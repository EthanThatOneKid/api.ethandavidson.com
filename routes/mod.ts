import { Router } from "../deps.ts";
import type { RouterContext } from "../deps.ts";

import aboutRoute from "./about/mod.ts";
import experienceRoute from "./experience/mod.ts";
import projectsRoute from "./projects/mod.ts";

const indexRoute = new Router().get("/", (ctx: RouterContext) => {
  ctx.response.body = { hello: "world" };
});

export const routers: Router[] = [
  indexRoute,
  aboutRoute,
  experienceRoute,
  projectsRoute,
];
