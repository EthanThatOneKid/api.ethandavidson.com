# Handbook 📚

> The `api.ethandavidson.com` handbook!!

## Development 👨‍💻

> TODO: Integrate denon.

To run the program, execute `deno run --allow-net --allow-read --allow-env mod.ts`.

To run the program as production, execute `npx pm2 start mod.ts --interpreter="deno" --interpreter-args="run --allow-net --allow-env --allow-read"`.

To stop the production process, execute `npx pm2 kill`.

## Deployment 🚀

### Heroku 🀄

#### Creating a New Heroku App ⬢

```ssh
heroku create --buildpack https://github.com/chibat/heroku-buildpack-deno.git
```

#### Deploying Remotely 📡

```ssh
heroku git:remote -a api-ethandavidson-com
git push heroku main
```

#### Setting Environment Variables 🌿

```ssh
heroku config:set NAME=value
```