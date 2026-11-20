import { Link } from 'react-router'
import { useUserProfile } from '../hooks/useUserProfile'
import { useToday } from '../hooks/useToday'
import { seasonFor, seasonTheme } from '../lib/season'

/** 웹 최상단 시즌 띠: ❄️ WINTER ARC · 주제 */
export function SeasonBand() {
  const todayKey = useToday()
  const { profile } = useUserProfile()
  const season = seasonFor(todayKey)
  const theme = seasonTheme(season, profile?.settings.seasonThemes)

  return (
    <div className="glow-soft mb-4 flex items-center justify-between gap-2 rounded-full border border-line px-4 py-2.5 lg:justify-center">
      <p className="flex min-w-0 items-center gap-2" title={theme}>
        <span aria-hidden>{season.emoji}</span>
        <span className="whitespace-nowrap font-black uppercase tracking-[0.2em]">{season.name}</span>
        <span className="text-muted max-lg:hidden">·</span>
        <span className="truncate text-sm text-muted max-lg:hidden">{theme}</span>
      </p>
      {/* 모바일: 설정은 오른쪽 위 */}
      <Link to="/settings" aria-label="설정" className="shrink-0 rounded-full px-2 py-0.5 text-lg text-muted hover:text-text lg:hidden">
        ⚙
      </Link>
    </div>
  )
}
