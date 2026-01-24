import type { DOMNode } from '@shared/types'

/**
 * Convert HTML string into a DOMNode tree
 * This runs in the browser (web app) which has DOMParser available
 *
 * The web-app only extracts raw DOM structure.
 * Block/inline classification is handled by the plugin using USFM_STYLES.
 */
export function htmlToTree(html: string): DOMNode {
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')
  return elementToNode(doc.body)
}

/**
 * Recursively convert a DOM element into a DOMNode
 */
function elementToNode(element: Element | Node): DOMNode {
  // Handle text nodes
  if (element.nodeType === Node.TEXT_NODE) {
    const text = element.textContent || ''
    return {
      tagName: null,
      classes: [],
      textContent: text.trim() ? text : '',
      children: []
    }
  }

  const el = element as Element

  // Create the node
  const node: DOMNode = {
    tagName: el.tagName?.toLowerCase() || null,
    classes: Array.from(el.classList),
    textContent: '',
    children: []
  }

  // Parse children recursively
  for (const child of element.childNodes) {
    const converted = elementToNode(child)

    // Skip whitespace-only text nodes
    if (converted.tagName === null && !converted.textContent) {
      continue
    }

    node.children.push(converted)
  }

  // Leaf nodes: extract text content directly
  if (node.children.length === 0) {
    node.textContent = el.textContent || ''
  }

  return node
}
