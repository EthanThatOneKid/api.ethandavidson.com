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
