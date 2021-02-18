import {
  CACHE_PERIOD,
  GITHUB_APP_ID,
  GITHUB_APP_SECRET,
  GITHUB_HANDLE,
} from "./constants.ts";
import { Format } from "../lib/format.ts";
import createLogger from "./create-logger.ts";
import markdownToHtml from "./markdown-to-html.ts";
import { Parse } from "./parse.ts";

const log = createLogger();

const files = new Map<string, GitHubFileCache>(),
  trees = new Map<string, GitHubRepositoryTreeCache>(),
  repositories = new Map<string, GitHubRepositoryCache>();

export const queries = {
  repo: (
    repo: string,
    accessToken?: string,
  ): [string, RequestInit] => [
    `https://api.github.com/repos/${GITHUB_HANDLE}/${repo}`,
    createQueryAuthorization(accessToken || null),
  ],
  contents: (
    repo: string,
    relativePath: string = "",
    accessToken?: string,
  ): [string, RequestInit] => [
    `https://api.github.com/repos/${GITHUB_HANDLE}/${repo}/contents/${relativePath}`,
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

const prepareFilePayload = (data: GitHubFileCache): GitHubFile => {
  const { name, size, path, content: base64Content } = data;
  const content = atob(base64Content);
  const { extension } = Parse.filename(name);
  const isReadme = checkIsReadme({ name });
  const html = isReadme ? markdownToHtml(content) : undefined;
  return { name, extension, size, path, content, isReadme, html };
};

const prepareTreePayload = (
  data: GitHubRepositoryTreeCache,
): GitHubRepositoryTree => {
  const path = [...data.path];
  let readme = null;
  const { name: readmeFilename } = data.files.find(checkIsReadme) ??
    { name: null };
  if (readmeFilename !== null) {
    const id = Format.path([...data.path, readmeFilename]);
    const readmeFileCache = files.get(id);
    if (readmeFileCache !== undefined) {
      log(`FOUND ${id} FILE IN CACHE`);
      const { content } = readmeFileCache;
      readme = markdownToHtml(atob(content));
    }
  }
  return {
    path,
    readme,
    directories: data.directories.map(({ name }) => ({ name })),
    files: data.files.map(({ name, size }) => {
      const { extension } = Parse.filename(name);
      return { name, extension, size };
    }),
  };
};

const preparePayload = (
  repo: GitHubRepositoryCache,
  data: GitHubRepositoryTreeCache | GitHubFileCache | null,
  isFile: boolean,
): GitHubRepository => {
  const basePayload = { name: repo.name, description: repo.description };
  if (data === null) {
    return { ...basePayload, type: "tree", tree: null };
  } else if (isFile) {
    return {
      ...basePayload,
      type: "file",
      file: prepareFilePayload(data as GitHubFileCache),
    };
  }
  return {
    ...basePayload,
    type: "tree",
    tree: prepareTreePayload(data as GitHubRepositoryTreeCache),
  };
};

const createCachedTree = async (
  data: any,
  path: string[],
): Promise<GitHubRepositoryTreeCache> => {
  const result: GitHubRepositoryTreeCache = {
    path: [...path],
    expiration_date: generateExpirationDate(),
    directories: [],
    files: [],
  };
  for (const { type, name, size } of data) {
    if (type === "dir") {
      result.directories.push({ name });
    } else {
      result.files.push({ name, size });
    }
  }
  return result;
};

const createCachedFile = (data: any, path: string[]): GitHubFileCache => ({
  path,
  name: data.name,
  content: data.content,
  size: data.size,
  expiration_date: generateExpirationDate(),
});

const findClosestCachedTreeOrFile = (
  path: string[],
): [GitHubRepositoryTreeCache | GitHubFileCache | null, string[]] => {
  const now = new Date().valueOf();
  const pathTrace: string[] = [];
  while (path.length > 0) {
    const id = Format.path(path);
    log(`SEARCH IN CACHE FOR ${id} TREE`);
    if (trees.has(id)) {
      const tree = trees.get(id);
      if (tree !== undefined && tree.expiration_date > now) {
        log(`FOUND ${id} TREE IN CACHE`);
        return [tree, [...pathTrace]];
      }
    } else if (files.has(id)) {
      const file = files.get(id);
      if (file !== undefined && file.expiration_date > now) {
        log(`FOUND ${id} FILE IN CACHE`);
        return [file, [...pathTrace]];
      }
    }
    log(`CACHE NOT FOUND FOR ${id} TREE`);
    const nextTrace = path.pop();
    if (nextTrace !== undefined) {
      pathTrace.unshift(nextTrace);
    }
  }
  return [null, []];
};

const getTreeOrFileFromRoot = async (
  repo: string,
  relativePath: string[],
  root: GitHubRepositoryTreeCache,
): Promise<GitHubRepositoryTreeCache | GitHubFileCache | null> => {
  if (relativePath.length < 1) {
    return root;
  }
  const fullPath = [...root.path];
  while (relativePath.length > 0) {
    const targetEntry = relativePath.shift();
    const nextFile = root.files
      .find(({ name }) => name === targetEntry);
    const nextDirectory = root.directories
      .find(({ name }) => name === targetEntry);
    if (nextDirectory !== undefined) {
      fullPath.push(nextDirectory.name);
      root = await fetch(
        ...queries.contents(
          repo,
          Format.path(fullPath.slice(1)),
        ),
      )
        .then((res) => res.json())
        .then((data) => createCachedTree(data, fullPath));
      const { name: readmeFilename } = root.files.find(checkIsReadme) ??
        { name: null };
      if (readmeFilename !== null) {
        // If there is a README file in the directory,
        // cache its contents for later use.
        await getTreeOrFileFromRoot(
          repo,
          [readmeFilename],
          { ...root },
        );
      }
      trees.set(Format.path(fullPath), { ...root });
      log(`CACHED ${Format.path(root.path)} TREE`);
    } else if (nextFile !== undefined) {
      fullPath.push(nextFile.name);
      const file = await fetch(...queries.contents(
        repo,
        Format.path(fullPath.slice(1)),
      ))
        .then((res) => res.json())
        .then((data) => createCachedFile(data, fullPath));
      files.set(Format.path(fullPath), { ...file });
      log(`CACHED ${Format.path(fullPath)} FILE`);
      return file;
    } else {
      return null;
    }
  }
  return root;
};

const getRootRepositoryTree = async (repo: string) => {
  const root = await fetch(...queries.contents(repo))
    .then((res) => res.json())
    .then((data) => createCachedTree(data, [repo]));
  trees.set(repo, root);
  log(`CACHED ${Format.path(root.path)} TREE`);
  return root;
};

export const getTree = async (
  path: string[],
): Promise<GitHubRepositoryTreeCache | GitHubFileCache | null> => {
  const [repo] = path;
  const [closestCachedTree, pathTrace] = findClosestCachedTreeOrFile([...path]);
  if (
    closestCachedTree !== null &&
    !("content" in closestCachedTree)
  ) {
    const tree = await getTreeOrFileFromRoot(
      repo,
      [...pathTrace],
      closestCachedTree as GitHubRepositoryTreeCache,
    );
    if (tree !== null) {
      return tree;
    }
  }
  const root = await getRootRepositoryTree(repo);
  if (path.length < 2) {
    return root;
  }
  const relativePath = path.slice(1);
  return await getTreeOrFileFromRoot(repo, [...relativePath], root);
};

export const getRepo = async (
  path: string[],
): Promise<GitHubRepository> => {
  const now = new Date().valueOf(),
    [repo] = path,
    tree = await getTree([...path]);
  if (repositories.has(repo)) {
    const cachedRepo = repositories.get(repo);
    if (cachedRepo !== undefined && cachedRepo.expiration_date > now) {
      return preparePayload(
        cachedRepo,
        tree,
        tree !== null && "content" in tree,
      );
    }
  }
  const payload: GitHubRepositoryCache = await fetch(...queries.repo(repo))
    .then((res) => res.json())
    .then((data) => ({
      name: repo,
      description: data.description,
      expiration_date: generateExpirationDate(),
    }));
  repositories.set(repo, { ...payload });
  return preparePayload(payload, tree, tree !== null && "content" in tree);
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

const checkIsReadme = ({ name: completeFilename }: { name: string }) => {
  const { name, extension } = Parse.filename(completeFilename);
  return (extension !== null && /md|txt/i.test(extension)) &&
    /README/i.test(name);
};

export type GitHubRepository = {
  name: string;
  description: string;
  type: "tree";
  tree: GitHubRepositoryTree | null;
} | {
  name: string;
  description: string;
  type: "file";
  file: GitHubFile | null;
};

export interface GitHubRepositoryCache {
  name: string;
  description: string;
  expiration_date: number;
}

export interface GitHubRepositoryTree {
  path: string[];
  directories: { name: string }[];
  files: { name: string; extension: string | null; size: number }[];
  readme: string | null;
}

export interface GitHubRepositoryTreeCache {
  path: string[];
  directories: { name: string }[];
  files: { name: string; size: number }[];
  expiration_date: number;
}

export interface GitHubFile {
  name: string;
  extension: string | null;
  path: string[];
  content: string;
  size: number;
  isReadme: boolean;
  html?: string;
}

export interface GitHubFileCache {
  name: string;
  path: string[];
  content: string;
  size: number;
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
