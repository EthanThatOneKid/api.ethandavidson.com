export interface Repository {
  name: string;
  description: string;
  expiration_date: number;
  tree?: RepositoryTree;
}

export interface RepositoryTree {
  path: string[];
  directories: { name: string; sha: string }[];
  files: { name: string; sha: string }[];
  expiration_date: number;
}
