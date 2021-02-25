import { Application } from "./deps/oak.ts";
import { routers } from "./routes/mod.ts";
import { MINUTE, PORT, RATE_LIMIT } from "./lib/constants.ts";

const app = new Application();
const url = `http://localhost:${PORT}/`;

for (const router of routers) {
  app.use(router.routes());
  app.use(router.allowedMethods());
}

app.use((ctx) => {
  // TODO: Implement rate-limter
  console.log(
    `${ctx.request.method} ${ctx.request.url.pathname}`,
  );
});

app.addEventListener("listen", () => {
  console.log(`Listening on ${url} ✨`);
});

/**
 * Returns the URL that the server is listening for.
 */
export const serve = async () => {
  await app.listen({ port: Number(PORT) });
  return url;
};

if (import.meta.main) {
  await serve();
}
