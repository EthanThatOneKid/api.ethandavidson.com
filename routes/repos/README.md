# `/repos`

Welcome to `/repos`!

![`api.ethandavidson.com/repos` Demo][demo]

## Making the Most of Rate-Limiting

The public GitHub API is rate-limited which means that after making several requests, the API will stop working.
Due to this, it is not reasonable to send a request to the GitHub API every time a user sends a request to my API.
I need to be able to make the most out of the limited requests I am given for free by the public GitHub API.
In order to solve this problem, I created a cache system that stores all of the data in memory.

## The *GitHub Repos* Algorithm

In my API, basic repository information is sent along with every tree request.
For example, the name and description of the repository are always sent along with the relevant information.
This information is requested from the GitHub API only one time and is stored in memory (via [`Map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)).
The next time that this information is requested by any other type of request on my API, it can be pulled from memory instead of requested from GitHub again.
The information that is stored in memory are not permanent, however.
An expiration date is attached to each cached tree (and cached repository).
If the expiration date has passed by the next time that the data is requested, it is considered expired so my API makes a request to GitHub to update the cached data.
Not only does this increase the efficiency of my API, but also heavily cuts the amount of requests made to GitHub for the same information.

## The *GitHub Trees* Algorithm

A GitHub tree can be identified as such: `/react/packages/react-devtools`; basically a path in a specific repository.
In my API, GitHub trees are cached/retrieved with perfect efficiency.
Let's walk through an example:

## Example #1

Let's say we are testing the cache system on the [React repository](https://github.com/facebook/react/).
Let's also say that each test is ran sequentially without ending the program.

### Test #1: Navigate to `/react/packages/react-devtools`

First, my API checks to see if the `react` repository is already cached.
Since it is not already cached, my API fetches React's basic information on GitHub such as the name and description of the repository and caches it.

```
cached_repos: [ react ]
cached_trees: []
```

Next, my API checks to see if a tree with the path `/react/packages/react-devtools` is already cached.
Since it is not already cached, it then checks to see if a tree with the path `/react/packages` is already cached.
Since it is not already cached, it then checks to see if a tree with the path `/react` is already cached.
Since it is not already cached, it finally decides to request the trees' information via GitHub.

Then, my API fetches the GitHub tree for the `/react` path and caches it.

```
cached_repos: [ react ]
cached_trees: [ /react ]
```

Next, my API fetches the tree for the `/react/packages` path and caches it.

```
cached_repos: [ react ]
cached_trees: [ /react, /react/packages ]
```

Finally, my API fetches the tree for the `/react/packages/react-devtools` path and caches it.

```
cached_repos: [ react ]
cached_trees: [
  /react,
  /react/packages,
  /react/packages/react-devtools
]
```

Now, each of those trees (`/react`, `/react/packages`, and `/react/packages/react-devtools`) are cached and are scheduled to expire at the determined `CACHE_PERIOD`.

### Test #2: Navigate to `/react/packages/react-fetch`

First, my API checks to see if the `react` repository is already cached.
Since it is actually already cached, my API decides *not* to request the repository's information via GitHub.

Next, my API checks to see if a tree with the path `/react/packages/react-fetch` is already cached.
Since it is not already cached, it then checks to see if a tree with the path `/react/packages` is already cached.
Since `/react/packages` is actually already cached, my API calculates that the missing tree can be expressed as a relative path, `/react-fetch` (For `/react/packages` + `/react-fetch` = `/react/packages/react-fetch`).
My API uses this relative path to fetch the trees (`/react-fetch`) leading up to the requested tree (`/react/packages/react-fetch`) and caches each.

```
cached_repos: [ react ]
cached_trees: [
  /react,
  /react/packages,
  /react/packages/react-devtools
  /react/packages/react-fetch
]
```

[demo]: ../../docs/media/repos-demo.gif