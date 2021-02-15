import { createCollectionRouter } from "../../lib/create-collection-route.ts";
import type ApproxDate from "../../lib/approx-date.ts";

export interface Experience {
  slug: string;
  title: string;
  establishment: string | null;
  info: string | null;
  start_date: ApproxDate;
  end_date: ApproxDate;
}

export const getExperienceFromSlug = (query: string) =>
  experiences.find(({ slug }) => slug === query);

export const experiences: Experience[] = [
  {
    slug: "google-step-intern",
    title: "Google STEP Intern",
    establishment: "Google",
    start_date: {
      month: "May",
      year: 2021,
    },
    end_date: {
      month: "Aug",
      year: 2021,
    },
    info:
      "I experienced a Google STEP internship and everything that it entails.",
  },
  {
    slug: "code-sensei",
    title: "Code Sensei",
    establishment: "Code Ninjas",
    start_date: {
      month: "Apr",
      year: 2020,
    },
    end_date: "PRESENT",
    info:
      "I teach elementary to high school students how to code in Scratch, JavaScript, and Lua.",
  },
  {
    slug: "acm-csuf-webmaster",
    title: "Webmaster of ACM CSUF",
    establishment: "ACM CSUF",
    start_date: {
      month: "Dec",
      year: 2020,
    },
    end_date: "PRESENT",
    info:
      "I created and manage the official website of ACM CSUf (https://acmcsuf.com/).",
  },
  {
    slug: "acm-csuf-competition-manager",
    title: "Competition Manager of ACM CSUF",
    establishment: "ACM CSUF",
    start_date: {
      month: "Aug",
      year: 2020,
    },
    end_date: {
      month: "Dec",
      year: 2020,
    },
    info:
      "I guided club members through the steps of attending hackathons and distributed information about up-coming competitions.",
  },
  {
    slug: "vaqcoders-president",
    title: "Vaqcoders President",
    establishment: null,
    start_date: {
      month: "Aug",
      year: 2018,
    },
    end_date: {
      month: "Jun",
      year: 2019,
    },
    info:
      "I was the founder and president of my high school's programming club during my senior year. We hosted coding challenges, JavaScript workshops, and more at weekly meetings.",
  },
];

export default createCollectionRouter<Experience>("experience", experiences);
