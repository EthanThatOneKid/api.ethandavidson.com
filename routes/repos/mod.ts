import { Router } from "../../deps.ts";
import type { RouterContext } from "../../deps.ts";
import { getRepo } from "./github.ts";

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

// Todo: Use the `use` middleware method to capture all requests to this route.
// Todo: Prefixing repo name with `~` returns the raw text data if path leads to file.
export default reposRoute;
