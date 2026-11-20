import { describe, expect, it } from 'vitest'
import { recentDistinct } from './suggest'

describe('recentDistinct', () => {
  it('최근 순, 중복·빈 값 제거', () => {
    expect(
      recentDistinct([
        { value: '르라보 상탈 33', at: 1 },
        { value: '딥티크 탐다오', at: 3 },
        { value: ' 르라보 상탈 33 ', at: 5 },
        { value: '', at: 9 },
      ]),
    ).toEqual(['르라보 상탈 33', '딥티크 탐다오'])
  })

  it('개수 제한', () => {
    expect(recentDistinct([{ value: 'a', at: 1 }, { value: 'b', at: 2 }], 1)).toEqual(['b'])
  })
})
