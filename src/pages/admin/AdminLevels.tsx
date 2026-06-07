import { useState } from 'react'
import { api } from '../../lib/api'
import { useApi } from '../../hooks/useApi'
import { endpoints } from '../../lib/endpoints'
import type { AdminLevel } from '../../types/levels'
import type { AdminTool } from '../../types/tools'
import LevelForm from '../../components/admin/LevelForm'
import HintsEditor from '../../components/admin/HintsEditor'
import AdminLevelRow from '../../components/admin/AdminLevelRow'

// AdminLevels is the puzzles CRUD section: a table of every level (flag and
// order shown) with create/edit/delete. Editing swaps the table for the form.
// The "unlocks" column is derived from the tools side (each tool names the level
// it unlocks at), so one level can show several tools.
type Editing = AdminLevel | 'new' | null

export default function AdminLevels() {
  const { data: levels, error, loading, reload } = useApi<AdminLevel[]>(endpoints.adminLevels)
  const { data: tools } = useApi<AdminTool[]>(endpoints.adminTools)
  const [editing, setEditing] = useState<Editing>(null)

  // Reverse lookup: the tools a given level unlocks, joined into a label.
  const unlocksLabel = (levelId: number) => {
    const titles = (tools ?? [])
      .filter((t) => t.unlocks_at_level_id === levelId)
      .map((t) => t.title)
    return titles.length > 0 ? titles.join(', ') : null
  }

  async function handleDelete(id: number) {
    await api.del(endpoints.adminLevel(id))
    reload()
  }

  function handleSaved() {
    setEditing(null)
    reload()
  }

  if (editing !== null) {
    return (
      <div className="space-y-8">
        <LevelForm
          level={editing === 'new' ? null : editing}
          onSaved={handleSaved}
          onCancel={() => setEditing(null)}
        />
        {/* Hints save independently (replace-all PUT) and need a level id, so
            they're available only when editing an existing level. */}
        {editing !== 'new' && <HintsEditor levelId={editing.id} />}
      </div>
    )
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="font-mono text-sm text-fg-muted">
          {levels ? `${levels.length} level${levels.length === 1 ? '' : 's'}` : ''}
        </p>
        <button
          onClick={() => setEditing('new')}
          className="rounded-md bg-accent px-3.5 py-2 font-mono text-sm font-semibold lowercase tracking-wide text-accent-fg transition-colors hover:bg-accent-hover"
        >
          + new level
        </button>
      </div>

      {loading && (
        <p className="font-mono text-sm text-fg-muted">
          <span className="cq-caret">loading levels</span>
        </p>
      )}

      {error && (
        <div className="rounded-md border border-danger/30 bg-danger/10 px-4 py-3 font-mono text-sm text-danger">
          <span className="text-danger/70">! </span>
          {error}
          <button
            onClick={reload}
            className="ml-3 text-fg-muted underline underline-offset-2 transition-colors hover:text-fg"
          >
            retry
          </button>
        </div>
      )}

      {levels && levels.length === 0 && (
        <p className="font-mono text-sm text-fg-muted">
          <span className="text-fg-subtle">{'// '}</span>
          no levels yet — create the first one.
        </p>
      )}

      {levels && levels.length > 0 && (
        <div className="overflow-x-auto">
        <table className="w-full min-w-[36rem]">
          <thead>
            <tr className="border-b border-border text-left">
              {['order', 'title', 'flag', 'unlocks', ''].map((h, i) => (
                <th
                  key={i}
                  className="pb-2 font-mono text-xs uppercase tracking-[0.15em] text-fg-subtle"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {levels.map((level) => (
              <AdminLevelRow
                key={level.id}
                level={level}
                unlocks={unlocksLabel(level.id)}
                onEdit={() => setEditing(level)}
                onDelete={() => handleDelete(level.id)}
              />
            ))}
          </tbody>
        </table>
        </div>
      )}
    </div>
  )
}
