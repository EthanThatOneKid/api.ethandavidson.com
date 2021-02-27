import htmlLookup from "./html-lookup.ts";
import { GITHUB_HANDLE } from "./constants";
import type { GitHubProfileScrapeResult } from "./types.ts";

export const scrapeGitHubProfile = async (): Promise<
  GitHubProfileScrapeResult
> => {
  const res = await fetch(`https://github.com/${GITHUB_HANDLE}/`);
  const html = await res.text();
  const result = htmlLookup(html);
  const payload: GitHubProfileScrapeResult = {
    bio: "string",
    followers: 0,
    contributionActivity: [],
    userStatus: {
      emoji: "string",
      message: "string",
    },
    pinnedRepos: [],
  };
  return payload;
};
