---
layout: ../../layouts/BlogLayout.astro
title: Adding an Updated Date to Markdown and MDX Posts
description: Improve your SEO by showing when your posts got last updated. Perfect for Gatsby and Next.js sites which use Markdown or MDX for their content.
published: 17/02/2021
---

## The Problem

Unlike a CMS grabbing the modified date for your posts in frameworks like Gatsby and Next can come as a bit of a challenge. In Gatsby for instance you could use the `gatsby-transformer-gitinfo` plug-in which adds a `gitPublishedDate` field to your GraphQL schema, and this will work perfectly for a lot of cases. However, there is a huge caveat in that approach, which is what I experienced when deploying to Vercel. If your `.git` directory isn't deployed alongside your repo, then your git logs can't be accessed and no timestamps can be pulled. This is true for a few other approaches I stumbled upon, such as [angelos.devs](https://angelos.dev/2019/09/add-support-for-modification-times-in-gatsby/) and [pragmatic pineapples](https://pragmaticpineapple.com/add-updated-at-to-your-gatsby-blog/) posts.

## Finding a Solution

Luckily I did come across a [thread](https://twitter.com/monicalent/status/1353327937085464576) from [@monicalent](https://twitter.com/monicalent) which offered some alternate solutions, and influenced the approach I ended up taking (here is the [initial tweet](https://twitter.com/leeerob/status/1353381006062063616) from Lee Robinson and the [snippet page](https://leerob.io/snippets/update-mdx-meta) it links to). Unlike the previous approaches, it adds the updated date when staging your content to commit rather than pulling the dates at build time. This means you don't need to rely on a `.git` directory being deployed, with minimal changes to your existing git workflow.

## The Approach

The approach that Lee Robinson and Michael Novotny took is to have an existing meta-object in the MDX which is altered via a script. It's a great idea but I want to cater to both Markdown and MDX files and not have to rely on an initial object to exist. Therefore, instead of having a meta-object, which would only be usable in MDX documents, we parse and alter the front-matter instead. This way we have a common solution which easily integrates into Next and Gatsby projects.

## The Node Script

Taking all of this into account, I wrote the below script to satisfy those needs:

```js
/* eslint-disable import/no-extraneous-dependencies */
const fs = require("fs").promises;
const matter = require("gray-matter");

const updateFrontmatter = async () => {
  const [, , ...mdFilePaths] = process.argv;

  mdFilePaths.forEach(async (path) => {
    const file = matter.read(path);
    const { data: currentFrontmatter } = file;

    if (currentFrontmatter.published === true) {
      const updatedFrontmatter = {
        ...currentFrontmatter,
        updatedOn: new Date().toISOString(),
      };
      file.data = updatedFrontmatter;
      const updatedFileContent = matter.stringify(file);
      fs.writeFile(path, updatedFileContent);
    }
  });
};

updateFrontmatter();
```

Here's what's happening:

1. We grab the Markdown/MDX file paths
2. Loop over all of the file paths
3. Read each file with the [gray-matter](https://www.npmjs.com/package/gray-matter) package which parses the front-matter for us.
4. Parse the front-matter and split it into an object. Take the rest of the content and dump it in a string.

```json
{
  "content": "<h1>Hello world!</h1>",
  "data": {
    "title": "Hello",
    "slug": "home"
  }
}
```

^ What is returned from gray-matter, data here being the parsed front-matter content.

1. If the posts published front-matter is true we continue, otherwise we do nothing.
2. Immutably update the object with the new date and assign it to the data property.
3. Take the newly updated gray-matter object and turn this back into a string
4. Overwrite the existing content using `fs.writeFile`

Now you will probably have noticed above that we are grabbing the paths using `process.argv`. The reason for doing this is we are using Husky and lint-staged to create a git commit hook. What this essentially means is when we make a commit which includes a Markdown or MDX file, we can run a node script and pass the paths as arguments, hence what you saw above.

## Setting Up Husky and lint-staged

1. Install Husky `npm i -D husky`
2. Add Husky's git hooks with `npx husky install` (you will notice it created a .husky directory).
3. Add your commit hook via `npx husky add .husky/pre-commit "npm run lint:staged"`. This will add a pre-commit file to your `.husky` directory and within that file, your npm command should exist (if not you can manually add it)
4. Install lint-staged `npm i lint-staged -D`
5. Create a `.lintstagedrc` file
6. Add your lint-staged config:

```json
{
  "**/*.{md,mdx}": "node updateFrontmatter"
}
```

(updateFrontmatter is the filename of your script)

1. Add the script to your package.json
```json
    "lint:staged": "lint-staged"
```

## Conclusion

Now, whenever you commit either a Markdown or MDX file Husky will run the node script and update/create the updatedOn frontmatter content. No more worrying about the build step and depending on git logs being available. It just works.

## Useful Links

- [gray-matter package](https://www.npmjs.com/package/gray-matter)
- [Husky docs](https://typicode.github.io/husky/#/) - These are worth checking out as V5 is very different to V4
- [gatsby-transformer-gitinfo](https://www.gatsbyjs.com/plugins/gatsby-transformer-gitinfo/) - if your .git directory is deployed alongside your repo check out this plugin
