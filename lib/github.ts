import {
  CACHE_PERIOD,
  GITHUB_APP_ID,
  GITHUB_APP_SECRET,
  GITHUB_HANDLE,
} from "./constants.ts";

const trees = new Map<string, RepositoryTreeCache>(),
  repositories = new Map<string, RepositoryCache>();

export const queries = {
  latestCommit: (
    repo: string,
    accessToken?: string,
  ): [string, RequestInit] => [
    `https://api.github.com/repos/${GITHUB_HANDLE}/${repo}/commits?per_page=1`,
    createQueryAuthorization(accessToken || null),
  ],
  tree: (
    repo: string,
    sha: string,
    accessToken?: string,
  ): [string, RequestInit] => [
    `https://api.github.com/repos/${GITHUB_HANDLE}/${repo}/git/trees/${sha}`,
    createQueryAuthorization(accessToken || null),
  ],
  repo: (
    repo: string,
    accessToken?: string,
  ): [string, RequestInit] => [
    `https://api.github.com/repos/${GITHUB_HANDLE}/${repo}`,
    createQueryAuthorization(accessToken || null),
  ],
  user: (accessToken?: string): [
    string,
    RequestInit,
  ] => [
    `https://api.github.com/user`,
    createQueryAuthorization(accessToken || null),
  ],
  authorize: (accessToken?: string): [
    string,
    RequestInit,
  ] => [
    `https://github.com/login/oauth/authorize?client_id=${GITHUB_APP_ID}`,
    createQueryAuthorization(accessToken || null),
  ],
  accessToken: (code: string): [string, RequestInit] => {
    const params = new URLSearchParams();
    params.append("client_id", GITHUB_APP_ID);
    params.append("client_secret", GITHUB_APP_SECRET);
    params.append("code", code);
    return [
      `https://github.com/login/oauth/access_token?${params}`,
      { method: "POST" },
    ];
  },
};

const preparePayload = (
  repo: RepositoryCache,
  tree: RepositoryTreeCache | null,
): Repository => ({
  ...{
    name: repo.name,
    description: repo.description,
    tree: tree === null ? null : {
      path: [...tree.path],
      directories: tree.directories.map(({ name }) => ({ name })),
      files: tree.files.map(({ name }) => ({
        name,
        extension: parseFilename(name).extension,
      })),
      hasReadme: tree.files.some(({ name: completeFilename }) => {
        const { name, extension } = parseFilename(completeFilename);
        return (extension !== null && /md|txt/i.test(extension)) &&
          /README/i.test(name);
      }),
    },
  },
});

