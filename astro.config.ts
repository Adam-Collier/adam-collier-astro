import { defineConfig } from 'astro/config'
import vercelAdapter from '@astrojs/vercel/serverless'
import unocss from 'unocss/astro'
import preact from '@astrojs/preact'
import { typography } from './src/utils/rehype/typography'
import { highlight } from './src/utils/rehype/highlight'
import prefetch from '@astrojs/prefetch'
import image from '@astrojs/image'

import svelte from '@astrojs/svelte'

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: vercelAdapter(),
  integrations: [unocss(), preact(), prefetch(), image(), svelte()],
  markdown: {
    syntaxHighlight: false,
    rehypePlugins: [highlight, typography],
  },
  vite: {
    ssr: {
      external: ['image-size', 'tiny-glob'],
    },
  },
})
