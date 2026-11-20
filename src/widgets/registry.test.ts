import { describe, expect, it } from 'vitest'
import { DEFAULT_LAYOUT, FIXED, libraryIds } from '../lib/layout'
import { WIDGETS } from './registry'

describe('위젯 레지스트리', () => {
  const ids = WIDGETS.map((w) => w.id)

  it('id 가 겹치지 않는다', () => {
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('기본 배치와 고정 칸의 위젯이 모두 등록돼 있다', () => {
    for (const id of [...Object.values(DEFAULT_LAYOUT), ...Object.values(FIXED)]) expect(ids).toContain(id)
  })

  it('좌측 상단은 이번 주 요약, 가운데 위는 LV·Day, 우측 하단은 라이브러리', () => {
    expect(DEFAULT_LAYOUT.tl).toBe('today')
    expect(DEFAULT_LAYOUT.tc).toBe('home')
    expect(DEFAULT_LAYOUT.br).toBe('library')
  })

  it('처음 라이브러리: 계산기, 일기장, One Dollar Drive', () => {
    expect(libraryIds(DEFAULT_LAYOUT, ids)).toEqual(['calculator', 'diary', 'onedollar'])
  })
})
