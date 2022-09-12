---
layout: ../../layouts/BlogLayout.astro
title: Moving from Next to Remix
description: I've moved away from Next.js and completely rewritten my site in Remix. Find out some of the reasons why and some of the new technologies I've adopted.
published: 23/02/2022
---

If you have visited this site pre February 2022 you may have noticed some slight UI tweaks here and there. The reality is I have completely rewritten the site, moving away from the well-loved [Next.js](https://nextjs.org/) to [Remix](https://remix.run/). I'm not going to go into tonnes of detail here but I thought it made sense to cover some of the reason why I made the move and some of the new technologies I am using.

## Why the rewrite

First things first, I want to clarify here that Next is a great framework and you can build some incredibly impressive things with it. A recent great example I've come across is [Brian Lovin's site](https://brianlovin.com/) which is built in Next, server-side renders content and uses graphQL and Apollo for retrieving and caching data (this is an over simplification for sure, but you get the idea). His site is open source so you can have a [peek](https://github.com/brianlovin/briOS), you'll definitely learn some things a long the way.

However, for me it all came back to the question: `What do I need to be able to do on my site?`. So I tried to simplify my answer into some actionable points:

- Self authentication to see admin section of the site.
- Control who has access to those pages.
- Add, edit and delete content from the database.
- Show admin only UI elements on each route, linking to admin pages to edit, update and delete content.
- Retrieve content from the database/cache and render it on the client.
- If the content is written in markdown, transform it into HTML on the server and cache it.
- Instantly update the UI with any changes made to content in the database.
- Cache the data and purge the cache on any changes to that data.
- Any changes to third party API’s automatically update in the UI.

In addition to this there also some very important factors when it comes to the app and the code itself:

- Simplicity: Is the apps architecture easy to understand? Is it clear how each part of the app works together?
- Readability: Am I struggling to understand what is happening? Do I find myself clicking through multiple files to get to the root of the problem?
- Productivity: Do I feel restricted getting my ideas into code? Do I find myself spending more time in GitHub issues rather than VS Code?

## Why Remix

- Front-end and back-end code is co-located in a single file. Write your back-end logic in your [loader](https://remix.run/docs/en/v1/api/conventions#loader) and hand it off to your client to render it to the page. Submitting a form? Handle what should happen to the data in your [action](https://remix.run/docs/en/v1/api/conventions#action).
- You can set headers via the [headers](https://remix.run/docs/en/v1/api/conventions#headers) export which gives you fine-grained control over how you want to cache your content. e.g you can set a `stale-while revalidate` header which gives you the same caching behaviour as Next's ISR.
- [Forms!](https://remix.run/docs/en/v1/guides/data-writes) The way Remix handles forms is fantastic. It's refreshingly simple and takes advantage of existing browser features and API's.
- Submitted form data can be handled by Remix’s [action](https://remix.run/docs/en/v1/api/conventions#action) export. Handle the data and send back the data you need, or if there's an error in your form send it right back to your client and render useful error messages for your visitors.
- [Nested routes](https://remix.run/docs/en/v1/guides/routing) are amazing. By tweaking your file/folder structure you can reuse layouts, data and components between routes.
- Remix has a built in [meta](https://remix.run/docs/en/v1/api/conventions) export which you can use for all of your page meta. Perfect for your SEO. The [Jokes App example](https://remix.run/docs/en/v1/tutorials/jokes#seo-with-meta-tags) has a more fleshed out example.
- Adding CSS is simple. Create a CSS file and add it via the `links` export or use something like [Tailwind](https://tailwindcss.com/) (or [UnoCSS](https://github.com/unocss/unocss) in my case).

## But Next could do a lot of these things

Of course you could debate that a lot of the above or similar could be achieved with Next in some shape or form. The biggie for me though was Forms: how we submit and handle the data and how that data is then pushed to the UI. I have around 14 different forms in the admin for this site to add, edit and delete content which is a fair amount generally speaking. Tackling this with Next, onSubmit and API routes seemed like an incredibly daunting task and I know I would inevitably end up confusing myself ("OK so I'm submitting the form, which API route am I hitting again? Hmm, where did I put that file? I'm pretty sure that's the right path..."). With Remix I don't need to think about that, everything I need is in a single file, which I love.

**Update 12.03.22:** [@andrewingram](https://twitter.com/andrewingram) pointed out to me that you can use [Next Runtime](https://github.com/smeijer/next-runtime) if you like the idea of Remix's co-location pattern but aren't quite ready to make the switch.

## Planetscale

Moving over from Next to Remix I made the decision to move all of my content over to a database rather than keeping it in Notion. The main reason here being I wanted to create a mini CMS for myself where I can edit the content "in-site" rather than opening a separate app. There's a few reasons for this:

- Reduce the amount of friction when it comes to publishing content.
- I can edit content on the move and publish when I like (once published, Notion updates content on every edit)
- Better control over caching and updating the UI.

To store all of the data I decided to go with Planetscale. I looked at quite a few different options but at the time there was a lot of hype about them on Twitter and they have a really generous free tier, perfect for my use case and experimenting. Now I needed a way to interact with my database...

## Prisma

Prisma is a `Next-generation Node.js and TypeScript ORM`. As I understand it Prisma have created a database abstraction which allows us to interact with it via Typescript (or JavaScript) without having to write any MySQL queries. This isn't a tutorial by any means but here are a few bits involved in getting set up:

- Create a Schema which describes our database structure and the database source
- Align the database with our schema via the `Prisma db push` command. This also generates the Prisma Client for you, so when we're writing our queries Typescript automagically knows what's available to use (thanks to our schema)
- Set up your client which exports a function like `db` or `prisma` which we use for our queries.
- Write queries in your back-end (Remix `loaders` or `actions` in this case) and return data.

A couple of good tips when querying your data:

- Use the `take` query option to get the number of items you need
- Use the `select` query option to get the fields that you need
- Use the `include` query option if you have any relations you'd also like to add. (e.g a User might have some Posts, where Posts is a separate model but associated to a User ID).

This is a great practice to follow because the less time we spend processing the fetched data the quicker we can get that data back to the client, and by sending a smaller payload we can keep our back-end fast and our page loads snappy.

In reality, we don't want to be hitting our database on every request, so there tends to be a cache layer which sits between the database and the back-end. In my case I'm using Upstash for this.

## Upstash

Originally I was playing with the idea of invalidating Vercels CDN cache so I could purge URL's as and when I needed, but that came to no avail (although this could be an option in the future based off of [Next 12.1's on-demand Incremental Static Regeneration](https://nextjs.org/blog/next-12-1)).
Instead, I needed to look at an external service for my caching needs. What I needed was a key value store which was simple to use, worked nicely with serverless functions and was quick. After coming across a thread on twitter I decided to give [Upstash](https://upstash.com/) a whirl.
What's great about Upstash is that rather than dealing with connection pooling they have the option to use their REST API, which is perfect for serverless sites. This means I could create some simple `get`, `set` and `del` methods (which are essentially the same fetch request with some slight changes) and Upstash deals with the rest.

Now when I'm requesting data I can:

1. Check the cache first
2. If the cache has the data I can return it
3. If the cache doesn't have the data I can hit the database, cache the response and send the data to the client.
4. On subsequent requests the cache will be used
5. I can delete the cached item and fresh data will be served

It's been a great addition to the stack but in the future I'd love to completely negate this step by dealing with the CDN cache directly.

## UnoCSS

When rewriting the site I wanted to rethink the way I approached styles. I used a mixture of CSS-in-JS and styled-jsx in my Next site but for Remix I wanted to keep it simple, understandable and performant. I was initially going to use [Tailwind](https://tailwindcss.com/) but then I came across [UnoCSS](https://github.com/unocss/unocss) by [@antfu7](https://twitter.com/antfu7). At it's core UnoCSS is an atomic CSS generator where you supply you're preferred "library" (Tailwind, WindiCSS etc) via presets and have the option to customise it however you like. It's incredibly quick and available as a plug-in for a lot of frameworks. I used the CLI for my Remix rewrite and it works great! I supply it with a couple of glob patterns for the files I want to watch and UnoCSS does the rest for me based off of my config.

It is worth noting that it did take me a while to get used to all of the different class names, but once you pick it up you find yourself creating interfaces quicker than ever.

**Update 10.03.22:** After some interest in how I use UnoCSS with Remix on Twitter and Discord I've written a follow up post [using UnoCSS with Remix](https://www.adamcollier.co.uk/blog/using-unocss-with-remix)

## Summary

Rewriting this site did take a lot of effort and a lot of work to get into a good place. However, I do think it has really paid off and I'm happy with the result. Even if you're not fully convinced by what I've written above I definitely recommend you give Remix a go!

In terms of the site itself, if you have any feedback please feel free to [tweet me](https://twitter.com/CollierAdam) and share it with anyone you think will benefit.
