import { assertEquals } from "../deps/std.ts";
import EthanDavidson from "./mod.ts";
import { getProjectFromSlug, projects } from "../routes/projects/mod.ts";
import {
  experiences,
  getExperienceFromSlug,
} from "../routes/experience/mod.ts";
import { PORT } from "../lib/constants.ts";

const base_api = `http://localhost:${PORT}`;

Deno.test("EthanDavidson.projects()", async () => {
  const ethan = new EthanDavidson({ base_api });
  const payload = await ethan.projects();
  assertEquals(payload.length, projects.length);
});

Deno.test("EthanDavidson.projects('api-ethandavidson-com')", async () => {
  const ethan = new EthanDavidson({ base_api });
  const projectSlug = "api-ethandavidson-com";
  const payload = await ethan.projects(projectSlug);
  const project = getProjectFromSlug(projectSlug);
  assertEquals(payload.pop(), project);
});

Deno.test("EthanDavidson.experience()", async () => {
  const ethan = new EthanDavidson({ base_api });
  const payload = await ethan.experience();
  assertEquals(payload.length, experiences.length);
});

Deno.test("EthanDavidson.experience('google-step-intern')", async () => {
  const ethan = new EthanDavidson({ base_api });
  const experienceSlug = "google-step-intern";
  const payload = await ethan.experience(experienceSlug);
  const experience = getExperienceFromSlug(experienceSlug);
  assertEquals(payload.pop(), experience);
});
