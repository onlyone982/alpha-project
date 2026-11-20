import type { Layout } from '../lib/layout'
import type { DataStore } from './store'

export function saveLayout(store: DataStore, layout: Layout) {
  return store.update('', { 'settings.layout': layout })
}

export function saveLevelSeen(store: DataStore, index: number) {
  return store.update('', { levelSeen: index })
}

/**
 * 예전 배지 데이터 지우기 (배지 기능을 없애면서 한 번만 실행).
 * 지울 게 없으면 아무것도 하지 않습니다.
 */
export function removeLegacyBadges(store: DataStore): Promise<void> {
  return new Promise((resolve) => {
    let done = false
    const off = store.subscribeCollection(
      'badges',
      (docs) => {
        if (done) return
        done = true
        queueMicrotask(() => off())
        Promise.all(docs.map((d) => store.remove(`badges/${d.id}`)))
          .catch((error) => console.error('예전 배지 데이터를 지우지 못했어요', error))
          .finally(resolve)
      },
      () => resolve(),
    )
  })
}

export function saveLevels(store: DataStore, levels: { name: string; minDays: number }[] | null) {
  return store.update('', { 'settings.levels': levels })
}

export function saveSeasonTheme(store: DataStore, seasonId: string, theme: string) {
  return store.update('', { [`settings.seasonThemes.${seasonId}`]: theme })
}

export function savePrivacyDefault(store: DataStore, value: boolean) {
  return store.update('', { 'settings.privacyModeDefault': value })
}
