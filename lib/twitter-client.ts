import { TWITTER_BEARER_TOKEN, TWITTER_HANDLE } from "./constants.ts";

const headers = new Headers(
  { "Authorization": `Bearer ${TWITTER_BEARER_TOKEN}` },
);

export interface TwitterProfile {
  name: string;
  username: string;
  description: string;
  profile_image_url: string;
}

export interface TwitterQuery {
  base?: string;
  route: string[];
  fields: [string, string][];
}

export const composeTwitterUrl = (
  { base = "https://api.twitter.com/2/", route, fields }: TwitterQuery,
) => {
  const params = new URLSearchParams();
  for (const [key, value] of fields) {
    params.append(key, value);
  }
  const url = [base, ...route].join("/").replace(/\/+/g, "/");
  return [url, params.toString()].join("?");
};

export const getTwitterProfile = async (): Promise<TwitterProfile> => {
  const query: TwitterQuery = {
    route: [
      "users",
      "by",
      "username",
      TWITTER_HANDLE,
    ],
    fields: [[
      "user.fields",
      "description,entities,pinned_tweet_id,profile_image_url",
    ]],
  };
  const response = await fetch(
    composeTwitterUrl(query),
    { headers },
  );
  const payload = await response.json();
  return {
    name: payload.data.name,
    username: payload.data.username,
    description: payload.data.description,
    profile_image_url: payload.data.profile_image_url,
  };
};

export const getPinnedTweet = () => {
};

/*

# Reference

- [Twitter API Reference: User Lookup](https://developer.twitter.com/en/docs/twitter-api/users/lookup/api-reference)

*/
