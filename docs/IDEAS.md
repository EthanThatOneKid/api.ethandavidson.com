# Ideas 🧠

I feel like this concept of having an API personal to an individual is really cool and can be very useful.
I would recommend it to any type of developer who is comfortable with making APIs.
The possibilities are limited only by the creativity of the individual.
The goal of this project is to provide a service for others; so that other people/machines can get relevant, structured information relevant to myself.
The real test of this project, however, is not to satisfy other people/machines, but to satisfy myself.
This project should be engineered as something that helps _me_.

A lot of the information provided by my API is static, which I have to update manually.
That is unfortunate because it forces me to use this GitHub repository as a sort of _CMS_ (content management service).
Really, I do not mind using GitHub as a CMS, but others may, so follow your own heart.

The real goal here is to engineer the API to generate structured data out of a _self-sufficient source_.
By _self-sufficient source_, I mean a type of data that is automatically updated naturally overtime.
A perfect example is my own GitHub repository data.
The `/repos` route of this API supplies data based on data received from GitHub.
Another example is fetching my own Twitter bio.
Things that can update on the side without the need of any focus are the best types of data sources to utilize to maximize the usefulness of this API for myself.

## Pokémon Endpoint

This endpoint would show my competitive teams and friend code to battle with.

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
- **POST /contact**: Procs a Discord bot to send me a private message on Discord. Message details are provided in the body of the request.

## GitHub Newsfeed

I can use this [GitHub Received Events API](https://api.github.com/users/octocat/received_events) to get a list of recent things that have happened based on my GitHub profile.
I can display the data in creative ways, such as connections on a globe or anything.

## Discord Bot Spin Off

This Discord bot would use the `api.ethandavidson.com` client to deliver formatted information about me online.
