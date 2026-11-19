import { DEFAULT_SETTINGS, DEFAULT_STREAK } from '../lib/userProfile'
import { toDayKey } from '../lib/date'
import type { DocData } from './store'

const DAY = 24 * 60 * 60 * 1000

/** 미리보기 모드에서 보여줄 예시 데이터 */
export function createPreviewSeed(now: Date): Record<string, DocData> {
  const ago = (days: number, hours = 0) => new Date(now.getTime() - days * DAY - hours * 3_600_000)
  const dayKey = (daysAgo: number) => toDayKey(ago(daysAgo))
  return {
    '': {
      startAt: ago(46, 5),
      motto: '조용히 하고, 결과로 말하자.',
      settings: { ...DEFAULT_SETTINGS },
      streak: { ...DEFAULT_STREAK },
      issueCounter: 0,
    },
    'habits/smoke': {
      name: '금연',
      emoji: '🚭',
      startAt: ago(12, 3),
      dailyCost: 4500,
      dailyMinutes: 40,
      reason: '계단 올라갈 때 숨 차는 거 지겨움. 폐 돌려받자.',
      isSensitive: false,
      archived: false,
      createdAt: ago(12, 3),
    },
    'habits/smoke/relapses/r1': { at: ago(4, 6), note: '회식 2차' },
    'habits/alcohol': {
      name: '금주',
      emoji: '🍺',
      startAt: ago(20, 1),
      dailyCost: 12000,
      dailyMinutes: 90,
      reason: '다음 날 아침을 통째로 날리는 게 아까움.',
      isSensitive: false,
      archived: false,
      createdAt: ago(20, 1),
    },
    'habits/dopamine': {
      name: '도파민 디톡스',
      emoji: '🧠',
      startAt: ago(5, 8),
      dailyCost: 0,
      dailyMinutes: 60,
      reason: '내 시간과 집중력을 내가 쓰고 싶어서.',
      isSensitive: true,
      archived: false,
      createdAt: ago(5, 8),
    },
    ...activitySeed(now),
    [`todos/t1`]: { date: dayKey(1), text: '헬스장 등록 알아보기', done: false, doneAt: null, order: 1, createdAt: ago(1) },
    [`todos/t2`]: { date: dayKey(1), text: '책 20쪽', done: true, doneAt: ago(1), order: 2, createdAt: ago(1) },
    [`todos/t3`]: { date: dayKey(0), text: '물 2L 마시기', done: false, doneAt: null, order: 1, createdAt: now },
    [`journal/${dayKey(1)}`]: { text: '회의 길었지만 운동은 함. 칭찬해.', mood: 4, updatedAt: ago(1) },
    'videos/v1': { youtubeId: 'dQw4w9WgXcQ', title: 'Never Gonna Give You Up (포기 안 함)', pinned: false, forSos: true, createdAt: ago(3) },
    'notes/n1': { text: '헬스장 6시 오픈. 알람 5:40', color: 'yellow', pinned: true, updatedAt: ago(1) },
    'notes/n2': { text: '단백질 쉐이크 주문하기', color: 'mint', pinned: false, updatedAt: ago(0, 2) },
    'notes/n3': { text: '이번 달 목표: 금주 30일 + 러닝 10회', color: 'pink', pinned: false, updatedAt: ago(2) },
    'quotes/q1': { text: '오늘 걷지 않으면 내일은 뛰어야 한다.', author: '어딘가에서 들은 말', createdAt: ago(5) },
    'wishlist/w1': { name: '향수 (우디 계열)', price: 250000, url: '', purchasedAt: null, createdAt: ago(10) },
    'wishlist/w2': { name: '러닝화', price: 129000, url: '', purchasedAt: null, createdAt: ago(9) },
  }
}

/** 예시 기록: 16~9일 전 8일 연속(프리즈 1개 획득) → 8일 전 빠짐(프리즈 사용) → 7~1일 전 연속 */
function activitySeed(now: Date): Record<string, DocData> {
  const seed: Record<string, DocData> = {}
  for (let daysAgo = 16; daysAgo >= 1; daysAgo--) {
    if (daysAgo === 8) continue
    const at = new Date(now.getTime() - daysAgo * DAY)
    seed[`activityDays/${toDayKey(at)}`] = { recorded: true, lastAt: at }
  }
  return seed
}
