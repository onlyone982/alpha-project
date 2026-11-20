import { describe, expect, it } from 'vitest'
import { clearSlot, DEFAULT_LAYOUT, libraryIds, placeWidget, resolveLayout, SLOT_INFO, SLOTS } from './layout'

const ALL = ['home', 'library', 'today', 'quit', 'notes', 'video', 'style', 'tree', 'quote', 'calculator', 'diary', 'onedollar']

describe('layout', () => {
  it('저장값이 없으면 기본 배치', () => {
    expect(resolveLayout(null, ALL)).toEqual(DEFAULT_LAYOUT)
    expect(resolveLayout({}, ALL)).toEqual(DEFAULT_LAYOUT)
  })

  it('저장된 배치를 쓴다', () => {
    const saved = { ...DEFAULT_LAYOUT, ml: 'calculator' }
    expect(resolveLayout(saved, ALL).ml).toBe('calculator')
  })

  it('모르는 위젯, 중복, 고정 칸 침범은 무시', () => {
    const r = resolveLayout({ tl: 'nope', tr: 'quit', ml: 'quit', tc: 'notes', mc: 'library' }, ALL)
    expect(r.tc).toBe('home')
    expect(r.br).toBe('library')
    expect(r.tr).toBe('quit')
    expect(r.ml).not.toBe('quit')
    expect(r.mc).not.toBe('library')
    const placed = Object.values(r).filter(Boolean)
    expect(new Set(placed).size).toBe(placed.length)
  })

  it('비워둔 칸은 비워둔 채로 유지', () => {
    expect(resolveLayout({ ...DEFAULT_LAYOUT, ml: '' }, ALL).ml).toBe('')
  })

  it('라이브러리 위젯을 칸에 넣으면 원래 위젯은 라이브러리로', () => {
    const next = placeWidget(DEFAULT_LAYOUT, 'calculator', 'ml')
    expect(next.ml).toBe('calculator')
    expect(libraryIds(next, ALL)).toContain('notes')
    expect(libraryIds(next, ALL)).not.toContain('calculator')
  })

  it('화면에 있는 위젯끼리는 자리 바꾸기', () => {
    const next = placeWidget(DEFAULT_LAYOUT, 'notes', 'mc')
    expect(next.mc).toBe('notes')
    expect(next.ml).toBe('video')
  })

  it('고정 칸에는 넣을 수 없고, 고정 위젯은 옮길 수 없다', () => {
    expect(placeWidget(DEFAULT_LAYOUT, 'calculator', 'tc')).toEqual(DEFAULT_LAYOUT)
    expect(placeWidget(DEFAULT_LAYOUT, 'home', 'ml')).toEqual(DEFAULT_LAYOUT)
    expect(clearSlot(DEFAULT_LAYOUT, 'br')).toEqual(DEFAULT_LAYOUT)
  })

  it('칸 비우기', () => {
    const next = clearSlot(DEFAULT_LAYOUT, 'ml')
    expect(next.ml).toBe('')
    expect(libraryIds(next, ALL)).toContain('notes')
  })

  it('처음 라이브러리에는 계산기, 일기장, onedollar', () => {
    expect(libraryIds(DEFAULT_LAYOUT, ALL)).toEqual(['calculator', 'diary', 'onedollar'])
  })

  it('칸 위치와 모바일 순서가 겹치지 않는다', () => {
    expect(new Set(SLOTS.map((s) => `${SLOT_INFO[s].col}-${SLOT_INFO[s].row}`)).size).toBe(9)
    expect(new Set(SLOTS.map((s) => SLOT_INFO[s].mobileOrder)).size).toBe(9)
  })

  it('모바일 순서: 이번 주, DAY, 메모, List, YouTube(가로 전체), 나무, 스타일, 명언, 라이브러리', () => {
    const order = [...SLOTS].sort((a, b) => SLOT_INFO[a].mobileOrder - SLOT_INFO[b].mobileOrder).map((s) => DEFAULT_LAYOUT[s])
    expect(order).toEqual(['today', 'home', 'notes', 'quit', 'video', 'tree', 'style', 'quote', 'library'])
    expect(SLOTS.filter((s) => SLOT_INFO[s].mobileSpan === 2)).toEqual(['mc'])
  })
})
