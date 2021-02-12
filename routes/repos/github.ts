import { CACHE_PERIOD, GITHUB_HANDLE } from "../../lib/constants.ts";
import { Repository, RepositoryCache, RepositoryTreeCache } from "./shared.ts";

const trees = new Map<string, RepositoryTreeCache>(),
  repositories = new Map<string, RepositoryCache>();

export const queries = {
  latestCommit: (repo: string) =>
    `https://api.github.com/repos/${GITHUB_HANDLE}/${repo}/commits?per_page=1`,
  tree: (repo: string, sha: string) =>
    `https://api.github.com/repos/${GITHUB_HANDLE}/${repo}/git/trees/${sha}`,
  repo: (repo: string) =>
    `https://api.github.com/repos/${GITHUB_HANDLE}/${repo}`,
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
): [RepositoryTreeCache | null, string[] ] | null => {
  const now = new Date().valueOf();
  const pathTrace: string[] = [];
  while (path.length > 0) {
    const id = identifyPath(path);
    if (trees.has(id)) {
      const tree = trees.get(id);
      if (tree !== undefined && tree.expiration_date > now) {
        return [ tree, pathTrace ];
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
  const { closestCachedTree, pathTrace } = findClosestCachedTree(path);
  const root = closestCachedTree !== undefined
    ? closestCachedTree
    : await getRootRepositoryTree(repo);
  const tree = await getTreeFromRoot(repo, relativePath, closestCachedTree);
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

const identifyPath = (path: string[]): string => path.join("/");

const generateExpirationDate = (): number => {
  const now = new Date();
  now.setMilliseconds(CACHE_PERIOD);
  return now.valueOf();
};
