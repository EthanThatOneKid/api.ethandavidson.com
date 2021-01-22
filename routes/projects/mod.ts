import { createCollectionRouter } from "../../shared/createCollectionRoute.ts";
import { ProjectTag } from "./tags/mod.ts";

export interface Project {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  technologies: ProjectTag[];
  demo_url: string | null;
  home_url: string | null;
  github: {
    owner: string;
    repo: string;
  } | null;
}

export const getProjectFromSlug = (query: string) =>
  projects.find(({ slug }) => slug === query);

export const projects: Project[] = [
  {
    slug: "neolang",
    title: "NeoLang",
    description:
      "A scripting language for web automation written in TypeScript.",
    tags: ["interpreter", "runtime", "headless", "language"],
    technologies: ["typescript", "deno", "googlechrome"],
    demo_url: null,
    home_url: "https://neolang.dev/",
    github: { owner: "EthanThatOneKid", repo: "neo-cli" },
  },
  {
    slug: "somesort",
    title: "Somesort",
    description:
      "A sorting algorithm visualizer with satisfying ui/ux built with React.",
    tags: [
      "algorithms",
      "datastructures",
      "ui",
      "ux",
      "sorting",
      "visualization",
    ],
    technologies: ["typescript", "react", "sass"],
    demo_url: "https://ethanthatonekid.github.io/somesort/",
    home_url: "https://github.com/ethanthatonekid/somesort/#readme",
    github: { owner: "EthanThatOneKid", repo: "somesort" },
  },
  {
    slug: "sacafi",
    title: "Sacafi",
    description:
      "A full-stack platform for sharing open wi-fi locations utilizing Vue and MongoDB.",
    tags: ["full-stack", "wi-fi", "augmented-reality", "platform"],
    technologies: ["typescript", "node-dot-js", "mongodb", "vue-dot-js"],
    demo_url: null,
    home_url: "https://github.com/ethanthatonekid/sacafi/#readme",
    github: { owner: "EthanThatOneKid", repo: "sacafi" },
  },
  {
    slug: "garden",
    title: "Garden",
    description: "A simulated, text-based gardening game written in Go.",
    tags: ["game", "text-based", "gardening"],
    technologies: ["go"],
    demo_url: "https://github.com/EthanThatOneKid/garden/releases/tag/v1.0",
    home_url: "https://github.com/ethanthatonekid/garden/#readme",
    github: { owner: "EthanThatOneKid", repo: "garden" },
  },
  {
    slug: "pogodex",
    title: "Pogodex",
    description: "A Pokédex for Pokémon Go built with React.",
    tags: ["webapp", "pokemon"],
    technologies: ["react"],
    demo_url: "https://ethanthatonekid.github.io/pogodex/",
    home_url: "https://github.com/ethanthatonekid/pogodex/#readme",
    github: { owner: "EthanThatOneKid", repo: "pogodex" },
  },
  {
    slug: "scheduled-sequence",
    title: "Scheduled Sequence",
    description: "An NPM package for creating scheduled sequences.",
    tags: ["npm-package"],
    technologies: ["node-dot-js", "npm"],
    demo_url: "https://www.npmjs.com/package/scheduled-sequence",
    home_url: "https://github.com/ethanthatonekid/scheduled-sequence/#readme",
    github: { owner: "EthanThatOneKid", repo: "scheduled-sequence" },
  },
  {
    slug: "vaqcoders",
    title: "Vaqcoders",
    description:
      "I was the president and founder of my high school coding club.",
    tags: ["club", "vaqcoders", "high-school"],
    technologies: [],
    demo_url: null,
    home_url: "https://vaqcoders.github.io/",
    github: null,
  },
  {
    slug: "spacemasters",
    title: "SpaceMasters",
    description:
      "A righteous turn-based interstellar game written in QuickBASIC.",
    tags: ["early-program", "game", "text-based"],
    technologies: ["qb64", "quickbasic"],
    demo_url: null,
    home_url: "https://github.com/ethanthatonekid/SpaceMasters/#readme",
    github: { owner: "EthanThatOneKid", repo: "spacemasters" },
  },
  {
    slug: "ascii-game",
    title: "ascii-game",
    description:
      "A JavaScript library for making games in the browser with ascii art.",
    tags: ["npm-package"],
    technologies: ["node-dot-js", "npm", "html5"],
    demo_url: "https://www.npmjs.com/package/ascii-game",
    home_url: "https://github.com/ethanthatonekid/ascii-game/#readme",
    github: { owner: "EthanThatOneKid", repo: "ascii-game" },
  },
  {
    slug: "pokefectionist",
    title: "Pokéfectionist",
    description:
      "A program for Pokémon trading-card collecting written in QuickBASIC.",
    tags: ["inventory", "pokemon", "tcg"],
    technologies: ["quickbasic", "qb64", "html5"],
    demo_url: null,
    home_url: "https://github.com/ethanthatonekid/pokefectionist/#readme",
    github: { owner: "EthanThatOneKid", repo: "garden" },
  },
  {
    slug: "mazebot",
    title: "MazeBot",
    description:
      "A Discord bot that uses messages as commands to control a text-based RPG.",
    tags: ["discord-bot", "game", "text-based"],
    technologies: ["discord", "node-dot-js", "heroku"],
    demo_url:
      "https://discordapp.com/oauth2/authorize?client_id=510952110960017412&scope=bot&permissions=0",
    home_url: "https://github.com/ethanthatonekid/MazeBot/#readme",
    github: { owner: "EthanThatOneKid", repo: "mazebot" },
  },
  {
    slug: "reddit-movie-maker",
    title: "Reddit Movie Maker",
    description:
      "A Python program that creates Reddit YouTube videos given only a post ID.",
    tags: [],
    technologies: ["python", "reddit", "p5-dot-js"],
    demo_url: "https://www.youtube.com/watch?v=ei8wPjEyYYs",
    home_url: "https://github.com/ethanthatonekid/reddit-movie-maker/#readme",
    github: { owner: "EthanThatOneKid", repo: "reddit-movie-maker" },
  },
  {
    slug: "jukin-johnny",
    title: "Jukin' Johnny",
    description: "A simple JavaScript game, playable on desktop browsers.",
    tags: ["early-program", "webapp", "game", "html5-game"],
    technologies: ["p5-dot-js", "javascript", "html5"],
    demo_url: "http://ethandavidson.com/johnny/",
    home_url: "https://github.com/ethanthatonekid/jukin-johnny/#readme",
    github: { owner: "EthanThatOneKid", repo: "jukin-johnny" },
  },
  {
    slug: "recursive-entries",
    title: "Recursive Entries",
    description:
      "An NPM package that implements a recursive version of Object.entries.",
    tags: ["npm-package"],
    technologies: ["node-dot-js", "npm", "javascript"],
    demo_url: "https://www.npmjs.com/package/recursive-entries",
    home_url: "https://github.com/ethanthatonekid/recursive-entries/#readme",
    github: { owner: "EthanThatOneKid", repo: "recursive-entries" },
  },
  {
    slug: "cribbage",
    title: "Cribbage",
    description: "An NPM package that evaluates Cribbage hands.",
    tags: ["npm-package", "card-game"],
    technologies: ["node-dot-js", "npm", "javascript"],
    demo_url: "https://www.npmjs.com/package/cribbage",
    home_url: "https://github.com/ethanthatonekid/cribbage/#readme",
    github: { owner: "EthanThatOneKid", repo: "cribbage" },
  },
  {
    slug: "stickies",
    title: "Stickies",
    description:
      "A webapp for creating shareable panels of stickynotes utilizing FireBase.",
    tags: ["platform", "webapp"],
    technologies: ["javascript", "html5", "firebase"],
    demo_url: "http://stickies.ethandavidson.com/",
    home_url: "https://github.com/ethanthatonekid/stickies/#readme",
    github: { owner: "EthanThatOneKid", repo: "stickies" },
  },
  {
    slug: "emerald",
    title: "Emerald",
    description: "A JavaScript platformer game playable on desktop browsers.",
    tags: [],
    technologies: ["javascript", "html5", "firebase"],
    demo_url: "http://emerald.ethandavidson.com/",
    home_url: "https://github.com/ethanthatonekid/emerald/#readme",
    github: { owner: "EthanThatOneKid", repo: "emerald" },
  },
  {
    slug: "moonlight-tumble",
    title: "Moonlight Tumble",
    description: "A simple JavaScript game playable on desktop browsers.",
    tags: ["game", "html5-game"],
    technologies: ["p5-dot-js", "javascript", "html5", "firebase"],
    demo_url: "http://tumble.ethandavidson.com/",
    home_url: "https://github.com/ethanthatonekid/moonlight-tumble/#readme",
    github: { owner: "EthanThatOneKid", repo: "moonlight-tumble" },
  },
  {
    slug: "api-ethandavidson-com",
    title: "api.ethandavidson.com",
    description: "The official API of Ethan Davidson.",
    tags: ["api", "rest"],
    technologies: ["deno"],
    demo_url: null,
    home_url:
      "https://github.com/ethanthatonekid/api.ethandavidson.com/#readme",
    github: { owner: "EthanThatOneKid", repo: "api.ethandavidson.com" },
  },
  {
    slug: "acm-csuf-site",
    title: "acmcsuf.com",
    description: "The official API of Ethan Davidson.",
    tags: ["acm", "webmaster", "website"],
    technologies: ["svelte", "sapper", "vercel", "sass", "typescript"],
    demo_url: "https://acmcsuf.com/",
    home_url: "https://github.com/ethanthatonekid/acmcsuf.com/#readme",
    github: { owner: "EthanThatOneKid", repo: "acmcsuf.com" },
  },
];

export default createCollectionRouter<Project>("projects", projects);
