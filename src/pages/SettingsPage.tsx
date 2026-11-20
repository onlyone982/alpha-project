import { useState } from 'react'
import { Link } from 'react-router'
import { ui } from '../components/ui'
import { LEVELS, type Level } from '../content/levels'
import { exportAll } from '../data/backup'
import { useStore } from '../data/DataStoreContext'
import { saveLevels, savePrivacyDefault, saveSeasonTheme } from '../data/profileRepo'
import { useLevels } from '../hooks/useLevels'
import { useToday } from '../hooks/useToday'
import { useUserProfile } from '../hooks/useUserProfile'
import { checkLevels } from '../lib/levels'
import { nextSeason, seasonFor, seasonTheme, type Season } from '../lib/season'

/** 설정: 시즌 주제, 레벨, 프라이버시 기본값, 데이터 백업 */
export function SettingsPage() {
  const { profile, loading } = useUserProfile()
  const levels = useLevels()
  const todayKey = useToday()

  if (loading || !profile) return <Shell><p className="text-muted">불러오는 중…</p></Shell>

  const current = seasonFor(todayKey)
  const next = nextSeason(current)
  const themes = profile.settings.seasonThemes

  return (
    <Shell>
      <Section title="🏁 시즌 챌린지 주제" note="웹 맨 위 시즌 띠에 나와요. 비워두면 기본 주제.">
        <SeasonThemeForm key={`${current.id}:${themes[current.id] ?? ''}`} season={current} label="지금 시즌" initial={seasonTheme(current, themes)} />
        <SeasonThemeForm key={`${next.id}:${themes[next.id] ?? ''}`} season={next} label="다음 시즌" initial={seasonTheme(next, themes)} />
      </Section>

      <Section title="⬆️ 레벨" note="연속 기록일 기준. 화면에는 'LV: 이름'만 나와요.">
        <LevelsForm key={JSON.stringify(levels)} initial={levels} isCustom={profile.settings.levels !== null} />
      </Section>

      <Section title="🙈 프라이버시">
        <PrivacyDefault initial={profile.settings.privacyModeDefault} />
      </Section>

      <Section title="💾 데이터 백업" note="내 기록 전체를 파일(JSON)로 내려받아요. 사진은 아직 없어서 글자 기록만 들어가요.">
        <BackupButton />
      </Section>
    </Shell>
  )
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-6 px-4 py-6 sm:px-6">
      <Link to="/" className="text-sm text-muted hover:text-text">
        ← 홈으로
      </Link>
      <h1 className="text-2xl font-bold">⚙ 설정</h1>
      {children}
    </main>
  )
}

function Section({ title, note, children }: { title: string; note?: string; children: React.ReactNode }) {
  return (
    <section className={`${ui.card} flex flex-col gap-3`}>
      <div>
        <h2 className="font-semibold">{title}</h2>
        {note && <p className="mt-0.5 text-xs text-muted">{note}</p>}
      </div>
      {children}
    </section>
  )
}

const period = (s: Season) => `${s.start.slice(5).replace('-', '.')} ~ ${s.end.slice(5).replace('-', '.')}`

function SeasonThemeForm({ season, label, initial }: { season: Season; label: string; initial: string }) {
  const store = useStore()
  const [theme, setTheme] = useState(initial)
  const [saving, setSaving] = useState(false)
  const changed = theme.trim() !== initial

  return (
    <form
      className="flex flex-col gap-1"
      onSubmit={async (e) => {
        e.preventDefault()
        if (!store) return
        setSaving(true)
        await saveSeasonTheme(store, season.id, theme.trim())
        setSaving(false)
      }}
    >
      <span className={ui.label}>
        {label}: {season.emoji} {season.name} ({season.id.slice(0, 4)}년 {period(season)})
      </span>
      <div className="flex gap-2">
        <input className={ui.input} value={theme} maxLength={60} placeholder={season.defaultTheme} onChange={(e) => setTheme(e.target.value)} />
        <button type="submit" className={ui.buttonPrimary} disabled={!changed || saving}>
          {changed ? '저장' : '저장됨'}
        </button>
      </div>
    </form>
  )
}

