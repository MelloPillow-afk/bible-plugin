# Known Issues - DOMToFigmaAdapter

This document lists known architectural issues, limitations, and TODOs for the Bible Plugin's DOMToFigmaAdapter implementation.

## Architectural Issues

### 1. DOMParser Not Available in Figma Plugin Sandbox

**Status**: Critical - Workaround Applied

**Description**: The `HTMLParser` class in `src/adapter/parser.ts` uses `DOMParser` to parse HTML strings. However, `DOMParser` is a browser DOM API that is NOT available in Figma's plugin sandbox (main thread). The plugin currently includes the DOM lib in tsconfig to make TypeScript compile, but this will fail at runtime.

**Current Workaround**: Added `"DOM"` to the `lib` array in `tsconfig.json` to allow TypeScript compilation.

**Proper Solution**: HTML parsing should be moved to the web app (iframe) which has full browser APIs. The parsed data structure (`ParsedNode` tree) should be serialized and sent via `postMessage` to the plugin. The plugin should only receive the pre-parsed tree and handle Figma node creation.

**Files Affected**:
- `src/adapter/parser.ts`
- `src/adapter/index.ts`
- `tsconfig.json`

### 2. Type Definitions Were Missing

**Status**: Fixed

**Description**: The following types were imported but not defined in `src/adapter/types.ts`:
- `ParsedNode`
- `FigmaStyle`
- `TextSegment`

**Resolution**: Added proper type definitions for all missing types.

### 3. Export/Import Mismatches

**Status**: Fixed

**Description**: Several modules were importing exports that did not exist:
- `toSuperscript` was imported from `css-helpers.ts` but not exported
- `BLOCK_CLASSES` was imported from `usfm-styles.ts` but not exported

**Resolution**: Added the missing exports to the respective files.

### 4. LayoutEngine Property Name Mismatch

**Status**: Fixed

**Description**: The `LayoutEngine` expected `baseStyle` and `contextualRules` properties on `USFMStyleRule`, but the actual implementation uses `textStyle` and `paragraphStyle`.

**Resolution**: Updated `LayoutEngine` to use the correct property names (`textStyle`, `paragraphStyle`) and use the `getContextualStyles` helper function for contextual styling.

---

## Figma API Limitations

### 1. `baselineShift` Not Available

**Description**: Figma's TextNode API does not support `baselineShift` for creating true superscript/subscript text positioning. This is needed for verse number labels that should appear as superscript.

**Workaround**: The `toSuperscript()` function in `src/utils/css-helpers.ts` converts regular digits to Unicode superscript characters (e.g., `1` -> `U+00B9`). This provides a visual approximation of superscript text.

**Limitations**:
- Only digits 0-9 are converted
- Font must support Unicode superscript characters
- Line height may be affected

### 2. Negative `paragraphIndent` Not Supported

**Description**: Figma's TextNode does not support negative values for `paragraphIndent`. In CSS, poetry/quote elements use negative `text-indent` (e.g., `-2em`) combined with `padding-left` to create hanging indentation.

**Workaround**: Set `paragraphIndent` to `0` for elements that would have negative indent in CSS. The visual result differs from the CSS original but maintains readability.

**Files Affected**:
- `src/styles/usfm-styles.ts` (q, q1, q2, q3, q4 styles)

### 3. No CSS Margin Collapse

**Description**: Figma frames do not support CSS-style margin collapse. Adjacent frames with margins will not collapse like they would in CSS.

**Workaround**: Margins are converted to frame padding. Contextual style rules (`CONTEXTUAL_STYLES`) are used to apply margin overrides based on sibling relationships.

### 4. No List Markers

**Description**: Figma does not have built-in list marker support (`list-style-type: disc`).

**Workaround**: List items (li, li1, li2) are rendered as regular text with left margin. List markers would need to be added as separate text nodes if required.

---

## TODO Items for Future Improvement

### High Priority

1. **Move HTML parsing to web app**: Refactor the architecture so that HTML parsing happens in the iframe (web app) which has access to DOMParser. Send the parsed `ParsedNode` tree to the plugin via postMessage.

2. **Add red letter support**: The `wj` (Words of Jesus) class should apply red color to text. Currently the style is defined but color application is not implemented in `NodeBuilder`.

3. **Handle font fallbacks gracefully**: If Georgia font is not available, the fallback to Inter is handled but character-level styling may not be preserved.

### Medium Priority

4. **Add list markers**: Implement bullet point characters for list items (li, li1, li2).

5. **Improve hanging indent**: Explore using text frames with negative left margin (if possible) or other techniques to achieve CSS-like hanging indentation.

6. **Add chapter number styling**: Large drop-cap style chapter numbers are common in Bible formatting but not currently implemented.

### Low Priority

7. **Add footnote/reference support**: USFM has footnote markers that could be converted to Figma text links or annotations.

8. **Add poetry/quote visual indicators**: Consider adding left border or background shading for poetry blocks.

9. **Support more USFM classes**: Additional USFM markers like `r` (reference), `d` (description), `sp` (speaker) could be added.

---

## Build Errors Encountered and Fixed

| Error | File | Resolution |
|-------|------|------------|
| `ParsedNode` not exported | `adapter/types.ts` | Added interface definition |
| `FigmaStyle` not exported | `adapter/types.ts` | Added interface definition |
| `TextSegment` not exported | `adapter/types.ts` | Added interface definition |
| `toSuperscript` not exported | `utils/css-helpers.ts` | Added function implementation |
| `BLOCK_CLASSES` not exported | `styles/usfm-styles.ts` | Added Set definition |
| `baseStyle` not on USFMStyleRule | `adapter/layout-engine.ts` | Changed to use `textStyle`/`paragraphStyle` |
| `contextualRules` not on USFMStyleRule | `adapter/layout-engine.ts` | Changed to use `getContextualStyles()` |
| `DOMParser` not found | `adapter/parser.ts` | Added DOM lib to tsconfig (runtime issue remains) |
| `Element` not found | `adapter/parser.ts` | Added DOM lib to tsconfig |
| `Node` not found | `adapter/parser.ts` | Added DOM lib to tsconfig |
| Implicit `any` type | `adapter/layout-engine.ts` | Added explicit `ParsedNode` type annotation |
| `classList` returns `unknown[]` | `adapter/parser.ts` | Added explicit `string[]` type annotation |

---

## File Structure Overview

```
packages/plugin/src/
  adapter/
    index.ts          - Main DOMToFigmaAdapter class
    parser.ts         - HTMLParser (uses DOMParser - runtime issue)
    layout-engine.ts  - Applies USFM styles to parsed tree
    node-builder.ts   - Creates Figma nodes from styled tree
    types.ts          - Type definitions for the adapter
  styles/
    colors.ts         - Color definitions (RGB format)
    fonts.ts          - Font definitions and loading
    usfm-styles.ts    - USFM class to style mapping
  utils/
    css-helpers.ts    - em to px conversion, superscript
  code.ts             - Plugin entry point
```
