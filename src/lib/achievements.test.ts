import { describe, expect, it } from 'vitest'
import { recentAchievements } from './achievements'

const kst = (s: string) => new Date(`${s}+09:00`)

describe('recentAchievements', () => {
  it('끊기 단계 달성 (최근 7일 안)', () => {
    const list = recentAchievements({
      todayKey: '2026-11-20',
      habits: [{ id: 'a', name: '금주', emoji: '🍺', isSensitive: false, since: kst('2026-10-20T10:00:00'), currentStreakDays: 31 }],
      recordStreak: { current: 0, todayRecorded: false },
    })
    expect(list).toEqual([{ key: 'quit:a:30', text: '🍺 금주 30일 달성!', dayKey: '2026-11-19', sensitive: false }])
  })

  it('7일보다 오래된 달성은 빠진다', () => {
    const list = recentAchievements({
      todayKey: '2026-11-20',
      habits: [{ id: 'a', name: '금주', emoji: '🍺', isSensitive: false, since: kst('2026-10-01T10:00:00'), currentStreakDays: 50 }],
      recordStreak: { current: 0, todayRecorded: false },
    })
    // 50일 달성일 = 11/20 → 포함 (30일 달성은 더 높은 단계에 가려짐)
    expect(list.map((a) => a.text)).toEqual(['🍺 금주 50일 달성!'])
  })

  it('기록 스트릭과 레벨', () => {
    const list = recentAchievements({
      todayKey: '2026-11-20',
      habits: [],
      recordStreak: { current: 15, todayRecorded: true },
    })
    // 오늘이 15일째 → 14일째는 어제
    expect(list).toEqual([
      { key: 'streak:14', text: '🔥 14일 연속 기록 달성!', dayKey: '2026-11-19', sensitive: false },
      { key: 'level:NPC', text: '⬆️ LV: NPC 달성!', dayKey: '2026-11-19', sensitive: false },
    ])
  })

  it('민감 항목 표시', () => {
    const list = recentAchievements({
      todayKey: '2026-11-20',
      habits: [{ id: 'd', name: '도파민 디톡스', emoji: '🧠', isSensitive: true, since: kst('2026-11-17T08:00:00'), currentStreakDays: 3 }],
      recordStreak: { current: 0, todayRecorded: false },
    })
    expect(list[0].sensitive).toBe(true)
  })
})
