# Endpoints 🎁

This document outlines all of the endpoints of the [REST](https://developer.mozilla.org/en-US/docs/Glossary/REST) API.

## `about/`

```ts
interface About {
  bio: string;
  image_url: string;
  twitter_handle: string;
  twitter_url: string;
  github_handle: string;
  github_url: string;
}
```

## `status/`

```ts
interface Status {
  is_on_discord: boolean; // If I am currently on Discord, true.
  currently_playing_title: string; // Title of game/program I am currently on.
  last_github_interaction: number; // A timestamp.
}
```

## `projects/`

```ts
type Projects = Project[];
```

### `projects/[project_title]/`

```ts
interface Project {
  title: string;
  code_url: string | null;
  demo_url: string | null;
  homepage: string | null;
  description: string | null;
}
```

## `experience/`

```ts
type Experiences = Experience[];
```

### `experience/[experience_id]`

```ts
interface Experience {
  title: string;
  establishment: string | null;
  start_date: number;
  end_date: number | "PRESENT";
  info: string | null;
}
```

## `resume/`

```ts
interface Resume {
  resume_url: string; // Static address of my latest resume.
  resume_markdown: string; // Markdown version of my resume, but compiled to raw HTML.
  resume_html: string; // My resume, compiled to raw HTML.
}
```

### `resume/markdown/`

This endpoint will render the markdown version of my resume.

### `resume/markdown/raw/`

This endpoint will deliver the raw markdown as text.

### `resume/html/`

This endpoint will render the HTML of my resume.

### `resume/html/raw/`

This endpoint will deliver the raw HTML as text.
