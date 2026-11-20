import { SEASONS, type SeasonType } from '../content/seasons'

export type Season = {
  /** 예: '2026-winter' (설정에서 주제를 저장할 때 쓰는 키) */
  id: string
  type: SeasonType
  name: string
  emoji: string
  /** 시작·끝 날짜 키 (끝 날짜 포함) */
  start: string
  end: string
  defaultTheme: string
}

const pad = (n: number) => String(n).padStart(2, '0')

/** 날짜 키(YYYY-MM-DD)가 속한 시즌 */
export function seasonFor(dayKey: string): Season {
  const [year, month] = dayKey.split('-').map(Number)
  const type = (Object.keys(SEASONS) as SeasonType[]).find((t) => SEASONS[t].months.includes(month))!
  const info = SEASONS[type]
  const first = info.months[0]
  const last = info.months[info.months.length - 1]
  const lastDay = new Date(Date.UTC(year, last, 0)).getUTCDate()
  return {
    id: `${year}-${type}`,
    type,
    name: info.name,
    emoji: info.emoji,
    start: `${year}-${pad(first)}-01`,
    end: `${year}-${pad(last)}-${pad(lastDay)}`,
    defaultTheme: info.defaultTheme,
  }
}

/** 다음 시즌 */
export function nextSeason(season: Season): Season {
  const [y, m, d] = season.end.split('-').map(Number)
  const next = new Date(Date.UTC(y, m - 1, d + 1)).toISOString().slice(0, 10)
  return seasonFor(next)
}

/** 저장된 주제가 있으면 그것, 없으면 기본 주제 */
export function seasonTheme(season: Season, themes: Readonly<Record<string, string>> | undefined): string {
  const custom = themes?.[season.id]?.trim()
  return custom || season.defaultTheme
}
