# Ideas 🧠

I feel like this concept of having an API personal to an individual is really cool and can be very useful.
I would recommend it to any type of developer who is comfortable with making APIs.
The possibilities are limited only by the creativity of the individual.
The goal of this project is to provide a service for others; so that other people/machines can get relevant, structured information relevant to myself.
The real test of this project, however, is not to satisfy other people/machines, but to satisfy myself.
This project should be engineered as something that helps *me*.

A lot of the information provided by my API is static, which I have to update manually.
That is unfortunate because it forces me to use this GitHub repository as a sort of *CMS* (content management service).
Really, I do not mind using GitHub as a CMS, but others may, so follow your own heart.

The real goal here is to engineer the API to generate structured data out of a *self-sufficient source*.
By *self-sufficient source*, I mean a type of data that is automatically updated naturally overtime.
A perfect example is my own GitHub repository data.
The `/repos` route of this API supplies data based on data received from GitHub.
Another example is fetching my own Twitter bio.
Things that can update on the side without the need of any focus are the best types of data sources to utilize to maximize the usefulness of this API for myself.

## Pokémon Endpoint

This endpoint would show my competitive teams and friend code to battle with.

## Discord Pusher Endpoint

This endpoint would proc a Discord bot to ping me a custom message.

## Error Handling

There needs to be a consistent way to manage errors.

## RSS Feed Endpoint

This endpoint returns an rss feed of content type 'application/rss+xml'. 
Sub paths can return the data of the feed in JSON.

## Log Endpoint

Write simple short logs and upload them to a GitHub repository.

## Blogposts Endpoint

This endpoint will manage all of the needed services for responding with quick blog data.


## Badges Endpoint

This endpoint will allow me to use custom badges for my GitHub READMEs.