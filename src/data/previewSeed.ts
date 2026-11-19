import { DEFAULT_SETTINGS, DEFAULT_STREAK } from '../lib/userProfile'
import type { DocData } from './store'

const DAY = 24 * 60 * 60 * 1000

/** 미리보기 모드에서 보여줄 예시 데이터 */
export function createPreviewSeed(now: Date): Record<string, DocData> {
  const ago = (days: number, hours = 0) => new Date(now.getTime() - days * DAY - hours * 3_600_000)
  return {
    '': {
      startAt: ago(46, 5),
      motto: '',
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
    'wishlist/w1': { name: '향수 (우디 계열)', price: 250000, url: '', purchasedAt: null, createdAt: ago(10) },
    'wishlist/w2': { name: '러닝화', price: 129000, url: '', purchasedAt: null, createdAt: ago(9) },
  }
}
