import { defineConfig } from 'astro/config'
import vercelAdapter from '@astrojs/vercel/serverless'
// @ts-ignore: this will be fixed in the next unocss release
import Unocss from 'unocss/astro'

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: vercelAdapter(),
  integrations: [
    Unocss({
      /* options */
    }),
  ],
})
