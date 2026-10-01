import { useState } from 'react'
import { useStore } from '../data/store'

// 目標（「英検2級に合格する」など）。作業中もタイマーの下に表示される。
export function GoalEditor() {
  const { record, setGoal } = useStore()
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState('')

  const open = () => {
    setDraft(record.goal)
    setEditing(true)
  }

  const commit = (value) => {
    setGoal(value)
    setEditing(false)
  }

  if (editing) {
    return (
      <form
        className="goal-form"
        onSubmit={(event) => {
          event.preventDefault()
          commit(draft)
        }}
      >
        <label className="label" htmlFor="goal-input">
          目標
        </label>
        <input
          id="goal-input"
          className="text-input"
          value={draft}
          maxLength={80}
          placeholder="例：英検2級に合格する"
          autoFocus
          enterKeyHint="done"
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Escape') setEditing(false)
          }}
        />
        <div className="goal-form-actions">
          {record.goal && (
            <button type="button" className="btn btn-quiet btn-small" onClick={() => commit('')}>
              目標を消す
            </button>
          )}
          <button type="button" className="btn btn-quiet btn-small" onClick={() => setEditing(false)}>
            キャンセル
          </button>
          <button type="submit" className="btn btn-primary btn-small">
            保存
          </button>
        </div>
      </form>
    )
  }

  return (
    <button type="button" className={`goal${record.goal ? '' : ' is-empty'}`} onClick={open}>
      <span className="label">目標</span>
      <span className="goal-text">{record.goal || 'まだ決めていません'}</span>
      <span className="goal-action">{record.goal ? '編集' : '決める'}</span>
    </button>
  )
}
