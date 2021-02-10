import { Router } from "../../deps.ts";
import type { RouterContext } from "../../deps.ts";
import { getRepo } from "./github.ts";

const reposRoute = new Router()
  .get("/repos/:repo", async (ctx: RouterContext) => {
    const { repo } = ctx.params;
    console.log({ repo });
    // console.log({ ctx });
    if (repo === undefined) {
      ctx.response.body = {};
    } else {
      const payload = await getRepo([repo]);
      // console.log({ payload });
      ctx.response.body = { ...payload };
    }
  });

export default reposRoute;
