import { Router } from "../deps.ts";
import type { Context } from "../deps.ts";

import aboutRoute from "./about/mod.ts";
import experienceRoute from "./experience/mod.ts";

const indexRoute = new Router().get("/", (ctx: Context) => {
  ctx.response.body = { hello: "world" };
});

export const routers: Router[] = [
  indexRoute,
  aboutRoute,
  experienceRoute
];
