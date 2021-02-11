import { Router } from "../deps.ts";
import type { RouterContext } from "../deps.ts";

import aboutRoute from "./about/mod.ts";
import experienceRoute from "./experience/mod.ts";
import reposRoute from "./repos/mod.ts";
import projectsRoute, { getProjectFromSlug } from "./projects/mod.ts";
import wishlistRoute from "./wishlist/mod.ts";

const indexRoute = new Router().get("/", (ctx: RouterContext) => {
  ctx.response.body = {
    welcome_message: "Welcome to the official API of Ethan Davidson!",
    project_data: getProjectFromSlug("api-ethandavidson-com"),
  };
});

export const routers: Router[] = [
  indexRoute,
  aboutRoute,
  experienceRoute,
  reposRoute,
  projectsRoute,
  wishlistRoute,
];
