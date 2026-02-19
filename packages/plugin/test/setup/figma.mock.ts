import { beforeEach, vi } from 'vitest'

type MockNode = Record<string, unknown>

export function createMockFrameNode(name = 'Frame'): MockNode {
  const frame: MockNode = {
    type: 'FRAME',
    name,
    width: 0,
    height: 100,
    children: [] as MockNode[],
    layoutMode: 'NONE',
    layoutSizingVertical: 'FIXED',
    layoutSizingHorizontal: 'FIXED',
    fills: [],
    paddingLeft: 0,
    paddingRight: 0,
    paddingTop: 0,
    paddingBottom: 0,
    itemSpacing: 0
  }

  frame.appendChild = vi.fn((child: MockNode) => {
    const children = frame.children as MockNode[]
    children.push(child)
    return child
  })

  frame.resize = vi.fn((width: number, height: number) => {
    frame.width = width
    frame.height = height
  })

  return frame
}

export function createMockTextNode(): MockNode {
  const textNode: MockNode = {
    type: 'TEXT',
    width: 0,
    height: 24,
    characters: '',
    textAutoResize: 'NONE',
    paragraphIndent: 0,
    lineHeight: { unit: 'AUTO' }
  }

  textNode.resize = vi.fn((width: number, height: number) => {
    textNode.width = width
    textNode.height = height
  })

  textNode.setRangeFontName = vi.fn()
  textNode.setRangeFontSize = vi.fn()
  textNode.setRangeFills = vi.fn()
  textNode.setRangeTextCase = vi.fn()

  return textNode
}

export const figmaMock = {
  showUI: vi.fn(),
  ui: {
    onmessage: undefined as ((msg: unknown) => unknown) | undefined,
    postMessage: vi.fn()
  },
  currentPage: {
    selection: [] as MockNode[]
  },
  viewport: {
    scrollAndZoomIntoView: vi.fn()
  },
  notify: vi.fn(),
  closePlugin: vi.fn(),
  loadFontAsync: vi.fn(() => Promise.resolve(undefined)),
  createFrame: vi.fn(() => createMockFrameNode()),
  createText: vi.fn(() => createMockTextNode())
}

export function resetFigmaMock(): void {
  figmaMock.showUI.mockReset()
  figmaMock.showUI.mockImplementation(() => undefined)

  figmaMock.ui.postMessage.mockReset()
  figmaMock.ui.postMessage.mockImplementation(() => undefined)
  figmaMock.ui.onmessage = undefined

  figmaMock.currentPage.selection = []

  figmaMock.viewport.scrollAndZoomIntoView.mockReset()
  figmaMock.viewport.scrollAndZoomIntoView.mockImplementation(() => undefined)

  figmaMock.notify.mockReset()
  figmaMock.notify.mockImplementation(() => undefined)

  figmaMock.closePlugin.mockReset()
  figmaMock.closePlugin.mockImplementation(() => undefined)

  figmaMock.loadFontAsync.mockReset()
  figmaMock.loadFontAsync.mockResolvedValue(undefined)

  figmaMock.createFrame.mockReset()
  figmaMock.createFrame.mockImplementation(() => createMockFrameNode())

  figmaMock.createText.mockReset()
  figmaMock.createText.mockImplementation(() => createMockTextNode())
}

export function setFigmaSelection(nodes: MockNode[]): void {
  figmaMock.currentPage.selection = nodes
}

Object.defineProperty(globalThis, 'figma', {
  configurable: true,
  writable: true,
  value: figmaMock as unknown as PluginAPI
})

beforeEach(() => {
  resetFigmaMock()
})
