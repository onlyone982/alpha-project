import { useMemo } from 'react'
import { addDaysToKey } from '../lib/date'
import { nextOrder, sortTodos, swapOrder, type Todo } from '../lib/todos'
import { markRecorded } from './activityRepo'
import { useCollection } from './hooks'
import { asBool, asNumber, asString, toDate, type DataStore, type StoredDoc } from './store'

export function parseTodo(doc: StoredDoc): Todo {
  return {
    id: doc.id,
    date: asString(doc.date),
    text: asString(doc.text),
    done: asBool(doc.done),
    doneAt: toDate(doc.doneAt),
    order: asNumber(doc.order),
    createdAt: toDate(doc.createdAt) ?? new Date(0),
  }
}

/** 특정 날짜의 할일 (순서대로) */
export function useTodos(dateKey: string): { todos: Todo[]; loading: boolean } {
  const { docs, loading } = useCollection('todos', { field: 'date', value: dateKey })
  const todos = useMemo(() => sortTodos(docs.map(parseTodo)), [docs])
  return { todos, loading }
}

export function addTodo(store: DataStore, dateKey: string, text: string, existing: readonly Todo[]) {
  return store.add('todos', {
    date: dateKey,
    text,
    done: false,
    doneAt: null,
    order: nextOrder(existing),
    createdAt: new Date(),
  })
}

/** 완료 체크. 완료하면 오늘을 '기록한 날'로 표시 */
export async function setTodoDone(store: DataStore, todo: Todo, done: boolean, now: Date) {
  await store.update(`todos/${todo.id}`, { done, doneAt: done ? now : null })
  if (done) await markRecorded(store, now)
}

export function editTodoText(store: DataStore, id: string, text: string) {
  return store.update(`todos/${id}`, { text })
}

export function removeTodo(store: DataStore, id: string) {
  return store.remove(`todos/${id}`)
}

export async function moveTodo(store: DataStore, sorted: readonly Todo[], id: string, direction: -1 | 1) {
  const swap = swapOrder(sorted, id, direction)
  if (!swap) return
  await Promise.all([
    store.update(`todos/${swap.a.id}`, { order: swap.a.order }),
    store.update(`todos/${swap.b.id}`, { order: swap.b.order }),
  ])
}

/** 전날 못 끝낸 할일을 오늘로 옮기기 */
export async function carryOverTodos(
  store: DataStore,
  unfinished: readonly Todo[],
  todayKey: string,
  todayTodos: readonly Todo[],
) {
  let order = nextOrder(todayTodos)
  await Promise.all(unfinished.map((t) => store.update(`todos/${t.id}`, { date: todayKey, order: order++ })))
}

export const yesterdayOf = (todayKey: string) => addDaysToKey(todayKey, -1)
