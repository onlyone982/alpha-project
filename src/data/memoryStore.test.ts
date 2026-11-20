import { describe, expect, it } from 'vitest'
import { createMemoryStore } from './memoryStore'
import type { StoredDoc } from './store'

describe('memoryStore', () => {
  it('추가/수정/삭제가 구독자에게 전달된다', async () => {
    const store = createMemoryStore()
    let latest: StoredDoc[] = []
    const off = store.subscribeCollection('habits', (docs) => (latest = docs))

    const id = await store.add('habits', { name: '금연' })
    expect(latest).toEqual([{ id, name: '금연' }])

    await store.update(`habits/${id}`, { name: '금주' })
    expect(latest[0].name).toBe('금주')

    await store.remove(`habits/${id}`)
    expect(latest).toEqual([])
    off()
  })

  it('하위 컬렉션 문서는 상위 컬렉션 목록에 섞이지 않는다', async () => {
    const store = createMemoryStore()
    const id = await store.add('habits', { name: '금연' })
    await store.add(`habits/${id}/relapses`, { note: '' })
    let habits: StoredDoc[] = []
    store.subscribeCollection('habits', (docs) => (habits = docs))
    expect(habits).toHaveLength(1)
  })

  it('점(.) 경로로 중첩 필드만 수정', async () => {
    const store = createMemoryStore({ '': { settings: { theme: 'dark', hiddenWidgets: [] } } })
    await store.update('', { 'settings.theme': 'winter' })
    let doc: unknown
    store.subscribeDoc('', (data) => (doc = data))
    expect(doc).toEqual({ settings: { theme: 'winter', hiddenWidgets: [] } })
  })

  it('Date 값을 그대로 보존', async () => {
    const at = new Date('2026-11-01T00:00:00Z')
    const store = createMemoryStore()
    await store.add('x', { at })
    let docs: StoredDoc[] = []
    store.subscribeCollection('x', (d) => (docs = d))
    expect(docs[0].at).toEqual(at)
  })

  it('subscribeWhere 와 set(merge)', async () => {
    const store = createMemoryStore()
    await store.add('todos', { date: '2026-11-20', text: 'a' })
    await store.add('todos', { date: '2026-11-21', text: 'b' })
    let docs: StoredDoc[] = []
    store.subscribeWhere('todos', { field: 'date', value: '2026-11-20' }, (d) => (docs = d))
    expect(docs.map((d) => d.text)).toEqual(['a'])

    await store.set('journal/2026-11-20', { text: '좋은 날', mood: 4 })
    await store.set('journal/2026-11-20', { mood: 5 })
    let journal: unknown
    store.subscribeDoc('journal/2026-11-20', (d) => (journal = d))
    expect(journal).toEqual({ text: '좋은 날', mood: 5 })
  })

  it('set(merge)은 안쪽 객체까지 합친다 (Firestore 와 같게)', async () => {
    const store = createMemoryStore()
    await store.set('meta/tips', { seen: { a: true }, hidden: ['x'] })
    await store.set('meta/tips', { seen: { b: true }, hidden: ['y'] })
    let doc: unknown
    store.subscribeDoc('meta/tips', (d) => (doc = d))
    expect(doc).toEqual({ seen: { a: true, b: true }, hidden: ['y'] })
  })
})
