export type Todo = {
  id: string
  /** 할일이 속한 날 (YYYY-MM-DD) */
  date: string
  text: string
  done: boolean
  doneAt: Date | null
  order: number
  createdAt: Date
}

export function sortTodos(todos: readonly Todo[]): Todo[] {
  return [...todos].sort((a, b) => a.order - b.order || a.createdAt.getTime() - b.createdAt.getTime())
}

/** 새 할일을 맨 아래에 놓을 순서값 */
export function nextOrder(todos: readonly Todo[]): number {
  return todos.reduce((max, t) => Math.max(max, t.order), 0) + 1
}

/** 위/아래로 한 칸 옮길 때 서로 바꿀 두 항목의 새 순서값. 못 옮기면 null */
export function swapOrder(
  sorted: readonly Todo[],
  id: string,
  direction: -1 | 1,
): { a: { id: string; order: number }; b: { id: string; order: number } } | null {
  const index = sorted.findIndex((t) => t.id === id)
  const target = index + direction
  if (index < 0 || target < 0 || target >= sorted.length) return null
  const current = sorted[index]
  const other = sorted[target]
  // 순서값이 같으면 위치 기준으로 다시 매김
  const currentOrder = current.order === other.order ? index : current.order
  const otherOrder = current.order === other.order ? target : other.order
  return { a: { id: current.id, order: otherOrder }, b: { id: other.id, order: currentOrder } }
}

export function completionRate(todos: readonly Todo[]): number {
  if (todos.length === 0) return 0
  return todos.filter((t) => t.done).length / todos.length
}
