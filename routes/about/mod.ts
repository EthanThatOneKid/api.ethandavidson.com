import { Router } from "../../deps.ts";
import type { RouterContext } from "../../deps.ts";
import { getTwitterProfile } from "../../shared/twitterClient.ts";
import { GITHUB_HANDLE, TWITTER_HANDLE } from "../../shared/constants.ts";

export interface About {
  bio: string;
  image_url: string;
  twitter_handle: string;
  twitter_url: string;
  github_handle: string;
  github_url: string;
  current_activity: string;
}

export default new Router().get("/about", async (ctx: RouterContext) => {
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
