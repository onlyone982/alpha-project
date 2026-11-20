import { describe, expect, it } from 'vitest'
import { TREE_STAGES } from '../lib/tree'
import { TREE_ART, TREE_COLORS } from './treeArt'

describe('나무 그림', () => {
  it.each(TREE_STAGES.map((s) => s.key))('%s: 16×16, 정의된 색만 사용', (key) => {
    const art = TREE_ART[key]
    expect(art).toHaveLength(16)
    for (const row of art) {
      expect(row).toHaveLength(16)
      for (const ch of row) if (ch !== '.') expect(TREE_COLORS[ch]).toBeDefined()
    }
  })
})
