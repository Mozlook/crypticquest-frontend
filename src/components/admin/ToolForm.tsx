import { useState, type FormEvent } from 'react'
import { ApiError, api } from '../../lib/api'
import { endpoints } from '../../lib/endpoints'
import type { AdminLevel } from '../../types/levels'
import type { AdminTool, ToolType } from '../../types/tools'
import SubmitButton from '../ui/SubmitButton'

// ToolForm creates or edits a tool. `tool === null` means create. The meaning of
// `content` depends on type (URL / file path / builtin id), hinted inline. The
// "unlocks at level" selector sets which level's solve grants this tool (a level
// can grant many tools). The type whitelist, required fields, length caps and the
// level reference are enforced server-side and surfaced via the error banner.

const fieldClass =
  'w-full rounded-md border border-border bg-surface-2/70 px-3.5 py-2.5 font-mono text-sm text-fg placeholder:text-fg-subtle transition-[border-color,box-shadow] focus:border-accent focus:shadow-[0_0_0_3px_rgba(52,245,160,0.12)] focus:outline-none'
const labelClass = 'mb-1.5 block font-mono text-xs uppercase tracking-[0.15em] text-fg-muted'

const TYPES: ToolType[] = ['link', 'pdf', 'builtin']

export default function ToolForm({
  tool,
  levels,
  onSaved,
  onCancel,
}: {
  tool: AdminTool | null
  levels: AdminLevel[]
  onSaved: () => void
  onCancel: () => void
}) {
  const editing = tool !== null
  const [type, setType] = useState<ToolType>(tool?.type ?? 'link')
  const [title, setTitle] = useState(tool?.title ?? '')
  const [description, setDescription] = useState(tool?.description ?? '')
  const [content, setContent] = useState(tool?.content ?? '')
  const [unlocksAtLevelId, setUnlocksAtLevelId] = useState(
    tool?.unlocks_at_level_id != null ? String(tool.unlocks_at_level_id) : '',
  )
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const contentHint =
    type === 'link'
      ? 'external URL, e.g. https://gchq.github.io/CyberChef/'
      : type === 'pdf'
        ? 'file path under files/tools/, e.g. ascii-table.pdf'
        : 'identifier of the in-app built-in tool'

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    const body = {
      type,
      title,
      description,
      content,
      unlocks_at_level_id: unlocksAtLevelId === '' ? null : Number(unlocksAtLevelId),
    }
    try {
      if (editing) await api.put(endpoints.adminTool(tool.id), body)
      else await api.post(endpoints.adminTools, body)
      onSaved()
    } catch (err) {
      setSubmitting(false)
      setError(err instanceof ApiError ? err.message : 'Could not save the tool.')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-bold tracking-tight text-fg">
          {editing ? 'edit tool' : 'new tool'}
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
          <label htmlFor="type" className={labelClass}>
            type
          </label>
          <select
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value as ToolType)}
            className={fieldClass}
          >
            {TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
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
        <label htmlFor="content" className={labelClass}>
          content
        </label>
        <input
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className={fieldClass}
          required
        />
        <p className="mt-1.5 font-mono text-xs text-fg-subtle">{contentHint}</p>
      </div>

      <div>
        <label htmlFor="description" className={labelClass}>
          description <span className="text-fg-subtle">(optional)</span>
        </label>
        <textarea
          id="description"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={`${fieldClass} resize-y leading-relaxed`}
        />
      </div>

      <div>
        <label htmlFor="unlocks_at_level_id" className={labelClass}>
          unlocks at level
        </label>
        <select
          id="unlocks_at_level_id"
          value={unlocksAtLevelId}
          onChange={(e) => setUnlocksAtLevelId(e.target.value)}
          className={fieldClass}
        >
          <option value="">— not tied to a level —</option>
          {levels.map((level) => (
            <option key={level.id} value={level.id}>
              {level.order_index}. {level.title}
            </option>
          ))}
        </select>
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
        {submitting ? 'saving…' : editing ? 'save changes' : 'create tool'}
      </SubmitButton>
    </form>
  )
}
