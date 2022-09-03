import { visit } from 'unist-util-visit'

export function typography() {
  // All remark and rehype plugins return a separate function
  return function (tree) {
    visit(tree, (node) => {
      if (node.tagName === 'h2') {
        node.properties.className = 'text-2xl'
      }
      if (node.tagName === 'h3') {
        node.properties.className = 'text-lg'
      }
      if (node.tagName === 'h4') {
        node.properties.className = 'text-md'
      }
      if (node.tagName === 'p') {
        node.properties.className = 'leading-7'
      }
      if (node.tagName === 'ol') {
        node.properties.className = 'list-decimal pl-8 space-y-2'
      }
      if (node.tagName === 'ul') {
        node.properties.className = 'list-disc pl-8 space-y-2'
      }
      if (node.tagName === 'code') {
        node.properties.className =
          'bg-gray-100 dark:bg-gray-700 text-sm px-1.5 py-1 rounded'
      }
      if (node.tagName === 'a') {
        node.properties.className =
          'underline text-indigo-600 dark:text-indigo-400'
      }
    })
  }
}
