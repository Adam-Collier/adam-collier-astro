---
layout: ../../layouts/BlogLayout.astro
title: Using UnoCSS with Remix
description: Unsure on how to style your Remix app? Get Remix up and running with UnoCSS, the instant on-demand Atomic CSS engine, and build UI's quicker than ever.
published: 10/03/2022
---
In my previous post [Moving from Next to Remix](https://www.adamcollier.co.uk/blog/moving-from-next-to-remix) one of the new technologies I mentioned using is [UnoCSS](https://github.com/unocss/unocss). A few of you on Twitter and Discord hadn't heard of UnoCSS before and wanted to know how to get set up with Remix, so I thought I'd throw together something to help get started. I'll try and keep this post short and sweet so you can get UnoCSS added to your Remix project and have a play yourself.

## What is UnoCSS
A little context before we get to the practical side of things. What is UnoCSS? Built by [@antfu7](https://twitter.com/antfu7) (the mind behind [WindiCSS](https://windicss.org/), [Unplugin](https://github.com/unjs/unplugin), [Vitest](https://vitest.dev/) and many more packages) UnoCSS essentially acts as an atomic CSS generator. What this means is UnoCSS comes with no core utilities and all functionalities are provided via presets and your own rules. There *is* a default setup which is a superset of Tailwind and WindiCSS, but you're in no way tied to that. Basically, you have full control, UnoCSS hands you the keys to a blazing fast engine geared to make your CSS changes as instant as possible.

## Why UnoCSS with Remix
Originally when getting started with Remix there was a [section in the docs](https://remix.run/docs/en/v1/guides/styling#tailwind-css) which recommended the Tailwind CLI as a potential CSS solution. I was already aware of WindiCSS as a faster alternative but I'd seen a tweet from [@antfu7](https://twitter.com/antfu7) about a new idea he was working on, that being UnoCSS. As it turns out UnoCSS has it's own CLI package and it's even faster!
```
11/5/2021, 4:26:57 AM
1656 utilities | x50 runs (min build time)

none                              8.30 ms / delta.      0.00 ms 
unocss       v0.4.15             13.58 ms / delta.      5.28 ms (x1.00)
windicss     v3.2.1             989.57 ms / delta.    981.27 ms (x185.94)
tailwindcss  v3.0.0-alpha.1    1290.96 ms / delta.   1282.66 ms (x243.05)
```
Some of you might be sceptical over these benchmarks, but the way I see it Anthony is also comparing against his own tool (WindiCSS) which adds to the credibility (in my opinion).

A quick overview of why I use UnoCSS:
* Faster than Tailwind and WindiCSS.
* Framework agnostic, alter which framework you'd like to use using presets
* Fully customisable.
* A great API and easy to use.
* Use as a [CLI](https://github.com/unocss/unocss/tree/main/packages/cli) or as a [Vite or Nuxt plugin](https://github.com/unocss/unocss#installation). With the Vite plug-in you get some added benefits, such as the [inspector](https://github.com/unocss/unocss#inspector).
* [Icons as CSS classes](https://github.com/unocss/unocss/tree/main/packages/preset-icons/) from a huge library of open source icons
* Comes packaged with [modern CSS resets](https://github.com/unocss/unocss#style-resetting) you can import (super convenient).

Now, let's get UnoCSS up and running with Remix.

## Installing UnoCSS
Let's install the main `unocss` package and `@unocss/reset`.
```bash
npm i -D unocss 
npm i @unocss/reset
```

## Adding the scripts
Here are the scripts that I use for my Remix site, you can change your glob patterns to whatever you need for your project
```json
"build": "npm run build:css && remix build",
"build:css": "unocss './app/**/*.{ts,tsx}' './app/utils/unified/**/*.js' -o ./app/styles/uno.css",
"dev": "node -r dotenv/config node_modules/.bin/remix dev",
"dev:css": "unocss './app/**/*.{ts,tsx}' './app/utils/unified/**/*.js' -o ./app/styles/uno.css --watch",
```
Notice here how I have two separate scripts rather than a single `dev` and `build` script. Some developers prefer to use something like [concurrently](https://www.npmjs.com/package/concurrently) or [npm-run-all](https://www.npmjs.com/package/npm-run-all) so you can create a single command that runs both processes. It's all down to personal preference, but for me I like to keep my processes running separately side by side in my terminal so I can easily navigate any errors.

## Creating your config
Create an `unocss.config.js` file in the root of your project and add:
```js
import { defineConfig, presetUno } from 'unocss'

export default defineConfig({
  presets: [presetUno()]
})
```
This is the `uno.css.config` in it's simplest form. For a more fleshed out example see the `uno.css.config` I use for this site below:

```js
import { defineConfig, presetIcons, presetUno } from 'unocss'

export default defineConfig({
  shortcuts: [
    {
      btn: 'text-sm py-2 px-4 rounded bg-neutral-900 hover:bg-neutral-700 border border-transparent text-white disabled:bg-gray-300 disabled:hover:bg-gray-300 disabled:cursor-not-allowed',
      'btn-delete':
        'text-sm py-2 px-4 rounded bg-transparent hover:bg-red-600 border border-color-red-600 text-red-600 hover:text-white disabled:border-color-gray-300 disabled:hover:border-color-gray-300 disabled:hover:bg-transparent disabled:text-gray-300 disabled:hover:text-gray-300 disabled:cursor-not-allowed',
    },
  ],
  rules: [
    [
      /^form-select$/,
      () => ({
        'background-image': `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%239ca3af' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
        'background-size': '1.5rem 1.5rem',
        'background-position': 'right 0.55rem center',
      }),
    ],
    [
      /^text-clamp-(\d)$/,
      ([, d]: any) => ({
        display: '-webkit-box;',
        '-webkit-line-clamp': d,
        '-webkit-box-orient': 'vertical',
        overflow: 'hidden',
      }),
    ],
  ],
  variants: [
    // href: hover:
    (matcher) => {
      if (!matcher.startsWith('href:')) return matcher
      return {
        // slice `hover:` prefix and passed to the next variants and rules
        matcher: matcher.slice(5),
        selector: (s) => `${s} a`,
      }
    },
  ],
  theme: {
    listStyleType: {
      revert: 'revert',
    },
  },
  presets: [presetUno(), presetIcons()],
})
```
I'd recommend taking a moment to try and understand what I'm doing and referring to the [documentation](https://github.com/unocss/unocss) for each option. You'll really start to piece together how powerful and flexible UnoCSS is.

## Add your generated UnoCSS file to your gitignore

Not much to say here other than to act as a reminder to ignore your generated file in your gitignore!

## Import and use your uno.css file
All that's left to do now is to import your modern reset and `uno.css` file in `root.tsx` and add them to your `links` export.

```jsx
import reset from '@unocss/reset/tailwind.css'
import unocss from '~/styles/uno.css'

export const links = () => [
  { rel: 'stylesheet', href: reset },
  { rel: 'stylesheet', href: unocss },
]
```

I hope this post adds some clarity on how to use UnoCSS with Remix and if you've found this post helpful or I've fluffed something up, [let me know](https://twitter.com/CollierAdam).
