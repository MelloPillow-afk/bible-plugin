- Figma does not support negative paragraph indent. We will rely on designers to add the indentations themselves then.
  To make the format look correct for now, we will have the padding left be the padding left + the paragraph indent.

Example:
```typescript
  /**
   * Poetry/Quote Level 2 (q2)
   * CSS: padding-left: 2em; text-indent: -1em; margin-bottom: calc(var(--yv-reader-font-size) * 0.3);
   * Note: text-indent is negative, so we use 0 for Figma
   */
  q2: {
    isBlock: true,
    description: 'Poetry line level 2',
    textStyle: {
      lineHeight: createLineHeight(1.625),
    },
    paragraphStyle: {
      paddingLeft: emToPx(1),
      paragraphIndent: 0,
      marginBottom: calcEmToPx(0.3),
    },
  },
```
