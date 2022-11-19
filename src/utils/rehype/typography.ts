import { visit } from 'unist-util-visit'

export const typography = () => {
  // All remark and rehype plugins return a separate function
  return (tree: any) => {
    visit(tree, (node, index, parentNode) => {
      if (node.tagName === 'h2') {
        node.properties.className = 'text-2xl font-medium tracking-[-0.019em]'
      }
      if (node.tagName === 'h3') {
        node.properties.className = 'text-lg font-medium'
      }
      if (node.tagName === 'h4') {
        node.properties.className = 'text-md font-medium '
      }
      if (node.tagName === 'p') {
        node.properties.className = 'text-md tracking-[-0.011em]'
      }
      if (node.tagName === 'ol') {
        node.properties.className = 'list-decimal pl-8 space-y-2'
      }
      if (node.tagName === 'ul') {
        node.properties.className = 'list-disc pl-8 space-y-2'
      }
      if (node.tagName === 'code' && parentNode?.tagName !== 'pre') {
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
