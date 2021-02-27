import { Router } from "../deps/oak.ts";
import type { RouterContext } from "../deps/oak.ts";

import aboutRoute from "./about/mod.ts";
import experienceRoute from "./experience/mod.ts";
import reposRoute from "./repos/mod.ts";
import projectsRoute from "./projects/mod.ts";
import wishlistRoute from "./wishlist/mod.ts";
import testRoute from "./t/mod.ts";
import idRoute from "./id/mod.ts";

const indexRoute = new Router()
  .get("/", (ctx: RouterContext) => {
    ctx.response.body = {
      welcome_message: "Welcome to the official API of Ethan Davidson!",
    };
  });

export const routers: Router[] = [
  indexRoute,
  aboutRoute,
  experienceRoute,
  reposRoute,
  projectsRoute,
  wishlistRoute,
  testRoute,
  idRoute,
];
