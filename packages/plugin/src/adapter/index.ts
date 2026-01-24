import type { DOMNode } from '@shared/types'
import type { ParsedNode } from './types'
import { LayoutEngine } from './layout-engine'
import { NodeBuilder } from './node-builder'
import { loadRequiredFonts } from '../styles/fonts'
import { USFM_STYLES } from '../styles/usfm-styles'

/**
 * Block-level HTML tags (fallback when no USFM class matches)
 */
const BLOCK_TAGS = new Set([
  'div', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'section', 'article', 'header', 'footer', 'main',
  'nav', 'aside', 'blockquote', 'pre',
  'ul', 'ol', 'li', 'table', 'tr', 'td', 'th'
])

/**
 * DOMToFigmaAdapter
 * Main adapter class that orchestrates the conversion of parsed content to Figma nodes
 *
 * Pipeline:
 * 1. Load required fonts
 * 2. Classify nodes and add sibling references
 * 3. Apply layout styles based on USFM classes
 * 4. Build Figma nodes from the styled tree
 */
export class DOMToFigmaAdapter {
  private layoutEngine: LayoutEngine
  private nodeBuilder: NodeBuilder

  constructor() {
    this.layoutEngine = new LayoutEngine()
    this.nodeBuilder = new NodeBuilder()
  }

  /**
   * Convert DOM tree to Figma nodes
   * @param domTree - Raw DOM node tree from web app
   * @returns Array of created SceneNodes
   */
  async convert(domTree: DOMNode): Promise<SceneNode[]> {
    // Step 1: Load required fonts
    await loadRequiredFonts()

    // Step 2: Classify nodes and add sibling references
    const classified = this.classifyTree(domTree)

    // Step 3: Apply layout styles
    const styledTree = this.layoutEngine.applyStyles(classified)

    // Step 4: Build Figma nodes
    const figmaNodes = this.nodeBuilder.build(styledTree)

    return figmaNodes
  }

  /**
   * Classify DOM nodes into block/inline/text and add sibling references
   * Uses USFM_STYLES as the single source of truth for block classification
   */
  private classifyTree(node: DOMNode, previousSibling?: ParsedNode): ParsedNode {
    const type = this.classifyNode(node)

    const result: ParsedNode = {
      tagName: node.tagName,
      classes: node.classes,
      textContent: node.textContent,
      type,
      children: [],
      previousSibling
    }

    let prevChild: ParsedNode | undefined
    for (const child of node.children) {
      const classified = this.classifyTree(child, prevChild)
      result.children.push(classified)
      prevChild = classified
    }

    return result
  }

  /**
   * Classify a node as block, inline, or text
   * Uses USFM_STYLES.isBlock as the single source of truth
   */
  private classifyNode(node: DOMNode): 'block' | 'inline' | 'text' {
    // Text nodes
    if (node.tagName === null) {
      return 'text'
    }

    // Check USFM classes (single source of truth)
    for (const cls of node.classes) {
      const rule = USFM_STYLES[cls]
      if (rule?.isBlock) {
        return 'block'
      }
    }

    // HTML block tags (fallback)
    if (BLOCK_TAGS.has(node.tagName)) {
      return 'block'
    }

    return 'inline'
  }
}

// Re-export components for direct access if needed
export { LayoutEngine } from './layout-engine'
export { NodeBuilder } from './node-builder'
export type { ParsedNode, FigmaStyle, TextSegment, USFMStyleRule } from './types'
