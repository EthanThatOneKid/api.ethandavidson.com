import htmlLookup from "./html-lookup.ts";
import { GITHUB_HANDLE } from "./constants.ts";
import type { GitHubProfileScrapeResult } from "./types.ts";

// TODO:
// - Integrate cache system, like for the repos route.

const selectors = {
  bio:
    "#js-pjax-container > div.container-xl.px-3.px-md-4.px-lg-5 > div > div.flex-shrink-0.col-12.col-md-3.mb-4.mb-md-0 > div > div.p-note.user-profile-bio.mb-3.js-user-profile-bio.f4 > div",
  followers:
    "#js-pjax-container > div.container-xl.px-3.px-md-4.px-lg-5 > div > div.flex-shrink-0.col-12.col-md-3.mb-4.mb-md-0 > div > div.d-flex.flex-column > div.js-profile-editable-area.d-flex.flex-column.d-md-block > div.flex-order-1.flex-md-order-none.mt-2.mt-md-0 > div > a:nth-child(1) > span",
  statusEmoji:
    "#js-pjax-container > div.container-xl.px-3.px-md-4.px-lg-5 > div > div.flex-shrink-0.col-12.col-md-3.mb-4.mb-md-0 > div > div.clearfix.d-flex.d-md-block.flex-items-center.mb-4.mb-md-0 > div.position-relative.d-inline-block.col-2.col-md-12.mr-3.mr-md-0.flex-shrink-0 > div > div > div > details > summary > div > div.f6.lh-condensed.user-status-header.d-inline-flex.user-status-emoji-only-header.circle > div > div > g-emoji",
  statusMessage:
    "#js-pjax-container > div.container-xl.px-3.px-md-4.px-lg-5 > div > div.flex-shrink-0.col-12.col-md-3.mb-4.mb-md-0 > div > div.clearfix.d-flex.d-md-block.flex-items-center.mb-4.mb-md-0 > div.position-relative.d-inline-block.col-2.col-md-12.mr-3.mr-md-0.flex-shrink-0 > div > div > div > details > summary > div > div.ws-normal.user-status-message-wrapper.f6.min-width-0 > div > span > div",
} as const;

export const scrapeGitHubProfile = async (): Promise<
  GitHubProfileScrapeResult
> => {
  const res = await fetch(`https://github.com/${GITHUB_HANDLE}/`);
  const html = await res.text();
  const querySelector = htmlLookup(html);
  const payload: GitHubProfileScrapeResult = {
    bio: querySelector(selectors.bio)?.textContent ?? "",
    followers: Number(querySelector(selectors.followers)?.textContent ?? 0),
    contributionActivity: parseContributionActivity(),
    userStatus: {
      emoji: querySelector(selectors.statusEmoji)?.textContent ?? "",
      message: querySelector(selectors.statusMessage)?.textContent ?? "",
    },
    pinnedRepos: parsePinnedRepos(),
  };
  return payload;
};

const parsePinnedRepos = () => {
  // TODO
  return [];
};

const parseContributionActivity = () => {
  // TODO
  return [];
};

export default scrapeGitHubProfile;
