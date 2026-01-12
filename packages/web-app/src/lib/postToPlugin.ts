import type { PluginMessage } from '@shared/types'

/**
 * Send a message to the Figma plugin
 * Simple postMessage wrapper with no envelope, no correlation IDs
 */
export function postToPlugin(message: PluginMessage): void {
  // Check if we're in Figma context
  if (typeof parent === 'undefined' || parent === window) {
    console.log('[dev] Would send to plugin:', message)
    return
  }

  // Send directly to plugin (Figma wraps in pluginMessage automatically)
  parent.postMessage({ pluginMessage: message, pluginId: 'bible-plugin' }, '*')
}

/**
 * Check if running inside Figma plugin iframe
 */
export function isInFigma(): boolean {
  return typeof parent !== 'undefined' && parent !== window
}
