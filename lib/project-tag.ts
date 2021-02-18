import data from "./simple-icons-list.ts";

const technologies = ["qb64", "quickbasic", "sapper"] as const;

export type ProjectTag = typeof data[number] | typeof technologies[number];
export const tags = [...data];
export default ProjectTag;
