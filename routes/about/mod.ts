import { Router } from "../../deps/oak.ts";
import type { RouterContext } from "../../deps/oak.ts";
import { getTwitterProfile } from "../../lib/twitter-client.ts";
import { GITHUB_HANDLE, TWITTER_HANDLE } from "../../lib/constants.ts";
import type { About } from "../../lib/types.ts";

export default new Router()
  .get("/about", async (ctx: RouterContext) => {
    const { description, profile_image_url } = await getTwitterProfile();
    const body: About = {
      bio: description,
      image_url: profile_image_url,
      twitter_handle: TWITTER_HANDLE,
      twitter_url: `https://twitter.com/${TWITTER_HANDLE}`,
      github_handle: GITHUB_HANDLE,
      github_url: `https://github.com/${GITHUB_HANDLE}`,
      current_activity: "",
    };
    ctx.response.body = JSON.stringify(body, null, 2);
    ctx.response.type = "application/json";
  });
