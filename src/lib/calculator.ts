/**
 * 계산기용 수식 계산 (+ − × ÷, 괄호, 소수, 음수). eval 을 쓰지 않습니다.
 * 잘못된 수식이면 null.
 */
export function calculate(expression: string): number | null {
  const tokens = tokenize(expression.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-'))
  if (!tokens) return null
  let pos = 0

  const peek = () => tokens[pos]
  const parseExpr = (): number | null => {
    let left = parseTerm()
    while (left !== null && (peek() === '+' || peek() === '-')) {
      const op = tokens[pos++]
      const right = parseTerm()
      if (right === null) return null
      left = op === '+' ? left + right : left - right
    }
    return left
  }
  const parseTerm = (): number | null => {
    let left = parseFactor()
    while (left !== null && (peek() === '*' || peek() === '/')) {
      const op = tokens[pos++]
      const right = parseFactor()
      if (right === null) return null
      if (op === '/' && right === 0) return null
      left = op === '*' ? left * right : left / right
    }
    return left
  }
  const parseFactor = (): number | null => {
    const token = tokens[pos++]
    if (token === '-') {
      const v = parseFactor()
      return v === null ? null : -v
    }
    if (token === '(') {
      const v = parseExpr()
      if (tokens[pos++] !== ')') return null
      return v
    }
    if (token !== undefined && /^\d*\.?\d+$|^\d+\.$/.test(token)) return Number(token)
    return null
  }

  const result = parseExpr()
  if (result === null || pos !== tokens.length || !Number.isFinite(result)) return null
  // 0.1 + 0.2 같은 부동소수점 오차 정리
  return Math.round(result * 1e10) / 1e10
}

function tokenize(input: string): string[] | null {
  const tokens: string[] = []
  const re = /\s*(\d*\.?\d+|\d+\.|[+\-*/()])/y
  let index = 0
  const trimmed = input.trim()
  while (index < trimmed.length) {
    re.lastIndex = index
    const m = re.exec(trimmed)
    if (!m) return null
    tokens.push(m[1])
    index = re.lastIndex
  }
  return tokens
}
