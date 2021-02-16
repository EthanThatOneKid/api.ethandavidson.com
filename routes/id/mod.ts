// https://docs.github.com/en/developers/apps/authorizing-oauth-apps

import { Router } from "../../deps/oak.ts";
import type { RouterContext } from "../../deps/oak.ts";
import { queries, verifyUser } from "../../lib/github.ts";

const idRoute = new Router()
  .get("/id", async (ctx: RouterContext) => {
    const params = new URLSearchParams(ctx.request.url.search);
    if (params.has("code")) {
      const code = params.get("code");
      if (code !== null) {
        const verification = await verifyUser(code);
        ctx.response.body = { verification };
      }
    } else {
      ctx.response.redirect(
        queries.authorize(),
      );
    }
  });

export default idRoute;
