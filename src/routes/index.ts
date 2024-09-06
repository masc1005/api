import Router from "@koa/router";
import { usersRouter } from "./user.routes";
import { koaSwagger } from "koa2-swagger-ui";
import swaggerSpec from "../config/swagger/index";

const router = new Router({});

router.get(
  "/docs",
  koaSwagger({
    routePrefix: false,
    swaggerOptions: { spec: swaggerSpec as any },
  })
);

router.use(usersRouter.routes()).use(usersRouter.allowedMethods());

export { router };
