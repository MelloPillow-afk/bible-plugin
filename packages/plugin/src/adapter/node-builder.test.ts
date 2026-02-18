import { beforeEach, describe, expect, it } from 'vitest'

import { NodeBuilder } from './node-builder'
import type { ParsedNode } from './types'
import { FONTS } from '../styles/fonts'
import { COLORS } from '../styles/colors'

type MockSceneNode = MockFrameNode | MockTextNode

interface MockFrameNode {
  type: 'FRAME'
  name: string
  width: number
  height: number
  fills: unknown[]
  layoutMode: string
  layoutSizingVertical: string
  layoutSizingHorizontal: string
  paddingLeft: number
  paddingRight: number
  paddingTop: number
  paddingBottom: number
  itemSpacing: number
  children: MockSceneNode[]
  resizeCalls: Array<{ width: number, height: number }>
  appendChild: (node: MockSceneNode) => void
  resize: (width: number, height: number) => void
}

interface MockTextNode {
  type: 'TEXT'
  characters: string
  width: number
  height: number
  paragraphIndent?: number
  lineHeight?: unknown
  textAutoResize: string
  resizeCalls: Array<{ width: number, height: number }>
  fontNameCalls: Array<{ start: number, end: number, fontName: FontName }>
  fontSizeCalls: Array<{ start: number, end: number, fontSize: number }>
  fillCalls: Array<{ start: number, end: number, fills: unknown[] }>
  textCaseCalls: Array<{ start: number, end: number, textCase: TextCase }>
  resize: (width: number, height: number) => void
  setRangeFontName: (start: number, end: number, fontName: FontName) => void
  setRangeFontSize: (start: number, end: number, fontSize: number) => void
  setRangeFills: (start: number, end: number, fills: unknown[]) => void
  setRangeTextCase: (start: number, end: number, textCase: TextCase) => void
}

interface MockHarness {
  createdFrames: MockFrameNode[]
  createdTexts: MockTextNode[]
}

function createParsedNode(overrides: Partial<ParsedNode>): ParsedNode {
  return {
    tagName: null,
    classes: [],
    textContent: '',
    type: 'text',
    children: [],
    ...overrides,
  }
}

function createFrameNode(): MockFrameNode {
  const frame: MockFrameNode = {
    type: 'FRAME',
    name: '',
    width: 100,
    height: 100,
    fills: [{ type: 'SOLID' }],
    layoutMode: 'NONE',
    layoutSizingVertical: 'FIXED',
    layoutSizingHorizontal: 'FIXED',
    paddingLeft: 0,
    paddingRight: 0,
    paddingTop: 0,
    paddingBottom: 0,
    itemSpacing: 0,
    children: [],
    resizeCalls: [],
    appendChild: (node: MockSceneNode) => {
      frame.children.push(node)
    },
    resize: (width: number, height: number) => {
      frame.width = width
      frame.height = height
      frame.resizeCalls.push({ width, height })
    },
  }

  return frame
}

function createTextNode(): MockTextNode {
  const text: MockTextNode = {
    type: 'TEXT',
    characters: '',
    width: 100,
    height: 40,
    paragraphIndent: undefined,
    lineHeight: undefined,
    textAutoResize: 'NONE',
    resizeCalls: [],
    fontNameCalls: [],
    fontSizeCalls: [],
    fillCalls: [],
    textCaseCalls: [],
    resize: (width: number, height: number) => {
      text.width = width
      text.height = height
      text.resizeCalls.push({ width, height })
    },
    setRangeFontName: (start: number, end: number, fontName: FontName) => {
      text.fontNameCalls.push({ start, end, fontName })
    },
    setRangeFontSize: (start: number, end: number, fontSize: number) => {
      text.fontSizeCalls.push({ start, end, fontSize })
    },
    setRangeFills: (start: number, end: number, fills: unknown[]) => {
      text.fillCalls.push({ start, end, fills })
    },
    setRangeTextCase: (start: number, end: number, textCase: TextCase) => {
      text.textCaseCalls.push({ start, end, textCase })
    },
  }

  return text
}

