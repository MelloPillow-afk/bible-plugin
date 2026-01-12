// Main thread code - runs in Figma's sandbox
// Has access to Figma API, no browser APIs

import type { PluginMessage, InsertPassageMessage } from '@shared/types'

// Show UI
figma.showUI(`<script>window.location.href = "http://localhost:5173"</script>`, 
  { width: 400, height: 300, themeColors: true })


// Handle messages from the web app
figma.ui.onmessage = async (msg: PluginMessage) => {
  switch (msg.type) {
    case 'INSERT_PASSAGE': {
      const { content } = (msg as InsertPassageMessage).payload

      await figma.loadFontAsync({ family: "Inter", style: "Regular" })
      // Create text node
      const textNode = figma.createText()
      textNode.characters = content

      // Position at viewport center
      textNode.x = figma.viewport.center.x - textNode.width / 2
      textNode.y = figma.viewport.center.y - textNode.height / 2

      // Add to page and select
      figma.currentPage.appendChild(textNode)
      figma.currentPage.selection = [textNode]

      // Zoom to fit
      figma.viewport.scrollAndZoomIntoView([textNode])
      break
    }

    case 'CLOSE':
      figma.closePlugin()
      break
  }
}
