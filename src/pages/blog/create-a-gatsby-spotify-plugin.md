---
layout: ../../layouts/BlogLayout.astro
title: Create a Gatsby Spotify Plugin
description: Take advantage of the Spotify API and build a plug-in to display your top tracks. Simple, flexible and a great feature to have on your personal site.
published: 27/03/2021
---

Creating your own Gatsby plug-in is a lot easier than you think, but for a while, I'll admit I found it an intimidating endeavour. Today we will be creating our own Spotify plugin so we can add our top tracks to our site. Disclaimer: of course there are already Spotify plug-ins out there (as with anything ever) but I wanted to create one that catered strictly for my needs without any "bloat".

Now... credit where credits due I found Lee Robinson's post [Using the Spotify API with Next.js](https://leerob.io/blog/spotify-api-nextjs) extremely useful in getting started with the Spotify API.

So here we go...

## Get your credentials

Okay so first we need to grab our Spotify credentials so we can authenticate with the API. To do this work your way through [Lee's post](https://leerob.io/blog/spotify-api-nextjs) up until the `Using Spotify's API` section.

At this point, you should have your:

- Spotify Client ID
- Spotify Client Secret
- Spotify Refresh token

## Create your .env file

Create a `.env.development` file and inside add our credentials:

```
SPOTIFY_CLIENT_ID=<client_id_here>
SPOTIFY_CLIENT_SECRET=<client_secret_here>
SPOTIFY_REFRESH_TOKEN=<refresh_token_here>

```

If you haven't used environment variables in Gatsby before I recommend [giving this a read.](https://www.gatsbyjs.com/docs/how-to/local-development/environment-variables/#defining-environment-variables)

## Set up your plug-in

Gatsby provides a super-easy way to get a plugin up and running. If you haven't already, create a `plugins` directory at the root of your project and write in your terminal:

```
$ cd plugins
$ npx gatsby new spotify-source <https://github.com/gatsbyjs/gatsby-starter-plugin>

```

This sets up some boilerplate for you, so no need to worry about any configs or setup. You can find more information about creating a local plug-in in the [Gatsby docs](https://www.gatsbyjs.com/docs/creating-a-local-plugin/)

The structure of your plug-in should look like this:

```
/spotify-source
????????? gatsby-browser.js
????????? gatsby-node.js
????????? gatsby-ssr.js
????????? index.js
????????? package.json
????????? README.md
```

## Install the dependencies

First things first let's get the dependencies we need to be installed. For the plugin, we will need `node-fetch` and `querystring`

```js
$ npm i node-fetch querystring
```

## Creating source nodes

For us to be able to query our Spotify tracks we need to create some nodes. To do this we are taking advantage of Gatsby's Node API, more specifically the [sourceNodes](https://www.gatsbyjs.com/docs/reference/config-files/gatsby-node/#sourceNodes) hook.

Since we will be primarily using the Node API, going forward we will be writing everything in the plugin's `gatsby-node.js` file.

Now let's get stuck in:

```js
const fetch = require(`node-fetch`);
const querystring = require("querystring");

exports.sourceNodes = async (
  { actions, createContentDigest, createNodeId },
  pluginOptions
) => {
  const { clientId, clientSecret, refreshToken } = pluginOptions;
  const { createNode } = actions;

  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const TOP_TRACKS_ENDPOINT = `https://api.spotify.com/v1/me/top/tracks?time_range=short_term`;
  const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`;
};
```

Here is some initial set up... This consists of importing our packages (notice the use of require since we are in Node territory), pulling in our plugin options and creating some variables for our endpoints and authentication string.

We can start to build this out more by creating a couple of functions; one to grab our `accessToken` and the other to fetch our top tracks from Spotify.

```js
const fetch = require(`node-fetch`);
const querystring = require("querystring");

exports.sourceNodes = async (
  { actions, createContentDigest, createNodeId },
  pluginOptions
) => {
  const { clientId, clientSecret, refreshToken } = pluginOptions;
  const { createNode } = actions;

  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const TOP_TRACKS_ENDPOINT = `https://api.spotify.com/v1/me/top/tracks?time_range=short_term`;
  const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`;

  const getAccessToken = async () => {
    const response = await fetch(TOKEN_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Basic ${basic}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: querystring.stringify({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
      }),
    });

    return response.json();
  };

  const getTopTracks = async () => {
    const { access_token: accessToken } = await getAccessToken();

    return fetch(TOP_TRACKS_ENDPOINT, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  };
};

```

Let's dive into what's happening:

- getAccessToken pretty much does what it says on the tin, we request our `TOKEN_ENDPOINT` passing in some essential bits in the header and body of the request. Once we have the data response we return the JSON. Notice how we are using async-await here to fetch and handle the data.
- getTopTracks first calls our getAccessToken function to grab our token and we assign it to a variable. We then make a request to `TOP_TRACKS_ENDPOINT` using the accessToken for authorisation via the header of the request. This data is then returned.

Now we have fetched all of our data we need to create our nodes:

```
const fetch = require(`node-fetch`);
const querystring = require("querystring");

exports.sourceNodes = async (
  { actions, createContentDigest, createNodeId },
  pluginOptions
) => {
  const { clientId, clientSecret, refreshToken } = pluginOptions;
  const { createNode } = actions;

  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const TOP_TRACKS_ENDPOINT = `https://api.spotify.com/v1/me/top/tracks?time_range=short_term`;
  const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`;

  const getAccessToken = async () => {
    const response = await fetch(TOKEN_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Basic ${basic}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: querystring.stringify({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
      }),
    });

    return response.json();
  };

  const getTopTracks = async () => {
    const { access_token: accessToken } = await getAccessToken();

    return fetch(TOP_TRACKS_ENDPOINT, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  };

  const topTracksResponse = await getTopTracks();
  const { items: topTracksData } = await topTracksResponse.json();

  topTracksData.forEach((track) => {
    createNode({
      ...track,
      id: createNodeId(`Track-${track.id}`),
      parent: null,
      children: [],
      internal: {
        type: `TopTracks`,
        contentDigest: createContentDigest(track),
      },
    });
  });
};

```

What's happening here:

1. We call `getTopTracks` and grab the data
2. The JSON response is assigned to the `topTracksData` variable
3. We loop through each track (using forEach since we don't need to return anything) and create a node for each track using the `createNode` action.

More can be found on the createNode action in the [Gatsby Docs](https://www.gatsbyjs.com/docs/reference/config-files/actions/#createNode). It's worth brushing up on as this is where Gatsby does a lot of the magic.

### Using the plug-in

As you may have noticed in the above snippet we are passing in the credentials via the pluginOptions. We previously stored these in our `.env` file so now we need to be able to load and access them via `process.env`.

This is where the `dotenv` package comes in.

Note: `dotenv` is already a dependency of Gatsby, so we can just require it at the top of our gatsby-config.js

```js
require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
});
```

Now we have access to our environment variables we can add our local plug-in and our options to the plug-ins array:

```js
{
  resolve: `spotify-source`,
  options: {
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    refreshToken: process.env.SPOTIFY_REFRESH_TOKEN,
  },
},
```

Now if you start your dev environment (using `npm run develop` ) and navigate to your Graphiql in-browser IDE you should have access to `topTracks` and `allTopTracks`

tip: use `ctrl + space` to browse the available options in the graphiql IDE.

So something like:

```js
{
  topTracks {
    id
    album {
      name
      external_urls {
        spotify
      }
    }
  }
  allTopTracks(limit: 3) {
    edges {
      node {
        album{
          name
        }
      }
    }
  }
}

```

would yield:

tip: use `ctrl + Enter` to run the query

```json
{
  "data": {
    "topTracks": {
      "id": "cb8d0892-419d-527b-be25-37d087e64d60",
      "album": {
        "name": "Spilligion",
        "external_urls": {
          "spotify": "<https://open.spotify.com/album/2L13Kv0sx6GPAHo7QTZLAy>"
        }
      }
    },
    "allTopTracks": {
      "edges": [
        {
          "node": {
            "album": {
              "name": "Spilligion"
            }
          }
        },
        {
          "node": {
            "album": {
              "name": "The Never Story"
            }
          }
        },
        {
          "node": {
            "album": {
              "name": "A N N I V E R S A R Y"
            }
          }
        }
      ]
    }
  },
  "extensions": {}
}
```

For this example, you will notice I have limited the number of albums.

## Handling Images via Gatsby Image

One thing to take into account at this point is that if we wanted to use an image from our plug-in we would be relying on what Spotify hands over to us. An example query would be something like:

```js
{
  topTracks {
    album {
      images {
        height
        url
        width
      }
    }
  }
}
```

which would spit out:

```js
{
  "data": {
    "topTracks": {
      "album": {
        "images": [
          {
            "height": 640,
            "url": "<https://i.scdn.co/image/ab67616d0000b273230d88bf27d6ca322fb59eb4>",
            "width": 640
          },
          {
            "height": 300,
            "url": "<https://i.scdn.co/image/ab67616d00001e02230d88bf27d6ca322fb59eb4>",
            "width": 300
          },
          {
            "height": 64,
            "url": "<https://i.scdn.co/image/ab67616d00004851230d88bf27d6ca322fb59eb4>",
            "width": 64
          }
        ]
      }
    }
  },
  "extensions": {}
}
```

See how we are limited to only a few sizes? To no surprise, Gatsby has the solution... what we need to do is [source and optimize our images from a remote location](https://www.gatsbyjs.com/docs/creating-a-source-plugin/#sourcing-and-optimizing-images-from-remote-locations). What this means is we can pull our images from the Spotify API and optimize them for use with Gatsby's [Gatsby Plugin Image](https://www.gatsbyjs.com/plugins/gatsby-plugin-image), taking full advantage of its powerful features and ease of use.

First of all, we need to install `gatsby-source-filesystem`

```js
$ npm install gatsby-source-filesystem
```

and then require `createRemoteFileNode` from `gatsby-source-filesystem` at the top of our `gatsby-node` file

```js
const { createRemoteFileNode } = require(`gatsby-source-filesystem`);
```

The next bit of code is pulled from the docs link above, but I'll let you know of any changes you'll need to make.

At the bottom of our file you will need to add:

```js
exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions;
  createTypes(`
    type TopTracks implements Node {
      id: ID!
      # create a relationship between YourSourceType and the File nodes for optimized images
      remoteImage: File @link
    }`);
};

exports.onCreateNode = async ({
  actions: { createNode },
  getCache,
  createNodeId,
  node,
}) => {
  // because onCreateNode is called for all nodes, verify that you are only running this code on nodes created by your plugin
  if (node.internal.type === `TopTracks`) {
    // create a FileNode in Gatsby that gatsby-transformer-sharp will create optimized images for
    const fileNode = await createRemoteFileNode({
      // the url of the remote image to generate a node for
      url: node.album.images[0].url,
      getCache,
      createNode,
      createNodeId,
      parentNodeId: node.id,
    });

    if (fileNode) {
      // with schemaCustomization: add a field `remoteImage` to your source plugin's node from the File node
      node.remoteImage = fileNode.id;
    }
  }
};
```

The two things you need to ensure here is that the `node.internal.type ===`TopTracks``and the URL property uses `node.album.images[0].url` as its value. The rest doesn't need to be touched! (queue wiping of sweaty head montage). Not too much thinking had to be done here to acquire a tonne of benefits.

## Using the remote images

Jumping back into the Graphiql IDE we will see a new `remoteImage` option available to us. Making sure we have `gatsby-plugin-image` installed:

```
$ npm i gatsby-plugin-image
```

We can query something like the below:

```
{
  topTracks {
    remoteImage {
      childImageSharp {
        gatsbyImageData(width: 72, layout: CONSTRAINED, formats: [AUTO, WEBP, AVIF])
      }
    }
  }
}
```

To give us back exactly what we need, perfectly formatted for our Gatsby Image component.

```js
{
  "data": {
    "topTracks": {
      "remoteImage": {
        "childImageSharp": {
          "gatsbyImageData": {
            "layout": "constrained",
            "images": {
              "fallback": {
                "src": "/static/a3c801edb5dfc32b978fea0d35088dee/cbeb2/ab67616d0000b273230d88bf27d6ca322fb59eb4.jpg",
                "srcSet": "/static/a3c801edb5dfc32b978fea0d35088dee/e0ff4/ab67616d0000b273230d88bf27d6ca322fb59eb4.jpg 18w,\\n/static/a3c801edb5dfc32b978fea0d35088dee/e6240/ab67616d0000b273230d88bf27d6ca322fb59eb4.jpg 36w,\\n/static/a3c801edb5dfc32b978fea0d35088dee/cbeb2/ab67616d0000b273230d88bf27d6ca322fb59eb4.jpg 72w,\\n/static/a3c801edb5dfc32b978fea0d35088dee/c45fb/ab67616d0000b273230d88bf27d6ca322fb59eb4.jpg 144w",
                "sizes": "(min-width: 72px) 72px, 100vw"
              },
              "sources": [
                {
                  "srcSet": "/static/a3c801edb5dfc32b978fea0d35088dee/8b19b/ab67616d0000b273230d88bf27d6ca322fb59eb4.avif 18w,\\n/static/a3c801edb5dfc32b978fea0d35088dee/3c977/ab67616d0000b273230d88bf27d6ca322fb59eb4.avif 36w,\\n/static/a3c801edb5dfc32b978fea0d35088dee/d1490/ab67616d0000b273230d88bf27d6ca322fb59eb4.avif 72w,\\n/static/a3c801edb5dfc32b978fea0d35088dee/f7d23/ab67616d0000b273230d88bf27d6ca322fb59eb4.avif 144w",
                  "type": "image/avif",
                  "sizes": "(min-width: 72px) 72px, 100vw"
                },
                {
                  "srcSet": "/static/a3c801edb5dfc32b978fea0d35088dee/4f7ad/ab67616d0000b273230d88bf27d6ca322fb59eb4.webp 18w,\\n/static/a3c801edb5dfc32b978fea0d35088dee/9a807/ab67616d0000b273230d88bf27d6ca322fb59eb4.webp 36w,\\n/static/a3c801edb5dfc32b978fea0d35088dee/de323/ab67616d0000b273230d88bf27d6ca322fb59eb4.webp 72w,\\n/static/a3c801edb5dfc32b978fea0d35088dee/1b3aa/ab67616d0000b273230d88bf27d6ca322fb59eb4.webp 144w",
                  "type": "image/webp",
                  "sizes": "(min-width: 72px) 72px, 100vw"
                }
              ]
            },
            "backgroundColor": "#080808",
            "width": 72,
            "height": 72
          }
        }
      }
    }
  },
  "extensions": {}
}
```

And that's it! I hope you've enjoyed learning how to create your own Spotify and I'll be back with another post soon!