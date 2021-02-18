const main = async () => {
  const decoder = new TextDecoder();
  const cmd = Deno.run({
    cmd: ["deno", "doc", "client/mod.ts", "--json"],
    stdout: "piped",
    stderr: "piped",
  });
  const output = await cmd.output();
  cmd.close();
  const payload = decoder.decode(output);
  const json = JSON.parse(payload);
  console.log({ json });
};

if (import.meta.main) {
  await main();
}

export default main;
