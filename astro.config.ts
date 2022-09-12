import { defineConfig } from 'astro/config'
import vercelAdapter from '@astrojs/vercel/serverless' // @ts-ignore: this will be fixed in the next unocss release

import preact from '@astrojs/preact'

import { typography } from './src/utils/rehype/typography'
import { highlight } from './src/utils/rehype/highlight'

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: vercelAdapter(),
  integrations: [preact()],
  markdown: {
    syntaxHighlight: false,
    rehypePlugins: [highlight, typography],
  },
})
