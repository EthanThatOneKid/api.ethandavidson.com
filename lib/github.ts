import {
  CACHE_PERIOD,
  GITHUB_APP_ID,
  GITHUB_APP_SECRET,
  GITHUB_HANDLE,
} from "./constants.ts";

const trees = new Map<string, RepositoryTreeCache>(),
  repositories = new Map<string, RepositoryCache>();

export const queries = {
  latestCommit: (repo: string) =>
    `https://api.github.com/repos/${GITHUB_HANDLE}/${repo}/commits?per_page=1`,
  tree: (repo: string, sha: string) =>
    `https://api.github.com/repos/${GITHUB_HANDLE}/${repo}/git/trees/${sha}`,
  repo: (repo: string) =>
    `https://api.github.com/repos/${GITHUB_HANDLE}/${repo}`,
  user: () => `https://api.github.com/user`,
  authorize: () =>
    `https://github.com/login/oauth/authorize?client_id=${GITHUB_APP_ID}`,
  accessToken: (code: string) => {
    const params = new URLSearchParams();
    params.append("client_id", GITHUB_APP_ID);
    params.append("client_secret", GITHUB_APP_SECRET);
    params.append("code", code);
    return `https://github.com/login/oauth/access_token?${params}`;
  },
};

const preparePayload = (
  repo: RepositoryCache,
  tree: RepositoryTreeCache,
): Repository => ({
  name: repo.name,
  description: repo.description,
  tree: {
    path: tree.path,
    directories: tree.directories.map(({ name }) => ({ name })),
    files: tree.files.map(({ name, extension }) => ({ name, extension })),
  },
});

const createCachedTree = (data: any, path: string[]) => {
  const result: RepositoryTreeCache = {
    path,
    expiration_date: generateExpirationDate(),
    directories: [],
    files: [],
  };
  for (const { type, sha, path: name } of data.tree) {
    if (type === "tree") {
      result.directories.push({ name, sha });
    } else {
      const extension = name.split(".").pop();
      result.files.push({ name, extension, sha });
    }
  }
  return result;
};

const findClosestCachedTree = (
  path: string[],
): [RepositoryTreeCache | null, string[]] => {
  const now = new Date().valueOf();
  const pathTrace: string[] = [];
  while (path.length > 0) {
    const id = identifyPath(path);
    if (trees.has(id)) {
      const tree = trees.get(id);
      if (tree !== undefined && tree.expiration_date > now) {
        return [tree, pathTrace];
      }
    }
    const nextTrace = path.pop();
    if (nextTrace !== undefined) {
      pathTrace.unshift(nextTrace);
    }
  }
  return [null, []];
};

const getTreeFromRoot = async (
  repo: string,
  relativePath: string[],
  root: RepositoryTreeCache,
): Promise<RepositoryTreeCache | null> => {
  const fullPath = [...root.path];
  while (relativePath.length > 0) {
    const targetEntry = relativePath.shift();
    const nextEntry = [...root.files, ...root.directories]
      .find(({ name }) => name === targetEntry);
    if (nextEntry !== undefined) {
      fullPath.push(nextEntry.name);
      root = await fetch(queries.tree(repo, nextEntry.sha))
        .then((res) => res.json())
        .then((data) => createCachedTree(data, fullPath));
      trees.set(identifyPath(fullPath), { ...root });
      console.log({ root });
    } else {
      return null;
    }
  }
  return root;
};

const getRootRepositoryTree = async (repo: string) => {
  return await fetch(queries.latestCommit(repo))
    .then((res) => res.json())
    .then((data) => data[0].commit.tree.sha)
    .then((sha) => fetch(queries.tree(repo, sha)))
    .then((res) => res.json())
    .then((data) => createCachedTree(data, [repo]));
};

export const getTree = async (
  path: string[],
): Promise<RepositoryTreeCache> => {
  const [repo] = path;
  const [closestCachedTree, pathTrace] = findClosestCachedTree(path);
  if (closestCachedTree !== null) {
    const tree = await getTreeFromRoot(repo, pathTrace, closestCachedTree);
    if (tree !== null) {
      return tree;
    }
  }
  return await getRootRepositoryTree(repo);
};

export const getRepo = async (
  path: string[],
): Promise<Repository> => {
  const now = new Date().valueOf(), [repo] = path;
  if (repositories.has(repo)) {
    const cachedRepo = repositories.get(repo);
    if (cachedRepo !== undefined && cachedRepo.expiration_date > now) {
      return preparePayload(cachedRepo, await getTree(path));
    }
  }
  console.log("MADE GITHUB REPO CALL");
  const payload: RepositoryCache = await fetch(queries.repo(repo))
    .then((res) => res.json())
    .then((data) => ({
      name: repo,
      description: data.description,
      expiration_date: generateExpirationDate(),
    }));
  repositories.set(repo, { ...payload });
  return preparePayload(payload, await getTree(path));
};

export const verifyCode = async (code: string): Promise<string | null> => {
  const accessTokenPayload = await fetch(
    queries.accessToken(code),
    { method: "POST" },
  ).then((res) => res.text());
  const accessToken = new URLSearchParams(accessTokenPayload)
    .get("access_token");
  return accessToken;
};

export const verifyUser = async (code: string): Promise<GitHubUser> => {
  const accessToken = await verifyCode(code);
  const userPayload = await fetch(
    queries.user(),
    {
      headers: new Headers({
        "Authorization": `Bearer ${accessToken}`,
      }),
    },
  ).then((res) => res.json());
  return { ...userPayload };
};

const identifyPath = (path: string[]): string => path.join("/");

const generateExpirationDate = (): number => {
  const now = new Date();
  now.setMilliseconds(CACHE_PERIOD);
  return now.valueOf();
};

export interface Repository {
  name: string;
  description: string;
  tree: RepositoryTree;
}

export interface RepositoryCache {
  name: string;
  description: string;
  expiration_date: number;
}

export interface RepositoryTree {
  path: string[];
  directories: { name: string }[];
  files: { name: string; extension: string }[];
}

export interface RepositoryTreeCache {
  path: string[];
  directories: { name: string; sha: string }[];
  files: { name: string; extension: string; sha: string }[];
  expiration_date: number;
}

export interface GitHubUser {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: "User";
  site_admin: boolean;
  name: string;
  company?: string;
  blog: string;
  location?: string;
  email?: string;
  hireable?: boolean;
  bio: string;
  twitter_username: string;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
}
