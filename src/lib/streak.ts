import { addDaysToKey } from './date'

/** 프리즈 규칙 (바꾸고 싶으면 여기만 수정) */
export const STREAK_RULES = {
  /** N일 연속 기록할 때마다 프리즈 1개 */
  freezeEvery: 7,
  /** 최대 보유 개수 */
  maxFreezes: 2,
}

export type StreakResult = {
  /** 현재 연속 기록일 (오늘 기록했으면 오늘 포함) */
  current: number
  longest: number
  /** 지금 가지고 있는 프리즈 */
  freezes: number
  /** 프리즈로 넘긴 날 */
  frozenDays: Set<string>
  todayRecorded: boolean
}

/**
 * '기록한 날' 목록으로 스트릭을 처음부터 다시 계산합니다.
 * 기록한 날은 지워지지 않으므로 몇 번을 계산해도 결과가 같습니다. (프리즈 사용 내역도 매번 똑같이 재현됨)
 *
 * 규칙
 * - 기록한 날: 연속 +1. 연속이 freezeEvery 의 배수가 될 때마다 프리즈 +1 (최대 maxFreezes)
 * - 기록 안 한 날(어제까지): 연속 중이고 프리즈가 있으면 1개 써서 연속 유지(일수는 늘지 않음), 없으면 연속 0
 * - 오늘: 아직 안 끝났으므로 기록 안 했어도 끊기지 않음
 */
export function computeStreak(recordedDays: ReadonlySet<string>, todayKey: string): StreakResult {
  const frozenDays = new Set<string>()
  const pastDays = [...recordedDays].filter((key) => key < todayKey).sort()
  let run = 0
  let longest = 0
  let freezes = 0

  const record = () => {
    run += 1
    longest = Math.max(longest, run)
    if (run % STREAK_RULES.freezeEvery === 0) freezes = Math.min(STREAK_RULES.maxFreezes, freezes + 1)
  }

  if (pastDays.length > 0) {
    for (let day = pastDays[0]; day < todayKey; day = addDaysToKey(day, 1)) {
      if (recordedDays.has(day)) {
        record()
      } else if (run > 0 && freezes > 0) {
        freezes -= 1
        frozenDays.add(day)
      } else {
        run = 0
      }
    }
  }

  const todayRecorded = recordedDays.has(todayKey)
  if (todayRecorded) record()

  return { current: run, longest, freezes, frozenDays, todayRecorded }
}
