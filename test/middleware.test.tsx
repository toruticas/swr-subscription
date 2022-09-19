import useSWR, { useSWRConfig } from "swr";
import axios from "axios";
import {
  subscription,
  SubscriptionConfig,
  useSubscription,
} from "swr-subscription";

import { act, renderHook, waitFor } from "@testing-library/react";

import { server } from "./mocks/server";

const usePosts = (caller?: any) => {
  const { data, isValidating } = useSWR(
    "http://localhost/posts",
    async (url: string) => {
      const response = await axios.get<any[]>(url);

      return response.data;
    },
    {
      use: [
        subscription("post::update", (data, swr) => {
          caller?.();
          swr.mutate(
            swr.data.map((item) => (item.id === data.id ? data : item)),
            { revalidate: false }
          );
        }),
      ],
    }
  );
  const { emit } = useSubscription();

  return { data, isValidating, emit };
};

describe("subscription middleware", () => {
  beforeAll(() => server.listen());
  afterEach(() => {
    server.resetHandlers();
  });
  afterAll(() => server.close());

  test("updating data from subscription", async () => {
    const { result } = renderHook(usePosts, {
      wrapper: SubscriptionConfig,
    });

    await waitFor(() =>
      expect(result.current.data).toEqual([
        { id: "1", title: "Post 1" },
        { id: "2", title: "Post 2" },
      ])
    );

    act(() => {
      result.current.emit("post::update", { id: "2", title: "New Post 2" });
    });

    await waitFor(() =>
      expect(result.current.data).toEqual([
        { id: "1", title: "Post 1" },
        { id: "2", title: "New Post 2" },
      ])
    );
  });

  test("avoid calling subscription twice", async () => {
    const mockFnOne = jest.fn();
    const mockFnTwo = jest.fn();
    const { result: resultOne } = renderHook(() => usePosts(mockFnOne), {
      wrapper: SubscriptionConfig,
    });
    const { result: resultTwo } = renderHook(() => usePosts(mockFnTwo), {
      wrapper: SubscriptionConfig,
    });

    await waitFor(() =>
      expect(resultOne.current.data).toEqual([
        { id: "1", title: "Post 1" },
        { id: "2", title: "New Post 2" },
      ])
    );

    expect(resultTwo.current.data).toEqual([
      { id: "1", title: "Post 1" },
      { id: "2", title: "New Post 2" },
    ]);

    act(() => {
      resultOne.current.emit("post::update", { id: "1", title: "New Post 1" });
    });

    await waitFor(() =>
      expect(resultOne.current.data).toEqual([
        { id: "1", title: "New Post 1" },
        { id: "2", title: "New Post 2" },
      ])
    );

    expect(mockFnOne).toHaveBeenCalled();
    expect(mockFnTwo).not.toHaveBeenCalled();
  });
});
