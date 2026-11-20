import { useMemo } from 'react'
import { recentDistinct } from '../lib/suggest'
import { markRecorded } from './activityRepo'
import { useCollection, useDoc } from './hooks'
import { asString, toDate } from './store'
import type { DataStore } from './store'

/** 날짜별 스타일 기록 칸 */
export const STYLE_FIELDS = [
  { key: 'accessories', label: '액세서리', searchable: true },
  { key: 'perfume', label: '향수', searchable: true },
  { key: 'hair', label: '헤어', searchable: false },
  { key: 'cosmetics', label: '화장품', searchable: true },
  { key: 'etc', label: 'etc', searchable: false },
] as const

export type StyleKey = (typeof STYLE_FIELDS)[number]['key']
export type StyleLog = Record<StyleKey, string>

const EMPTY: StyleLog = { accessories: '', perfume: '', hair: '', cosmetics: '', etc: '' }

export function useStyleLog(dateKey: string): { log: StyleLog; loading: boolean; exists: boolean } {
  const { data, loading } = useDoc(`styleLogs/${dateKey}`)
  if (!data) return { log: EMPTY, loading, exists: false }
  const log = Object.fromEntries(STYLE_FIELDS.map((f) => [f.key, asString(data[f.key])])) as StyleLog
  return { log, loading, exists: true }
}

/** 저장. 하나라도 적혀 있으면 오늘을 '기록한 날'로 표시 (착장 기록과 같은 규칙) */
export async function saveStyleLog(store: DataStore, dateKey: string, log: StyleLog, now: Date) {
  const trimmed = Object.fromEntries(Object.entries(log).map(([k, v]) => [k, v.trim()])) as StyleLog
  await store.set(`styleLogs/${dateKey}`, { ...trimmed, updatedAt: now })
  if (Object.values(trimmed).some(Boolean)) await markRecorded(store, now)
}

/** 검색 바로가기 */
export const searchLinks = (query: string) => [
  { label: 'N쇼핑', title: '네이버쇼핑에서 검색', url: `https://search.shopping.naver.com/search/all?query=${encodeURIComponent(query)}` },
  { label: 'G', title: '구글에서 검색', url: `https://www.google.com/search?q=${encodeURIComponent(query)}` },
]

/** 칸별 자동완성 목록 (예전에 적은 값, 최근 순) */
export function useStyleSuggestions(): Record<StyleKey, string[]> {
  const { docs } = useCollection('styleLogs')
  return useMemo(() => {
    const at = (d: (typeof docs)[number]) => toDate(d.updatedAt)?.getTime() ?? 0
    return Object.fromEntries(
      STYLE_FIELDS.map((f) => [f.key, recentDistinct(docs.map((d) => ({ value: asString(d[f.key]), at: at(d) })))]),
    ) as Record<StyleKey, string[]>
  }, [docs])
}
