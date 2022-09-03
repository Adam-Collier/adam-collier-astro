import { visit } from 'unist-util-visit'
import { toString } from 'hast-util-to-string'
import { refractor } from 'refractor'

export const highlight = () => {
  return (tree: any) => {
    visit(tree, 'element', visitor)
  }

  function visitor(node: any, index: any, parentNode: any) {
    if (node.tagName === 'pre') {
      node.properties.className = 'pre'
      let code = toString(node.children[0])

      const wrapperNode = {
        type: 'element',
        tagName: 'div',
        properties: {
          className: 'relative',
        },
        children: [
          { ...node },
          {
            type: 'element',
            tagName: 'button',
            properties: {
              className:
                'absolute top-2 right-2 p-1 bg-[hsl(15_12.9%_20%)] hover:bg-[hsl(15_12.9%_25%)] rounded text-white',
              dataCode: code,
              onclick: 'copyCodeToClipboard(this)',
              ariaLabel: 'copy to clipboard',
            },
            children: [
              {
                type: 'element',
                tagName: 'span',
                properties: {
                  className: 'block i-ri:clipboard-line w-[14px] h-[14px]',
                },
              },
            ],
          },
        ],
      }

      parentNode.children[index] = wrapperNode
    }

    if (parentNode.tagName === 'pre' && node.tagName === 'code') {
      // syntax highlight
      console.log(node.properties)
      const lang = node.properties.className
        ? node.properties.className[0].split('-')[1]
        : 'md'

      let code = toString(node)
      let result = refractor.highlight(code, lang)
      node.children = [{ ...result }]
    }
  }
}

export default highlight
