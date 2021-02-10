import { Router } from "../deps.ts";
import type { RouterContext } from "../deps.ts";

export const createCollectionRouter = <Data extends { slug: string }>(
  collectionName: string,
  collectionData: Data[],
): Router => {
  return new Router().get(`/${collectionName}`, async (ctx: RouterContext) => {
    const body: Data[] = [...collectionData];
    ctx.response.body = JSON.stringify(body, null, 2);
    ctx.response.type = "application/json";
  }).get(
    `/${collectionName}/:slug`,
    (ctx: RouterContext) => {
      const body = collectionData.find(({ slug }) => slug === ctx.params.slug);
      ctx.response.body = JSON.stringify(
        body !== undefined ? body : {},
        null,
        2,
      );
      ctx.response.type = "application/json";
    },
  );
};
