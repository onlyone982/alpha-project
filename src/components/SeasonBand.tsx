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
    <div className="glow-soft mb-4 flex items-center justify-center gap-2 rounded-full border border-line px-4 py-2.5 text-center">
      <span aria-hidden>{season.emoji}</span>
      <span className="font-black uppercase tracking-[0.2em]">{season.name}</span>
      <span className="text-muted">·</span>
      <span className="truncate text-sm text-muted">{theme}</span>
    </div>
  )
}
