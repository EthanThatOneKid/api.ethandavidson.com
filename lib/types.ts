import ApproxDate from "./approx-date.ts";
import ProjectTag from "./project-tag.ts";

export type {
  GitHubRepository,
  GitHubRepositoryCache,
  GitHubRepositoryTree,
  GitHubRepositoryTreeCache,
  GitHubUser,
} from "./github.ts";
export type { ApproxDate, ProjectTag };

export interface GitHubProfileScrapeResult {
  bio: string;
  followers: number;
  contributionActivity: any[];
  userStatus: {
    emoji: string;
    message: string;
  };
  pinnedRepos: {
    name: string;
    description: string;
    language: string;
  }[];
}

export interface About {
  bio: string;
  image_url: string;
  twitter_handle: string;
  twitter_url: string;
  github_handle: string;
  github_url: string;
  current_activity: string;
}

export interface Experience {
  slug: string;
  title: string;
  establishment: string | null;
  info: string | null;
  start_date: ApproxDate;
  end_date: ApproxDate;
}

export interface Project {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  technologies: ProjectTag[];
  demo_url: string | null;
  home_url: string | null;
  github: {
    owner: string;
    repo: string;
  } | null;
}

export interface WishlistItem {
  slug: string;
  title: string;
  link: string | null;
  purchaseDetails: {
    by: string;
    when: ApproxDate;
  } | null;
}
