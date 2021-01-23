const bundle = async () => {
  const process = Deno.run({
    cmd: ["deno", "bundle", "client/mod.ts", "client/mod.bundle.js"],
  });
  const status = await process.status();
  if (status.success) {
    return;
  }
  throw new Error();
};

const generate_docs = async () => {
  const process = Deno.run({
    cmd: ["deno", "doc", "client/mod.ts", "--json"],
    stdout: "piped",
  });
  const status = await process.status();
  if (status.success) {
    const decoder = new TextDecoder();
    const json = decoder.decode(await process.output());
    await Deno.writeTextFile("client/docs.json", json);
  }
};

const build = async () => {
  await bundle();
  await generate_docs();
};

export default build();
