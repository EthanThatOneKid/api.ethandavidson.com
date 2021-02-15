import { Application } from "./deps/oak.ts";
import { routers } from "./routes/mod.ts";
import { PORT } from "./lib/constants.ts";

const app = new Application();

for (const router of routers) {
  app.use(router.routes());
  app.use(router.allowedMethods());
}

app.use((ctx) => {
  console.log(`${ctx.request.method} ${ctx.request.url.pathname}`);
});

app.addEventListener("listen", ({ port }) => {
  console.log(`Listening on http://localhost:${port}/ ✨`);
});

export const serve = async () => {
  await app.listen({ port: Number(PORT) });
};

await serve();
