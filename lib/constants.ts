import { config } from "../deps/dotenv.ts";

const env: Record<string, string> = config();

export const PORT = String(env["PORT"] || Deno.env.get("PORT"));

export const GITHUB_HANDLE = String(
  env["GITHUB_HANDLE"] || Deno.env.get("GITHUB_HANDLE"),
);

export const GITHUB_APP_ID = String(
  env["GITHUB_APP_ID"] || Deno.env.get("GITHUB_APP_ID"),
);

export const GITHUB_APP_SECRET = String(
  env["GITHUB_APP_SECRET"] || Deno.env.get("GITHUB_APP_SECRET"),
);

export const TWITTER_HANDLE = String(
  env["TWITTER_HANDLE"] || Deno.env.get("TWITTER_HANDLE"),
);

export const TWITTER_BEARER_TOKEN = String(
  env["TWITTER_BEARER_TOKEN"] ||
    Deno.env.get("TWITTER_BEARER_TOKEN"),
);

// export const DISCORD_ID = String(
//   env["DISCORD_ID"] || Deno.env.get("DISCORD_ID"),
// );

// export const DISCORD_TOKEN = String(
//   env["DISCORD_TOKEN"] || Deno.env.get("DISCORD_TOKEN"),
// );

const MINUTE = 1e3 * 60,
  HOUR = MINUTE * 60,
  DAY = HOUR * 24;
export const CACHE_PERIOD = DAY;

for (
  const [name, value] of Object.entries(
    {
      PORT,
      GITHUB_HANDLE,
      GITHUB_APP_ID,
      GITHUB_APP_SECRET,
      TWITTER_HANDLE,
      TWITTER_BEARER_TOKEN,
      // DISCORD_ID,
      // DISCORD_TOKEN,
    },
  )
) {
  if (value === "undefined" || value.length === 0) {
    throw new Error(`Expected secret ${name} in '.env' file.`);
  }
}
