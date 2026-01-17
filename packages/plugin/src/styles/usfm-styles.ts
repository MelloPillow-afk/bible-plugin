/**
 * USFM Style Registry
 *
 * Defines styling rules for USFM (Unified Standard Format Markers) classes
 * based on the bible-reader.css stylesheet. These styles are used to convert
 * biblical text formatting to Figma text node properties.
 */

import type { USFMStyleRule, ContextualStyleRule } from '../adapter/types'
import { emToPx, createLineHeight, calcEmToPx } from '../utils/css-helpers'
import { COLORS } from './colors'

/**
 * Set of USFM class names that represent block-level elements
 * Used by the parser to determine element type
 */
export const BLOCK_CLASSES = new Set([
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
 * USFM Style definitions for common Bible text classes
 * 
 * Block elements: mt, ms, s, s1, s2, p, m, q, q1, q2, q3, q4, li, li1, li2, b, chapter, version
 * Inline elements: label, yv-vlbl, wj, it, add, tl, sc, nd
 */
export const USFM_STYLES: Record<string, USFMStyleRule> = {
  // ===================
  // BLOCK ELEMENTS
  // ===================

  /**
   * Major Title (mt, mt1)
   * CSS: font-size: 1.3em; font-weight: bold; line-height: 1.8em; margin: 1em 0 0;
   */
  mt: {
    isBlock: true,
    description: 'Major title',
    textStyle: {
      fontSize: emToPx(1.3),
      fontWeight: 700,
      lineHeight: createLineHeight(1.8),
    },
    paragraphStyle: {
      marginTop: emToPx(1),
      marginBottom: 0,
    },
  },

  /**
   * Major Section Header (ms, ms1)
   * CSS: font-size: 1.3em; font-weight: bold; line-height: 1.8em; margin: 1em 0 0;
   */
  ms: {
    isBlock: true,
    description: 'Major section header',
    textStyle: {
      fontSize: emToPx(1.3),
      fontWeight: 700,
      lineHeight: createLineHeight(1.8),
    },
    paragraphStyle: {
      marginTop: emToPx(1),
      marginBottom: 0,
    },
  },

  /**
   * Section Header (s, s1)
   * CSS: font-size: 1.1em; font-weight: bold; line-height: 1.8em; margin: 0 0 0.5em;
   */
  s: {
    isBlock: true,
    description: 'Section header',
    textStyle: {
      fontSize: emToPx(1.1),
      fontWeight: 700,
      lineHeight: createLineHeight(1.8),
    },
    paragraphStyle: {
      marginTop: 0,
      marginBottom: emToPx(0.5),
    },
  },

  /**
   * Section Header Level 1 (alias for s)
   */
  s1: {
    isBlock: true,
    description: 'Section header level 1',
    textStyle: {
      fontSize: emToPx(1.1),
      fontWeight: 700,
      lineHeight: createLineHeight(1.8),
    },
    paragraphStyle: {
      marginTop: 0,
      marginBottom: emToPx(0.5),
    },
  },

  /**
   * Section Header Level 2
   * CSS: font-weight: bold; line-height: 1.8em; margin: 0 0 0.5em; font-size: 1em;
   */
  s2: {
    isBlock: true,
    description: 'Section header level 2',
    textStyle: {
      fontSize: emToPx(1),
      fontWeight: 700,
      lineHeight: createLineHeight(1.8),
    },
    paragraphStyle: {
      marginTop: 0,
      marginBottom: emToPx(0.5),
    },
  },

  /**
   * Paragraph (p)
   * CSS: margin-bottom: 0; text-indent: 1em;
   */
  p: {
    isBlock: true,
    description: 'Paragraph',
    textStyle: {
      lineHeight: createLineHeight(1.625),
    },
    paragraphStyle: {
      paragraphIndent: emToPx(1),
      marginBottom: 0,
    },
  },

  /**
   * Continuation (margin) paragraph (m)
   * CSS: margin-bottom: calc(var(--yv-reader-font-size) * 0.5); text-indent: 0;
   */
  m: {
    isBlock: true,
    description: 'Continuation paragraph (no indent)',
    textStyle: {
      lineHeight: createLineHeight(1.625),
    },
    paragraphStyle: {
      paragraphIndent: 0,
      marginBottom: calcEmToPx(0.5),
    },
  },

  /**
   * Poetry/Quote Level 1 (q, q1)
   * CSS: padding-left: 2em; text-indent: -2em; margin-bottom: calc(var(--yv-reader-font-size) * 0.3);
   * Note: text-indent is negative, so we use 0 for Figma
   */
  q: {
    isBlock: true,
    description: 'Poetry line level 1',
    textStyle: {
      lineHeight: createLineHeight(1.625),
    },
    paragraphStyle: {
      paddingLeft: emToPx(2),
      paragraphIndent: 0, // CSS has -2em, Figma doesn't support negative
      marginBottom: calcEmToPx(0.3),
    },
  },

  /**
   * Poetry/Quote Level 1 (alias for q)
   */
  q1: {
    isBlock: true,
    description: 'Poetry line level 1',
    textStyle: {
      lineHeight: createLineHeight(1.625),
    },
    paragraphStyle: {
      paddingLeft: emToPx(2),
      paragraphIndent: 0, // CSS has -2em, Figma doesn't support negative
      marginBottom: calcEmToPx(0.3),
    },
  },

  /**
   * Poetry/Quote Level 2 (q2)
   * CSS: padding-left: 2em; text-indent: -1em; margin-bottom: calc(var(--yv-reader-font-size) * 0.3);
   * Note: text-indent is negative, so we use 0 for Figma
   */
  q2: {
    isBlock: true,
    description: 'Poetry line level 2',
    textStyle: {
      lineHeight: createLineHeight(1.625),
    },
    paragraphStyle: {
      paddingLeft: emToPx(2),
      paragraphIndent: 0, // CSS has -1em, Figma doesn't support negative
      marginBottom: calcEmToPx(0.3),
    },
  },

  /**
   * Poetry/Quote Level 3 (q3)
   * CSS: padding-left: 3em; text-indent: -2em; margin-bottom: calc(var(--yv-reader-font-size) * 0.3);
   * Note: text-indent is negative, so we use 0 for Figma
   */
  q3: {
    isBlock: true,
    description: 'Poetry line level 3',
    textStyle: {
      lineHeight: createLineHeight(1.625),
    },
    paragraphStyle: {
      paddingLeft: emToPx(3),
      paragraphIndent: 0, // CSS has -2em, Figma doesn't support negative
      marginBottom: calcEmToPx(0.3),
    },
  },

  /**
   * Poetry/Quote Level 4 (q4)
   * CSS: padding-left: 4em; text-indent: -2em; margin-bottom: calc(var(--yv-reader-font-size) * 0.3);
   * Note: text-indent is negative, so we use 0 for Figma
   */
  q4: {
    isBlock: true,
    description: 'Poetry line level 4',
    textStyle: {
      lineHeight: createLineHeight(1.625),
    },
    paragraphStyle: {
      paddingLeft: emToPx(4),
      paragraphIndent: 0, // CSS has -2em, Figma doesn't support negative
      marginBottom: calcEmToPx(0.3),
    },
  },

  /**
   * List Item Level 1 (li, li1)
   * CSS: display: list-item; list-style-type: disc; margin-left: 1em;
   */
  li: {
    isBlock: true,
    description: 'List item level 1',
    textStyle: {
      lineHeight: createLineHeight(1.625),
    },
    paragraphStyle: {
      marginLeft: emToPx(1),
    },
  },

  /**
   * List Item Level 1 (alias for li)
   */
  li1: {
    isBlock: true,
    description: 'List item level 1',
    textStyle: {
      lineHeight: createLineHeight(1.625),
    },
    paragraphStyle: {
      marginLeft: emToPx(1),
    },
  },

  /**
   * List Item Level 2 (li2)
   * CSS: display: list-item; list-style-type: disc; margin-left: 2em;
   */
  li2: {
    isBlock: true,
    description: 'List item level 2',
    textStyle: {
      lineHeight: createLineHeight(1.625),
    },
    paragraphStyle: {
      marginLeft: emToPx(2),
    },
  },

  /**
   * Blank Line (b)
   * CSS: line-height: 2em; height: 1em;
   */
  b: {
    isBlock: true,
    description: 'Blank line for spacing',
    textStyle: {
      lineHeight: createLineHeight(2),
    },
    paragraphStyle: {
      marginTop: emToPx(1),
      marginBottom: 0,
    },
  },

  /**
   * Chapter container
   * No specific CSS styling beyond the defaults
   */
  chapter: {
    isBlock: true,
    description: 'Chapter container',
    textStyle: {
      lineHeight: createLineHeight(1.625),
    },
    paragraphStyle: {},
  },

  /**
   * Version container
   * CSS: margin-top: 1.6em; padding: 1.2em;
   */
  version: {
    isBlock: true,
    description: 'Version/translation container',
    textStyle: {
      lineHeight: createLineHeight(1.625),
    },
    paragraphStyle: {
      marginTop: emToPx(1.6),
      paddingTop: emToPx(1.2),
      paddingBottom: emToPx(1.2),
      paddingLeft: emToPx(1.2),
      paddingRight: emToPx(1.2),
    },
  },

  // ===================
  // INLINE ELEMENTS
  // ===================

  /**
   * Label (chapter/verse label, hidden by default in CSS)
   * Used internally for verse/chapter markers
   */
  label: {
    isBlock: false,
    description: 'Generic label (often hidden)',
    textStyle: {},
  },

  /**
   * Verse Label (yv-vlbl)
   * CSS: padding-right: 0.3em; font-size: 0.5em; line-height: 1em; vertical-align: baseline; position: relative; top: -0.6em;
   * Rendered as superscript verse numbers
   */
  'yv-vlbl': {
    isBlock: false,
    description: 'Verse number label (superscript)',
    textStyle: {
      fontSize: emToPx(0.5),
      lineHeight: createLineHeight(1),
    },
  },

  /**
   * Words of Jesus (wj)
   * CSS: color: var(--yv-red);
   */
  wj: {
    isBlock: false,
    description: 'Words of Jesus (red letter)',
    textStyle: {
      color: COLORS.RED,
    },
  },

  /**
   * Italic text (it)
   * CSS: font-style: italic;
   */
  it: {
    isBlock: false,
    description: 'Italic text',
    textStyle: {
      fontStyle: 'italic',
    },
  },

  /**
   * Added/translator text (add)
   * CSS: font-style: italic;
   */
  add: {
    isBlock: false,
    description: 'Translator added text (italic)',
    textStyle: {
      fontStyle: 'italic',
    },
  },

  /**
   * Transliterated text (tl)
   * CSS: font-style: italic;
   */
  tl: {
    isBlock: false,
    description: 'Transliterated text (italic)',
    textStyle: {
      fontStyle: 'italic',
    },
  },

  /**
   * Small caps (sc)
   * CSS: font-variant: small-caps;
   */
  sc: {
    isBlock: false,
    description: 'Small caps text',
    textStyle: {
      textCase: 'SMALL_CAPS',
    },
  },

  /**
   * Name of Deity (nd)
   * CSS: font-variant: small-caps;
   */
  nd: {
    isBlock: false,
    description: 'Name of Deity (small caps)',
    textStyle: {
      textCase: 'SMALL_CAPS',
    },
  },
}

/**
 * Contextual style rules for adjacent sibling combinations
 * These rules apply when specific classes appear after other specific classes
 * 
 * Based on CSS rules like:
 * - .p + .s { margin-top: 1em; }
 * - .s + .p { margin-top: 0.5em; text-indent: 0; }
 */
export const CONTEXTUAL_STYLES: ContextualStyleRule[] = [
  // Section headers after paragraphs get top margin
  // CSS: .p + .s, .p + .s1, .p + .s2, .p + .ms, .p + .ms1, .p + .ms2 { margin-top: 1em; }
  { precedingClass: 'p', currentClass: 's', styleOverrides: { marginTop: emToPx(1) } },
  { precedingClass: 'p', currentClass: 's1', styleOverrides: { marginTop: emToPx(1) } },
  { precedingClass: 'p', currentClass: 's2', styleOverrides: { marginTop: emToPx(1) } },
  { precedingClass: 'p', currentClass: 'ms', styleOverrides: { marginTop: emToPx(1) } },

  // Paragraphs after section headers get top margin and no indent
  // CSS: .ms + .p, .ms1 + .p, .ms2 + .p { margin-top: 0.5em; text-indent: 0; }
  { precedingClass: 'ms', currentClass: 'p', styleOverrides: { marginTop: emToPx(0.5), paragraphIndent: 0 } },
  { precedingClass: 's', currentClass: 'p', styleOverrides: { marginTop: emToPx(0.5), paragraphIndent: 0 } },
  { precedingClass: 's1', currentClass: 'p', styleOverrides: { marginTop: emToPx(0.5), paragraphIndent: 0 } },
  { precedingClass: 's2', currentClass: 'p', styleOverrides: { marginTop: emToPx(0.5), paragraphIndent: 0 } },

  // Poetry after paragraphs
  // CSS: .p + .q, .p + .q1 { margin-top: 1em; }
  { precedingClass: 'p', currentClass: 'q', styleOverrides: { marginTop: emToPx(1) } },
  { precedingClass: 'p', currentClass: 'q1', styleOverrides: { marginTop: emToPx(1) } },

  // CSS: .p + .q1, .p + .q2, .p + .q3, .p + .q4 { margin-top: 0; }
  // (These override the above when in embedded quote context)
  { precedingClass: 'p', currentClass: 'q2', styleOverrides: { marginTop: 0 } },
  { precedingClass: 'p', currentClass: 'q3', styleOverrides: { marginTop: 0 } },
  { precedingClass: 'p', currentClass: 'q4', styleOverrides: { marginTop: 0 } },

  // Continuation paragraph after poetry
  // CSS: .q + .m, .q1 + .m, .q2 + .m, .q3 + .m { margin-top: 0.5em; text-indent: 0; }
  { precedingClass: 'q', currentClass: 'm', styleOverrides: { marginTop: emToPx(0.5), paragraphIndent: 0 } },
  { precedingClass: 'q1', currentClass: 'm', styleOverrides: { marginTop: emToPx(0.5), paragraphIndent: 0 } },
  { precedingClass: 'q2', currentClass: 'm', styleOverrides: { marginTop: emToPx(0.5), paragraphIndent: 0 } },
  { precedingClass: 'q3', currentClass: 'm', styleOverrides: { marginTop: emToPx(0.5), paragraphIndent: 0 } },

  // Section headers after poetry
  // CSS: .q + .s, .q1 + .s, .q2 + .s, etc. { margin-top: 1em; }
  { precedingClass: 'q', currentClass: 's', styleOverrides: { marginTop: emToPx(1) } },
  { precedingClass: 'q1', currentClass: 's', styleOverrides: { marginTop: emToPx(1) } },
  { precedingClass: 'q2', currentClass: 's', styleOverrides: { marginTop: emToPx(1) } },
  { precedingClass: 'q3', currentClass: 's', styleOverrides: { marginTop: emToPx(1) } },
  { precedingClass: 'q', currentClass: 's1', styleOverrides: { marginTop: emToPx(1) } },
  { precedingClass: 'q1', currentClass: 's1', styleOverrides: { marginTop: emToPx(1) } },
  { precedingClass: 'q2', currentClass: 's1', styleOverrides: { marginTop: emToPx(1) } },
  { precedingClass: 'q3', currentClass: 's1', styleOverrides: { marginTop: emToPx(1) } },

  // Paragraphs after poetry
  // CSS: .q + p, .q1 + .p, .q2 + .p { margin-top: 1em; }
  { precedingClass: 'q', currentClass: 'p', styleOverrides: { marginTop: emToPx(1) } },
  { precedingClass: 'q1', currentClass: 'p', styleOverrides: { marginTop: emToPx(1) } },
  { precedingClass: 'q2', currentClass: 'p', styleOverrides: { marginTop: emToPx(1) } },

  // Section headers after continuation paragraphs
  // CSS: .m + .s, .m + .s1, .m + .s2 { margin-top: 1em; }
  { precedingClass: 'm', currentClass: 's', styleOverrides: { marginTop: emToPx(1) } },
  { precedingClass: 'm', currentClass: 's1', styleOverrides: { marginTop: emToPx(1) } },
  { precedingClass: 'm', currentClass: 's2', styleOverrides: { marginTop: emToPx(1) } },

  // List item transitions
  // CSS: .p + .li, .p + .li1 { margin-top: 1em; }
  { precedingClass: 'p', currentClass: 'li', styleOverrides: { marginTop: emToPx(1) } },
  { precedingClass: 'p', currentClass: 'li1', styleOverrides: { marginTop: emToPx(1) } },

  // CSS: .li + .li2, .li1 + .li2 { margin-top: 1em; }
  { precedingClass: 'li', currentClass: 'li2', styleOverrides: { marginTop: emToPx(1) } },
  { precedingClass: 'li1', currentClass: 'li2', styleOverrides: { marginTop: emToPx(1) } },

  // CSS: .li2 + .li, .li2 + .li1 { margin-top: 1em; }
  { precedingClass: 'li2', currentClass: 'li', styleOverrides: { marginTop: emToPx(1) } },
  { precedingClass: 'li2', currentClass: 'li1', styleOverrides: { marginTop: emToPx(1) } },

  // Label followed by paragraph removes indent
  // CSS: .label + .p { text-indent: 0; }
  { precedingClass: 'label', currentClass: 'p', styleOverrides: { paragraphIndent: 0 } },
]

/**
 * Helper function to get contextual style overrides
 * @param precedingClass - The class of the preceding element
 * @param currentClass - The class of the current element
 * @returns Style overrides to apply, or undefined if no contextual rule matches
 */
export function getContextualStyles(
  precedingClass: string,
  currentClass: string
): Partial<import('../adapter/types').ParagraphStyleProps> | undefined {
  const rule = CONTEXTUAL_STYLES.find(
    (r) => r.precedingClass === precedingClass && r.currentClass === currentClass
  )
  return rule?.styleOverrides
}

/**
 * Helper function to get a USFM style by class name
 * @param className - The USFM class name
 * @returns The style rule or undefined if not found
 */
export function getUSFMStyle(className: string): USFMStyleRule | undefined {
  return USFM_STYLES[className]
}

/**
 * Helper function to check if a class is a block element
 * @param className - The USFM class name
 * @returns True if the class is a block element
 */
export function isBlockElement(className: string): boolean {
  return USFM_STYLES[className]?.isBlock ?? false
}
