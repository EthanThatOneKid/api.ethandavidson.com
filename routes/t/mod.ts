import { Router } from "../../deps/oak.ts";
import type { RouterContext } from "../../deps/oak.ts";
import scrapeGitHubProfile from "../../lib/scrape-github-profile.ts";

const testRoute = new Router()
  .get("/t", async (ctx: RouterContext) => {
    const profile = await scrapeGitHubProfile();
    ctx.response.body = { ...profile };
  });

export default testRoute;
