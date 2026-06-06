import { useEffect, useState } from 'react'
import { useApi } from '../../hooks/useApi'
import { endpoints } from '../../lib/endpoints'
import type { Hint } from '../../types/hints'

// Reveal schedule: hint i (0-based) unlocks at 5 + 15·i minutes after the first
// visit — 5, 20, 35, 50… The clock starts on first entry to a level and is
// persisted per level in localStorage, so it survives reloads.
const unlockOffsetMs = (i: number) => (5 + 15 * i) * 60_000
const startKey = (levelId: string) => `cq:hint-start:${levelId}`

function readOrCreateStart(levelId: string): number {
  const key = startKey(levelId)
  const stored = localStorage.getItem(key)
  if (stored) {
    const t = Number(stored)
    if (Number.isFinite(t)) return t
  }
  const now = Date.now()
  localStorage.setItem(key, String(now))
  return now
}

function formatCountdown(ms: number): string {
  const total = Math.ceil(ms / 1000)
  const m = Math.floor(total / 60)
  const s = total % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

// Hints fetches all of a level's hints (same access gate as the level) and shows
// each as a covered bar. A bar is time-locked (showing a live countdown) until
// its scheduled moment, then becomes clickable — clicking peels off the blur.
// Reveal is per-bar and one-way; the backend tracks no hint state.
export default function Hints({ levelId }: { levelId: string }) {
  const { data: hints, error, loading, reload } = useApi<Hint[]>(endpoints.levelHints(levelId))
  const [revealed, setRevealed] = useState<ReadonlySet<number>>(() => new Set())
  const [start] = useState(() => readOrCreateStart(levelId))
  const [now, setNow] = useState(() => Date.now())

  // Tick once a second so countdowns update and bars unlock in real time.
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

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
        {hints.map((hint, i) => {
          const remaining = start + unlockOffsetMs(i) - now
          return (
            <li key={hint.id}>
              <HintBar
                number={i + 1}
                text={hint.text}
                revealed={revealed.has(i)}
                remainingMs={remaining}
                onReveal={() => reveal(i)}
              />
            </li>
          )
        })}
      </ul>
    </section>
  )
}

function HintBar({
  number,
  text,
  revealed,
  remainingMs,
  onReveal,
}: {
  number: number
  text: string
  revealed: boolean
  remainingMs: number
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

  // Time-locked: a live countdown, not yet clickable.
  if (remainingMs > 0) {
    return (
      <div className="flex w-full items-center gap-3 rounded-lg border border-border bg-surface-2/20 px-4 py-3">
        <span className="font-mono text-sm text-fg-subtle">{num}</span>
        <span
          aria-hidden
          className="flex-1 select-none truncate font-mono text-sm text-fg opacity-40 blur-[5px]"
        >
          {text}
        </span>
        <span className="font-mono text-xs tabular-nums text-fg-subtle">
          locked · {formatCountdown(remainingMs)}
        </span>
      </div>
    )
  }

  // Unlocked but still covered — click to peel the blur.
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
