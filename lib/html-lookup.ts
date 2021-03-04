import {
  DOMParser,
  Element,
} from "https://deno.land/x/deno_dom@v0.1.6-alpha/deno-dom-wasm.ts";

export const htmlLookup = (html: string) => {
  const doc = new DOMParser().parseFromString(html, "text/html")!;
  return (querySelector: string) => {
    return doc.querySelector(querySelector);
  };
};

export default htmlLookup;
