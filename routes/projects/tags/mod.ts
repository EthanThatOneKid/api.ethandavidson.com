import { data } from "./data.ts";

const technologies = ["qb64", "quickbasic"] as const;

export type ProjectTag = typeof data[number] | typeof technologies[number];
export const tags = [...data];
