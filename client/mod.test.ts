import { assertEquals } from "../deps/std.ts";
import EthanDavidson from "./mod.ts";
import { getProjectFromSlug, projects } from "../routes/projects/mod.ts";
import {
  experiences,
  getExperienceFromSlug,
} from "../routes/experience/mod.ts";
import { PORT } from "../lib/constants.ts";

// const serverPath = new URL("../mod.ts", import.meta.url).href;
// const worker = new Worker(serverPath, { type: "module" });
// console.log({ serverPath, worker });
const base_api = `http://localhost:${PORT}`;

const TESTS: Record<string, () => Promise<void>> = {
  "EthanDavidson.projects()": async () => {
    const ethan = new EthanDavidson({ base_api });
    const payload = await ethan.projects();
    assertEquals(payload.length, projects.length);
  },
  "EthanDavidson.projects('api-ethandavidson-com')": async () => {
    const ethan = new EthanDavidson({ base_api });
    const projectSlug = "api-ethandavidson-com";
    const payload = await ethan.projects(projectSlug);
    const project = getProjectFromSlug(projectSlug);
    assertEquals(payload.pop(), project);
  },
  "EthanDavidson.experience()": async () => {
    const ethan = new EthanDavidson({ base_api });
    const payload = await ethan.experience();
    assertEquals(payload.length, experiences.length);
  },
  "EthanDavidson.experience('google-step-intern')": async () => {
    const ethan = new EthanDavidson({ base_api });
    const experienceSlug = "google-step-intern";
    const payload = await ethan.experience(experienceSlug);
    const experience = getExperienceFromSlug(experienceSlug);
    assertEquals(payload.pop(), experience);
  },
  "EthanDavidson.repos()": async () => {
    const ethan = new EthanDavidson({ base_api });
    const payload = await ethan.experience();
    assertEquals(payload.length, experiences.length);
  },
};

// let ranTests = 0;
// const finishTest = (totalTests: number) => {
//   ranTests++;
//   if (ranTests >= totalTests) {
//     worker.terminate();
//   }
// };

Object.entries(TESTS)
  .forEach(([name, test]) => {
    // const totalTests = tests.length;
    // const fn = () => test().finally(() => finishTest(totalTests));
    const sanitizeOps = false;
    const sanitizeResources = false;
    Deno.test({ name, fn: test, sanitizeOps, sanitizeResources });
  });
