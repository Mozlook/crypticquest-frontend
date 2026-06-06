import { Link, Navigate, useParams } from 'react-router-dom'
import { useApi } from '../hooks/useApi'
import { fileUrl } from '../lib/api'
import { endpoints } from '../lib/endpoints'
import type { LevelDetail } from '../types/levels'

// Puzzle is the single-level view: title, narrative, and any downloadable
// attachments (served through the gated /files/levels/{id}/...). The access gate
// lives in the backend — 404 if the level doesn't exist, 403 if it's locked —
// surfaced here as distinct messages. Flag submission and hints are separate
// steps.
export default function Puzzle() {
  const { id } = useParams()
  if (!id) return <Navigate to="/" replace />

  return <PuzzleView id={id} />
}

function PuzzleView({ id }: { id: string }) {
  const { data: level, error, errorStatus, loading, reload } = useApi<LevelDetail>(
    endpoints.level(id),
  )

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        to="/"
        className="font-mono text-sm text-fg-muted transition-colors hover:text-fg"
      >
        ← mission archive
      </Link>

      {loading && (
        <p className="mt-8 font-mono text-sm text-fg-muted">
          <span className="cq-caret">decrypting transmission</span>
        </p>
      )}

      {error && <PuzzleError status={errorStatus} message={error} onRetry={reload} />}

      {level && (
        <article className="mt-6">
          <header className="mb-5 flex items-start justify-between gap-4">
            <h1 className="font-display text-2xl font-bold tracking-tight text-fg">
              {level.title}
            </h1>
            {level.solved && (
              <span className="mt-1 shrink-0 font-mono text-xs uppercase tracking-wide text-success">
                ✓ solved
              </span>
            )}
          </header>

          <div className="rounded-xl border border-border bg-surface px-6 py-5">
            <p className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-fg">
              {level.description}
            </p>

            {level.files.length > 0 && (
              <div className="mt-5 border-t border-border pt-4">
                <p className="mb-2 font-mono text-xs uppercase tracking-[0.15em] text-fg-subtle">
                  attachments
                </p>
                <ul className="space-y-1.5">
                  {level.files.map((name) => (
                    <li key={name}>
                      <a
                        href={fileUrl(endpoints.levelFile(id, name))}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 font-mono text-sm text-cipher transition-colors hover:text-accent"
                      >
                        <span aria-hidden>↓</span>
                        {name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </article>
      )}
    </div>
  )
}

function PuzzleError({
  status,
  message,
  onRetry,
}: {
  status: number | null
  message: string
  onRetry: () => void
}) {
  const known = status === 404 || status === 403
  const heading = status === 404 ? 'TRANSMISSION NOT FOUND' : status === 403 ? 'ACCESS DENIED' : 'ERROR'

  return (
    <div className="mt-8 rounded-xl border border-danger/30 bg-danger/[0.06] px-6 py-5">
      <p className="font-display text-lg font-bold tracking-tight text-danger">{heading}</p>
      <p className="mt-2 font-mono text-sm text-fg-muted">
        <span className="text-fg-subtle">{'// '}</span>
        {message}
      </p>
      {/* A network/5xx error is worth retrying; a 404/403 is not. */}
      {!known && (
        <button
          onClick={onRetry}
          className="mt-4 rounded-md border border-border px-3 py-1.5 font-mono text-xs lowercase tracking-wide text-fg-muted transition-colors hover:border-accent hover:text-accent"
        >
          retry
        </button>
      )}
    </div>
  )
}
