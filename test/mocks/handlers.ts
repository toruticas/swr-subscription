import { rest } from "msw";

const handlers = [
  rest.get("http://localhost/posts", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        { id: "1", title: "Post 1" },
        { id: "2", title: "Post 2" },
      ])
    );
  }),
];

export { handlers };
