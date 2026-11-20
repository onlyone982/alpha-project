import { useMemo } from 'react'
import { useStore } from '../data/DataStoreContext'
import { saveLayout } from '../data/profileRepo'
import { resolveLayout, type Layout } from '../lib/layout'
import { WIDGETS } from '../widgets/registry'
import { useUserProfile } from './useUserProfile'

/** 지금 칸 배치 + 저장 */
export function useLayout(): { layout: Layout; save: (layout: Layout) => Promise<void> | undefined } {
  const store = useStore()
  const { profile } = useUserProfile()
  const saved = profile?.settings.layout
  const layout = useMemo(() => resolveLayout(saved, WIDGETS.map((w) => w.id)), [saved])
  return { layout, save: (next) => (store ? saveLayout(store, next) : undefined) }
}