function LevelsForm({ initial, isCustom }: { initial: Level[]; isCustom: boolean }) {
  const store = useStore()
  const [rows, setRows] = useState(() => initial.map((l) => ({ name: l.name, minDays: String(l.minDays) })))
  const [saving, setSaving] = useState(false)
  const parsed: Level[] = rows.map((r, i) => ({ name: r.name.trim(), minDays: i === 0 ? 0 : Number(r.minDays) }))
  const check = checkLevels(parsed.map((l) => ({ ...l, minDays: Number.isFinite(l.minDays) ? l.minDays : NaN })))
  const changed = JSON.stringify(parsed) !== JSON.stringify(initial)

  const update = (i: number, patch: Partial<{ name: string; minDays: string }>) =>
    setRows(rows.map((r, j) => (j === i ? { ...r, ...patch } : r)))

  return (
    <div className="flex flex-col gap-2">
      {rows.map((row, i) => (
        <div key={i} className="grid grid-cols-[auto_1fr_6rem_auto] items-center gap-2">
          <span className="w-10 text-xs text-muted">LV:</span>
          <input className={ui.input} value={row.name} aria-label={`${i + 1}번째 레벨 이름`} onChange={(e) => update(i, { name: e.target.value })} />
          <label className="flex items-center gap-1 text-xs text-muted">
            <input
              type="number"
              inputMode="numeric"
              min={0}
              className={ui.input + ' px-2'}
              value={i === 0 ? '0' : row.minDays}
              disabled={i === 0}
              aria-label={`${i + 1}번째 레벨 시작 일수`}
              onChange={(e) => update(i, { minDays: e.target.value })}
            />
            일
          </label>
          <button
            type="button"
            className="px-2 text-muted hover:text-danger disabled:opacity-30"
            disabled={rows.length <= 1 || i === 0}
            aria-label={`${row.name} 레벨 삭제`}
            onClick={() => setRows(rows.filter((_, j) => j !== i))}
          >
            ✕
          </button>
        </div>
      ))}
      {!check.ok && <p className="text-xs text-danger">{check.reason}</p>}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className={ui.button}
          onClick={() => setRows([...rows, { name: '', minDays: String((parsed[parsed.length - 1]?.minDays || 0) + 100) }])}
        >
          + 레벨 추가
        </button>
        <button
          type="button"
          className={ui.button}
          disabled={!isCustom && !changed}
          onClick={async () => {
            if (store) await saveLevels(store, null)
            setRows(LEVELS.map((l) => ({ name: l.name, minDays: String(l.minDays) })))
          }}
        >
          기본값으로
        </button>
        <button
          type="button"
          className={`${ui.buttonPrimary} ml-auto`}
          disabled={!check.ok || !changed || saving}
          onClick={async () => {
            if (!store) return
            setSaving(true)
            await saveLevels(store, parsed)
            setSaving(false)
          }}
        >
          {changed ? '저장' : '저장됨'}
        </button>
      </div>
    </div>
  )
}

function PrivacyDefault({ initial }: { initial: boolean }) {
  const store = useStore()
  return (
    <label className="flex items-center gap-2 text-sm">
      <input type="checkbox" defaultChecked={initial} onChange={(e) => store && savePrivacyDefault(store, e.target.checked)} />
      접속할 때마다 민감 항목을 가린 상태로 시작
    </label>
  )
}

function BackupButton() {
  const store = useStore()
  const [state, setState] = useState<'idle' | 'working' | 'done' | 'error'>('idle')

  async function download() {
    if (!store) return
    setState('working')
    try {
      const json = await exportAll(store)
      const url = URL.createObjectURL(new Blob([json], { type: 'application/json' }))
      const a = document.createElement('a')
      a.href = url
      a.download = `arc-backup-${new Date().toISOString().slice(0, 10)}.json`
      a.click()
      URL.revokeObjectURL(url)
      setState('done')
    } catch (error) {
      console.error(error)
      setState('error')
    }
  }

  return (
    <div className="flex items-center gap-3">
      <button type="button" className={ui.button} onClick={download} disabled={state === 'working'}>
        {state === 'working' ? '모으는 중…' : '⬇ 백업 파일 받기'}
      </button>
      {state === 'done' && <span className="text-xs text-muted">받았어요.</span>}
      {state === 'error' && <span className="text-xs text-danger">백업을 만들지 못했어요. 다시 시도해주세요.</span>}
    </div>
  )
}
