import { useState } from 'react'
import { calculate } from '../lib/calculator'

const KEYS = ['C', '(', ')', '÷', '7', '8', '9', '×', '4', '5', '6', '−', '1', '2', '3', '+', '0', '.', '⌫', '=']

/** 계산기 */
export function CalculatorWidget() {
  const [expr, setExpr] = useState('')
  const [result, setResult] = useState<string | null>(null)
  const preview = expr ? calculate(expr) : null

  function press(key: string) {
    if (key === 'C') {
      setExpr('')
      setResult(null)
    } else if (key === '⌫') {
      setExpr((e) => e.slice(0, -1))
      setResult(null)
    } else if (key === '=') {
      const value = calculate(expr)
      setResult(value === null ? '오류' : format(value))
      if (value !== null) setExpr(String(value))
    } else {
      setExpr((e) => (result !== null && /[0-9.]/.test(key) ? key : e + key))
      setResult(null)
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-64 flex-col gap-2">
      <div className="border border-line px-3 py-2 text-right" aria-live="polite">
        <p className="min-h-5 truncate text-xs text-muted tabular-nums">{expr || ' '}</p>
        <p className="truncate text-2xl font-bold tabular-nums">{result ?? (preview !== null ? format(preview) : '0')}</p>
      </div>
      <div className="grid grid-cols-4 gap-px border border-line bg-line">
        {KEYS.map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => press(key)}
            className={`bg-bg py-2.5 text-base tabular-nums transition-colors hover:bg-surface-2 ${
              key === '=' ? 'text-accent font-bold' : /[÷×−+()]/.test(key) ? 'text-accent' : ''
            }`}
          >
            {key}
          </button>
        ))}
      </div>
    </div>
  )
}

const format = (n: number) => n.toLocaleString('ko-KR', { maximumFractionDigits: 10 })
