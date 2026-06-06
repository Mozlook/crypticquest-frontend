import { useApi } from '../hooks/useApi'
import { endpoints } from '../lib/endpoints'
import type { LevelListItem } from '../types/levels'
import LevelRow from '../components/levels/LevelRow'

// Levels is the index view: the player's accessible levels (solved + the next
// unsolved), newest gate last. Solved levels are revisitable; the single
// unsolved one is highlighted as the current objective. Future levels are not
// returned by the API, so there's nothing locked to render here.
export default function Levels() {
  const { data: levels, error, loading, reload } = useApi<LevelListItem[]>(endpoints.levels)

  return (
    <div className="mx-auto max-w-3xl">
      <header className="mb-6">
        <h1 className="font-display text-2xl font-bold tracking-tight text-fg">
          mission archive
        </h1>
        <p className="mt-1 font-mono text-sm text-fg-muted">
          <span className="text-fg-subtle">{'// '}</span>
          decrypt each transmission to unlock the next
        </p>
      </header>

      {loading && (
        <p className="font-mono text-sm text-fg-muted">
          <span className="cq-caret">decrypting manifest</span>
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

      {levels && (
        <ol className="space-y-3">
          {levels.map((lvl, i) => (
            <LevelRow key={lvl.id} level={lvl} index={i} />
          ))}
        </ol>
      )}
    </div>
  )
}
