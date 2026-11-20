import { describe, expect, it } from 'vitest'
import { BADGES } from '../content/badges'
import { evaluateBadges, newlyEarned, nextBadges, remainingText, type BadgeInputs, type HabitBadgeInput } from './badges'

const habit = (over: Partial<HabitBadgeInput> = {}): HabitBadgeInput => ({
  id: 'smoke',
  name: '금연',
  emoji: '🚭',
  isSensitive: false,
  archived: false,
  currentStreakDays: 0,
  longestStreakDays: 0,
  cleanDays: 0,
  ...over,
})

const inputs = (over: Partial<BadgeInputs> = {}): BadgeInputs => ({
  recordStreak: { current: 0, longest: 0 },
  habits: [],
  sosWins: 0,
  journalCount: 0,
  totalSaved: 0,
  purchasedWishes: 0,
  dayNumber: 1,
  ...over,
})

const earnedKeys = (i: BadgeInputs) => evaluateBadges(i).filter((s) => s.earned).map((s) => s.key)

describe('배지 정의', () => {
  it('id 가 겹치지 않는다', () => {
    const ids = BADGES.map((b) => b.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
})

describe('evaluateBadges', () => {
  it('아무것도 없으면 받은 배지 없음', () => {
    expect(earnedKeys(inputs())).toEqual([])
  })

  it('기록 스트릭은 최장 기록 기준 (지금 끊겨도 자격 유지)', () => {
    const keys = earnedKeys(inputs({ recordStreak: { current: 1, longest: 8 } }))
    expect(keys).toEqual(expect.arrayContaining(['record-3', 'record-7']))
    expect(keys).not.toContain('record-14')
  })

  it('끊기 배지는 항목별로 따로', () => {
    const keys = earnedKeys(
      inputs({
        habits: [
          habit({ id: 'smoke', longestStreakDays: 7, currentStreakDays: 2 }),
          habit({ id: 'alcohol', name: '금주', longestStreakDays: 3, currentStreakDays: 3 }),
        ],
      }),
    )
    expect(keys).toEqual(expect.arrayContaining(['quit-7__smoke', 'quit-3__alcohol']))
    expect(keys).not.toContain('quit-7__alcohol')
  })

  it('항목 이름이 제목에 들어간다', () => {
    const status = evaluateBadges(inputs({ habits: [habit({ longestStreakDays: 30 })] })).find((s) => s.key === 'quit-30__smoke')
    expect(status?.title).toBe('금연 30일')
  })

  it('누적 배지는 실패가 있어도 누적 성공 일수로', () => {
    const keys = earnedKeys(inputs({ habits: [habit({ cleanDays: 31, longestStreakDays: 9 })] }))
    expect(keys).toContain('quitTotal-30__smoke')
    expect(keys).not.toContain('quit-30__smoke')
  })

  it('보관한 항목은 새로 판정하지 않는다', () => {
    const keys = earnedKeys(inputs({ habits: [habit({ archived: true, longestStreakDays: 30 })] }))
    expect(keys).toEqual([])
  })

  it('SOS, 일지, 아낀 돈, 특별 배지', () => {
    const keys = earnedKeys(inputs({ sosWins: 5, journalCount: 10, totalSaved: 120_000, purchasedWishes: 1, dayNumber: 100 }))
    expect(keys).toEqual(
      expect.arrayContaining(['sos-1', 'sos-5', 'journal-10', 'savings-100000', 'special-first-wish', 'special-day-100']),
    )
    expect(keys).not.toContain('special-day-365')
  })
})

describe('newlyEarned / nextBadges', () => {
  const statuses = evaluateBadges(
    inputs({
      recordStreak: { current: 5, longest: 5 },
      habits: [habit({ longestStreakDays: 28, currentStreakDays: 28, cleanDays: 28 })],
    }),
  )

  it('이미 받은 배지는 다시 주지 않는다', () => {
    const fresh = newlyEarned(statuses, new Set(['record-3', 'quit-1__smoke']))
    expect(fresh.map((s) => s.key)).not.toContain('record-3')
    expect(fresh.map((s) => s.key)).toContain('quit-14__smoke')
  })

  it('다음 배지는 그룹마다 가장 가까운 단계 하나, 진행률 높은 순 (같으면 정의 순서)', () => {
    const next = nextBadges(statuses, new Set())
    expect(next.map((s) => s.key)).toEqual(['quit-30__smoke', 'quitTotal-30__smoke', 'record-7'])
  })

  it('남은 양 문구', () => {
    const quit30 = statuses.find((s) => s.key === 'quit-30__smoke')!
    expect(remainingText(quit30)).toBe('2일 남음')
  })
})
