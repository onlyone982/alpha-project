import { LEVELS, type Level } from '../content/levels'

export type LevelInfo = {
  level: Level
  /** LEVELS 안에서의 순서 (0 = 첫 레벨). 화면에는 안 보이고 레벨업 판단에만 씀 */
  index: number
  next: Level | null
  daysToNext: number | null
}

/** 연속 기록일 → 레벨 */
export function levelFor(streakDays: number, levels: readonly Level[] = LEVELS): LevelInfo {
  const days = Math.max(0, streakDays)
  let index = 0
  for (let i = 0; i < levels.length; i++) if (days >= levels[i].minDays) index = i
  const next = levels[index + 1] ?? null
  return { level: levels[index], index, next, daysToNext: next ? next.minDays - days : null }
}

export type LevelCheck = { ok: true } | { ok: false; reason: string }

/** 설정에서 레벨을 고칠 때 검사: 이름 필수, 첫 레벨 0일, 일수는 점점 커져야 함 */
export function checkLevels(levels: readonly Level[]): LevelCheck {
  if (levels.length === 0) return { ok: false, reason: '레벨이 하나 이상 있어야 해요.' }
  if (levels.some((l) => !l.name.trim())) return { ok: false, reason: '레벨 이름을 모두 적어주세요.' }
  if (levels[0].minDays !== 0) return { ok: false, reason: '첫 레벨은 0일부터 시작해야 해요.' }
  for (let i = 1; i < levels.length; i++) {
    if (!(levels[i].minDays > levels[i - 1].minDays)) return { ok: false, reason: '아래 레벨일수록 일수가 커야 해요.' }
  }
  return { ok: true }
}

/** 저장된 레벨 목록이 쓸 만하면 그것, 아니면 기본 레벨 */
export function resolveLevels(saved: unknown): Level[] {
  if (!Array.isArray(saved)) return LEVELS
  const levels = saved
    .filter((l): l is Level => !!l && typeof l.name === 'string' && typeof l.minDays === 'number')
    .map((l) => ({ name: l.name, minDays: l.minDays }))
  return checkLevels(levels).ok ? levels : LEVELS
}
