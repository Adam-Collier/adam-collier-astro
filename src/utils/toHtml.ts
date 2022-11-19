import { unified } from 'unified'

import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import remarkExternalLinks from 'remark-external-links'

import rehypeStringify from 'rehype-stringify'

import highlight from './rehype/highlight'
import { typography } from './rehype/typography'

type Options = {
  highlightOptions?: {
    noPre?: boolean
  }
}

export const toHTML = async (markdown: string, options: Options) => {
  let processor = unified()
    .use(remarkParse) // Parse markdown content to a syntax tree
    .use(remarkRehype) // Turn markdown syntax tree to HTML syntax tree, ignoring embedded HTML
    .use(highlight, { ...options?.highlightOptions })
    .use(typography)
    .use(remarkExternalLinks)
    .use(rehypeStringify)

  let html = await processor.process(markdown)

  // make sure to return a string otherwise Typescript will throw an error regarding VFile
  return html.value
}
