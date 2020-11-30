import { TWITTER_BEARER_TOKEN, TWITTER_HANDLE } from "./constants.ts";

export interface TwitterProfile {
  name: string;
  username: string;
  description: string;
  profile_image_url: string;
}

const headers = new Headers(
  { "Authorization": `Bearer ${TWITTER_BEARER_TOKEN}` },
);

export const getTwitterProfile = async (): Promise<TwitterProfile> => {
  const fields = new URLSearchParams();
  fields.append(
    "user.fields",
    "description,entities,pinned_tweet_id,profile_image_url",
  );
  const response = await fetch(
    `https://api.twitter.com/2/users/by/username/${TWITTER_HANDLE}?${fields}`,
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
