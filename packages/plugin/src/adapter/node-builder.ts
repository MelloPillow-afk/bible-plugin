import type { ParsedNode, FigmaStyle, TextSegment } from './types'
import { FONTS } from '../styles/fonts'
import { COLORS } from '../styles/colors'
import { toSuperscript } from '../utils/css-helpers'

// Default frame width (max-w-lg in Tailwind = 512px)
const FRAME_WIDTH = 512

/**
 * Node Builder
 * Builds Figma nodes from ParsedNode tree
 * - Block elements become FrameNodes with auto-layout
 * - Inline/text elements become TextNodes with character-level styling
 */
export class NodeBuilder {
  /**
   * Build Figma nodes from the ParsedNode tree
   * Returns an array of created SceneNodes
   */
  build(root: ParsedNode): SceneNode[] {
    const nodes: SceneNode[] = []

    // Process root's children (skip the root wrapper itself)
    for (const child of root.children) {
      const node = this.buildNode(child)
      if (node) {
        nodes.push(node)
      }
    }

    return nodes
  }

  /**
   * Build a single Figma node from a ParsedNode
   */
  private buildNode(node: ParsedNode): SceneNode | null {
    if (node.type === 'block') {
      return this.buildBlockNode(node)
    }

    // For top-level inline/text nodes, wrap in a text node
    if (node.type === 'inline' || node.type === 'text') {
      return this.buildTextNode([node], {})
    }

    return null
  }

  /**
   * Build a block-level FrameNode with auto-layout
   */
  private buildBlockNode(node: ParsedNode): FrameNode {
    const frame = figma.createFrame()
    const style = node.style || {}

    // Set up auto-layout
    frame.layoutMode = 'VERTICAL'
    frame.primaryAxisSizingMode = 'AUTO'
    frame.counterAxisSizingMode = 'FIXED'
    frame.resize(FRAME_WIDTH, 1) // Height will auto-adjust

    // Remove default fills (transparent background)
    frame.fills = []

    // Apply padding (Figma has no margins, so marginTop becomes paddingTop)
    frame.paddingLeft = style.paddingLeft || 0
    frame.paddingRight = style.paddingRight || 0
    frame.paddingTop = style.marginTop || 0 // marginTop as paddingTop
    frame.paddingBottom = style.marginBottom || 0

    // Item spacing for children
    frame.itemSpacing = style.itemSpacing || 0

    // Collect all inline/text children for text node creation
    const inlineChildren: ParsedNode[] = []
    let hasBlockChildren = false

    for (const child of node.children) {
      if (child.type === 'block') {
        // If we have accumulated inline children, create a text node first
        if (inlineChildren.length > 0) {
          const textNode = this.buildTextNode(inlineChildren, style)
          if (textNode) {
            frame.appendChild(textNode)
          }
          inlineChildren.length = 0
        }

        // Build and append block child
        const blockNode = this.buildBlockNode(child)
        frame.appendChild(blockNode)
        hasBlockChildren = true
      } else {
        // Accumulate inline/text children
        inlineChildren.push(child)
      }
    }

    // Create text node for remaining inline children
    if (inlineChildren.length > 0) {
      const textNode = this.buildTextNode(inlineChildren, style)
      if (textNode) {
        frame.appendChild(textNode)
      }
    }

    // If no children were added but node has text content, create text node
    if (!hasBlockChildren && inlineChildren.length === 0 && node.textContent) {
      const textNode = this.buildTextNode([node], style)
      if (textNode) {
        frame.appendChild(textNode)
      }
    }

    return frame
  }

  /**
   * Build a TextNode from inline/text ParsedNodes
   */
  private buildTextNode(nodes: ParsedNode[], parentStyle: FigmaStyle): TextNode | null {
    // Collect text segments with their styles
    const segments: TextSegment[] = []
    this.collectTextSegments(nodes, parentStyle, segments)

    // Filter out empty segments
    const nonEmptySegments = segments.filter(s => s.content.length > 0)
    if (nonEmptySegments.length === 0) {
      return null
    }

    // Create text node
    const textNode = figma.createText()

    // Set the full text content
    const fullText = nonEmptySegments.map(s => s.content).join('')
    textNode.characters = fullText

    // Configure text node sizing
    textNode.resize(FRAME_WIDTH, textNode.height)
    textNode.textAutoResize = 'HEIGHT'

    // Apply paragraph indent if specified
    if (parentStyle.paragraphIndent) {
      textNode.paragraphIndent = parentStyle.paragraphIndent
    }

    // Apply line height if specified
    if (parentStyle.lineHeight) {
      textNode.lineHeight = parentStyle.lineHeight
    }

    // Apply character-level styling via setRange methods
    let offset = 0
    for (const segment of nonEmptySegments) {
      const start = offset
      const end = offset + segment.content.length

      // Apply font
      textNode.setRangeFontName(start, end, segment.fontName)

      // Apply font size
      textNode.setRangeFontSize(start, end, segment.fontSize)

      // Apply fill color
      textNode.setRangeFills(start, end, [{ type: 'SOLID', color: segment.color }])

      // Apply text case if specified
      if (segment.textCase && segment.textCase !== 'ORIGINAL') {
        textNode.setRangeTextCase(start, end, segment.textCase)
      }

      offset = end
    }

    return textNode
  }

  /**
   * Recursively collect text segments from ParsedNodes
   */
  private collectTextSegments(
    nodes: ParsedNode[],
    inheritedStyle: FigmaStyle,
    segments: TextSegment[]
  ): void {
    for (const node of nodes) {
      // Merge inherited style with node's own style
      const mergedStyle: FigmaStyle = { ...inheritedStyle, ...node.style }

      if (node.type === 'text' || (node.children.length === 0 && node.textContent)) {
        // This is a leaf text node
        let content = node.textContent

        // Check if this is a verse label that needs superscript conversion
        const isVerseLabel = node.classes.includes('label') || node.classes.includes('yv-vlbl')
        if (isVerseLabel) {
          content = toSuperscript(content)
        }

        if (content) {
          segments.push(this.createTextSegment(content, mergedStyle))
        }
      } else {
        // Process children recursively
        this.collectTextSegments(node.children, mergedStyle, segments)
      }
    }
  }

  /**
   * Create a TextSegment from content and style
   */
  private createTextSegment(content: string, style: FigmaStyle): TextSegment {
    // Determine font based on weight and style
    let fontName: FontName = FONTS.SERIF

    if (style.fontWeight === 700 && style.fontStyle === 'italic') {
      // Note: Georgia doesn't have Bold Italic, fallback to Bold
      fontName = FONTS.SERIF_BOLD
    } else if (style.fontWeight === 700) {
      fontName = FONTS.SERIF_BOLD
    } else if (style.fontStyle === 'italic') {
      fontName = FONTS.SERIF_ITALIC
    }

    return {
      content,
      fontSize: style.fontSize || 20,
      fontName,
      color: style.color || COLORS.FOREGROUND,
      textCase: style.textCase
    }
  }
}
