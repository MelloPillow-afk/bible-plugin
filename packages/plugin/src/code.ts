// Main thread code - runs in Figma's sandbox
// Has access to Figma API, no browser APIs

import type { PluginMessage } from '@shared/types'
import { DOMToFigmaAdapter } from './adapter'

// Show UI
figma.showUI(`<script>window.location.href = "http://localhost:5173"</script>`,
  { width: 400, height: 300, themeColors: true })

// Handle messages from the web app
figma.ui.onmessage = async (msg: PluginMessage) => {
  switch (msg.type) {
    case 'INSERT_PASSAGE': {
      const { parsedContent } = (msg).payload

      // Get the selected frame
      const selectedNode = figma.currentPage.selection[0]

      if (!selectedNode || selectedNode.type !== 'FRAME') {
        figma.notify('Please select a frame first')
        break
      }

      await figma.loadFontAsync({ family: 'Inter', style: 'Regular' })
      await figma.loadFontAsync({ family: 'Untitled Serif', style: 'Regular' })

      try {
        // Convert parsed content to Figma nodes using the adapter

      const adapter = new DOMToFigmaAdapter()
        const nodes = await adapter.convert(parsedContent)

        // Add all created nodes to the selected frame
        for (const node of nodes) {
          selectedNode.appendChild(node)
        }

        // Select the new nodes
        if (nodes.length > 0) {
          figma.currentPage.selection = nodes

          // Zoom to fit
          figma.viewport.scrollAndZoomIntoView(nodes)
        }

        figma.notify('Passage inserted successfully')
      } catch (error) {
        console.error('Error inserting passage:', error)
        figma.notify('Error inserting passage. Please try again.')
      }
      break
    }

    case 'CLOSE':
      figma.closePlugin()
      break
  }
}
