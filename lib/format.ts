export namespace Format {
  export const path = (path: (string | undefined)[]) => {
    return path.join("/");
  };
}
