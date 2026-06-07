import { useState, type FormEvent } from 'react'
import { ApiError, api } from '../../lib/api'
import { endpoints } from '../../lib/endpoints'
import type { AdminLevel } from '../../types/levels'
import SubmitButton from '../ui/SubmitButton'

// LevelForm creates or edits a level. `level === null` means create. Server-side
// validation (order_index positivity/uniqueness, required fields) is
// authoritative and surfaced via the error banner; the form keeps only light
// client checks. On success it calls onSaved (the page reloads the list).
// Which tools a level unlocks is set on the tool side now (see ToolForm).

const fieldClass =
  'w-full rounded-md border border-border bg-surface-2/70 px-3.5 py-2.5 font-mono text-sm text-fg placeholder:text-fg-subtle transition-[border-color,box-shadow] focus:border-accent focus:shadow-[0_0_0_3px_rgba(52,245,160,0.12)] focus:outline-none'
const labelClass = 'mb-1.5 block font-mono text-xs uppercase tracking-[0.15em] text-fg-muted'

export default function LevelForm({
  level,
  onSaved,
  onCancel,
}: {
  level: AdminLevel | null
  onSaved: () => void
  onCancel: () => void
}) {
  const editing = level !== null
  const [orderIndex, setOrderIndex] = useState(level ? String(level.order_index) : '')
  const [title, setTitle] = useState(level?.title ?? '')
  const [description, setDescription] = useState(level?.description ?? '')
  const [flag, setFlag] = useState(level?.flag ?? '')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    const body = {
      order_index: Number(orderIndex),
      title,
      description,
      flag,
    }
    try {
      if (editing) await api.put(endpoints.adminLevel(level.id), body)
      else await api.post(endpoints.adminLevels, body)
      onSaved()
    } catch (err) {
      setSubmitting(false)
      setError(err instanceof ApiError ? err.message : 'Could not save the level.')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-bold tracking-tight text-fg">
          {editing ? 'edit level' : 'new level'}
        </h2>
        <button
          type="button"
          onClick={onCancel}
          className="font-mono text-sm text-fg-muted transition-colors hover:text-fg"
        >
          ← cancel
        </button>
      </div>

      <div className="grid grid-cols-[8rem_1fr] gap-4">
        <div>
          <label htmlFor="order_index" className={labelClass}>
            order
          </label>
          <input
            id="order_index"
            type="number"
            min={1}
            value={orderIndex}
            onChange={(e) => setOrderIndex(e.target.value)}
            className={`${fieldClass} tabular-nums`}
            required
          />
        </div>
        <div>
          <label htmlFor="title" className={labelClass}>
            title
          </label>
          <input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={fieldClass}
            required
          />
        </div>
      </div>

      <div>
        <label htmlFor="description" className={labelClass}>
          description
        </label>
        <textarea
          id="description"
          rows={6}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={`${fieldClass} resize-y leading-relaxed`}
          required
        />
      </div>

      <div>
        <label htmlFor="flag" className={labelClass}>
          flag
        </label>
        <input
          id="flag"
          value={flag}
          onChange={(e) => setFlag(e.target.value)}
          className={`${fieldClass} text-warning`}
          required
        />
      </div>

      {error && (
        <p
          role="alert"
          className="rounded-md border border-danger/30 bg-danger/10 px-3 py-2 font-mono text-sm text-danger"
        >
          <span className="text-danger/70">! </span>
          {error}
        </p>
      )}

      <SubmitButton loading={submitting}>
        {submitting ? 'saving…' : editing ? 'save changes' : 'create level'}
      </SubmitButton>
    </form>
  )
}
