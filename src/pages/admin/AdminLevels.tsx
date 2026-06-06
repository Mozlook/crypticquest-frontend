import { useState } from 'react'
import { api } from '../../lib/api'
import { useApi } from '../../hooks/useApi'
import { endpoints } from '../../lib/endpoints'
import type { AdminLevel } from '../../types/levels'
import type { Tool } from '../../types/tools'
import LevelForm from '../../components/admin/LevelForm'
import AdminLevelRow from '../../components/admin/AdminLevelRow'

// AdminLevels is the puzzles CRUD section: a table of every level (flag and
// order shown) with create/edit/delete. Editing swaps the table for the form.
// The tools list feeds the form's "unlocks tool" selector and the table's tool
// column.
type Editing = AdminLevel | 'new' | null

export default function AdminLevels() {
  const { data: levels, error, loading, reload } = useApi<AdminLevel[]>(endpoints.adminLevels)
  const { data: tools } = useApi<Tool[]>(endpoints.adminTools)
  const [editing, setEditing] = useState<Editing>(null)

  const toolList = tools ?? []
  const toolTitle = (id: number | null) =>
    id == null ? null : (toolList.find((t) => t.id === id)?.title ?? `tool #${id}`)

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
      <LevelForm
        level={editing === 'new' ? null : editing}
        tools={toolList}
        onSaved={handleSaved}
        onCancel={() => setEditing(null)}
      />
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
        <table className="w-full">
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
                toolTitle={toolTitle(level.unlocks_tool_id)}
                onEdit={() => setEditing(level)}
                onDelete={() => handleDelete(level.id)}
              />
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
