import type { Experience } from "../routes/experience/mod.ts";
import type { Project } from "../routes/projects/mod.ts";
import { BASE_API } from "./constants.ts";

export interface EthanDavidsonConfig {
  base_api?: string;
}

export default class EthanDavidson {
  #base_api: string;
  constructor({ base_api = BASE_API }: EthanDavidsonConfig) {
    this.#base_api = base_api;
  }

  async projects(slug?: string): Promise<Project[]> {
    return await this.service("projects", slug);
  }

  async experience(slug?: string): Promise<Experience[]> {
    return await this.service("experience", slug);
  }

  private async service<T>(route: string, slug?: string): Promise<T[]> {
    const url = `${this.#base_api}/${route}/${slug || ""}`;
    const response = await fetch(url);
    const payload = await response.json();
    if (slug !== undefined) {
      return [payload];
    }
    return payload;
  }
}
