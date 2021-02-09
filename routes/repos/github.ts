import { CACHE_PERIOD, GITHUB_HANDLE } from "../../shared/constants.ts";
import { Repository, RepositoryTree } from "./shared.ts";

const trees = new Map<string, RepositoryTree>(),
  repositories = new Map<string, Repository>();

export const queries = {
  latestCommit: (repo: string) =>
    `https://api.github.com/repos/${GITHUB_HANDLE}/${repo}/commits?per_page=1`,
  tree: (repo: string, sha: string) =>
    `https://api.github.com/repos/${GITHUB_HANDLE}/${repo}/git/trees/${sha}`,
  repo: (repo: string) =>
    `https://api.github.com/repos/${GITHUB_HANDLE}/${repo}`,
};

export const getTree = async (
  path: string[],
): Promise<RepositoryTree> => {
  const id = identifyPath(path),
    now = new Date().valueOf(),
    [repo] = path;
  if (trees.has(id)) {
    const tree = trees.get(id);
    if (tree !== undefined && tree.expiration_date > now) {
      return tree;
    }
  }
  const tree: RepositoryTree = await fetch(queries.latestCommit(repo))
    .then((res) => res.json())
    .then((data) => data[0].commit.tree.sha)
    .then((sha) => fetch(queries.tree(repo, sha)))
    .then((res) => res.json())
    .then((data) => {
      const result: RepositoryTree = {
        path,
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
    });
  trees.set(id, tree);
  return tree;
};

export const getRepo = async (path: string[]): Promise<Repository> => {
  const now = new Date().valueOf(), [repo] = path;
  if (repositories.has(repo)) {
    const payload = repositories.get(repo);
    if (payload !== undefined && payload.expiration_date > now) {
      payload.tree = await getTree(path);
      return payload;
    }
  }
  const payload: Repository = await fetch(queries.repo(repo))
    .then((res) => res.json())
    .then((data) => ({
      name: repo,
      description: data.description,
      expiration_date: generateExpirationDate(),
    }));
  repositories.set(repo, { ...payload });
  payload.tree = await getTree(path);
  return payload;
};

const identifyPath = (path: string[]): string => path.join("/");

const generateExpirationDate = (): number => {
  const now = new Date();
  now.setMilliseconds(CACHE_PERIOD);
  return now.valueOf();
};
