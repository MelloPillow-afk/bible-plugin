/**
 * Types for the USFM to Figma adapter
 */

import type { DOMNode } from '@shared/types'

/**
 * RGB color type for Figma fills
 */
export interface RGB {
  r: number
  g: number
  b: number
}

/**
 * Internal parsed node with classification and styling (plugin-only)
 * Extends DOMNode with type classification and plugin-specific fields
 */
export interface ParsedNode extends DOMNode {
  type: 'block' | 'inline' | 'text'
  children: ParsedNode[]
  previousSibling?: ParsedNode
  style?: FigmaStyle
  description?: string
}

/**
 * Computed Figma style to be applied to nodes
 */
export interface FigmaStyle {
  fontSize?: number
  fontWeight?: number
  fontStyle?: 'normal' | 'italic'
  textCase?: TextCase
  lineHeight?: LineHeight
  color?: RGB
  paragraphIndent?: number
  marginTop?: number
  marginBottom?: number
  paddingLeft?: number
  paddingRight?: number
  paddingTop?: number
  paddingBottom?: number
  itemSpacing?: number
}

/**
 * Text segment with content and styling for character-level formatting
 */
export interface TextSegment {
  content: string
  fontSize: number
  fontName: FontName
  color: RGB
  textCase?: TextCase
  sourceClasses: string[]
}

/**
 * Text case options for Figma
 */
export type TextCase = 'ORIGINAL' | 'UPPER' | 'LOWER' | 'TITLE' | 'SMALL_CAPS' | 'SMALL_CAPS_FORCED'

/**
 * Text style properties that can be applied to Figma text
 */
export interface TextStyleProps {
  fontSize?: number
  fontWeight?: number
  fontStyle?: 'normal' | 'italic'
  textCase?: TextCase
  lineHeight?: LineHeight
  letterSpacing?: LetterSpacing
  textDecoration?: 'NONE' | 'UNDERLINE' | 'STRIKETHROUGH'
  color?: RGB
}

/**
 * Line height configuration for Figma text
 */
export interface LineHeight {
  value: number
  unit: 'PIXELS' | 'PERCENT' | 'AUTO'
}

/**
 * Letter spacing configuration for Figma text
 */
export interface LetterSpacing {
  value: number
  unit: 'PIXELS' | 'PERCENT'
}

/**
 * Paragraph/block style properties for Figma text nodes
 */
export interface ParagraphStyleProps {
  paragraphIndent?: number
  paragraphSpacing?: number
  paddingLeft?: number
  paddingRight?: number
  paddingTop?: number
  paddingBottom?: number
  marginTop?: number
  marginBottom?: number
  marginLeft?: number
  textAlignHorizontal?: 'LEFT' | 'CENTER' | 'RIGHT' | 'JUSTIFIED'
}

/**
 * Complete USFM style rule combining text and paragraph styles
 */
export interface USFMStyleRule {
  /** Whether this is a block-level element */
  isBlock: boolean
  /** Text styling properties */
  textStyle?: TextStyleProps
  /** Paragraph/layout properties (only for block elements) */
  paragraphStyle?: ParagraphStyleProps
  /** Description of what this USFM class represents */
  description?: string
}

/**
 * Contextual style rule for adjacent sibling styling
 */
export interface ContextualStyleRule {
  /** The preceding sibling class */
  precedingClass: string
  /** The current class being styled */
  currentClass: string
  /** Style overrides to apply in this context */
  styleOverrides: Partial<ParagraphStyleProps>
}
