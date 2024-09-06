import { Context } from "koa";
import { UserUseCases } from "../use_cases/user.use_cases";
import { UserDto } from "../dto/user.dto";

export class UserController {
  constructor(private userUseCases: UserUseCases) {}

  async createRoute(ctx: Context) {
    try {
      const data = ctx.request.body as UserDto;
      const user = await this.userUseCases.singinOrRegister(data);

      if (user?.token) {
        ctx.status = 200;
        ctx.body = {
          user,
        };
        return;
      }

      ctx.status = 201;
      ctx.body = {
        message: "User created successfully",
        user,
      };
    } catch (error) {
      ctx.status = 500;
      ctx.body = {
        message: "An error occurred ",
        error: (error as Error).message,
      };
    }
  }

  async confirmationAccountRoute(ctx: Context) {
    try {
      const data = ctx.request.body as { email: string; code: string };
      await this.userUseCases.confirmationAccount(data.email, data.code);

      ctx.status = 204;
    } catch (error) {
      ctx.status = 500;
      ctx.body = {
        message: "An error occurred ",
        error: (error as Error).message,
      };
    }
  }

  async getRoute(ctx: Context) {
    try {
      if (ctx.state.user["custom:role"] === "user") {
        ctx.status = 401;
        ctx.body = {
          error: "Unauthorized",
          message: "Not authorized to get /api/users",
        };
        return;
      }

      const find = await this.userUseCases.find();
      ctx.status = 200;
      ctx.body = {
        find,
      };
    } catch (error) {
      ctx.status = 500;
      ctx.body = {
        message: "An error occurred while find users",
        error: (error as Error).message,
      };
    }
  }

  async meRoute(ctx: Context) {
    try {
      const find = await this.userUseCases.me(ctx.state.user.email);
      ctx.status = 200;
      ctx.body = {
        find,
      };
    } catch (error) {
      ctx.status = 500;
      ctx.body = {
        message: "An error occurred while find users",
        error: (error as Error).message,
      };
    }
  }

  async putRoute(ctx: Context) {
    try {
      let data = ctx.request.body as UserDto;

      if (ctx.state.user["custom:role"] === "user") {
        data = {
          name: data.name,
          isOnboarded: 1,
        };
      }

      const put = await this.userUseCases.update(ctx.state.user.email, data);

      ctx.status = 200;
      ctx.body = {
        put,
      };
    } catch (error) {
      ctx.status = 500;
      ctx.body = {
        message: "An error occurred while find users",
        error: (error as Error).message,
      };
    }
  }

  async deleteRoute(ctx: Context) {
    try {
      const id = ctx.params;
      const find = await this.userUseCases.delete(id);
      ctx.status = 200;
      ctx.body = {
        find,
      };
    } catch (error) {
      ctx.status = 500;
      ctx.body = {
        message: "An error occurred while find users",
        error: (error as Error).message,
      };
    }
  }
}
