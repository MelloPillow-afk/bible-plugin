import { describe, expect, it, vi } from 'vitest'

import { LayoutEngine } from './layout-engine'
import type { ParsedNode } from './types'

function createNode(partial: Partial<ParsedNode> = {}): ParsedNode {
  return {
    tagName: partial.tagName ?? 'div',
    classes: partial.classes ?? [],
    textContent: partial.textContent ?? '',
    type: partial.type ?? 'block',
    children: partial.children ?? [],
    previousSibling: partial.previousSibling,
    style: partial.style,
    description: partial.description,
  }
}

describe('LayoutEngine', () => {
  describe('applyStyles', () => {
    it('merges styles from all classes in order and lets later classes override shared properties', () => {
      const engine = new LayoutEngine()
      const node = createNode({
        classes: ['p', 's2'],
        type: 'block',
      })

      const result = engine.applyStyles(node)

      expect(result.style).toEqual({
        lineHeight: { value: 180, unit: 'PERCENT' },
        paragraphIndent: 20,
        marginBottom: 10,
        fontSize: 20,
        fontWeight: 700,
        marginTop: 0,
      })
    })

    it('resolves description from the first class that has a USFM description for block nodes', () => {
      const engine = new LayoutEngine()
      const node = createNode({
        classes: ['q', 'ms'],
        type: 'block',
      })

      const result = engine.applyStyles(node)

      expect(result.description).toBe('Poetry line level 1')
    })

    it('keeps an existing node description', () => {
      const engine = new LayoutEngine()
      const node = createNode({
        classes: ['ms'],
        type: 'block',
        description: 'Already set',
      })

      const result = engine.applyStyles(node)

      expect(result.description).toBe('Already set')
    })

    it('applies contextual overrides based on previous sibling classes', () => {
      const engine = new LayoutEngine()
      const previousSibling = createNode({ classes: ['label'], type: 'inline' })
      const node = createNode({
        classes: ['p'],
        type: 'block',
        previousSibling,
      })

      const result = engine.applyStyles(node)

      expect(result.style?.paragraphIndent).toBe(0)
      expect(result.style?.marginBottom).toBe(0)
      expect(result.style?.lineHeight).toEqual({ value: 162.5, unit: 'PERCENT' })
    })

    it('warns for unknown classes but skips warnings for common HTML classes', () => {
      const engine = new LayoutEngine()
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      engine.applyStyles(createNode({ classes: ['unknown-usfm', 'content'], type: 'block' }))

      expect(warnSpy).toHaveBeenCalledTimes(1)
      expect(warnSpy).toHaveBeenCalledWith('Unknown USFM class: unknown-usfm')

      warnSpy.mockRestore()
    })

    it('processes children recursively and styles nested descendants', () => {
      const engine = new LayoutEngine()
      const nestedInline = createNode({
        tagName: 'span',
        classes: ['it'],
        textContent: 'nested text',
        type: 'inline',
      })
      const firstChild = createNode({
        tagName: 'p',
        classes: ['p'],
        type: 'block',
        children: [nestedInline],
      })
      const secondChild = createNode({
        tagName: 'p',
        classes: ['s'],
        type: 'block',
        previousSibling: firstChild,
      })
      const root = createNode({
        tagName: 'section',
        classes: ['chapter'],
        type: 'block',
        children: [firstChild, secondChild],
      })

      const result = engine.applyStyles(root)

      expect(result).not.toBe(root)
      expect(result.children[0]).not.toBe(firstChild)
      expect(result.children[0].description).toBe('Paragraph')
      expect(result.children[0].children[0].style).toEqual({ fontStyle: 'italic' })
      expect(result.children[1].description).toBe('Section header')
      expect(result.children[1].style?.marginTop).toBe(20)
    })
  })
})
