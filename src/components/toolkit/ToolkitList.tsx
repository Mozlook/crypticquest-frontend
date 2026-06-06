import type { Tool } from '../../types/tools'
import ToolItem from './ToolItem'

// ToolkitList renders the drawer's body: loading, error+retry, an empty state,
// or the list of unlocked tools.
export default function ToolkitList({
  tools,
  error,
  loading,
  onRetry,
}: {
  tools: Tool[] | null
  error: string | null
  loading: boolean
  onRetry: () => void
}) {
  if (loading) {
    return (
      <p className="font-mono text-sm text-fg-muted">
        <span className="cq-caret">loading tools</span>
      </p>
    )
  }

  if (error) {
    return (
      <div className="rounded-md border border-danger/30 bg-danger/10 px-3 py-2 font-mono text-sm text-danger">
        <span className="text-danger/70">! </span>
        {error}
        <button
          onClick={onRetry}
          className="ml-3 text-fg-muted underline underline-offset-2 transition-colors hover:text-fg"
        >
          retry
        </button>
      </div>
    )
  }

  if (!tools || tools.length === 0) {
    return (
      <p className="font-mono text-sm text-fg-muted">
        <span className="text-fg-subtle">{'// '}</span>
        no tools unlocked yet — solve levels to earn them.
      </p>
    )
  }

  return (
    <ul className="space-y-3">
      {tools.map((tool) => (
        <ToolItem key={tool.id} tool={tool} />
      ))}
    </ul>
  )
}
