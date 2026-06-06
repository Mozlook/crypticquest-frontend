import { useState } from 'react'
import { api } from '../../lib/api'
import { useApi } from '../../hooks/useApi'
import { endpoints } from '../../lib/endpoints'
import type { Tool } from '../../types/tools'
import ToolForm from '../../components/admin/ToolForm'
import AdminToolRow from '../../components/admin/AdminToolRow'

// AdminTools is the toolkit CRUD section: a table of every tool with
// create/edit/delete. A tool referenced by a level can't be deleted (409),
// surfaced inline on the row.
type Editing = Tool | 'new' | null

export default function AdminTools() {
  const { data: tools, error, loading, reload } = useApi<Tool[]>(endpoints.adminTools)
  const [editing, setEditing] = useState<Editing>(null)

  async function handleDelete(id: number) {
    await api.del(endpoints.adminTool(id))
    reload()
  }

  function handleSaved() {
    setEditing(null)
    reload()
  }

  if (editing !== null) {
    return (
      <ToolForm
        tool={editing === 'new' ? null : editing}
        onSaved={handleSaved}
        onCancel={() => setEditing(null)}
      />
    )
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="font-mono text-sm text-fg-muted">
          {tools ? `${tools.length} tool${tools.length === 1 ? '' : 's'}` : ''}
        </p>
        <button
          onClick={() => setEditing('new')}
          className="rounded-md bg-accent px-3.5 py-2 font-mono text-sm font-semibold lowercase tracking-wide text-accent-fg transition-colors hover:bg-accent-hover"
        >
          + new tool
        </button>
      </div>

      {loading && (
        <p className="font-mono text-sm text-fg-muted">
          <span className="cq-caret">loading tools</span>
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

      {tools && tools.length === 0 && (
        <p className="font-mono text-sm text-fg-muted">
          <span className="text-fg-subtle">{'// '}</span>
          no tools yet — create the first one.
        </p>
      )}

      {tools && tools.length > 0 && (
        <div className="overflow-x-auto">
        <table className="w-full min-w-[36rem]">
          <thead>
            <tr className="border-b border-border text-left">
              {['type', 'title', 'content', ''].map((h, i) => (
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
            {tools.map((tool) => (
              <AdminToolRow
                key={tool.id}
                tool={tool}
                onEdit={() => setEditing(tool)}
                onDelete={() => handleDelete(tool.id)}
              />
            ))}
          </tbody>
        </table>
        </div>
      )}
    </div>
  )
}
