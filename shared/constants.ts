import { config } from "../deps.ts";

const env: Record<string, string> = config();

export const PORT = String(env["PORT"] || Deno.env.get("PORT"));

export const GITHUB_HANDLE = String(
  env["GITHUB_HANDLE"] || Deno.env.get("GITHUB_HANDLE"),
);

export const TWITTER_HANDLE = String(
  env["TWITTER_HANDLE"] || Deno.env.get("TWITTER_HANDLE"),
);

export const TWITTER_BEARER_TOKEN = String(
  env["TWITTER_BEARER_TOKEN"] ||
    Deno.env.get("TWITTER_BEARER_TOKEN"),
);

for (
  const [name, value] of Object.entries(
    {
      PORT,
      GITHUB_HANDLE,
      TWITTER_HANDLE,
      TWITTER_BEARER_TOKEN,
    },
  )
) {
  if (value === "undefined" || value.length === 0) {
    throw new Error(`Expected secret ${name} in '.env' file.`);
  }
}
