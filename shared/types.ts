// Ultra-minimal message types for web-app <-> plugin communication

// ============================================
// WEB APP -> PLUGIN MESSAGES
// ============================================

export interface InsertPassageMessage {
  type: 'INSERT_PASSAGE'
  payload: {
    content: string
    reference: string
    versionId: number
  }
}

export interface CloseMessage {
  type: 'CLOSE'
}

export type PluginMessage = InsertPassageMessage | CloseMessage
