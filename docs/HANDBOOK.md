# Handbook 📚

> The `api.ethandavidson.com` handbook!!

## Development 👨‍💻

To spin up the development server, execute `deno run --allow-net --allow-read --allow-env mod.ts`.

To test the client library, spin up the development server in one terminal instance (as above) and execute `deno test --allow-read --allow-net` in another terminal instance.

### Scripts 📜

- **Spin Up Server**: `deno run --allow-net --allow-read --allow-env mod.ts`
- **Test Client and Server**: `deno test --allow-read --allow-net`
- **Generate Documentation**: `deno run --allow-run scripts/docs.ts`

## Deployment 🚀

### Heroku 🀄

Visit the [Heroku Dashboard][heroku_dash] to deploy the latest version of the site.

## Package Managers 📦

### NPM 💚

```sh
cd client
npm login
npm run publish
```

### deno.land/x/ 🦕

```sh
# tbd
```

[heroku_dash]: https://dashboard.heroku.com/apps/api-ethandavidson-com