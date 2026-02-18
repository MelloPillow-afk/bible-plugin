import { describe, expect, it } from 'vitest'

import {
  BASE_FONT_SIZE,
  calcEmToPx,
  clampPositive,
  createAutoLineHeight,
  createLineHeight,
  createLineHeightPx,
  emToPx,
  toSuperscript,
} from './css-helpers'

describe('css-helpers', () => {
  describe('emToPx', () => {
    it('converts em values with the default base size and rounds to nearest integer', () => {
      expect(BASE_FONT_SIZE).toBe(20)
      expect(emToPx(1.3)).toBe(26)
      expect(emToPx(0.525)).toBe(11)
    })

    it('accepts a custom base font size', () => {
      expect(emToPx(1.5, 18)).toBe(27)
    })
  })

  describe('createLineHeight', () => {
    it('creates a percent-based line height', () => {
      expect(createLineHeight(1.625)).toEqual({ value: 162.5, unit: 'PERCENT' })
    })
  })

  describe('createLineHeightPx', () => {
    it('creates a pixel-based line height', () => {
      expect(createLineHeightPx(24)).toEqual({ value: 24, unit: 'PIXELS' })
    })
  })

  describe('createAutoLineHeight', () => {
    it('creates an auto line height', () => {
      expect(createAutoLineHeight()).toEqual({ value: 0, unit: 'AUTO' })
    })
  })

  describe('calcEmToPx', () => {
    it('converts calc multipliers to px using the same rounding as emToPx', () => {
      expect(calcEmToPx(0.3)).toBe(6)
      expect(calcEmToPx(0.525)).toBe(11)
    })

    it('accepts a custom base font size', () => {
      expect(calcEmToPx(0.5, 24)).toBe(12)
    })
  })

  describe('clampPositive', () => {
    it('clamps negative values to 0 and keeps non-negative values', () => {
      expect(clampPositive(-12)).toBe(0)
      expect(clampPositive(0)).toBe(0)
      expect(clampPositive(7)).toBe(7)
    })
  })

  describe('toSuperscript', () => {
    it('converts digits to superscript characters and preserves non-digits', () => {
      expect(toSuperscript('123')).toBe('\u00B9\u00B2\u00B3 ')
      expect(toSuperscript('v2a')).toBe('v\u00B2a ')
    })

    it('always appends a trailing space, including empty input', () => {
      expect(toSuperscript('')).toBe(' ')
    })
  })
})
