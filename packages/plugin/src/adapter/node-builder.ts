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
  private static readonly SPACING_SENSITIVE_CLASS = 'wj'

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
    frame.name = node.description || 'Frame'
    const style = node.style || {}

    // Set up auto-layout
    frame.layoutMode = 'VERTICAL'

    // Use layoutSizing properties for proper auto-sizing
    // HUG means the frame will expand to fit its children
    frame.layoutSizingVertical = 'HUG'
    frame.layoutSizingHorizontal = 'FIXED'

    // Set width only - height will be determined by HUG
    frame.resize(FRAME_WIDTH, frame.height)

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

    // Preserve readable spacing when parser output drops whitespace-only DOM text nodes.
    const normalizedSegments = this.normalizeBoundarySpacing(nonEmptySegments)

    // Create text node
    const textNode = figma.createText()

    // Configure text node sizing FIRST (before setting content)
    // This ensures the auto-resize is active when content is added
    textNode.textAutoResize = 'WIDTH_AND_HEIGHT'

    // Set the full text content
    const fullText = normalizedSegments.map(s => s.content).join('')
    textNode.characters = fullText

    // Now set fixed width and let height adjust
    textNode.textAutoResize = 'HEIGHT'
    textNode.resize(FRAME_WIDTH, textNode.height)

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
    for (const segment of normalizedSegments) {
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
   * Restores missing boundary spaces between adjacent text segments when needed.
   * The parser intentionally drops whitespace-only nodes, so we re-insert a single
   * space for word-like boundaries while guarding against punctuation artifacts.
   */
  private normalizeBoundarySpacing(segments: TextSegment[]): TextSegment[] {
    const normalized: TextSegment[] = []

    for (const segment of segments) {
      const nextSegment: TextSegment = { ...segment }
      const previous = normalized[normalized.length - 1]

      if (
        previous &&
        this.hasSpacingSensitiveBoundary(previous, nextSegment) &&
        this.shouldInsertBoundarySpace(previous.content, nextSegment.content)
      ) {
        nextSegment.content = ` ${nextSegment.content}`
      }

      normalized.push(nextSegment)
    }

    return normalized
  }

  private hasSpacingSensitiveBoundary(previous: TextSegment, current: TextSegment): boolean {
    return (
      previous.sourceClasses.includes(NodeBuilder.SPACING_SENSITIVE_CLASS) &&
      current.sourceClasses.includes(NodeBuilder.SPACING_SENSITIVE_CLASS)
    )
  }

  private shouldInsertBoundarySpace(previous: string, current: string): boolean {
    if (!previous || !current) {
      return false
    }

    const previousChar = previous.slice(-1)
    const currentChar = current[0]

    if (!previousChar || !currentChar) {
      return false
    }

    if (/\s/u.test(previousChar) || /\s/u.test(currentChar)) {
      return false
    }

    // Never insert before punctuation that belongs to the preceding token.
    if (/^[,.;:!?)\]}%]/u.test(currentChar)) {
      return false
    }

    // Never insert after opening punctuation that belongs to the following token.
    if (/[([{]/u.test(previousChar)) {
      return false
    }

    // Avoid splitting contractions if a segment starts with apostrophe.
    if (currentChar === '\'' || currentChar === '’') {
      return false
    }

    const previousLooksLikeTokenEnd = /[\p{L}\p{N}\u00B9\u00B2\u00B3\u2070-\u2079,.;:!?'"’”]/u.test(previousChar)
    const currentLooksLikeTokenStart = /[\p{L}\p{N}\u00B9\u00B2\u00B3\u2070-\u2079"“]/u.test(currentChar)

    return previousLooksLikeTokenEnd && currentLooksLikeTokenStart
  }

  /**
   * Recursively collect text segments from ParsedNodes
   * @param inheritedClasses - Classes inherited from parent nodes (for verse label detection)
   */
  private collectTextSegments(
    nodes: ParsedNode[],
    inheritedStyle: FigmaStyle,
    segments: TextSegment[],
    inheritedClasses: string[] = []
  ): void {
    for (const node of nodes) {
      // Merge inherited style with node's own style
      const mergedStyle: FigmaStyle = { ...inheritedStyle, ...node.style }
      // Merge inherited classes with node's own classes
      const mergedClasses = [...inheritedClasses, ...node.classes]

      if (node.type === 'text' || (node.children.length === 0 && node.textContent)) {
        // This is a leaf text node
        let content = node.textContent

        // Check merged classes for verse label (classes may be on parent span)
        const isVerseLabel = mergedClasses.includes('label') || mergedClasses.includes('yv-vlbl')
        if (isVerseLabel) {
          content = toSuperscript(content)
        }

        if (content) {
          segments.push(this.createTextSegment(content, mergedStyle, mergedClasses))
        }
      } else {
        // Process children recursively, passing merged classes
        this.collectTextSegments(node.children, mergedStyle, segments, mergedClasses)
      }
    }
  }

  /**
   * Create a TextSegment from content and style
   */
  private createTextSegment(content: string, style: FigmaStyle, sourceClasses: string[]): TextSegment {
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
      textCase: style.textCase,
      sourceClasses
    }
  }
}
