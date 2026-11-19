import { describe, expect, it } from 'vitest'
import { completionRate, nextOrder, sortTodos, swapOrder, type Todo } from './todos'

const todo = (id: string, order: number, done = false): Todo => ({
  id,
  date: '2026-11-20',
  text: id,
  done,
  doneAt: null,
  order,
  createdAt: new Date(0),
})

describe('todos', () => {
  it('정렬과 다음 순서값', () => {
    const list = [todo('b', 2), todo('a', 1)]
    expect(sortTodos(list).map((t) => t.id)).toEqual(['a', 'b'])
    expect(nextOrder(list)).toBe(3)
    expect(nextOrder([])).toBe(1)
  })

  it('한 칸 위로', () => {
    const sorted = [todo('a', 1), todo('b', 2), todo('c', 3)]
    expect(swapOrder(sorted, 'b', -1)).toEqual({ a: { id: 'b', order: 1 }, b: { id: 'a', order: 2 } })
  })

  it('맨 위에서 위로, 맨 아래에서 아래로는 불가', () => {
    const sorted = [todo('a', 1), todo('b', 2)]
    expect(swapOrder(sorted, 'a', -1)).toBeNull()
    expect(swapOrder(sorted, 'b', 1)).toBeNull()
  })

  it('순서값이 같아도 바뀐다', () => {
    const sorted = [todo('a', 5), todo('b', 5)]
    expect(swapOrder(sorted, 'a', 1)).toEqual({ a: { id: 'a', order: 1 }, b: { id: 'b', order: 0 } })
  })

  it('완료율', () => {
    expect(completionRate([todo('a', 1, true), todo('b', 2)])).toBe(0.5)
    expect(completionRate([])).toBe(0)
  })
})
