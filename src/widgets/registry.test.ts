import { describe, expect, it } from 'vitest'
import { visibleWidgets, WIDGETS } from './registry'

describe('위젯 레지스트리', () => {
  it('id 가 겹치지 않는다', () => {
    const ids = WIDGETS.map((w) => w.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('PC 그리드 위치가 겹치지 않는다', () => {
    const cells = WIDGETS.map((w) => `${w.desktop.col}-${w.desktop.row}`)
    expect(new Set(cells).size).toBe(cells.length)
  })

  it('모바일 순서가 겹치지 않는다', () => {
    const orders = WIDGETS.map((w) => w.mobileOrder)
    expect(new Set(orders).size).toBe(orders.length)
  })

  it('모바일 순서는 명세대로: 할일 → 끊기 → 명언 → 영상 → 착장 → 운동 → 주간지 → 배지 → 메모', () => {
    const order = [...WIDGETS].sort((a, b) => a.mobileOrder - b.mobileOrder).map((w) => w.id)
    expect(order).toEqual(['today', 'quit', 'quote', 'video', 'outfit', 'workout', 'weekly', 'badges', 'notes'])
  })

  it('좌측 상단은 자동 주간지', () => {
    expect(WIDGETS.find((w) => w.desktop.col === 1 && w.desktop.row === 1)?.id).toBe('weekly')
  })

  it('숨긴 위젯은 빠진다', () => {
    const ids = visibleWidgets(['notes', 'weekly']).map((w) => w.id)
    expect(ids).not.toContain('notes')
    expect(ids).not.toContain('weekly')
    expect(ids).toHaveLength(WIDGETS.length - 2)
  })
})
