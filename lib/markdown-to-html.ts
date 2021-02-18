import { Marked } from "../deps/markdown.ts";

export const markdownToHtml = (content: string) => {
  const result = Marked.parse(content);
  return result.content;
};

export default markdownToHtml;
