# Client Library

Welcome to the official client library of `api.ethandavidson.com`, the official API of Ethan Davidson.

## Getting Started

To install the client library in a [NodeJS][node_home] project, simply run `npm i api.ethandavidson.com`.
The library can then be imported in NodeJS with the following code:

```ts:node
import EthanDavidson from "api.ethandavidson.com";
```

To import the client library in [Deno][deno_home], use this code instead:

```ts:deno
import EthanDavidson from "";
```

Next, instantiate a client using the following code:

```ts
const base_api = "";
const ethan = new EthanDavidson({ base_api });
```

Now, you can use the client asynchronously to retrieve imperative information concerning Ethan Davidson.
Here are some examples...

```ts
const experience = await ethan.experience();
const [project] = await ethan.projects("api-ethandavidson-com");
console.log({ experience, project });
```

Enjoy!

## Documentation

Check out the docs!

---

Engineered with 💘 by [EthanThatOneKid][author_url]

[author_url]: https://github.com/EthanThatOneKid/
[node_home]: #
[deno_home]: #