import Koa from "koa";
import bodyParser from "koa-bodyparser";
import cors from "@koa/cors";
import dotenv from "dotenv";

import { router } from "../routes/index";

dotenv.config();

const server = new Koa();

server.use(bodyParser());
server.use(cors());

server.use(router.routes()).use(router.allowedMethods);

server.use(async (ctx, next) => {
  await next();
  const rt = ctx.response.get("X-Response-Time");
  console.log(`${ctx.method} ${ctx.url} - ${rt}`);
});

server.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.set("X-Response-Time", `${ms}ms`);
});

export { server };
