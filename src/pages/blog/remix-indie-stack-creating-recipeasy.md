---
layout: ../../layouts/BlogLayout.astro
title: 'Remix Indie Stack: Creating Recipeasy'
description: "I released a small side project, Recipeasy: A space to collect recipes and quickly create shopping lists. Here's my thoughts and take on Remix's Indie Stack"
published: 15/04/2022
---

This week I released a small side project using Remix Stacks. The aim was to familiarise myself with how to get up and running Remix stacks and gain more experience creating mini projects that have a database, authentication and user created content. I'll give a general overview of the project itself, some barriers and frustrations I experienced a long the way.

If you're keen to see what I built, you can find it here: [Recipeasy](https://recipeasy.fly.dev/).

## What I chose to build

Bookmarking recipes is great; find a recipe you like the look of and open it up on your preferred device ready to start cooking.

However, what bookmarking recipes doesn't solve is the tedious chore of having to open up each recipe page to note down the ingredients you need. So this is what inspired me to create Recipeasy: a space to collect your favourite recipes and easily prepare your shopping lists.

I saw this as an opportunity to not only fix a problem I find terribly annoying but also play around with a new tech stack

A general list of things that needed doing:

- User authentication
- A grid of user Recipes
- Add, edit and delete a Recipe
- Add, remove and update items in the shopping list
- Shopping list item check off
- Shopping list view on mobile

I used Figma to sketch out a few of the ideas I had and using that as a starting point, I was quite happy designing in the browser.

## Picking the Remix Stack to use

Since this is only going to be a relatively small project I opted to use the [Indie Stack](https://github.com/remix-run/indie-stack) which includes:

- Fly app deployment with Docker
- Production-ready SQLite Database
- Healthcheck endpoint for Fly backups region fallbacks
- GitHub Actions for deploy on merge to production and staging environments
- Email/Password Authentication with cookie-based sessions
- Database ORM with Prisma
- Styling with Tailwind
- End-to-end testing with Cypress
- Local third party request mocking with MSW
- Unit testing with Vitest and Testing Library
- Code formatting with Prettier
- Linting with ESLint
- Static Types with TypeScript

## Getting up and running

To create your Indie Stack set up you can run:

```bash
npx create-remix --template remix-run/indie-stack
```

This will install everything for you, there is no need to `npm install` or `npm run setup` as this has already been done for you.

## Initial thoughts

It's a really nice experience! I didn't have to think about setting anything up and everything I needed was already there for me. Of course I prefer to use UnoCSS over Tailwind and I have no clue how I'm supposed to use MSW, but these inclusions aren't blocking me from getting started. I can start the dev starter and jump right into writing my app code.

Having authentication already set up saved me a lot of time and there's even some handy pre-written `util` functions you can use to access user data etc in your loaders. Even `Form` wise there's not much you need to do here, it's got some nice styling and basic error handling out of the box.

I really like using SQLite as my database. Previously I used Planetscale because Vercel doesn't let you deploy something like SQLite for persistent data storage. It was refreshing to have a local database where I can get almost instant responses and not having to worry about hitting the remote database constantly. It made me feel more comfortable, which meant that I could experiment and make mistakes with no harmful implications. Additionally, because I'm deploying with Fly.io my data is always going to be close to my app, therefore responses are going to be almost as snappy (which is amazing).

Since I already have a decent understanding of Remix I found myself being super productive and not running into many issues a long the way. In fact I don't think I visited any Github issue pages at all (which is an achievement in itself).

## Deploying the project

There's two ways I ended up deploying Recipeasy: one way was using the fly CLI directly and the other was pushing up to GitHub and letting GitHub Actions deploy it for me. I'm not going to go into step by step instructions here because one thing that makes Remix Stacks (and Remix in general) great is whatever stack/framework you choose the `README` always has all the information you need for getting your app deployed.

## Frustrations

The biggest frustration I came across with Recipeasy was when it came to deploying the app with the current GitHub Actions setup:

- The majority of my pushes took longer than 5 minutes to deploy
- I had some issues where Actions would fail for no reason relating to the code
- Once the app had deployed there was no deploy URL shown, each time I either had to remember the URL or go to my Fly.io dashboard
- It's limited in terms of the branches that deploy (currently `main` and `dev`). I do think this is a limitation of Fly though.

I think there's a lot that can be improved on in this area, especially if you compare it to how Vercel handles deploying your app: every push to a branch gets deployed, deploy URL's can be easily found and are even added to the main repo page and each Remix deploy (in my experience) is live in less than a minute.

Personally, I would like the see all of the checks done locally before pushing up (ESLint, Typescript, Vitest and Cypress) that way we can reduce the time it takes to deploy and we're not waiting around for GitHub Actions to download the dependencies needed to do the checks each time.

This may be a conscious decision they made when creating Remix Stacks and it may work for a lot of people, but for me the current GitHub Actions is the biggest crux in the current development experience with Remix Stacks.

Not necessarily a frustrating experience but something worth pointing out. Currently the Fly CLI seems to have an incredible amount of features which don't currently have a UI equivalent. It'd be nice to see some of that functionality find its way on to the web. At the moment I don't think its possible to add a database via the UI, I think it can only be added via the command line.

## Conclusion

Overall I have thoroughly enjoyed my experience playing around with the Indie Stack and learning some new technologies along the way. I'm really blown away at how quick the responses are from the SQLite database compared to Planetscale and some of these learning will influence some of the decisions I make for this site going forward. If you haven't already I would recommend you take a look at [Recipeasy](https://recipeasy.fly.dev/) and give the [Indie Stack](https://github.com/remix-run/indie-stack) a go.

As with anything there are some features I would eventually like to add to Recipeasy which I haven't gotten around to, but I'll get there. If there are any features you would like to see or anything you think can be improved don't hesitate to [DM me on Twitter](https://twitter.com/CollierAdam)
