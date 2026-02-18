import { describe, expect, it } from 'vitest'

import { getContextualStyles, getUSFMStyle, isBlockElement } from './usfm-styles'

describe('usfm-styles helpers', () => {
  describe('getUSFMStyle', () => {
    it('returns the style rule for a known class', () => {
      const rule = getUSFMStyle('p')

      expect(rule).toBeDefined()
      expect(rule?.isBlock).toBe(true)
      expect(rule?.description).toBe('Paragraph')
      expect(rule?.paragraphStyle).toEqual({ paragraphIndent: 20, marginBottom: 0 })
    })

    it('returns undefined for unknown classes', () => {
      expect(getUSFMStyle('not-a-usfm-class')).toBeUndefined()
    })
  })

  describe('isBlockElement', () => {
    it('returns true for block classes', () => {
      expect(isBlockElement('s')).toBe(true)
    })

    it('returns false for inline and unknown classes', () => {
      expect(isBlockElement('wj')).toBe(false)
      expect(isBlockElement('unknown')).toBe(false)
    })
  })

  describe('getContextualStyles', () => {
    it('returns contextual override styles when a rule exists', () => {
      expect(getContextualStyles('pi', 'p')).toEqual({ marginTop: 10, paragraphIndent: 0 })
    })

    it('returns undefined when no contextual rule exists', () => {
      expect(getContextualStyles('p', 'chapter')).toBeUndefined()
    })

    it('uses the first matching rule when duplicate pairs exist in the table', () => {
      expect(getContextualStyles('p', 'q1')).toEqual({ marginTop: 20 })
    })
  })
})
