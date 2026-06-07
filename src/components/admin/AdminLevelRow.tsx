import { useState } from 'react'
import type { AdminLevel } from '../../types/levels'

// AdminLevelRow is one row of the admin levels table: the level's fields (flag
// included — admin surface) plus edit/delete actions. Delete is a two-step
// inline confirm. The actual API call lives in the page (passed as onDelete);
// the row owns only the confirm/pending/error UI.
export default function AdminLevelRow({
  level,
  unlocks,
  onEdit,
  onDelete,
}: {
  level: AdminLevel
  unlocks: string | null
  onEdit: () => void
  onDelete: () => Promise<void>
}) {
  const [confirming, setConfirming] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState(false)

  async function handleDelete() {
    setDeleting(true)
    setError(false)
    try {
      await onDelete() // success reloads the list → this row unmounts
    } catch {
      setError(true)
      setDeleting(false)
      setConfirming(false)
    }
  }

  return (
    <tr className="border-b border-border/60">
      <td className="py-3 pr-4 font-mono text-sm tabular-nums text-fg-muted">
        {level.order_index}
      </td>
      <td className="py-3 pr-4 font-mono text-sm text-fg">{level.title}</td>
      <td className="py-3 pr-4 font-mono text-sm text-warning">{level.flag}</td>
      <td className="py-3 pr-4 font-mono text-xs text-fg-muted">{unlocks ?? '—'}</td>
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
            {error && <span className="font-mono text-xs text-danger">failed</span>}
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
      </td>
    </tr>
  )
}
