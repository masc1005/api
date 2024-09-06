import Koa from "koa";
import bodyParser from "koa-bodyparser";
import cors from "@koa/cors";
import dotenv from "dotenv";

import { router } from "../routes/index";
import { AppDataSource } from "./database/database.config";

dotenv.config();

const server = new Koa();

server.use(bodyParser());
server.use(cors());

server.use(router.routes());
server.use(router.allowedMethods());

server.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.set("X-Response-Time", `${ms}ms`);
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

AppDataSource.initialize()
  .then(() => {
    console.log("Data Source initialized");
  })
  .catch((error) => {
    console.error("Error during Data Source initialization", error);
  });

export { server };
