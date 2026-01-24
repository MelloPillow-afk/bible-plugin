/**
 * USFM Style Registry
 *
 * Defines styling rules for USFM (Unified Standard Format Markers) classes
 * based on the bible-reader.css stylesheet. These styles are used to convert
 * biblical text formatting to Figma text node properties.
 *
 * Block classification is determined by the `isBlock` property on each rule.
 * This is the single source of truth for block/inline classification.
 */

import type { USFMStyleRule, ContextualStyleRule } from '../adapter/types'
import { emToPx, createLineHeight, calcEmToPx } from '../utils/css-helpers'
import { COLORS } from './colors'

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
  // INTRODUCTION ELEMENTS
  // ===================

  /**
   * Introduction Major Title (imt, imt1)
   * CSS: font-size: 1.3em; font-weight: bold; line-height: 1.8em; margin: 1em 0 0;
   */
  imt: {
    isBlock: true,
    description: 'Introduction major title',
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

  imt1: {
    isBlock: true,
    description: 'Introduction major title level 1',
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
   * Introduction Title Levels 2-4 (imt2, imt3, imt4)
   * CSS: line-height: 1.8em; margin: 0.5em 0; font-weight: bold;
   */
  imt2: {
    isBlock: true,
    description: 'Introduction title level 2',
    textStyle: {
      fontWeight: 700,
      lineHeight: createLineHeight(1.8),
    },
    paragraphStyle: {
      marginTop: emToPx(0.5),
      marginBottom: emToPx(0.5),
    },
  },

  imt3: {
    isBlock: true,
    description: 'Introduction title level 3',
    textStyle: {
      fontWeight: 700,
      lineHeight: createLineHeight(1.8),
    },
    paragraphStyle: {
      marginTop: emToPx(0.5),
      marginBottom: emToPx(0.5),
    },
  },

  imt4: {
    isBlock: true,
    description: 'Introduction title level 4',
    textStyle: {
      fontWeight: 700,
      lineHeight: createLineHeight(1.8),
    },
    paragraphStyle: {
      marginTop: emToPx(0.5),
      marginBottom: emToPx(0.5),
    },
  },

  /**
   * Introduction Other Title (iot)
   * CSS: font-size: 1.3em; font-weight: 700; line-height: 1.8em; margin: 0.5em 0;
   */
  iot: {
    isBlock: true,
    description: 'Introduction other title',
    textStyle: {
      fontSize: emToPx(1.3),
      fontWeight: 700,
      lineHeight: createLineHeight(1.8),
    },
    paragraphStyle: {
      marginTop: emToPx(0.5),
      marginBottom: emToPx(0.5),
    },
  },

  /**
   * Introduction Outline Level 1 (io, io1)
   * CSS: list-style-type: disc; margin-left: 1em; display: list-item;
   */
  io: {
    isBlock: true,
    description: 'Introduction outline level 1',
    textStyle: {
      lineHeight: createLineHeight(1.625),
    },
    paragraphStyle: {
      marginLeft: emToPx(1),
    },
  },

  io1: {
    isBlock: true,
    description: 'Introduction outline level 1',
    textStyle: {
      lineHeight: createLineHeight(1.625),
    },
    paragraphStyle: {
      marginLeft: emToPx(1),
    },
  },

  /**
   * Introduction Outline Level 2-3 (io2, io3)
   * CSS: list-style-type: disc; margin-left: 2em; display: list-item;
   */
  io2: {
    isBlock: true,
    description: 'Introduction outline level 2',
    textStyle: {
      lineHeight: createLineHeight(1.625),
    },
    paragraphStyle: {
      marginLeft: emToPx(2),
    },
  },

  io3: {
    isBlock: true,
    description: 'Introduction outline level 3',
    textStyle: {
      lineHeight: createLineHeight(1.625),
    },
    paragraphStyle: {
      marginLeft: emToPx(2),
    },
  },

  /**
   * Introduction Section Header (is, is1, is2)
   * CSS: font-size: 1.1em; font-weight: bold; line-height: 1.8em; margin: 0 0 0.5em;
   */
  is: {
    isBlock: true,
    description: 'Introduction section header',
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

  is1: {
    isBlock: true,
    description: 'Introduction section header level 1',
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

  is2: {
    isBlock: true,
    description: 'Introduction section header level 2',
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
   * Introduction Paragraph (ip)
   * CSS: margin-bottom: 0; text-indent: 1em;
   */
  ip: {
    isBlock: true,
    description: 'Introduction paragraph',
    textStyle: {
      lineHeight: createLineHeight(1.625),
    },
    paragraphStyle: {
      paragraphIndent: emToPx(1),
      marginBottom: 0,
    },
  },

  /**
   * Introduction Paragraph Indent (ipi)
   * CSS: text-indent: 1.5em;
   */
  ipi: {
    isBlock: true,
    description: 'Introduction paragraph indented',
    textStyle: {
      lineHeight: createLineHeight(1.625),
    },
    paragraphStyle: {
      paragraphIndent: emToPx(1.5),
    },
  },

  // ===================
  // INDENTED PARAGRAPHS
  // ===================

  /**
   * Indented Paragraph Level 1 (pi, pi1)
   * CSS: text-indent: 1em; padding-left: 0; margin-bottom: calc(0.5em);
   */
  pi: {
    isBlock: true,
    description: 'Indented paragraph level 1',
    textStyle: {
      lineHeight: createLineHeight(1.625),
    },
    paragraphStyle: {
      paragraphIndent: emToPx(1),
      paddingLeft: 0,
      marginBottom: calcEmToPx(0.5),
    },
  },

  pi1: {
    isBlock: true,
    description: 'Indented paragraph level 1',
    textStyle: {
      lineHeight: createLineHeight(1.625),
    },
    paragraphStyle: {
      paragraphIndent: emToPx(1),
      paddingLeft: 0,
      marginBottom: calcEmToPx(0.5),
    },
  },

  /**
   * Indented Paragraph Level 2 (pi2)
   * CSS: text-indent: 2em; padding-left: 1em; margin-bottom: calc(0.5em);
   */
  pi2: {
    isBlock: true,
    description: 'Indented paragraph level 2',
    textStyle: {
      lineHeight: createLineHeight(1.625),
    },
    paragraphStyle: {
      paragraphIndent: emToPx(2),
      paddingLeft: emToPx(1),
      marginBottom: calcEmToPx(0.5),
    },
  },

  /**
   * Indented Paragraph Level 3 (pi3)
   * CSS: text-indent: 4em; padding-left: 3em; margin-bottom: calc(0.5em);
   */
  pi3: {
    isBlock: true,
    description: 'Indented paragraph level 3',
    textStyle: {
      lineHeight: createLineHeight(1.625),
    },
    paragraphStyle: {
      paragraphIndent: emToPx(4),
      paddingLeft: emToPx(3),
      marginBottom: calcEmToPx(0.5),
    },
  },

  // ===================
  // MARGIN INDENTED
  // ===================

  /**
   * Margin Indented (mi)
   * CSS: text-indent: 0; padding-left: 2em; margin-bottom: calc(0.5em);
   */
  mi: {
    isBlock: true,
    description: 'Margin indented paragraph',
    textStyle: {
      lineHeight: createLineHeight(1.625),
    },
    paragraphStyle: {
      paragraphIndent: 0,
      paddingLeft: emToPx(2),
      marginBottom: calcEmToPx(0.5),
    },
  },

  /**
   * Poetic Margin (pm, pmo, pmc, pmr)
   * CSS: text-indent: 0; padding-left: 2em; margin-bottom: calc(0.5em);
   */
  pm: {
    isBlock: true,
    description: 'Poetic margin paragraph',
    textStyle: {
      lineHeight: createLineHeight(1.625),
    },
    paragraphStyle: {
      paragraphIndent: 0,
      paddingLeft: emToPx(2),
      marginBottom: calcEmToPx(0.5),
    },
  },

  pmo: {
    isBlock: true,
    description: 'Poetic margin opening',
    textStyle: {
      lineHeight: createLineHeight(1.625),
    },
    paragraphStyle: {
      paragraphIndent: 0,
      paddingLeft: emToPx(2),
      marginBottom: calcEmToPx(0.5),
    },
  },

  pmc: {
    isBlock: true,
    description: 'Poetic margin closing',
    textStyle: {
      lineHeight: createLineHeight(1.625),
    },
    paragraphStyle: {
      paragraphIndent: 0,
      paddingLeft: emToPx(2),
      marginBottom: calcEmToPx(0.5),
    },
  },

  pmr: {
    isBlock: true,
    description: 'Poetic margin refrain',
    textStyle: {
      lineHeight: createLineHeight(1.625),
    },
    paragraphStyle: {
      paragraphIndent: 0,
      paddingLeft: emToPx(2),
      marginBottom: calcEmToPx(0.5),
    },
  },

  /**
   * No-break paragraph (nb) - alias for m
   * CSS: margin-bottom: calc(0.5em); text-indent: 0;
   */
  nb: {
    isBlock: true,
    description: 'No-break paragraph',
    textStyle: {
      lineHeight: createLineHeight(1.625),
    },
    paragraphStyle: {
      paragraphIndent: 0,
      marginBottom: calcEmToPx(0.5),
    },
  },

  // ===================
  // ALIGNMENT VARIANTS
  // ===================

  /**
   * Paragraph Right (pr)
   * CSS: text-align: right; margin-bottom: calc(0.5em);
   */
  pr: {
    isBlock: true,
    description: 'Right-aligned paragraph',
    textStyle: {
      lineHeight: createLineHeight(1.625),
    },
    paragraphStyle: {
      textAlignHorizontal: 'RIGHT',
      marginBottom: calcEmToPx(0.5),
    },
  },

  /**
   * Paragraph Centered (pc)
   * CSS: text-align: center; font-variant: small-caps; font-weight: bold; margin-bottom: calc(0.5em);
   */
  pc: {
    isBlock: true,
    description: 'Centered paragraph',
    textStyle: {
      lineHeight: createLineHeight(1.625),
      textCase: 'SMALL_CAPS',
      fontWeight: 700,
    },
    paragraphStyle: {
      textAlignHorizontal: 'CENTER',
      marginBottom: calcEmToPx(0.5),
    },
  },

  /**
   * Quote Right (qr)
   * CSS: text-align: right; margin-bottom: calc(0.5em);
   */
  qr: {
    isBlock: true,
    description: 'Right-aligned quote',
    textStyle: {
      lineHeight: createLineHeight(1.625),
    },
    paragraphStyle: {
      textAlignHorizontal: 'RIGHT',
      marginBottom: calcEmToPx(0.5),
    },
  },

  /**
   * Quote Centered (qc)
   * CSS: text-align: center; font-variant: small-caps; font-weight: bold; margin-bottom: calc(0.5em);
   */
  qc: {
    isBlock: true,
    description: 'Centered quote',
    textStyle: {
      lineHeight: createLineHeight(1.625),
      textCase: 'SMALL_CAPS',
      fontWeight: 700,
    },
    paragraphStyle: {
      textAlignHorizontal: 'CENTER',
      marginBottom: calcEmToPx(0.5),
    },
  },

  // ===================
  // INTRODUCTION QUOTES
  // ===================

  /**
   * Introduction Quote Level 1 (iq, iq1)
   * CSS: padding-left: 2em; text-indent: -2em; margin-bottom: calc(0.3em);
   */
  iq: {
    isBlock: true,
    description: 'Introduction quote level 1',
    textStyle: {
      lineHeight: createLineHeight(1.625),
    },
    paragraphStyle: {
      paddingLeft: emToPx(2),
      paragraphIndent: 0,
      marginBottom: calcEmToPx(0.3),
    },
  },

  iq1: {
    isBlock: true,
    description: 'Introduction quote level 1',
    textStyle: {
      lineHeight: createLineHeight(1.625),
    },
    paragraphStyle: {
      paddingLeft: emToPx(2),
      paragraphIndent: 0,
      marginBottom: calcEmToPx(0.3),
    },
  },

  /**
   * Introduction Quote Level 2 (iq2)
   * CSS: padding-left: 2em; text-indent: -1em; margin-bottom: calc(0.3em);
   */
  iq2: {
    isBlock: true,
    description: 'Introduction quote level 2',
    textStyle: {
      lineHeight: createLineHeight(1.625),
    },
    paragraphStyle: {
      paddingLeft: emToPx(2),
      paragraphIndent: 0,
      marginBottom: calcEmToPx(0.3),
    },
  },

  /**
   * Introduction Quote Level 3 (iq3)
   * CSS: padding-left: 3em; text-indent: -2em; margin-bottom: calc(0.3em);
   */
  iq3: {
    isBlock: true,
    description: 'Introduction quote level 3',
    textStyle: {
      lineHeight: createLineHeight(1.625),
    },
    paragraphStyle: {
      paddingLeft: emToPx(3),
      paragraphIndent: 0,
      marginBottom: calcEmToPx(0.3),
    },
  },

  /**
   * Introduction Quote Level 4 (iq4)
   * CSS: padding-left: 4em; text-indent: -2em; margin-bottom: calc(0.3em);
   */
  iq4: {
    isBlock: true,
    description: 'Introduction quote level 4',
    textStyle: {
      lineHeight: createLineHeight(1.625),
    },
    paragraphStyle: {
      paddingLeft: emToPx(4),
      paragraphIndent: 0,
      marginBottom: calcEmToPx(0.3),
    },
  },

  // ===================
  // QUOTE MARGIN
  // ===================

  /**
   * Quote Margin Level 1 (qm, qm1)
   * CSS: padding-left: 2em; text-indent: -2em; margin-bottom: calc(0.3em);
   */
  qm: {
    isBlock: true,
    description: 'Quote margin level 1',
    textStyle: {
      lineHeight: createLineHeight(1.625),
    },
    paragraphStyle: {
      paddingLeft: emToPx(2),
      paragraphIndent: 0,
      marginBottom: calcEmToPx(0.3),
    },
  },

  qm1: {
    isBlock: true,
    description: 'Quote margin level 1',
    textStyle: {
      lineHeight: createLineHeight(1.625),
    },
    paragraphStyle: {
      paddingLeft: emToPx(2),
      paragraphIndent: 0,
      marginBottom: calcEmToPx(0.3),
    },
  },

  /**
   * Quote Margin Level 2 (qm2)
   * CSS: padding-left: 2em; text-indent: -1em; margin-bottom: calc(0.3em);
   */
  qm2: {
    isBlock: true,
    description: 'Quote margin level 2',
    textStyle: {
      lineHeight: createLineHeight(1.625),
    },
    paragraphStyle: {
      paddingLeft: emToPx(2),
      paragraphIndent: 0,
      marginBottom: calcEmToPx(0.3),
    },
  },

  /**
   * Quote Margin Level 3 (qm3)
   * CSS: padding-left: 3em; text-indent: -2em; margin-bottom: calc(0.3em);
   */
  qm3: {
    isBlock: true,
    description: 'Quote margin level 3',
    textStyle: {
      lineHeight: createLineHeight(1.625),
    },
    paragraphStyle: {
      paddingLeft: emToPx(3),
      paragraphIndent: 0,
      marginBottom: calcEmToPx(0.3),
    },
  },

  /**
   * Quote Margin Level 4 (qm4)
   * CSS: padding-left: 4em; text-indent: -2em; margin-bottom: calc(0.3em);
   */
  qm4: {
    isBlock: true,
    description: 'Quote margin level 4',
    textStyle: {
      lineHeight: createLineHeight(1.625),
    },
    paragraphStyle: {
      paddingLeft: emToPx(4),
      paragraphIndent: 0,
      marginBottom: calcEmToPx(0.3),
    },
  },

  // ===================
  // ADDITIONAL SECTION HEADERS
  // ===================

  /**
   * Section Header Level 3-4 (s3, s4)
   * CSS: font-weight: bold; line-height: 1.8em; margin: 0 0 0.5em;
   */
  s3: {
    isBlock: true,
    description: 'Section header level 3',
    textStyle: {
      fontWeight: 700,
      lineHeight: createLineHeight(1.8),
    },
    paragraphStyle: {
      marginTop: 0,
      marginBottom: emToPx(0.5),
    },
  },

  s4: {
    isBlock: true,
    description: 'Section header level 4',
    textStyle: {
      fontWeight: 700,
      lineHeight: createLineHeight(1.8),
    },
    paragraphStyle: {
      marginTop: 0,
      marginBottom: emToPx(0.5),
    },
  },

  /**
   * Major Section Header Level 2 (ms2)
   * CSS: line-height: 1.8em; margin: 0.5em 0; font-weight: bold;
   */
  ms2: {
    isBlock: true,
    description: 'Major section header level 2',
    textStyle: {
      fontWeight: 700,
      lineHeight: createLineHeight(1.8),
    },
    paragraphStyle: {
      marginTop: emToPx(0.5),
      marginBottom: emToPx(0.5),
    },
  },

  // ===================
  // MISC BLOCK ELEMENTS
  // ===================

  /**
   * Reference (r)
   * CSS: font-style: italic; font-weight: bold; line-height: 1.8em; margin: 0 0 0.5em;
   */
  r: {
    isBlock: true,
    description: 'Reference text',
    textStyle: {
      fontStyle: 'italic',
      fontWeight: 700,
      lineHeight: createLineHeight(1.8),
    },
    paragraphStyle: {
      marginTop: 0,
      marginBottom: emToPx(0.5),
    },
  },

  /**
   * Speaker (sp)
   * CSS: font-style: italic; font-weight: bold; line-height: 1.8em; margin: 0 0 0.5em;
   */
  sp: {
    isBlock: true,
    description: 'Speaker name',
    textStyle: {
      fontStyle: 'italic',
      fontWeight: 700,
      lineHeight: createLineHeight(1.8),
    },
    paragraphStyle: {
      marginTop: 0,
      marginBottom: emToPx(0.5),
    },
  },

  /**
   * Section Reference (sr)
   * CSS: font-style: italic; font-weight: bold; line-height: 1.8em; margin: 0 0 0.5em;
   */
  sr: {
    isBlock: true,
    description: 'Section reference',
    textStyle: {
      fontStyle: 'italic',
      fontWeight: 700,
      lineHeight: createLineHeight(1.8),
    },
    paragraphStyle: {
      marginTop: 0,
      marginBottom: emToPx(0.5),
    },
  },

  /**
   * Quote Attribution (qa)
   * CSS: font-weight: bold; line-height: 1.8em; margin: 0 0 0.5em;
   */
  qa: {
    isBlock: true,
    description: 'Quote attribution (acrostic heading)',
    textStyle: {
      fontWeight: 700,
      lineHeight: createLineHeight(1.8),
    },
    paragraphStyle: {
      marginTop: 0,
      marginBottom: emToPx(0.5),
    },
  },

  /**
   * Hebrew Text Heading (d)
   * CSS: font-style: italic; font-weight: bold; line-height: 1.8em; margin: 0.5em 0;
   */
  d: {
    isBlock: true,
    description: 'Hebrew text heading (descriptive title)',
    textStyle: {
      fontStyle: 'italic',
      fontWeight: 700,
      lineHeight: createLineHeight(1.8),
    },
    paragraphStyle: {
      marginTop: emToPx(0.5),
      marginBottom: emToPx(0.5),
    },
  },

  /**
   * List Item Level 3 (li3)
   * CSS: display: list-item; list-style-type: disc;
   */
  li3: {
    isBlock: true,
    description: 'List item level 3',
    textStyle: {
      lineHeight: createLineHeight(1.625),
    },
    paragraphStyle: {},
  },

  /**
   * List Item Level 4 (li4)
   * CSS: display: list-item; list-style-type: disc;
   */
  li4: {
    isBlock: true,
    description: 'List item level 4',
    textStyle: {
      lineHeight: createLineHeight(1.625),
    },
    paragraphStyle: {},
  },

  /**
   * Selah (qs)
   * CSS: text-align: right; font-style: italic; margin: 0.5em 0;
   */
  qs: {
    isBlock: true,
    description: 'Selah (right-aligned italic)',
    textStyle: {
      fontStyle: 'italic',
      lineHeight: createLineHeight(1.625),
    },
    paragraphStyle: {
      textAlignHorizontal: 'RIGHT',
      marginTop: calcEmToPx(0.5),
      marginBottom: calcEmToPx(0.5),
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

  /**
   * Quoted text (qt)
   * CSS: font-style: italic;
   */
  qt: {
    isBlock: false,
    description: 'Quoted text (italic)',
    textStyle: {
      fontStyle: 'italic',
    },
  },

  /**
   * First verse marker (fv)
   * CSS: Same styling as yv-vlbl - superscript verse marker
   */
  fv: {
    isBlock: false,
    description: 'First verse marker (superscript)',
  },

  /**
   * Verse paragraph marker (vp)
   * CSS: Same styling as fv - verse paragraph marker
   */
  vp: {
    isBlock: false,
    description: 'Verse paragraph marker (superscript)',
  },
}

/**
 * Contextual style rules for adjacent sibling combinations
 * These rules apply when specific classes appear after other specific classes
 *
 * Based on CSS adjacent sibling rules (A + B) from bible-reader.css
 * Organized by the style effect they produce.
 */
export const CONTEXTUAL_STYLES: ContextualStyleRule[] = [
  // ===================
  // GROUP 1: margin-top: 0.5em; text-indent: 0
  // CSS Lines 234-250
  // ===================

  // .pi + .p, .pi1 + .p
  { precedingClass: 'pi', currentClass: 'p', styleOverrides: { marginTop: emToPx(0.5), paragraphIndent: 0 } },
  { precedingClass: 'pi1', currentClass: 'p', styleOverrides: { marginTop: emToPx(0.5), paragraphIndent: 0 } },

  // .s + .pi, .s + .pi1, .s1 + .pi, .s1 + .pi1
  { precedingClass: 's', currentClass: 'pi', styleOverrides: { marginTop: emToPx(0.5), paragraphIndent: 0 } },
  { precedingClass: 's', currentClass: 'pi1', styleOverrides: { marginTop: emToPx(0.5), paragraphIndent: 0 } },
  { precedingClass: 's1', currentClass: 'pi', styleOverrides: { marginTop: emToPx(0.5), paragraphIndent: 0 } },
  { precedingClass: 's1', currentClass: 'pi1', styleOverrides: { marginTop: emToPx(0.5), paragraphIndent: 0 } },

  // .ms + .p, .ms1 + .p, .ms2 + .p
  { precedingClass: 'ms', currentClass: 'p', styleOverrides: { marginTop: emToPx(0.5), paragraphIndent: 0 } },
  { precedingClass: 'ms1', currentClass: 'p', styleOverrides: { marginTop: emToPx(0.5), paragraphIndent: 0 } },
  { precedingClass: 'ms2', currentClass: 'p', styleOverrides: { marginTop: emToPx(0.5), paragraphIndent: 0 } },

  // .q + .m, .q1 + .m, .q2 + .m, .q3 + .m
  { precedingClass: 'q', currentClass: 'm', styleOverrides: { marginTop: emToPx(0.5), paragraphIndent: 0 } },
  { precedingClass: 'q1', currentClass: 'm', styleOverrides: { marginTop: emToPx(0.5), paragraphIndent: 0 } },
  { precedingClass: 'q2', currentClass: 'm', styleOverrides: { marginTop: emToPx(0.5), paragraphIndent: 0 } },
  { precedingClass: 'q3', currentClass: 'm', styleOverrides: { marginTop: emToPx(0.5), paragraphIndent: 0 } },

  // ===================
  // GROUP 2: text-indent: 0 only
  // CSS Lines 252-254
  // ===================

  // .label + .p
  { precedingClass: 'label', currentClass: 'p', styleOverrides: { paragraphIndent: 0 } },

  // ===================
  // GROUP 3: margin-top: 0 (negative not supported in Figma)
  // CSS Lines 261-263: .d + .d { margin-top: -1.25em; }
  // ===================

  // .d + .d (Figma doesn't support negative margins, using 0)
  { precedingClass: 'd', currentClass: 'd', styleOverrides: { marginTop: 0 } },

  // ===================
  // GROUP 4: margin-top: 1em
  // CSS Lines 265-333
  // ===================

  // .p + .s, .p + .s1, .p + .s2, .p + .ms, .p + .ms1, .p + .ms2
  { precedingClass: 'p', currentClass: 's', styleOverrides: { marginTop: emToPx(1) } },
  { precedingClass: 'p', currentClass: 's1', styleOverrides: { marginTop: emToPx(1) } },
  { precedingClass: 'p', currentClass: 's2', styleOverrides: { marginTop: emToPx(1) } },
  { precedingClass: 'p', currentClass: 'ms', styleOverrides: { marginTop: emToPx(1) } },
  { precedingClass: 'p', currentClass: 'ms1', styleOverrides: { marginTop: emToPx(1) } },
  { precedingClass: 'p', currentClass: 'ms2', styleOverrides: { marginTop: emToPx(1) } },

  // .p + .q, .p + .q1
  { precedingClass: 'p', currentClass: 'q', styleOverrides: { marginTop: emToPx(1) } },
  { precedingClass: 'p', currentClass: 'q1', styleOverrides: { marginTop: emToPx(1) } },

  // .p + .li, .p + .li1
  { precedingClass: 'p', currentClass: 'li', styleOverrides: { marginTop: emToPx(1) } },
  { precedingClass: 'p', currentClass: 'li1', styleOverrides: { marginTop: emToPx(1) } },

  // .li + .li2, .li1 + .li2
  { precedingClass: 'li', currentClass: 'li2', styleOverrides: { marginTop: emToPx(1) } },
  { precedingClass: 'li1', currentClass: 'li2', styleOverrides: { marginTop: emToPx(1) } },

  // .li2 + .li, .li2 + .li1
  { precedingClass: 'li2', currentClass: 'li', styleOverrides: { marginTop: emToPx(1) } },
  { precedingClass: 'li2', currentClass: 'li1', styleOverrides: { marginTop: emToPx(1) } },

  // .m + .s, .m + .s1, .m + .s2
  { precedingClass: 'm', currentClass: 's', styleOverrides: { marginTop: emToPx(1) } },
  { precedingClass: 'm', currentClass: 's1', styleOverrides: { marginTop: emToPx(1) } },
  { precedingClass: 'm', currentClass: 's2', styleOverrides: { marginTop: emToPx(1) } },

  // .q + p, .q1 + .p, .q2 + .p
  { precedingClass: 'q', currentClass: 'p', styleOverrides: { marginTop: emToPx(1) } },
  { precedingClass: 'q1', currentClass: 'p', styleOverrides: { marginTop: emToPx(1) } },
  { precedingClass: 'q2', currentClass: 'p', styleOverrides: { marginTop: emToPx(1) } },

  // .q + .s, .q + .s1, .q + .s2, .q + .ms, .q + .ms1, .q + .ms2
  { precedingClass: 'q', currentClass: 's', styleOverrides: { marginTop: emToPx(1) } },
  { precedingClass: 'q', currentClass: 's1', styleOverrides: { marginTop: emToPx(1) } },
  { precedingClass: 'q', currentClass: 's2', styleOverrides: { marginTop: emToPx(1) } },
  { precedingClass: 'q', currentClass: 'ms', styleOverrides: { marginTop: emToPx(1) } },
  { precedingClass: 'q', currentClass: 'ms1', styleOverrides: { marginTop: emToPx(1) } },
  { precedingClass: 'q', currentClass: 'ms2', styleOverrides: { marginTop: emToPx(1) } },

  // .q1 + .s, .q1 + .s1, .q1 + .s2, .q1 + .ms, .q1 + .ms1, .q1 + .ms2
  { precedingClass: 'q1', currentClass: 's', styleOverrides: { marginTop: emToPx(1) } },
  { precedingClass: 'q1', currentClass: 's1', styleOverrides: { marginTop: emToPx(1) } },
  { precedingClass: 'q1', currentClass: 's2', styleOverrides: { marginTop: emToPx(1) } },
  { precedingClass: 'q1', currentClass: 'ms', styleOverrides: { marginTop: emToPx(1) } },
  { precedingClass: 'q1', currentClass: 'ms1', styleOverrides: { marginTop: emToPx(1) } },
  { precedingClass: 'q1', currentClass: 'ms2', styleOverrides: { marginTop: emToPx(1) } },

  // .q2 + .s, .q2 + .s1, .q2 + .s2, .q2 + .ms
  { precedingClass: 'q2', currentClass: 's', styleOverrides: { marginTop: emToPx(1) } },
  { precedingClass: 'q2', currentClass: 's1', styleOverrides: { marginTop: emToPx(1) } },
  { precedingClass: 'q2', currentClass: 's2', styleOverrides: { marginTop: emToPx(1) } },
  { precedingClass: 'q2', currentClass: 'ms', styleOverrides: { marginTop: emToPx(1) } },

  // .q3 + .s, .q3 + .s1, .q3 + .s2, .q3 + .ms
  { precedingClass: 'q3', currentClass: 's', styleOverrides: { marginTop: emToPx(1) } },
  { precedingClass: 'q3', currentClass: 's1', styleOverrides: { marginTop: emToPx(1) } },
  { precedingClass: 'q3', currentClass: 's2', styleOverrides: { marginTop: emToPx(1) } },
  { precedingClass: 'q3', currentClass: 'ms', styleOverrides: { marginTop: emToPx(1) } },

  // .imt + .is, .imt + .is1, .imt1 + .is, .imt1 + .is1
  { precedingClass: 'imt', currentClass: 'is', styleOverrides: { marginTop: emToPx(1) } },
  { precedingClass: 'imt', currentClass: 'is1', styleOverrides: { marginTop: emToPx(1) } },
  { precedingClass: 'imt1', currentClass: 'is', styleOverrides: { marginTop: emToPx(1) } },
  { precedingClass: 'imt1', currentClass: 'is1', styleOverrides: { marginTop: emToPx(1) } },

  // .ip + .is, .ip + .is1
  { precedingClass: 'ip', currentClass: 'is', styleOverrides: { marginTop: emToPx(1) } },
  { precedingClass: 'ip', currentClass: 'is1', styleOverrides: { marginTop: emToPx(1) } },

  // .io + .is, .io + .is1, .io1 + .is, .io1 + .is1
  { precedingClass: 'io', currentClass: 'is', styleOverrides: { marginTop: emToPx(1) } },
  { precedingClass: 'io', currentClass: 'is1', styleOverrides: { marginTop: emToPx(1) } },
  { precedingClass: 'io1', currentClass: 'is', styleOverrides: { marginTop: emToPx(1) } },
  { precedingClass: 'io1', currentClass: 'is1', styleOverrides: { marginTop: emToPx(1) } },

  // .io2 + .is, .io2 + .is1, .io3 + .is, .io3 + .is1
  { precedingClass: 'io2', currentClass: 'is', styleOverrides: { marginTop: emToPx(1) } },
  { precedingClass: 'io2', currentClass: 'is1', styleOverrides: { marginTop: emToPx(1) } },
  { precedingClass: 'io3', currentClass: 'is', styleOverrides: { marginTop: emToPx(1) } },
  { precedingClass: 'io3', currentClass: 'is1', styleOverrides: { marginTop: emToPx(1) } },

  // .ip + .io, .ip + .io1, .ip + .io2, .ip + .io3
  { precedingClass: 'ip', currentClass: 'io', styleOverrides: { marginTop: emToPx(1) } },
  { precedingClass: 'ip', currentClass: 'io1', styleOverrides: { marginTop: emToPx(1) } },
  { precedingClass: 'ip', currentClass: 'io2', styleOverrides: { marginTop: emToPx(1) } },
  { precedingClass: 'ip', currentClass: 'io3', styleOverrides: { marginTop: emToPx(1) } },

  // .pi1 + .s, .pi + .s
  { precedingClass: 'pi1', currentClass: 's', styleOverrides: { marginTop: emToPx(1) } },
  { precedingClass: 'pi', currentClass: 's', styleOverrides: { marginTop: emToPx(1) } },

  // ===================
  // GROUP 5: margin-top: 0
  // CSS Lines 335-468 - Resets margin for quote/margin content after paragraphs
  // ===================

  // .p + .pm, .p + .pmo, .p + .pmc, .p + .q1, .p + .q2, .p + .q3, .p + .q4, .p + .qr, .p + .qm1, .p + .qm2, .p + .pmr
  { precedingClass: 'p', currentClass: 'pm', styleOverrides: { marginTop: 0 } },
  { precedingClass: 'p', currentClass: 'pmo', styleOverrides: { marginTop: 0 } },
  { precedingClass: 'p', currentClass: 'pmc', styleOverrides: { marginTop: 0 } },
  { precedingClass: 'p', currentClass: 'q1', styleOverrides: { marginTop: 0 } },
  { precedingClass: 'p', currentClass: 'q2', styleOverrides: { marginTop: 0 } },
  { precedingClass: 'p', currentClass: 'q3', styleOverrides: { marginTop: 0 } },
  { precedingClass: 'p', currentClass: 'q4', styleOverrides: { marginTop: 0 } },
  { precedingClass: 'p', currentClass: 'qr', styleOverrides: { marginTop: 0 } },
  { precedingClass: 'p', currentClass: 'qm1', styleOverrides: { marginTop: 0 } },
  { precedingClass: 'p', currentClass: 'qm2', styleOverrides: { marginTop: 0 } },
  { precedingClass: 'p', currentClass: 'pmr', styleOverrides: { marginTop: 0 } },

  // .m + similar patterns
  { precedingClass: 'm', currentClass: 'pm', styleOverrides: { marginTop: 0 } },
  { precedingClass: 'm', currentClass: 'pmo', styleOverrides: { marginTop: 0 } },
  { precedingClass: 'm', currentClass: 'pmc', styleOverrides: { marginTop: 0 } },
  { precedingClass: 'm', currentClass: 'q1', styleOverrides: { marginTop: 0 } },
  { precedingClass: 'm', currentClass: 'q2', styleOverrides: { marginTop: 0 } },
  { precedingClass: 'm', currentClass: 'q3', styleOverrides: { marginTop: 0 } },
  { precedingClass: 'm', currentClass: 'q4', styleOverrides: { marginTop: 0 } },
  { precedingClass: 'm', currentClass: 'qr', styleOverrides: { marginTop: 0 } },
  { precedingClass: 'm', currentClass: 'qm1', styleOverrides: { marginTop: 0 } },
  { precedingClass: 'm', currentClass: 'qm2', styleOverrides: { marginTop: 0 } },
  { precedingClass: 'm', currentClass: 'pmr', styleOverrides: { marginTop: 0 } },

  // .mi + similar patterns
  { precedingClass: 'mi', currentClass: 'pm', styleOverrides: { marginTop: 0 } },
  { precedingClass: 'mi', currentClass: 'pmo', styleOverrides: { marginTop: 0 } },
  { precedingClass: 'mi', currentClass: 'pmc', styleOverrides: { marginTop: 0 } },
  { precedingClass: 'mi', currentClass: 'q1', styleOverrides: { marginTop: 0 } },
  { precedingClass: 'mi', currentClass: 'q2', styleOverrides: { marginTop: 0 } },
  { precedingClass: 'mi', currentClass: 'q3', styleOverrides: { marginTop: 0 } },
  { precedingClass: 'mi', currentClass: 'q4', styleOverrides: { marginTop: 0 } },
  { precedingClass: 'mi', currentClass: 'qr', styleOverrides: { marginTop: 0 } },
  { precedingClass: 'mi', currentClass: 'qm1', styleOverrides: { marginTop: 0 } },
  { precedingClass: 'mi', currentClass: 'qm2', styleOverrides: { marginTop: 0 } },
  { precedingClass: 'mi', currentClass: 'pmr', styleOverrides: { marginTop: 0 } },

  // .pi1 + similar patterns
  { precedingClass: 'pi1', currentClass: 'pm', styleOverrides: { marginTop: 0 } },
  { precedingClass: 'pi1', currentClass: 'pmo', styleOverrides: { marginTop: 0 } },
  { precedingClass: 'pi1', currentClass: 'pmc', styleOverrides: { marginTop: 0 } },
  { precedingClass: 'pi1', currentClass: 'q1', styleOverrides: { marginTop: 0 } },
  { precedingClass: 'pi1', currentClass: 'q2', styleOverrides: { marginTop: 0 } },
  { precedingClass: 'pi1', currentClass: 'q3', styleOverrides: { marginTop: 0 } },
  { precedingClass: 'pi1', currentClass: 'q4', styleOverrides: { marginTop: 0 } },
  { precedingClass: 'pi1', currentClass: 'qr', styleOverrides: { marginTop: 0 } },
  { precedingClass: 'pi1', currentClass: 'qm1', styleOverrides: { marginTop: 0 } },
  { precedingClass: 'pi1', currentClass: 'qm2', styleOverrides: { marginTop: 0 } },
  { precedingClass: 'pi1', currentClass: 'pmr', styleOverrides: { marginTop: 0 } },

  // .pi2 + similar patterns
  { precedingClass: 'pi2', currentClass: 'pm', styleOverrides: { marginTop: 0 } },
  { precedingClass: 'pi2', currentClass: 'pmo', styleOverrides: { marginTop: 0 } },
  { precedingClass: 'pi2', currentClass: 'pmc', styleOverrides: { marginTop: 0 } },
  { precedingClass: 'pi2', currentClass: 'q1', styleOverrides: { marginTop: 0 } },
  { precedingClass: 'pi2', currentClass: 'q2', styleOverrides: { marginTop: 0 } },
  { precedingClass: 'pi2', currentClass: 'q3', styleOverrides: { marginTop: 0 } },
  { precedingClass: 'pi2', currentClass: 'q4', styleOverrides: { marginTop: 0 } },
  { precedingClass: 'pi2', currentClass: 'qr', styleOverrides: { marginTop: 0 } },
  { precedingClass: 'pi2', currentClass: 'qm1', styleOverrides: { marginTop: 0 } },
  { precedingClass: 'pi2', currentClass: 'qm2', styleOverrides: { marginTop: 0 } },
  { precedingClass: 'pi2', currentClass: 'pmr', styleOverrides: { marginTop: 0 } },

  // .pi3 + similar patterns
  { precedingClass: 'pi3', currentClass: 'pm', styleOverrides: { marginTop: 0 } },
  { precedingClass: 'pi3', currentClass: 'pmo', styleOverrides: { marginTop: 0 } },
  { precedingClass: 'pi3', currentClass: 'pmc', styleOverrides: { marginTop: 0 } },
  { precedingClass: 'pi3', currentClass: 'q1', styleOverrides: { marginTop: 0 } },
  { precedingClass: 'pi3', currentClass: 'q2', styleOverrides: { marginTop: 0 } },
  { precedingClass: 'pi3', currentClass: 'q3', styleOverrides: { marginTop: 0 } },
  { precedingClass: 'pi3', currentClass: 'q4', styleOverrides: { marginTop: 0 } },
  { precedingClass: 'pi3', currentClass: 'qr', styleOverrides: { marginTop: 0 } },
  { precedingClass: 'pi3', currentClass: 'qm1', styleOverrides: { marginTop: 0 } },
  { precedingClass: 'pi3', currentClass: 'qm2', styleOverrides: { marginTop: 0 } },
  { precedingClass: 'pi3', currentClass: 'pmr', styleOverrides: { marginTop: 0 } },

  // .li + similar patterns
  { precedingClass: 'li', currentClass: 'pm', styleOverrides: { marginTop: 0 } },
  { precedingClass: 'li', currentClass: 'pmo', styleOverrides: { marginTop: 0 } },
  { precedingClass: 'li', currentClass: 'pmc', styleOverrides: { marginTop: 0 } },
  { precedingClass: 'li', currentClass: 'q1', styleOverrides: { marginTop: 0 } },
  { precedingClass: 'li', currentClass: 'q2', styleOverrides: { marginTop: 0 } },
  { precedingClass: 'li', currentClass: 'q3', styleOverrides: { marginTop: 0 } },
  { precedingClass: 'li', currentClass: 'q4', styleOverrides: { marginTop: 0 } },
  { precedingClass: 'li', currentClass: 'qr', styleOverrides: { marginTop: 0 } },
  { precedingClass: 'li', currentClass: 'qm1', styleOverrides: { marginTop: 0 } },
  { precedingClass: 'li', currentClass: 'qm2', styleOverrides: { marginTop: 0 } },
  { precedingClass: 'li', currentClass: 'pmr', styleOverrides: { marginTop: 0 } },

  // .li1 + similar patterns
  { precedingClass: 'li1', currentClass: 'pm', styleOverrides: { marginTop: 0 } },
  { precedingClass: 'li1', currentClass: 'pmo', styleOverrides: { marginTop: 0 } },
  { precedingClass: 'li1', currentClass: 'pmc', styleOverrides: { marginTop: 0 } },
  { precedingClass: 'li1', currentClass: 'q1', styleOverrides: { marginTop: 0 } },
  { precedingClass: 'li1', currentClass: 'q2', styleOverrides: { marginTop: 0 } },
  { precedingClass: 'li1', currentClass: 'q3', styleOverrides: { marginTop: 0 } },
  { precedingClass: 'li1', currentClass: 'q4', styleOverrides: { marginTop: 0 } },
  { precedingClass: 'li1', currentClass: 'qr', styleOverrides: { marginTop: 0 } },
  { precedingClass: 'li1', currentClass: 'qm1', styleOverrides: { marginTop: 0 } },
  { precedingClass: 'li1', currentClass: 'qm2', styleOverrides: { marginTop: 0 } },
  { precedingClass: 'li1', currentClass: 'pmr', styleOverrides: { marginTop: 0 } },

  // .li2 + similar patterns
  { precedingClass: 'li2', currentClass: 'pm', styleOverrides: { marginTop: 0 } },
  { precedingClass: 'li2', currentClass: 'pmo', styleOverrides: { marginTop: 0 } },
  { precedingClass: 'li2', currentClass: 'pmc', styleOverrides: { marginTop: 0 } },
  { precedingClass: 'li2', currentClass: 'q1', styleOverrides: { marginTop: 0 } },
  { precedingClass: 'li2', currentClass: 'q2', styleOverrides: { marginTop: 0 } },
  { precedingClass: 'li2', currentClass: 'q3', styleOverrides: { marginTop: 0 } },
  { precedingClass: 'li2', currentClass: 'q4', styleOverrides: { marginTop: 0 } },
  { precedingClass: 'li2', currentClass: 'qr', styleOverrides: { marginTop: 0 } },
  { precedingClass: 'li2', currentClass: 'qm1', styleOverrides: { marginTop: 0 } },
  { precedingClass: 'li2', currentClass: 'qm2', styleOverrides: { marginTop: 0 } },
  { precedingClass: 'li2', currentClass: 'pmr', styleOverrides: { marginTop: 0 } },

  // .li3 + similar patterns
  { precedingClass: 'li3', currentClass: 'pm', styleOverrides: { marginTop: 0 } },
  { precedingClass: 'li3', currentClass: 'pmo', styleOverrides: { marginTop: 0 } },
  { precedingClass: 'li3', currentClass: 'pmc', styleOverrides: { marginTop: 0 } },
  { precedingClass: 'li3', currentClass: 'q1', styleOverrides: { marginTop: 0 } },
  { precedingClass: 'li3', currentClass: 'q2', styleOverrides: { marginTop: 0 } },
  { precedingClass: 'li3', currentClass: 'q3', styleOverrides: { marginTop: 0 } },
  { precedingClass: 'li3', currentClass: 'q4', styleOverrides: { marginTop: 0 } },
  { precedingClass: 'li3', currentClass: 'qr', styleOverrides: { marginTop: 0 } },
  { precedingClass: 'li3', currentClass: 'qm1', styleOverrides: { marginTop: 0 } },
  { precedingClass: 'li3', currentClass: 'qm2', styleOverrides: { marginTop: 0 } },
  { precedingClass: 'li3', currentClass: 'pmr', styleOverrides: { marginTop: 0 } },

  // .li4 + similar patterns
  { precedingClass: 'li4', currentClass: 'pm', styleOverrides: { marginTop: 0 } },
  { precedingClass: 'li4', currentClass: 'pmo', styleOverrides: { marginTop: 0 } },
  { precedingClass: 'li4', currentClass: 'pmc', styleOverrides: { marginTop: 0 } },
  { precedingClass: 'li4', currentClass: 'q1', styleOverrides: { marginTop: 0 } },
  { precedingClass: 'li4', currentClass: 'q2', styleOverrides: { marginTop: 0 } },
  { precedingClass: 'li4', currentClass: 'q3', styleOverrides: { marginTop: 0 } },
  { precedingClass: 'li4', currentClass: 'q4', styleOverrides: { marginTop: 0 } },
  { precedingClass: 'li4', currentClass: 'qr', styleOverrides: { marginTop: 0 } },
  { precedingClass: 'li4', currentClass: 'qm1', styleOverrides: { marginTop: 0 } },
  { precedingClass: 'li4', currentClass: 'qm2', styleOverrides: { marginTop: 0 } },
  { precedingClass: 'li4', currentClass: 'pmr', styleOverrides: { marginTop: 0 } },
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
