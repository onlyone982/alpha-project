import type { DataStore, DocData, StoredDoc } from './store'

/** 미리보기 모드용 메모리 저장소. 새로고침하면 사라집니다. */
export function createMemoryStore(seed: Record<string, DocData> = {}): DataStore {
  const docs = new Map<string, DocData>(Object.entries(seed).map(([k, v]) => [k, structuredClone(v)]))
  const listeners = new Set<() => void>()
  let counter = 0

  const notify = () => listeners.forEach((listener) => listener())
  const listen = (fn: () => void) => {
    listeners.add(fn)
    fn()
    return () => {
      listeners.delete(fn)
    }
  }

  const childrenOf = (collectionPath: string): StoredDoc[] => {
    const prefix = `${collectionPath}/`
    const result: StoredDoc[] = []
    for (const [path, data] of docs) {
      if (path.startsWith(prefix) && !path.slice(prefix.length).includes('/')) {
        result.push({ ...structuredClone(data), id: path.slice(prefix.length) })
      }
    }
    return result
  }

  return {
    subscribeDoc(docPath, onChange) {
      return listen(() => {
        const data = docs.get(docPath)
        onChange(data ? structuredClone(data) : null)
      })
    },
    subscribeCollection(collectionPath, onChange) {
      return listen(() => onChange(childrenOf(collectionPath)))
    },
    subscribeWhere(collectionPath, where, onChange) {
      return listen(() => onChange(childrenOf(collectionPath).filter((d) => d[where.field] === where.value)))
    },
    async add(collectionPath, data) {
      const id = `mem${++counter}`
      docs.set(`${collectionPath}/${id}`, structuredClone(data))
      notify()
      return id
    },
    async update(docPath, data) {
      const current = structuredClone(docs.get(docPath) ?? {})
      for (const [key, value] of Object.entries(data)) setIn(current, key.split('.'), value)
      docs.set(docPath, current)
      notify()
    },
    async remove(docPath) {
      docs.delete(docPath)
      notify()
    },
    async set(docPath, data) {
      docs.set(docPath, { ...(docs.get(docPath) ?? {}), ...structuredClone(data) })
      notify()
    },
  }
}

function setIn(target: DocData, keys: string[], value: unknown) {
  let node = target
  for (const key of keys.slice(0, -1)) {
    if (typeof node[key] !== 'object' || node[key] === null) node[key] = {}
    node = node[key] as DocData
  }
  node[keys[keys.length - 1]] = structuredClone(value)
}
