import { useState } from 'react'
import { useApi } from '../../hooks/useApi'
import { endpoints } from '../../lib/endpoints'
import type { Hint } from '../../types/hints'

// Hints fetches all of a level's hints (same access gate as the level) and shows
// each as a covered bar — the text is blurred until the player clicks to peel it
// off. Reveal is per-bar and one-way; the backend tracks no hint state. Reveal
// timers (gate a bar behind a delay) are a follow-up step.
export default function Hints({ levelId }: { levelId: string }) {
  const { data: hints, error, loading, reload } = useApi<Hint[]>(endpoints.levelHints(levelId))
  const [revealed, setRevealed] = useState<ReadonlySet<number>>(() => new Set())

  // Stay quiet while loading — hints are secondary to the puzzle.
  if (loading) return null

  if (error) {
    return (
      <p className="mt-6 font-mono text-xs text-fg-subtle">
        could not load hints —{' '}
        <button
          onClick={reload}
          className="underline underline-offset-2 transition-colors hover:text-fg"
        >
          retry
        </button>
      </p>
    )
  }

  if (!hints || hints.length === 0) {
    return (
      <p className="mt-6 font-mono text-xs text-fg-subtle">
        {'// '}no hints for this transmission
      </p>
    )
  }

  const reveal = (i: number) => setRevealed((prev) => new Set(prev).add(i))

  return (
    <section className="mt-6">
      <div className="flex items-center justify-between">
        <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-fg-subtle">hints</h2>
        <span className="font-mono text-xs text-fg-subtle">
          {revealed.size} / {hints.length} revealed
        </span>
      </div>

      <ul className="mt-3 space-y-2">
        {hints.map((hint, i) => (
          <li key={hint.id}>
            <HintBar
              number={i + 1}
              text={hint.text}
              revealed={revealed.has(i)}
              onReveal={() => reveal(i)}
            />
          </li>
        ))}
      </ul>
    </section>
  )
}

function HintBar({
  number,
  text,
  revealed,
  onReveal,
}: {
  number: number
  text: string
  revealed: boolean
  onReveal: () => void
}) {
  const num = String(number).padStart(2, '0')

  if (revealed) {
    return (
      <div className="flex items-start gap-3 rounded-lg border border-border bg-surface-2/40 px-4 py-3">
        <span className="font-mono text-sm text-warning">{num}</span>
        <span className="flex-1 font-mono text-sm text-fg">{text}</span>
      </div>
    )
  }

  return (
    <button
      onClick={onReveal}
      aria-label={`Reveal hint ${number}`}
      className="group flex w-full items-center gap-3 rounded-lg border border-border bg-surface-2/40 px-4 py-3 text-left transition-colors hover:border-warning/60"
    >
      <span className="font-mono text-sm text-warning">{num}</span>
      <span
        aria-hidden
        className="flex-1 select-none truncate font-mono text-sm text-fg blur-[5px]"
      >
        {text}
      </span>
      <span className="font-mono text-xs uppercase tracking-wide text-fg-subtle transition-colors group-hover:text-warning">
        reveal
      </span>
    </button>
  )
}
