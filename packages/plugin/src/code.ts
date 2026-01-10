// Main thread code - runs in Figma's sandbox
// Has access to Figma API, no browser APIs

import { initBridge, onMessage, emit } from './bridge'
import type { InsertPassageMessage, InsertPassageResult, GetSelectionResult } from '@shared/types'

// Initialize the bridge
initBridge()

// Show UI
figma.showUI(__html__, { width: 400, height: 600 })

// Register message handlers
onMessage('INSERT_PASSAGE', async (msg: InsertPassageMessage, respond) => {
  const { content } = msg.payload

  await figma.loadFontAsync({ family: 'Inter', style: 'Regular' })

  const textNode = figma.createText()
  textNode.characters = content
  textNode.x = figma.viewport.center.x - textNode.width / 2
  textNode.y = figma.viewport.center.y - textNode.height / 2

  figma.currentPage.appendChild(textNode)
  figma.currentPage.selection = [textNode]

  respond({
    nodeId: textNode.id,
    success: true,
  } satisfies InsertPassageResult)
})

onMessage('GET_SELECTION', (_msg, respond) => {
  const selection = figma.currentPage.selection
  respond({
    hasSelection: selection.length > 0,
    selectedNodeIds: selection.map((n) => n.id),
    selectedNodeTypes: selection.map((n) => n.type),
  } satisfies GetSelectionResult)
})

onMessage('READY', () => {
  console.log('Web app is ready')
  emit({
    type: 'PLUGIN_READY',
    payload: { version: '1.0.0' },
  })
})

onMessage('CLOSE', () => {
  figma.closePlugin()
})

// Listen for selection changes and notify the web app
figma.on('selectionchange', () => {
  const selection = figma.currentPage.selection
  emit({
    type: 'SELECTION_CHANGED',
    payload: {
      selectedNodeIds: selection.map((n) => n.id),
      selectedNodeTypes: selection.map((n) => n.type),
    },
  })
})