function installFigmaMock(): MockHarness {
  const createdFrames: MockFrameNode[] = []
  const createdTexts: MockTextNode[] = []

  const figmaMock = {
    createFrame: () => {
      const frame = createFrameNode()
      createdFrames.push(frame)
      return frame as unknown as FrameNode
    },
    createText: () => {
      const text = createTextNode()
      createdTexts.push(text)
      return text as unknown as TextNode
    },
  }

  ;(globalThis as unknown as { figma: unknown }).figma = figmaMock

  return { createdFrames, createdTexts }
}

describe('NodeBuilder runtime behavior', () => {
  let builder: NodeBuilder
  let harness: MockHarness

  beforeEach(() => {
    harness = installFigmaMock()
    builder = new NodeBuilder()
  })

  it('skips the root wrapper and applies default block frame settings', () => {
    const tree = createParsedNode({
      type: 'block',
      tagName: 'div',
      children: [
        createParsedNode({
          type: 'block',
          tagName: 'span',
          description: 'Paragraph',
          children: [
            createParsedNode({
              type: 'text',
              tagName: null,
              textContent: 'Hello',
            }),
          ],
        }),
      ],
    })

    const nodes = builder.build(tree)

    expect(nodes).toHaveLength(1)
    expect(harness.createdFrames).toHaveLength(1)

    const frame = nodes[0] as unknown as MockFrameNode
    expect(frame.name).toBe('Paragraph')
    expect(frame.layoutMode).toBe('VERTICAL')
    expect(frame.layoutSizingVertical).toBe('HUG')
    expect(frame.layoutSizingHorizontal).toBe('FIXED')
    expect(frame.resizeCalls).toEqual([{ width: 512, height: 100 }])
    expect(frame.width).toBe(512)
    expect(frame.fills).toEqual([])
    expect(frame.paddingLeft).toBe(0)
    expect(frame.paddingRight).toBe(0)
    expect(frame.paddingTop).toBe(0)
    expect(frame.paddingBottom).toBe(0)
    expect(frame.itemSpacing).toBe(0)
  })

  it('assembles mixed inline and block children in the correct order', () => {
    const tree = createParsedNode({
      type: 'block',
      tagName: 'div',
      children: [
        createParsedNode({
          type: 'block',
          tagName: 'div',
          children: [
            createParsedNode({
              type: 'text',
              tagName: null,
              textContent: 'A',
            }),
            createParsedNode({
              type: 'inline',
              tagName: 'span',
              style: { fontStyle: 'italic' },
              children: [
                createParsedNode({
                  type: 'text',
                  tagName: null,
                  textContent: 'B',
                }),
              ],
            }),
            createParsedNode({
              type: 'block',
              tagName: 'div',
              description: 'Nested',
              children: [
                createParsedNode({
                  type: 'text',
                  tagName: null,
                  textContent: 'N',
                }),
              ],
            }),
            createParsedNode({
              type: 'text',
              tagName: null,
              textContent: 'C',
            }),
          ],
        }),
      ],
    })

    const nodes = builder.build(tree)
    const topFrame = nodes[0] as unknown as MockFrameNode

    expect(topFrame.children).toHaveLength(3)

    const firstChild = topFrame.children[0] as MockTextNode
    const secondChild = topFrame.children[1] as MockFrameNode
    const thirdChild = topFrame.children[2] as MockTextNode

    expect(firstChild.type).toBe('TEXT')
    expect(firstChild.characters).toBe('AB')

    expect(secondChild.type).toBe('FRAME')
    expect(secondChild.name).toBe('Nested')

    expect(thirdChild.type).toBe('TEXT')
    expect(thirdChild.characters).toBe('C')
  })

  it('applies text range styling calls for every segment', () => {
    const tree = createParsedNode({
      type: 'block',
      tagName: 'div',
      children: [
        createParsedNode({
          type: 'block',
          tagName: 'p',
          style: {
            paragraphIndent: 12,
            lineHeight: { value: 150, unit: 'PERCENT' },
          },
          children: [
            createParsedNode({
              type: 'text',
              tagName: null,
              textContent: 'Bold',
              style: {
                fontWeight: 700,
                fontSize: 24,
                color: COLORS.RED,
              },
            }),
            createParsedNode({
              type: 'text',
              tagName: null,
              textContent: 'It',
              style: {
                fontStyle: 'italic',
                fontSize: 18,
              },
            }),
            createParsedNode({
              type: 'text',
              tagName: null,
              textContent: 'sc',
              style: {
                textCase: 'SMALL_CAPS',
              },
            }),
          ],
        }),
      ],
    })

    const nodes = builder.build(tree)
    const frame = nodes[0] as unknown as MockFrameNode
    const text = frame.children[0] as MockTextNode

    expect(text.characters).toBe('BoldItsc')
    expect(text.paragraphIndent).toBe(12)
    expect(text.lineHeight).toEqual({ value: 150, unit: 'PERCENT' })

    expect(text.fontNameCalls).toEqual([
      { start: 0, end: 4, fontName: FONTS.SERIF_BOLD },
      { start: 4, end: 6, fontName: FONTS.SERIF_ITALIC },
      { start: 6, end: 8, fontName: FONTS.SERIF },
    ])

    expect(text.fontSizeCalls).toEqual([
      { start: 0, end: 4, fontSize: 24 },
      { start: 4, end: 6, fontSize: 18 },
      { start: 6, end: 8, fontSize: 20 },
    ])

    expect(text.fillCalls).toEqual([
      { start: 0, end: 4, fills: [{ type: 'SOLID', color: COLORS.RED }] },
      { start: 4, end: 6, fills: [{ type: 'SOLID', color: COLORS.FOREGROUND }] },
      { start: 6, end: 8, fills: [{ type: 'SOLID', color: COLORS.FOREGROUND }] },
    ])

    expect(text.textCaseCalls).toEqual([
      { start: 6, end: 8, textCase: 'SMALL_CAPS' },
    ])
  })

  it('converts label and yv-vlbl text into superscript segments', () => {
    const tree = createParsedNode({
      type: 'block',
      tagName: 'div',
      children: [
        createParsedNode({
          type: 'block',
          tagName: 'p',
          children: [
            createParsedNode({
              type: 'inline',
              tagName: 'span',
              classes: ['label'],
              textContent: '12',
            }),
            createParsedNode({
              type: 'inline',
              tagName: 'span',
              classes: ['yv-vlbl'],
              textContent: '3',
            }),
            createParsedNode({
              type: 'text',
              tagName: null,
              textContent: 'word',
            }),
          ],
        }),
      ],
    })

    const nodes = builder.build(tree)
    const frame = nodes[0] as unknown as MockFrameNode
    const text = frame.children[0] as MockTextNode

    expect(text.characters).toBe('¹² ³ word')
  })

  it('skips creating empty text nodes when content is empty', () => {
    const topLevelInlineOnly = createParsedNode({
      type: 'block',
      tagName: 'div',
      children: [
        createParsedNode({
          type: 'text',
          tagName: null,
          textContent: '',
        }),
      ],
    })

    const topLevelNodes = builder.build(topLevelInlineOnly)
    expect(topLevelNodes).toHaveLength(0)

    const emptyBlockContent = createParsedNode({
      type: 'block',
      tagName: 'div',
      children: [
        createParsedNode({
          type: 'block',
          tagName: 'p',
          children: [
            createParsedNode({
              type: 'text',
              tagName: null,
              textContent: '',
            }),
          ],
        }),
      ],
    })

    const blockNodes = builder.build(emptyBlockContent)
    const frame = blockNodes[0] as unknown as MockFrameNode

    expect(frame.children).toHaveLength(0)
    expect(harness.createdTexts).toHaveLength(0)
  })
})
