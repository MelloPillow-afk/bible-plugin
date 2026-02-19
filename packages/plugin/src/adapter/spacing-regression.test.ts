import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

import type { DOMNode } from '@shared/types'
import { DOMToFigmaAdapter } from './index'

interface SpacingFixture {
  versionId: number
  usfm: string
  domTree: DOMNode
}

interface MockSceneNode {
  type?: string
  characters?: string
  children?: MockSceneNode[]
}

function loadFixture(): SpacingFixture {
  const fixturePath = new URL('../../test/fixtures/jhn1-v111-50-51.fixture.json', import.meta.url)
  const raw = readFileSync(fixturePath, 'utf8')
  return JSON.parse(raw) as SpacingFixture
}

function collectText(node: MockSceneNode): string[] {
  if (node.type === 'TEXT' && typeof node.characters === 'string') {
    return [node.characters]
  }

  const children = node.children ?? []
  return children.flatMap(collectText)
}

describe('spacing regression - JHN.1 v111', () => {
  it('keeps spaces between adjacent words-of-jesus spans when building figma text', async () => {
    const fixture = loadFixture()
    const adapter = new DOMToFigmaAdapter()

    const nodes = (await adapter.convert(fixture.domTree)) as unknown as MockSceneNode[]
    const textOutput = nodes.flatMap(collectText).join('\n')

    expect(textOutput).toContain('believe because')
    expect(textOutput).toContain('you will')
    expect(textOutput).toContain('on’ the Son of Man.')
    expect(textOutput).not.toContain('believebecause')
    expect(textOutput).not.toContain('youwill')
    expect(textOutput).not.toContain('on’the')
  })
})
