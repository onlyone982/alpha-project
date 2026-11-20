import { describe, expect, it } from 'vitest'
import { calculate } from './calculator'

describe('calculate', () => {
  it.each([
    ['1+2', 3],
    ['2+3×4', 14],
    ['(2+3)×4', 20],
    ['10÷4', 2.5],
    ['−5+2', -3],
    ['0.1+0.2', 0.3],
    ['4500×30', 135000],
    ['2-(-3)', 5],
  ])('%s = %d', (expr, value) => {
    expect(calculate(expr)).toBe(value)
  })

  it.each(['', '1+', '(1+2', '5÷0', 'abc', '1++2*'])('잘못된 수식 %s → null', (expr) => {
    expect(calculate(expr)).toBeNull()
  })
})
