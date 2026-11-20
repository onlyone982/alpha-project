import { useState } from 'react'
import { DateNav } from '../components/DateNav'
import { ui } from '../components/ui'
import { useStore } from '../data/DataStoreContext'
import { saveStyleLog, searchLinks, STYLE_FIELDS, useStyleLog, type StyleLog } from '../data/styleRepo'
import { useToday } from '../hooks/useToday'

/** 오른쪽 가운데: <날짜> 액세서리 · 향수 · 헤어 · 화장품 · etc */
export function StyleWidget() {
  const todayKey = useToday()
  const [dateKey, setDateKey] = useState(todayKey)
  const { log, loading } = useStyleLog(dateKey)

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-center">
        <DateNav dateKey={dateKey} todayKey={todayKey} onChange={setDateKey} />
      </div>
      {loading ? (
        <p className="text-sm text-muted">불러오는 중…</p>
      ) : (
        <StyleForm key={`${dateKey}:${JSON.stringify(log)}`} dateKey={dateKey} initial={log} />
      )}
    </div>
  )
}

function StyleForm({ dateKey, initial }: { dateKey: string; initial: StyleLog }) {
  const store = useStore()
  const [log, setLog] = useState(initial)
  const [saving, setSaving] = useState(false)
  const changed = STYLE_FIELDS.some((f) => log[f.key].trim() !== initial[f.key])

  return (
    <form
      className="flex flex-col gap-2"
      onSubmit={async (e) => {
        e.preventDefault()
        if (!store) return
        setSaving(true)
        await saveStyleLog(store, dateKey, log, new Date())
        setSaving(false)
      }}
    >
      {STYLE_FIELDS.map((field) => {
        const value = log[field.key]
        return (
          <div key={field.key} className="grid grid-cols-[4.5rem_1fr] items-center gap-2">
            <label htmlFor={`style-${field.key}`} className="text-sm text-muted">
              {field.label}:
            </label>
            <div className="flex items-center gap-1">
              <input
                id={`style-${field.key}`}
                className={ui.input + ' py-1.5'}
                value={value}
                onChange={(e) => setLog({ ...log, [field.key]: e.target.value })}
              />
              {field.searchable &&
                value.trim() &&
                searchLinks(value.trim()).map((link) => (
                  <a
                    key={link.label}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    title={link.title}
                    className="shrink-0 whitespace-nowrap border border-line px-1.5 py-1 text-[11px] text-muted hover:border-accent hover:text-text"
                  >
                    {link.label}
                  </a>
                ))}
            </div>
          </div>
        )
      })}
      <button type="submit" className={`${ui.buttonPrimary} self-end`} disabled={!changed || saving}>
        {changed ? '저장' : '저장됨'}
      </button>
    </form>
  )
}
