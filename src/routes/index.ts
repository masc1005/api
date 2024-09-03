import Router from "@koa/router";
import { usersRouter } from "./user.routes";

const router = new Router({
  prefix: "/api",
});

router.use(usersRouter.routes()).use(usersRouter.allowedMethods());

export { router };
