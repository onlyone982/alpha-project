import { useState } from 'react'
import { ui } from '../../components/ui'
import { emptyTodos } from '../../content/memes'
import { useStore } from '../../data/DataStoreContext'
import {
  addTodo,
  carryOverTodos,
  editTodoText,
  moveTodo,
  removeTodo,
  setTodoDone,
  useTodos,
  yesterdayOf,
} from '../../data/todosRepo'
import type { Todo } from '../../lib/todos'

/** 날짜별 할일 목록. isToday 면 '어제 남은 할일 가져오기'를 보여줍니다. */
export function TodoList({ dateKey, isToday, compact = false }: { dateKey: string; isToday: boolean; compact?: boolean }) {
  const store = useStore()
  const { todos, loading } = useTodos(dateKey)
  const [text, setText] = useState('')

  if (!store) return null

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    const value = text.trim()
    if (!value || !store) return
    setText('')
    await addTodo(store, dateKey, value, todos)
  }

  const doneCount = todos.filter((t) => t.done).length

  return (
    <div className="flex flex-col gap-2">
      {isToday && <CarryOver todayKey={dateKey} todayTodos={todos} />}

      {!loading && todos.length === 0 && <p className="text-sm text-muted">{emptyTodos}</p>}

      <ul className="flex flex-col">
        {todos.map((todo, index) => (
          <TodoRow
            key={todo.id}
            todo={todo}
            compact={compact}
            canUp={index > 0}
            canDown={index < todos.length - 1}
            onToggle={(done) => setTodoDone(store, todo, done, new Date())}
            onMove={(dir) => moveTodo(store, todos, todo.id, dir)}
            onEdit={(value) => editTodoText(store, todo.id, value)}
            onRemove={() => removeTodo(store, todo.id)}
          />
        ))}
      </ul>

      <form onSubmit={handleAdd} className="flex gap-2 @max-3xs:flex-col">
        <input
          className={ui.input}
          value={text}
          placeholder="+ 할일 추가"
          aria-label="새 할일"
          onChange={(e) => setText(e.target.value)}
        />
        <button type="submit" className={ui.button} disabled={!text.trim()}>
          추가
        </button>
      </form>

      {todos.length > 0 && (
        <p className="text-xs text-muted tabular-nums">
          {doneCount}/{todos.length} 완료
        </p>
      )}
    </div>
  )
}

function TodoRow({
  todo,
  compact,
  canUp,
  canDown,
  onToggle,
  onMove,
  onEdit,
  onRemove,
}: {
  todo: Todo
  compact: boolean
  canUp: boolean
  canDown: boolean
  onToggle: (done: boolean) => void
  onMove: (direction: -1 | 1) => void
  onEdit: (text: string) => void
  onRemove: () => void
}) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(todo.text)

  return (
    <li className="group flex items-center gap-2 rounded-lg px-1 py-1 hover:bg-surface-2">
      <input
        type="checkbox"
        className="size-4 shrink-0 accent-[var(--arc-accent)]"
        checked={todo.done}
        aria-label={`${todo.text} 완료`}
        onChange={(e) => onToggle(e.target.checked)}
      />
      {editing ? (
        <form
          className="flex flex-1 gap-1"
          onSubmit={(e) => {
            e.preventDefault()
            if (draft.trim()) onEdit(draft.trim())
            setEditing(false)
          }}
        >
          <input className={ui.input + ' py-1'} value={draft} autoFocus onChange={(e) => setDraft(e.target.value)} />
          <button type="submit" className="text-xs text-accent">
            저장
          </button>
        </form>
      ) : (
        <span className={`flex-1 text-sm ${todo.done ? 'text-muted line-through' : ''}`}>{todo.text}</span>
      )}
      {!editing && (
        <span
          className={`flex shrink-0 items-center gap-0.5 text-xs text-muted ${
            // 메인 칸에서는 마우스를 올렸을 때만. 터치 화면(모바일)에선 안 보이는 버튼을 잘못 누르지 않게 아예 숨김 → 전체 보기에서 편집
            compact ? 'opacity-0 group-hover:opacity-100 focus-within:opacity-100 max-lg:hidden' : ''
          }`}
        >
          <IconButton label="위로" disabled={!canUp} onClick={() => onMove(-1)}>
            ↑
          </IconButton>
          <IconButton label="아래로" disabled={!canDown} onClick={() => onMove(1)}>
            ↓
          </IconButton>
          <IconButton
            label="수정"
            onClick={() => {
              setDraft(todo.text)
              setEditing(true)
            }}
          >
            ✎
          </IconButton>
          <IconButton label="삭제" onClick={onRemove}>
            ✕
          </IconButton>
        </span>
      )}
    </li>
  )
}

function IconButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string
  disabled?: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      className="rounded px-1.5 py-0.5 hover:bg-bg hover:text-text disabled:opacity-30"
    >
      {children}
    </button>
  )
}

/** 어제 못 끝낸 할일을 오늘로 가져오기 (자동으로 옮기지 않음) */
function CarryOver({ todayKey, todayTodos }: { todayKey: string; todayTodos: Todo[] }) {
  const store = useStore()
  const { todos } = useTodos(yesterdayOf(todayKey))
  const unfinished = todos.filter((t) => !t.done)
  if (!store || unfinished.length === 0) return null

  return (
    <button
      type="button"
      className="self-start text-left rounded-lg border border-dashed border-line px-2.5 py-1 text-xs text-muted hover:border-accent hover:text-text"
      onClick={() => carryOverTodos(store, unfinished, todayKey, todayTodos)}
    >
      ↪ 어제 남은 할일 {unfinished.length}개 가져오기
    </button>
  )
}
