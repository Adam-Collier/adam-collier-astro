import { toReadableDate } from 'src/utils'
import { toHTML } from 'src/utils/toHtml'

export async function get({ params, request }) {
  const response = await fetch(`${import.meta.env.STATIC_API}/snippets.json`)
  const json = await response.json()

  const snippets = await Promise.all(
    json.data.map(async (data: any) => {
      const [, ...markdownCode] = data.content.split(/(```)/)
      const code = await toHTML(markdownCode.join(''), {
        highlightOptions: { noPre: true },
      })

      delete data.SnippetCollection
      delete data.content

      return {
        ...data,
        updatedAt: toReadableDate(data.updatedAt),
        code,
      }
    }),
  )

  return new Response(JSON.stringify(snippets), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 's-maxage=1, stale-while-revalidate=59',
    },
  })
}
