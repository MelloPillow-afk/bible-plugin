import type { ParsedNode as SharedParsedNode } from '@shared/types'
import type { ParsedNode } from './types'
import { LayoutEngine } from './layout-engine'
import { NodeBuilder } from './node-builder'
import { loadRequiredFonts } from '../styles/fonts'

/**
 * DOMToFigmaAdapter
 * Main adapter class that orchestrates the conversion of parsed content to Figma nodes
 *
 * Pipeline:
 * 1. Load required fonts
 * 2. Add previousSibling references for contextual styling
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
   * Convert parsed content to Figma nodes
   * @param parsedTree - Pre-parsed node tree from web app
   * @returns Array of created SceneNodes
   */
  async convert(parsedTree: SharedParsedNode): Promise<SceneNode[]> {
    // Step 1: Load required fonts
    await loadRequiredFonts()

    // Step 2: Add previousSibling references for contextual styling
    const treeWithSiblings = this.addSiblingReferences(parsedTree)

    // Step 3: Apply layout styles
    const styledTree = this.layoutEngine.applyStyles(treeWithSiblings)

    // Step 4: Build Figma nodes
    const figmaNodes = this.nodeBuilder.build(styledTree)

    return figmaNodes
  }

  /**
   * Add previousSibling references to the tree for contextual styling
   * The web app sends nodes without this to avoid circular refs in JSON
   */
  private addSiblingReferences(node: SharedParsedNode, previousSibling?: ParsedNode): ParsedNode {
    const result: ParsedNode = {
      type: node.type,
      tagName: node.tagName,
      classes: node.classes,
      textContent: node.textContent,
      children: [],
      previousSibling
    }

    let prevChild: ParsedNode | undefined
    for (const child of node.children) {
      const processedChild = this.addSiblingReferences(child, prevChild)
      result.children.push(processedChild)
      prevChild = processedChild
    }

    return result
  }
}

// Re-export components for direct access if needed
export { LayoutEngine } from './layout-engine'
export { NodeBuilder } from './node-builder'
export type { ParsedNode, FigmaStyle, TextSegment, USFMStyleRule } from './types'
