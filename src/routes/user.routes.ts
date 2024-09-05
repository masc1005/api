import Router from "@koa/router";
import { UserController } from "../app/controller/user.controller";
import { UserUseCases } from "../app/use_cases/user.use_cases";
import { authMiddleware } from "../app/middleware/authMiddleware";

const userUseCases = new UserUseCases();
const userController = new UserController(userUseCases);

const usersRouter = new Router();

usersRouter.get("/users", authMiddleware, (ctx) =>
  userController.getRoute(ctx)
);
usersRouter.get("/me", authMiddleware, (ctx) => userController.meRoute(ctx));

usersRouter.put("/edit-account", authMiddleware, (ctx) =>
  userController.putRoute(ctx)
);

usersRouter.post("/auth", (ctx) => userController.createRoute(ctx));
usersRouter.post("/confirm-account", (ctx) =>
  userController.confirmationAccountRoute(ctx)
);

export { usersRouter };
