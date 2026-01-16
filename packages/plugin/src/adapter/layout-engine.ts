import type { ParsedNode, FigmaStyle } from './types'
import { USFM_STYLES, getContextualStyles } from '../styles/usfm-styles'

/**
 * Layout Engine
 * Walks the ParsedNode tree and applies computed Figma styles
 * based on USFM class names and contextual rules
 */
export class LayoutEngine {
  /**
   * Apply styles to the entire ParsedNode tree
   */
  applyStyles(root: ParsedNode): ParsedNode {
    return this.processNode(root)
  }

  /**
   * Process a single node and its children recursively
   */
  private processNode(node: ParsedNode): ParsedNode {
    // Compute style for this node
    const style = this.computeStyle(node)

    // Process children recursively
    const processedChildren = node.children.map((child: ParsedNode) => this.processNode(child))

    return {
      ...node,
      style,
      children: processedChildren
    }
  }

  /**
   * Compute the FigmaStyle for a node based on its classes and context
   */
  private computeStyle(node: ParsedNode): FigmaStyle {
    const style: FigmaStyle = {}

    // Process each class on the node
    for (const className of node.classes) {
      const styleRule = USFM_STYLES[className]

      if (!styleRule) {
        // Log warning for unknown USFM classes (skip common HTML classes)
        if (!this.isCommonHTMLClass(className)) {
          console.warn(`Unknown USFM class: ${className}`)
        }
        continue
      }

      // Apply text styles (fontSize, fontWeight, fontStyle, textCase, lineHeight)
      if (styleRule.textStyle) {
        Object.assign(style, styleRule.textStyle)
      }

      // Apply paragraph styles (margins, padding, indent)
      if (styleRule.paragraphStyle) {
        Object.assign(style, styleRule.paragraphStyle)
      }

      // Check contextual rules based on previousSibling
      if (node.previousSibling) {
        for (const siblingClass of node.previousSibling.classes) {
          const contextualOverrides = getContextualStyles(siblingClass, className)
          if (contextualOverrides) {
            Object.assign(style, contextualOverrides)
            break // Apply first matching contextual rule
          }
        }
      }
    }

    return style
  }

  /**
   * Check if a class name is a common HTML/CSS class that shouldn't trigger warnings
   */
  private isCommonHTMLClass(className: string): boolean {
    const commonClasses = new Set([
      'content',
      'verse',
      'text',
      'container',
      'wrapper',
      'inner',
      'outer',
      'clearfix'
    ])
    return commonClasses.has(className.toLowerCase())
  }
}
