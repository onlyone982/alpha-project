import { useMemo } from 'react'
import type { Level } from '../content/levels'
import { resolveLevels } from '../lib/levels'
import { useUserProfile } from './useUserProfile'

/** 지금 쓰는 레벨 목록 (설정에서 바꿨으면 그것, 아니면 기본) */
export function useLevels(): Level[] {
  const { profile } = useUserProfile()
  const saved = profile?.settings.levels
  return useMemo(() => resolveLevels(saved), [saved])
}
