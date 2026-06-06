import { useState } from 'react'
import { ApiError } from '../../lib/api'
import type { Tool } from '../../types/tools'

// AdminToolRow is one row of the admin tools table with edit/delete. Delete is a
// two-step inline confirm; a tool still unlocked by a level can't be deleted
// (409), so the backend's "tool in use" message is shown verbatim.
export default function AdminToolRow({
  tool,
  onEdit,
  onDelete,
}: {
  tool: Tool
  onEdit: () => void
  onDelete: () => Promise<void>
}) {
  const [confirming, setConfirming] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleDelete() {
    setDeleting(true)
    setError(null)
    try {
      await onDelete() // success reloads the list → this row unmounts
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Delete failed.')
      setDeleting(false)
      setConfirming(false)
    }
  }

  return (
    <tr className="border-b border-border/60 align-top">
      <td className="py-3 pr-4">
        <span className="rounded border border-border px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wide text-fg-subtle">
          {tool.type}
        </span>
      </td>
      <td className="py-3 pr-4 font-mono text-sm text-fg">{tool.title}</td>
      <td className="max-w-xs py-3 pr-4">
        <span className="block truncate font-mono text-xs text-fg-muted" title={tool.content}>
          {tool.content}
        </span>
      </td>
      <td className="py-3 text-right">
        {confirming ? (
          <span className="inline-flex items-center gap-3">
            <span className="font-mono text-xs text-fg-muted">delete?</span>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="font-mono text-xs lowercase text-danger transition-colors hover:text-danger/80 disabled:opacity-60"
            >
              {deleting ? '…' : 'yes'}
            </button>
            <button
              onClick={() => setConfirming(false)}
              className="font-mono text-xs lowercase text-fg-muted transition-colors hover:text-fg"
            >
              no
            </button>
          </span>
        ) : (
          <span className="inline-flex items-center gap-4">
            <button
              onClick={onEdit}
              className="font-mono text-xs lowercase text-fg-muted transition-colors hover:text-accent"
            >
              edit
            </button>
            <button
              onClick={() => setConfirming(true)}
              className="font-mono text-xs lowercase text-fg-muted transition-colors hover:text-danger"
            >
              delete
            </button>
          </span>
        )}
        {error && <p className="mt-1.5 font-mono text-xs text-danger">{error}</p>}
      </td>
    </tr>
  )
}
