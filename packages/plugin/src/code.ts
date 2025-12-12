// Main thread code - runs in Figma's sandbox
// Has access to Figma API, no browser APIs

figma.showUI(__html__, { width: 400, height: 600 })

figma.ui.onmessage = (msg: { type: string; payload?: unknown }) => {
  console.log('Received message from UI:', msg)

  if (msg.type === 'close') {
    figma.closePlugin()
  }
}
