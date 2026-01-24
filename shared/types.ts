// Ultra-minimal message types for web-app <-> plugin communication

// ============================================
// SHARED TYPES
// ============================================

/**
 * Raw DOM node structure from HTML parsing
 * Used to transfer DOM tree from web app to plugin
 *
 * The web-app extracts raw DOM structure without classification.
 * The plugin handles USFM semantics (block/inline classification).
 */
export interface DOMNode {
  tagName: string | null
  classes: string[]
  textContent: string
  children: DOMNode[]
}

// ============================================
// WEB APP -> PLUGIN MESSAGES
// ============================================

export interface InsertPassageMessage {
  type: 'INSERT_PASSAGE'
  payload: {
    content: DOMNode
    reference: string
    versionId: number
  }
}

export interface CloseMessage {
  type: 'CLOSE'
}

export type PluginMessage = InsertPassageMessage | CloseMessage
