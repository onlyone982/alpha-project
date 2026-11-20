import { describe, expect, it } from 'vitest'
import { DEFAULT_SETTINGS, DEFAULT_STREAK, parseProfile } from './userProfile'

describe('parseProfile', () => {
  it('빈 문서는 기본값으로 채운다', () => {
    const profile = parseProfile({})
    expect(profile.startAt).toBeNull()
    expect(profile.motto).toBe('')
    expect(profile.settings).toEqual(DEFAULT_SETTINGS)
    expect(profile.streak).toEqual(DEFAULT_STREAK)
    expect(profile.issueCounter).toBe(0)
    expect(profile.levelSeen).toBeNull()
  })

  it('Timestamp 처럼 toDate()가 있는 값은 Date 로 바꾼다', () => {
    const date = new Date('2026-10-03T06:00:00+09:00')
    const profile = parseProfile({ startAt: { toDate: () => date } })
    expect(profile.startAt).toEqual(date)
  })

  it('일부 설정만 저장돼 있어도 나머지는 기본값', () => {
    const profile = parseProfile({ settings: { layout: { ml: 'calculator' } } })
    expect(profile.settings.layout).toEqual({ ml: 'calculator' })
    expect(profile.settings.privacyModeDefault).toBe(false)
  })
})
