import { Application } from "./deps.ts";
import { routers } from "./routes/mod.ts";
import { PORT } from "./shared/constants.ts";

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

await app.listen({ port: Number(PORT) });
