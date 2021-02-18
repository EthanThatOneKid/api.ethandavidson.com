export namespace Parse {
  export const path = (path: string) =>
    path
      .split("/")
      .filter(({ length }) => length > 0);

  export const filename = (
    filename: string,
  ) =>
    filename
      .split(".")
      .reduce(
        ({ name, extension }, segment, index, { length }) => {
          if (index === 0) {
            return { name: segment, extension: null };
          } else if (index === length - 1) {
            return { name, extension: segment };
          }
          return { name: [name, segment].join("."), extension };
        },
        {} as { name: string; extension: string | null },
      );
}
