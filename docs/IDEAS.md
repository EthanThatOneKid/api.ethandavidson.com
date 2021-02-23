# Ideas 🧠

## Pokémon Endpoint

This endpoint would show my competitive teams and friend code to battle with.

## Discord Pusher Endpoint

This endpoint would proc a Discord bot to ping me a custom message.

## Error Handling

There needs to be a consistent way to manage errors.

## Blog Endpoint

- **GET /rss-feed**: Content type must be 'application/rss+xml'. Delivers current RSS feed.
- **POST /blog**: Create a new blogpost if using authenticated client (takes title, slug, description/excerpt, and the content in markdown). The API would then upload it to a repository as an unpublished blogpost.
- **GET /blog**: Gets list of some blog posts without the content. By default it gets the latest few posts, but a querystring can be used to specify which blogposts are sent over the wire.
- **GET /blog/[slug]**: Gets specific blog post by slug.

## Log Endpoint

Write simple short logs and upload them to a GitHub repository.

## Badges Endpoint

This endpoint will allow me to use custom badges for my GitHub READMEs.

## Deploy to Digital Ocean

https://blog.logrocket.com/how-to-deploy-deno-applications-to-production/

## Contact

- **GET /contact**: Delivers my public contact information.
- **POST /contact**: Procs a Discord bot to send me a private message on Discord. Details are provided in the body.
