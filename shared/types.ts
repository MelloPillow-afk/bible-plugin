// Ultra-minimal message types for web-app <-> plugin communication

// ============================================
// SHARED TYPES
// ============================================

/**
 * Parsed node from HTML parsing
 * Used to transfer parsed content from web app to plugin
 */
export interface ParsedNode {
  type: 'block' | 'inline' | 'text'
  tagName: string | null
  classes: string[]
  textContent: string
  children: ParsedNode[]
}

// ============================================
// WEB APP -> PLUGIN MESSAGES
// ============================================

export interface InsertPassageMessage {
  type: 'INSERT_PASSAGE'
  payload: {
    parsedContent: ParsedNode
    reference: string
    versionId: number
  }
}

export interface CloseMessage {
  type: 'CLOSE'
}

export type PluginMessage = InsertPassageMessage | CloseMessage
