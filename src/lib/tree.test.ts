import { describe, expect, it } from 'vitest'
import { treeState } from './tree'

describe('treeState', () => {
  it('처음엔 씨앗, 시들지 않음', () => {
    expect(treeState(new Set(), '2026-11-20')).toMatchObject({ stage: { key: 'seed' }, wilted: false, wateredToday: false, daysToNext: 1 })
  })

  it('물 준 날 수로 자람', () => {
    const watered = new Set(['2026-11-14', '2026-11-15', '2026-11-16', '2026-11-18', '2026-11-19', '2026-11-20', '2026-11-12'])
    expect(treeState(watered, '2026-11-20')).toMatchObject({ stage: { key: 'small' }, wateredDays: 7, wateredToday: true })
  })

  it('2일 넘게 안 주면 시듦, 물 주면 회복 (자란 건 그대로)', () => {
    const watered = new Set(['2026-11-15', '2026-11-16', '2026-11-17'])
    expect(treeState(watered, '2026-11-19').wilted).toBe(false)
    expect(treeState(watered, '2026-11-20').wilted).toBe(true)
    const after = treeState(new Set([...watered, '2026-11-20']), '2026-11-20')
    expect(after.wilted).toBe(false)
    expect(after.stage.key).toBe('sapling')
  })
})
