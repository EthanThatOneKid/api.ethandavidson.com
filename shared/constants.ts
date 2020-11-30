import { config } from "../deps.ts";

const env: Record<string, string> = config();

export const PORT = env["PORT"],
  GITHUB_HANDLE = env["GITHUB_HANDLE"],
  TWITTER_HANDLE = env["TWITTER_HANDLE"],
  TWITTER_BEARER_TOKEN = env["TWITTER_BEARER_TOKEN"];

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
  console.log({ name, value });
  if (value === undefined || value.length === 0) {
    throw new Error(`Expected secret ${name} in '.env' file.`);
  }
}
