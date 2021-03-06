# Endpoints 👽

> This document outlines all of the endpoints of the [REST](https://developer.mozilla.org/en-US/docs/Glossary/REST) API.

<details>
  <summary>
    Table of Contents
  </summary>

- [`about/`](#about-)
- [`status/`](#status-)
- [`projects/`](#projects-)
- [`experience/`](#experience-)
- [`resume/`](#resume-)
- [`verify/`](#verify-)
</details>
  

## `about/` ✔

```ts
interface About {
  bio: string;
  image_url: string;
  twitter_handle: string;
  twitter_url: string;
  github_handle: string;
  github_url: string;
  current_activity: string;
}
```

## `status/` ❌

```ts
interface Status {
  is_on_discord: boolean; // If I am currently on Discord, true.
  currently_playing_title: string; // Title of game/program I am currently on.
  last_github_interaction: number; // A timestamp.
}
```

## `projects/` ✔

```ts
type Projects = Project[];
```

### `projects/[project_title]/`

```ts
interface Project {
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
```

## `experience/` ✔

```ts
type Experiences = Experience[];
```

### `experience/[experience_id]`

```ts
interface Experience {
  slug: string;
  title: string;
  establishment: string | null;
  info: string | null;
  start_date: ApproxDate;
  end_date: ApproxDate;
}
```

## `resume/` ❌

```ts
interface Resume {
  resume_url: string; // Static address of my latest resume.
  resume_markdown: string; // Markdown version of my resume, but compiled to raw HTML.
  resume_html: string; // My resume, compiled to raw HTML.
}
```

### `resume/markdown/`

This endpoint will render the markdown version of my resume.

#### `resume/markdown/raw/`

This endpoint will deliver the raw markdown as text.

### `resume/html/`

This endpoint will render the HTML of my resume.

#### `resume/html/raw/`

This endpoint will deliver the raw HTML as text.

## `verify/` ❌

This endpoint will securely authenticate Ethan wherever this endpoint is fetched.
This is used to authenticate for admin-ops on other *EthanThatOneKid* products.
