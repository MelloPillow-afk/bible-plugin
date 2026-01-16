export const FONTS = {
  SERIF: { family: 'Georgia', style: 'Regular' },
  SERIF_BOLD: { family: 'Georgia', style: 'Bold' },
  SERIF_ITALIC: { family: 'Georgia', style: 'Italic' }
}

export async function loadRequiredFonts(): Promise<void> {
  try {
    await Promise.all([
      figma.loadFontAsync(FONTS.SERIF),
      figma.loadFontAsync(FONTS.SERIF_BOLD),
      figma.loadFontAsync(FONTS.SERIF_ITALIC)
    ])
  } catch {
    console.warn('Georgia not available, using Inter')
    await figma.loadFontAsync({ family: 'Inter', style: 'Regular' })
  }
}
