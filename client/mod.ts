import type { Experience, GitHubRepository, Project } from "../lib/types.ts";
import { Format } from "../lib/format.ts";
import { BASE_API } from "./lib/constants.ts";

export interface EthanDavidsonConfig {
  base_api?: string;
}

export default class EthanDavidson {
  #base_api: string;
  constructor({ base_api = BASE_API }: EthanDavidsonConfig) {
    this.#base_api = base_api;
  }

  /**
   * This function returns a list of all of my projects fetched from the API.
   * If a slug is specified, it will return a single project item.
   * @example await ethan.projects();
   * @example await ethan.projects("api.ethandavidson.com");
   */
  async projects(slug?: string): Promise<Project[]> {
    return await this.service("projects", slug);
  }

  /**
   * This function returns a list of all of my professional work experiences fetched from the API.
   * If a slug is specified, it will return a single professional work experience item.
   * @example await ethan.experience();
   * @example await ethan.experience("code-sensei");
   */
  async experience(slug?: string): Promise<Experience[]> {
    return await this.service("experience", slug);
  }

  /**
   * This function returns a list of all of my public GitHub repositories fetched from the API.
   * If a `repo` is specified, it will return a single repository item.
   * If a `path` is specified, it will return a repository item including the information inside of the given path.
   * @example await ethan.repo();
   * @example await ethan.repo("api.ethandavidson.com");
   * @example await ethan.repo("api.ethandavidson.com", "routes", "repos");
   */
  async repo(repo?: string, ...path: string[]): Promise<GitHubRepository[]> {
    return await this.service("repo", Format.path([repo, ...path]));
  }

  /**
   * This function makes the request to the API.
   * @param route Specify which initial route (i.e. projects, experience, repos, ...etc).
   * @param path Specify any relative path to fetch from.
   */
  private async service<T>(
    route: string,
    path?: string,
  ): Promise<T[]> {
    const url = [this.#base_api, route, path].join("/");
    const response = await fetch(url);
    const payload = await response.json();
    if (path !== undefined) {
      // If a slug is used, then the API will return one item.
      // Since this function must return an array, we will
      // swaddle the payload in an array.
      return [payload];
    }
    return payload;
  }
}
