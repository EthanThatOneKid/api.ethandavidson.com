import { Router } from "../../deps/oak.ts";
import type { RouterContext } from "../../deps/oak.ts";
import { getRepo } from "../../lib/github.ts";

const reposRoute = new Router()
  .get("/repos/:path(.+)", async (ctx: RouterContext) => {
    ctx.response.body = {};
    if (ctx.params.path === undefined) {
      return;
    }
    const path = ctx.params.path?.split("/");
    const [repo] = path;
    if (repo === undefined) {
      return;
    }
    const payload = await getRepo(path);
    ctx.response.body = { ...payload };
  });

// Todo: Prefixing repo name with `~` returns the raw text data if path leads to file.
export default reposRoute;
