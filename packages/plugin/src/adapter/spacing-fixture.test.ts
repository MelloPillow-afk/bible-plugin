import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

import type { DOMNode } from '@shared/types'

interface SpacingFixture {
  source: {
    endpoint: string
    reference: string
    capturedAt: string
  }
  versionId: number
  usfm: string
  notes: string
  domTree: DOMNode
}

function loadFixture(): SpacingFixture {
  const fixturePath = new URL('../../test/fixtures/jhn1-v111-50-51.fixture.json', import.meta.url)
  const raw = readFileSync(fixturePath, 'utf8')
  return JSON.parse(raw) as SpacingFixture
}

function flattenText(node: DOMNode): string {
  if (node.tagName === null) {
    return node.textContent
  }

  if (node.children.length === 0) {
    return node.textContent
  }

  return node.children.map(flattenText).join('')
}

describe('spacing fixture sanity', () => {
  it('loads the focused JHN.1 fixture and preserves merged-word boundaries from current parser output', () => {
    const fixture = loadFixture()
    const text = flattenText(fixture.domTree)

    expect(fixture.versionId).toBe(111)
    expect(fixture.usfm).toBe('JHN.1')
    expect(fixture.source.endpoint).toContain('/v1/bibles/111/passages/JHN.1')

    expect(text).toContain('believebecause')
    expect(text).toContain('youwill')
    expect(text).toContain('on’the')
  })
})
