// const generate_docs = async () => {
//   const process = Deno.run({
//     cmd: ["deno", "doc", "client/mod.ts", "--json"],
//   });
//   // const decoder = new TextDecoder();
//   const status = await process.status();
//   if (status.success) {
//     // const json = decoder.decode(await process.output());
//     // await Deno.writeTextFile("client/docs.json", json);
//     console.log(Deno.stdout.);
//     return process.close();
//   } else {
//     const error = "oops"; // decoder.decode(await process.stderrOutput());
//     throw new Error(error);
//   }
// };

// generate_docs();

// export {};

const cmd = Deno.run({
  cmd: ["echo", "hello"],
  stdout: "piped",
  stderr: "piped",
});
const output = await cmd.output(); // "piped" must be set
cmd.close(); // Don't forget to close it
const outStr = new TextDecoder().decode(output); // hello
console.log({ outStr });
export {};
