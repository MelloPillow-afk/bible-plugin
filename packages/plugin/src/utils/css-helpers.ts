/**
 * CSS helper functions for converting CSS values to Figma-compatible values
 */

import type { LineHeight } from '../adapter/types'

/**
 * Base font size used for em calculations (matches --yv-reader-font-size)
 */
export const BASE_FONT_SIZE = 20

/**
 * Converts em values to pixels based on the base font size
 * @param em - The em value to convert
 * @param baseFontSize - The base font size in pixels (default: 20)
 * @returns The pixel value
 */
export function emToPx(em: number, baseFontSize: number = BASE_FONT_SIZE): number {
  return Math.round(em * baseFontSize)
}

/**
 * Creates a Figma-compatible line height object from an em value
 * @param em - The line height in em units
 * @returns LineHeight object for Figma
 */
export function createLineHeight(em: number): LineHeight {
  return {
    value: em * 100,
    unit: 'PERCENT'
  }
}

/**
 * Creates a line height object from a pixel value
 * @param px - The line height in pixels
 * @returns LineHeight object for Figma
 */
export function createLineHeightPx(px: number): LineHeight {
  return {
    value: px,
    unit: 'PIXELS'
  }
}

/**
 * Creates an auto line height
 * @returns LineHeight object with AUTO unit
 */
export function createAutoLineHeight(): LineHeight {
  return {
    value: 0,
    unit: 'AUTO'
  }
}

/**
 * Converts a CSS calc expression with em values to pixels
 * Example: "calc(var(--yv-reader-font-size) * 0.5)" becomes 10 (at 20px base)
 * @param multiplier - The multiplier from the calc expression
 * @param baseFontSize - The base font size in pixels
 * @returns The pixel value
 */
export function calcEmToPx(multiplier: number, baseFontSize: number = BASE_FONT_SIZE): number {
  return Math.round(multiplier * baseFontSize)
}

/**
 * Ensures a value is not negative (Figma doesn't support negative paragraph indent)
 * @param value - The value to clamp
 * @returns The value or 0 if negative
 */
export function clampPositive(value: number): number {
  return Math.max(0, value)
}

/**
 * Superscript character mapping for verse numbers
 * Maps regular digits to their Unicode superscript equivalents
 */
const SUPERSCRIPT_MAP: Record<string, string> = {
  '0': '\u2070',
  '1': '\u00B9',
  '2': '\u00B2',
  '3': '\u00B3',
  '4': '\u2074',
  '5': '\u2075',
  '6': '\u2076',
  '7': '\u2077',
  '8': '\u2078',
  '9': '\u2079',
}

/**
 * Converts a string of digits to Unicode superscript characters
 * Used for verse numbers since Figma doesn't support baselineShift
 * @param text - The text to convert (typically verse numbers)
 * @returns The text with digits converted to superscript Unicode characters
 */
export function toSuperscript(text: string): string {
  let superscriptText = text
    .split('')
    .map(char => SUPERSCRIPT_MAP[char] || char)
    .join('')

    return `${superscriptText} `
}
