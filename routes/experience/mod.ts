import { Router } from "../../deps.ts";
import type { Context } from "../../deps.ts";
import { experiences } from "./experiences.ts";
import type ApproxDate from "../../shared/interfaces/ApproxDate.ts";

export interface Experience {
  slug: string;
  title: string;
  establishment: string | null;
  info: string | null;
  start_date: ApproxDate;
  end_date: ApproxDate;
}

export default new Router().get("/experience", async (ctx: Context) => {
  const body: Experience[] = [...experiences];
  ctx.response.body = JSON.stringify(body, null, 2);
  ctx.response.type = "application/json";
}).get<{ slug: string }>("/experience/:slug", (ctx: Context) => {
  const body = experiences.find(({ slug }) => slug === ctx.params.slug);
  ctx.response.body = JSON.stringify(body !== undefined ? body : {}, null, 2);
  ctx.response.type = "application/json";
});
