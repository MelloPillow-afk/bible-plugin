import type { ParsedNode } from '@shared/types'

/**
 * Set of USFM class names that represent block-level elements
 */
const BLOCK_CLASSES = new Set([
  'mt', 'mt1', 'mt2',
  'ms', 'ms1', 'ms2',
  's', 's1', 's2',
  'p', 'm',
  'q', 'q1', 'q2', 'q3', 'q4',
  'li', 'li1', 'li2',
  'b',
  'chapter', 'version'
])

/**
 * Block-level HTML tags
 */
const BLOCK_TAGS = new Set([
  'div', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'section', 'article', 'header', 'footer', 'main',
  'nav', 'aside', 'blockquote', 'pre',
  'ul', 'ol', 'li', 'table', 'tr', 'td', 'th'
])

/**
 * Parse HTML string into a ParsedNode tree
 * This runs in the browser (web app) which has DOMParser available
 */
export function parseHTML(html: string): ParsedNode {
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')
  return parseElement(doc.body)
}

/**
 * Recursively parse a DOM element into a ParsedNode
 */
function parseElement(element: Element | Node): ParsedNode {
  const isElement = element.nodeType === Node.ELEMENT_NODE
  const el = element as Element

  // Handle text nodes
  if (element.nodeType === Node.TEXT_NODE) {
    const text = element.textContent || ''

    // Return node with empty text if whitespace only
    return {
      type: 'text',
      tagName: null,
      classes: [],
      textContent: text.trim() ? text : '',
      children: []
    }
  }

  // Get classes from element
  const classes: string[] = isElement ? Array.from(el.classList) : []
  const tagName = isElement ? el.tagName.toLowerCase() : null

  // Determine node type based on classes
  const type = classifyNode(classes, tagName)

  // Create the node
  const node: ParsedNode = {
    type,
    tagName,
    classes,
    textContent: '',
    children: []
  }

  // Parse children recursively
  const childNodes = Array.from(element.childNodes)

  for (const child of childNodes) {
    const parsedChild = parseElement(child)

    // Skip empty text nodes
    if (parsedChild.type === 'text' && !parsedChild.textContent) {
      continue
    }

    node.children.push(parsedChild)
  }

  // For text-only nodes, extract text content directly
  if (node.children.length === 0 && isElement) {
    node.textContent = el.textContent || ''
  }

  return node
}

/**
 * Classify a node as block, inline, or text based on its CSS classes
 */
function classifyNode(classes: string[], tagName: string | null): 'block' | 'inline' | 'text' {
  // Check if any class is a block class
  for (const cls of classes) {
    if (BLOCK_CLASSES.has(cls)) {
      return 'block'
    }
  }

  // Block-level HTML tags
  if (tagName && BLOCK_TAGS.has(tagName)) {
    return 'block'
  }

  // Default to inline for elements with classes or known inline tags
  return 'inline'
}
