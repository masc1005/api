import Router from "@koa/router";

const usersRouter = new Router({
  prefix: "/users",
});

usersRouter.get("/", (ctx) => {
  ctx.body = { message: "Lista de usuários" };
});

export { usersRouter };