const createCachedTree = (data: any, path: string[]) => {
  const result: RepositoryTreeCache = {
    path: [...path],
    expiration_date: generateExpirationDate(),
    directories: [],
    files: [],
  };
  for (const { type, sha, path: name } of data.tree) {
    if (type === "tree") {
      result.directories.push({ name, sha });
    } else {
      result.files.push({ name, sha });
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
    console.log(`SEARCH IN CACHE FOR ${id} TREE`);
    if (trees.has(id)) {
      const tree = trees.get(id);
      if (tree !== undefined && tree.expiration_date > now) {
        console.log(`FOUND ${id} TREE IN CACHE`);
        return [tree, [...pathTrace]];
      }
    }
    console.log(`CACHE NOT FOUND FOR ${id} TREE`);
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
  if (relativePath.length < 1) {
    console.log(`TREE IS ROOT (EMPTY RELATIVE PATH)`);
    return root;
  }
  const fullPath = [...root.path];
  while (relativePath.length > 0) {
    const targetEntry = relativePath.shift();
    const nextEntry = [...root.files, ...root.directories]
      .find(({ name }) => name === targetEntry);
    if (nextEntry !== undefined) {
      fullPath.push(nextEntry.name);
      root = await fetch(...queries.tree(repo, nextEntry.sha))
        .then((res) => res.json())
        .then((data) => createCachedTree(data, fullPath));
      trees.set(identifyPath(fullPath), { ...root });
      console.log(`CACHED ${identifyPath(root.path)} TREE`);
    } else {
      return null;
    }
  }
  return root;
};

const getRootRepositoryTree = async (repo: string) => {
  const root = await fetch(...queries.latestCommit(repo))
    .then((res) => res.json())
    .then((data) => {
      return data[0].commit.tree.sha;
    })
    .then((sha) => fetch(...queries.tree(repo, sha)))
    .then((res) => res.json())
    .then((data) => createCachedTree(data, [repo]));
  trees.set(repo, root);
  console.log(`CACHED ${identifyPath(root.path)} TREE`);
  return root;
};

export const getTree = async (
  path: string[],
): Promise<RepositoryTreeCache | null> => {
  const [repo] = path;
  const [closestCachedTree, pathTrace] = findClosestCachedTree([...path]);
  if (closestCachedTree !== null) {
    const tree = await getTreeFromRoot(repo, [...pathTrace], closestCachedTree);
    if (tree !== null) {
      return tree;
    }
  }
  const root = await getRootRepositoryTree(repo);
  if (path.length < 2) {
    return root;
  }
  const relativePath = path.slice(1);
  return await getTreeFromRoot(repo, [...relativePath], root);
};

export const getRepo = async (
  path: string[],
): Promise<Repository> => {
  const now = new Date().valueOf(),
    [repo] = path,
    tree = await getTree([...path]);
  if (repositories.has(repo)) {
    const cachedRepo = repositories.get(repo);
    if (cachedRepo !== undefined && cachedRepo.expiration_date > now) {
      return preparePayload(cachedRepo, tree);
    }
  }
  const payload: RepositoryCache = await fetch(...queries.repo(repo))
    .then((res) => res.json())
    .then((data) => ({
      name: repo,
      description: data.description,
      expiration_date: generateExpirationDate(),
    }));
  repositories.set(repo, { ...payload });
  return preparePayload(payload, tree);
};

export const verifyCode = async (code: string): Promise<string | null> => {
  const accessTokenPayload = await fetch(
    ...queries.accessToken(code),
  ).then((res) => res.text());
  const accessToken = new URLSearchParams(accessTokenPayload)
    .get("access_token");
  return accessToken;
};

export const verifyUser = async (code: string): Promise<GitHubUser> => {
  const accessToken = await verifyCode(code) || undefined;
  const userPayload = await fetch(...queries.user(accessToken))
    .then((res) => res.json());
  return { ...userPayload };
};

const identifyPath = (path: string[]): string => path.join("/");

const generateExpirationDate = (): number => {
  const now = new Date();
  now.setMilliseconds(CACHE_PERIOD);
  return now.valueOf();
};

const createQueryAuthorization = (
  accessToken: string | null,
): RequestInit => (accessToken === null ? {} : {
  headers: new Headers({
    "Authorization": `Bearer ${accessToken}`,
  }),
});

const parseFilename = (
  filename: string,
) =>
  filename.split(".").reduce(
    ({ name, extension }, segment, index, { length }) => {
      if (index === 0) {
        return { name: segment, extension: null };
      } else if (index === length - 1) {
        return { name, extension: segment };
      }
      return { name: [name, segment].join("."), extension };
    },
    {} as { name: string; extension: string | null },
  );

export interface Repository {
  name: string;
  description: string;
  tree: RepositoryTree | null;
}

export interface RepositoryCache {
  name: string;
  description: string;
  expiration_date: number;
}

export interface RepositoryTree {
  path: string[];
  directories: { name: string }[];
  files: { name: string; extension: string | null }[];
  hasReadme: boolean;
}

export interface RepositoryTreeCache {
  path: string[];
  directories: { name: string; sha: string }[];
  files: { name: string; sha: string }[];
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
