import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'

import type { DOMNode, PluginMessage } from '@shared/types'
import { DOMToFigmaAdapter } from './adapter'

interface MockSceneNode {
  id: string
  type: string
}

interface MockFrameSelection extends MockSceneNode {
  type: 'FRAME'
  appended: MockSceneNode[]
  appendChild: (node: MockSceneNode) => void
}

interface MockFigma {
  showUICalls: Array<[string, { width: number, height: number, themeColors: boolean }]>
  notifyCalls: string[]
  zoomCalls: MockSceneNode[][]
  closePluginCalls: number
  currentPage: {
    selection: SceneNode[]
  }
  viewport: {
    scrollAndZoomIntoView: (nodes: SceneNode[]) => void
  }
  ui: {
    onmessage?: (msg: PluginMessage) => void | Promise<void>
  }
  showUI: (html: string, options: { width: number, height: number, themeColors: boolean }) => void
  notify: (message: string) => void
  closePlugin: () => void
}

function createSceneNode(id: string, type: string): MockSceneNode {
  return { id, type }
}

function createFrameSelection(id: string): MockFrameSelection {
  const appended: MockSceneNode[] = []

  return {
    id,
    type: 'FRAME',
    appended,
    appendChild: (node: MockSceneNode) => {
      appended.push(node)
    },
  }
}

function createInsertMessage(content: DOMNode): PluginMessage {
  return {
    type: 'INSERT_PASSAGE',
    payload: {
      content,
      reference: 'John 1:1',
      versionId: 1,
    },
  }
}

function createDomContent(): DOMNode {
  return {
    tagName: 'div',
    classes: [],
    textContent: '',
    children: [
      {
        tagName: null,
        classes: [],
        textContent: 'Sample content',
        children: [],
      },
    ],
  }
}

function createFigmaMock(): MockFigma {
  const showUICalls: Array<[string, { width: number, height: number, themeColors: boolean }]> = []
  const notifyCalls: string[] = []
  const zoomCalls: MockSceneNode[][] = []

  const mock: MockFigma = {
    showUICalls,
    notifyCalls,
    zoomCalls,
    closePluginCalls: 0,
    currentPage: {
      selection: [],
    },
    viewport: {
      scrollAndZoomIntoView: (nodes: SceneNode[]) => {
        zoomCalls.push(nodes as unknown as MockSceneNode[])
      },
    },
    ui: {
      onmessage: undefined,
    },
    showUI: (html: string, options: { width: number, height: number, themeColors: boolean }) => {
      showUICalls.push([html, options])
    },
    notify: (message: string) => {
      notifyCalls.push(message)
    },
    closePlugin: () => {
      mock.closePluginCalls += 1
    },
  }

  return mock
}

function getMessageHandler(figmaMock: MockFigma): (msg: PluginMessage) => Promise<void> {
  const handler = figmaMock.ui.onmessage
  if (!handler) {
    throw new Error('Plugin message handler is not registered')
  }

  return async (msg: PluginMessage) => {
    await handler(msg)
  }
}

let figmaMock: MockFigma
let originalConvert: (content: DOMNode) => Promise<SceneNode[]>
let originalConsoleError: typeof console.error

describe('Plugin code handler behavior', () => {
  beforeAll(async () => {
    figmaMock = createFigmaMock()
    ;(globalThis as unknown as { figma: unknown }).figma = figmaMock

    const convertDescriptor = Object.getOwnPropertyDescriptor(DOMToFigmaAdapter.prototype, 'convert')
    if (!convertDescriptor || typeof convertDescriptor.value !== 'function') {
      throw new Error('DOMToFigmaAdapter.convert is not available')
    }
    originalConvert = convertDescriptor.value as (content: DOMNode) => Promise<SceneNode[]>
    originalConsoleError = console.error

    await import('./code')
  })

  beforeEach(() => {
    figmaMock.notifyCalls.length = 0
    figmaMock.zoomCalls.length = 0
    figmaMock.closePluginCalls = 0
    figmaMock.currentPage.selection = []
    DOMToFigmaAdapter.prototype.convert = originalConvert
    console.error = () => undefined
  })

  afterAll(() => {
    DOMToFigmaAdapter.prototype.convert = originalConvert
    console.error = originalConsoleError
  })

  it('calls showUI on module load', () => {
    expect(figmaMock.showUICalls).toHaveLength(1)

    const [html, options] = figmaMock.showUICalls[0]

    expect(html).toContain('http://localhost:5173')
    expect(options).toEqual({ width: 600, height: 600, themeColors: true })
  })

  it('notifies when INSERT_PASSAGE runs without a selected frame', async () => {
    const content = createDomContent()
    let convertCalled = false

    DOMToFigmaAdapter.prototype.convert = () => {
      convertCalled = true
      return Promise.resolve([])
    }

    const onmessage = getMessageHandler(figmaMock)
    await onmessage(createInsertMessage(content))

    expect(convertCalled).toBe(false)
    expect(figmaMock.notifyCalls).toEqual(['Please select a frame first'])
    expect(figmaMock.zoomCalls).toHaveLength(0)
  })

  it('appends converted nodes, updates selection, zooms, and notifies on success', async () => {
    const content = createDomContent()
    const selectedFrame = createFrameSelection('selected-frame')
    const nodeA = createSceneNode('node-a', 'TEXT')
    const nodeB = createSceneNode('node-b', 'FRAME')
    const converted = [nodeA, nodeB]

    figmaMock.currentPage.selection = [selectedFrame as unknown as SceneNode]

    let receivedContent: DOMNode | undefined
    DOMToFigmaAdapter.prototype.convert = (domContent: DOMNode) => {
      receivedContent = domContent
      return Promise.resolve(converted as unknown as SceneNode[])
    }

    const onmessage = getMessageHandler(figmaMock)
    await onmessage(createInsertMessage(content))

    expect(receivedContent).toEqual(content)
    expect(selectedFrame.appended).toEqual(converted)
    expect(figmaMock.currentPage.selection).toEqual(converted as unknown as SceneNode[])
    expect(figmaMock.zoomCalls).toEqual([converted])
    expect(figmaMock.notifyCalls[figmaMock.notifyCalls.length - 1]).toBe('Passage inserted successfully')
  })

  it('notifies on conversion errors', async () => {
    const content = createDomContent()
    const selectedFrame = createFrameSelection('selected-frame')

    figmaMock.currentPage.selection = [selectedFrame as unknown as SceneNode]

    DOMToFigmaAdapter.prototype.convert = () => Promise.reject(new Error('conversion failed'))

    const onmessage = getMessageHandler(figmaMock)
    await onmessage(createInsertMessage(content))

    expect(selectedFrame.appended).toHaveLength(0)
    expect(figmaMock.notifyCalls[figmaMock.notifyCalls.length - 1]).toBe('Error inserting passage. Please try again.')
  })

  it('closes the plugin on CLOSE message', async () => {
    const onmessage = getMessageHandler(figmaMock)

    await onmessage({ type: 'CLOSE' })

    expect(figmaMock.closePluginCalls).toBe(1)
  })
})
