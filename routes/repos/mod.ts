import { Router } from "../../deps/oak.ts";
import type { RouterContext } from "../../deps/oak.ts";
import { getRepo } from "../../lib/github.ts";
import { Parse } from "../../lib/parse.ts";
import { MAX_HANG_TIME } from "../../lib/constants.ts";

const reposRoute = new Router()
  .get("/repos/:path(.+)", async (ctx: RouterContext) => {
    ctx.response.body = { error_message: "No Such Repository" };
    if (ctx.params.path === undefined) {
      return;
    }
    const path = Parse.path(ctx.params.path),
      [repo] = path;
    if (repo === undefined) {
      return;
    }
    try {
      console.log(`AWAITING ${path.join("/")} TREE`);
      const timeoutId = setTimeout(() => {
        throw new Error("HANGTIME REACHED");
      }, MAX_HANG_TIME);
      const payload = await getRepo(path);
      clearTimeout(timeoutId);
      ctx.response.body = { ...payload };
    } catch (err) {
      console.error(err);
    }
  });
// .get("/~repos/:path(.+)", async (ctx: RouterContext) => {
//   ctx.response.body = {};
//   // Todo: Prefixing repo name with `~` returns the raw text data if path leads to file.
// });

export default reposRoute;
