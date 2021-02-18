import { Application } from "./deps/oak.ts";
import { routers } from "./routes/mod.ts";
import { MINUTE, PORT, RATE_LIMIT } from "./lib/constants.ts";

const app = new Application();

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

app.addEventListener("listen", ({ port }) => {
  console.log(`Listening on http://localhost:${port}/ ✨`);
});

export const serve = async () => {
  await app.listen({ port: Number(PORT) });
};

if (import.meta.main) {
  await serve();
}
