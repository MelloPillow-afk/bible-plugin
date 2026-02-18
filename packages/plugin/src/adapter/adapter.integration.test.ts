import { beforeEach, describe, expect, it } from 'vitest'

import type { DOMNode } from '@shared/types'
import { DOMToFigmaAdapter } from './index'
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
  fillCalls: Array<{ start: number, end: number, fills: unknown[] }>
  textCaseCalls: Array<{ start: number, end: number, textCase: TextCase }>
  resize: (width: number, height: number) => void
  setRangeFontName: (start: number, end: number, fontName: FontName) => void
  setRangeFontSize: (start: number, end: number, fontSize: number) => void
  setRangeFills: (start: number, end: number, fills: unknown[]) => void
  setRangeTextCase: (start: number, end: number, textCase: TextCase) => void
}

interface MockHarness {
  fontLoads: FontName[]
  callOrder: string[]
  createdFrames: MockFrameNode[]
  createdTexts: MockTextNode[]
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
    fillCalls: [],
    textCaseCalls: [],
    resize: (width: number, height: number) => {
      text.width = width
      text.height = height
      text.resizeCalls.push({ width, height })
    },
    setRangeFontName: () => undefined,
    setRangeFontSize: () => undefined,
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
  const fontLoads: FontName[] = []
  const callOrder: string[] = []
  const createdFrames: MockFrameNode[] = []
  const createdTexts: MockTextNode[] = []

  const figmaMock = {
    loadFontAsync: (fontName: FontName) => {
      fontLoads.push(fontName)
      callOrder.push(`font:${fontName.family}-${fontName.style}`)
      return Promise.resolve()
    },
    createFrame: () => {
      const frame = createFrameNode()
      createdFrames.push(frame)
      callOrder.push('createFrame')
      return frame as unknown as FrameNode
    },
    createText: () => {
      const text = createTextNode()
      createdTexts.push(text)
      callOrder.push('createText')
      return text as unknown as TextNode
    },
  }

  ;(globalThis as unknown as { figma: unknown }).figma = figmaMock

  return {
    fontLoads,
    callOrder,
    createdFrames,
    createdTexts,
  }
}

describe('DOMToFigmaAdapter integration', () => {
  let harness: MockHarness

  beforeEach(() => {
    harness = installFigmaMock()
  })

  it('loads fonts and runs classify->layout->build with observable classification outcomes', async () => {
    const domTree: DOMNode = {
      tagName: 'div',
      classes: [],
      textContent: '',
      children: [
        {
          tagName: 'span',
          classes: ['p'],
          textContent: '',
          children: [
            {
              tagName: 'span',
              classes: ['label'],
              textContent: '1',
              children: [],
            },
            {
              tagName: null,
              classes: [],
              textContent: 'In the ',
              children: [],
            },
            {
              tagName: 'span',
              classes: ['sc'],
              textContent: 'beginning',
              children: [],
            },
          ],
        },
        {
          tagName: 'p',
          classes: [],
          textContent: '',
          children: [
            {
              tagName: null,
              classes: [],
              textContent: 'Fallback block',
              children: [],
            },
          ],
        },
        {
          tagName: 'span',
          classes: ['wj'],
          textContent: 'Jesus',
          children: [],
        },
      ],
    }

    const adapter = new DOMToFigmaAdapter()
    const nodes = await adapter.convert(domTree)

    expect(harness.fontLoads).toEqual([
      FONTS.INTER,
      FONTS.SERIF,
      FONTS.SERIF_BOLD,
      FONTS.SERIF_ITALIC,
    ])

    expect(harness.callOrder.slice(0, 4)).toEqual([
      'font:Inter-Regular',
      'font:Georgia-Regular',
      'font:Georgia-Bold',
      'font:Georgia-Italic',
    ])

    const firstFrameCallIndex = harness.callOrder.indexOf('createFrame')
    expect(firstFrameCallIndex).toBeGreaterThan(3)

    expect(nodes).toHaveLength(3)

    const firstNode = nodes[0] as unknown as MockFrameNode
    const secondNode = nodes[1] as unknown as MockFrameNode
    const thirdNode = nodes[2] as unknown as MockTextNode

    expect(firstNode.type).toBe('FRAME')
    expect(firstNode.name).toBe('Paragraph')

    expect(secondNode.type).toBe('FRAME')
    expect(secondNode.name).toBe('Frame')

    expect(thirdNode.type).toBe('TEXT')

    const firstParagraphText = firstNode.children[0] as MockTextNode
    expect(firstParagraphText.characters).toBe('¹ In the beginning')
    expect(firstParagraphText.paragraphIndent).toBe(20)
    expect(firstParagraphText.textCaseCalls).toEqual([
      { start: 9, end: 18, textCase: 'SMALL_CAPS' },
    ])

    const fallbackParagraphText = secondNode.children[0] as MockTextNode
    expect(fallbackParagraphText.characters).toBe('Fallback block')

    expect(thirdNode.fillCalls).toEqual([
      { start: 0, end: 5, fills: [{ type: 'SOLID', color: COLORS.RED }] },
    ])
  })
})
