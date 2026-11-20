import { BADGES, CATEGORY_INFO, type BadgeDef } from '../content/badges'

export type HabitBadgeInput = {
  id: string
  name: string
  emoji: string
  isSensitive: boolean
  archived: boolean
  currentStreakDays: number
  longestStreakDays: number
  cleanDays: number
}

/** 배지 판정에 필요한 값 */
export type BadgeInputs = {
  recordStreak: { current: number; longest: number }
  habits: HabitBadgeInput[]
  sosWins: number
  journalCount: number
  totalSaved: number
  purchasedWishes: number
  dayNumber: number
}

export type BadgeStatus = {
  /** 저장 키: 공통 배지는 def.id, 항목별 배지는 `${def.id}__${habitId}` */
  key: string
  def: BadgeDef
  habit: HabitBadgeInput | null
  /** 화면에 보일 이름 ({habit} 치환됨) */
  title: string
  earned: boolean
  /** 진행률 표시용 현재 값 (예: 현재 연속 일수) */
  current: number
  target: number
}

export const badgeKey = (defId: string, habitId?: string | null) => (habitId ? `${defId}__${habitId}` : defId)

/**
 * 모든 배지의 현재 상태.
 * - 받을 자격(earned)은 "한 번이라도 도달한 값"으로 판정합니다. (최장 기록 등 → 실패해도 자격이 사라지지 않음)
 * - 진행률(current)은 지금 값으로 보여줍니다. (예: 금연 30일까지 남은 일수는 현재 연속 기준)
 * - 보관한 끊기 항목은 이미 받은 배지 표시용으로만 포함되고, 새로 판정되지는 않습니다.
 */
export function evaluateBadges(input: BadgeInputs): BadgeStatus[] {
  const result: BadgeStatus[] = []

  for (const def of BADGES) {
    if (CATEGORY_INFO[def.category].perHabit) {
      for (const habit of input.habits) {
        const reached = def.category === 'quit' ? habit.longestStreakDays : habit.cleanDays
        const current = def.category === 'quit' ? habit.currentStreakDays : habit.cleanDays
        result.push({
          key: badgeKey(def.id, habit.id),
          def,
          habit,
          title: def.title.replace('{habit}', habit.name),
          earned: !habit.archived && reached >= def.threshold,
          current,
          target: def.threshold,
        })
      }
      continue
    }

    const [reached, current] = valuesFor(def, input)
    result.push({
      key: badgeKey(def.id),
      def,
      habit: null,
      title: def.title,
      earned: reached >= def.threshold,
      current,
      target: def.threshold,
    })
  }

  return result
}

function valuesFor(def: BadgeDef, input: BadgeInputs): [reached: number, current: number] {
  switch (def.category) {
    case 'record':
      return [input.recordStreak.longest, input.recordStreak.current]
    case 'sos':
      return [input.sosWins, input.sosWins]
    case 'journal':
      return [input.journalCount, input.journalCount]
    case 'savings':
      return [input.totalSaved, input.totalSaved]
    case 'special':
      if (def.id === 'special-first-wish') return [input.purchasedWishes, input.purchasedWishes]
      return [input.dayNumber, input.dayNumber]
    default:
      return [0, 0]
  }
}

/** 새로 받아야 할 배지 (자격이 있는데 아직 저장 안 된 것) */
export function newlyEarned(statuses: readonly BadgeStatus[], earnedKeys: ReadonlySet<string>): BadgeStatus[] {
  return statuses.filter((s) => s.earned && !earnedKeys.has(s.key))
}

/**
 * 다음에 받을 배지들: 아직 안 받은 것 중 카테고리(항목별이면 항목)마다 가장 낮은 단계 하나씩,
 * 진행률이 높은 순.
 */
export function nextBadges(statuses: readonly BadgeStatus[], earnedKeys: ReadonlySet<string>, limit = 3): BadgeStatus[] {
  const firstLocked = new Map<string, BadgeStatus>()
  for (const s of statuses) {
    if (earnedKeys.has(s.key) || s.earned || s.habit?.archived) continue
    const group = `${s.def.category}:${s.habit?.id ?? ''}`
    const prev = firstLocked.get(group)
    if (!prev || s.target < prev.target) firstLocked.set(group, s)
  }
  return [...firstLocked.values()]
    .sort((a, b) => b.current / b.target - a.current / a.target || a.target - a.current - (b.target - b.current))
    .slice(0, limit)
}

/** '금연 30일까지 3일' 같은 남은 양 문구 */
export function remainingText(status: BadgeStatus): string {
  const left = Math.max(0, status.target - status.current)
  const unit = CATEGORY_INFO[status.def.category].unit
  if (status.def.category === 'savings') return `${left.toLocaleString('ko-KR')}원 남음`
  if (status.def.id.startsWith('special-day')) return `${left}일 남음`
  if (status.def.id === 'special-first-wish') return '위시 하나 사면 획득'
  return `${left}${unit} 남음`
}
