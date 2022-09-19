import { renderHook } from "@testing-library/react";

import { SubscriptionConfig, useSubscription } from "swr-subscription";

describe("Subscription Config provider", () => {
  test("context definition", () => {
    const { result } = renderHook(useSubscription, {
      wrapper: SubscriptionConfig,
    });

    expect(result.current).toBeDefined();
  });

  test("attach a subscription", () => {
    const { result } = renderHook(useSubscription, {
      wrapper: SubscriptionConfig,
    });
    const handler = jest.fn();

    result.current.subscribe("key", "message", handler);
    result.current.emit("message", "hello world");

    expect(handler).toHaveBeenCalledWith("hello world");
  });

  test("attach two subscriptions", () => {
    const { result } = renderHook(useSubscription, {
      wrapper: SubscriptionConfig,
    });
    const handlerOne = jest.fn();
    const handlerTwo = jest.fn();

    result.current.subscribe("key-one", "message", handlerOne);
    result.current.subscribe("key-two", "message", handlerTwo);
    result.current.emit("message", "hello world");

    expect(handlerOne).toHaveBeenCalledWith("hello world");
    expect(handlerTwo).toHaveBeenCalledWith("hello world");
  });

  test("avoid duplicated subscription", () => {
    const { result } = renderHook(useSubscription, {
      wrapper: SubscriptionConfig,
    });
    const handlerOne = jest.fn();
    const handlerTwo = jest.fn();

    result.current.subscribe("key", "message", handlerOne);
    result.current.subscribe("key", "message", handlerTwo);
    result.current.emit("message", "hello world");

    expect(handlerOne).not.toHaveBeenCalled();
    expect(handlerTwo).toHaveBeenCalledWith("hello world");
  });

  test("attach two subscriptions with same key and handle one unsubscribe", () => {
    const { result } = renderHook(useSubscription, {
      wrapper: SubscriptionConfig,
    });
    const handlerOne = jest.fn();
    const handlerTwo = jest.fn();

    result.current.subscribe("key", "message", handlerOne);
    result.current.subscribe("key", "message", handlerTwo);
    result.current.unsubscribe("key");
    result.current.emit("message", "hello world");

    expect(handlerOne).not.toHaveBeenCalled();
    expect(handlerTwo).toHaveBeenCalledWith("hello world");
  });

  test("attach two subscriptions with same key and unsubscribe all", () => {
    const { result } = renderHook(useSubscription, {
      wrapper: SubscriptionConfig,
    });
    const handlerOne = jest.fn();
    const handlerTwo = jest.fn();

    result.current.subscribe("key", "message", handlerOne);
    result.current.subscribe("key", "message", handlerTwo);
    result.current.unsubscribe("key");
    result.current.unsubscribe("key");
    result.current.emit("message", "hello world");

    expect(handlerOne).not.toHaveBeenCalled();
    expect(handlerTwo).not.toHaveBeenCalled();
  });
});
