import { Link } from 'react-router-dom'
import type { LevelListItem } from '../../types/levels'

// LevelRow renders one entry in the level list: a card linking to the puzzle.
// Solved levels are muted and revisitable; the unsolved one is highlighted as
// the current objective. `index` is the 0-based list position (the displayed
// number is index + 1, since raw order_index is internal).
export default function LevelRow({
  level,
  index,
}: {
  level: LevelListItem
  index: number
}) {
  const number = String(index + 1).padStart(2, '0')

  return (
    <li>
      <Link
        to={`/levels/${level.id}`}
        className={[
          'group flex items-center gap-4 rounded-lg border px-5 py-4 transition-colors',
          level.solved
            ? 'border-border bg-surface hover:border-border-strong'
            : 'border-accent/50 bg-accent/[0.04] hover:border-accent',
        ].join(' ')}
      >
        <span
          className={[
            'font-mono text-sm tabular-nums',
            level.solved ? 'text-fg-subtle' : 'text-accent',
          ].join(' ')}
        >
          {number}
        </span>

        <span className={`flex-1 font-mono ${level.solved ? 'text-fg-muted' : 'text-fg'}`}>
          {level.title}
        </span>

        {level.solved ? (
          <span className="font-mono text-xs uppercase tracking-wide text-success">
            ✓ solved
          </span>
        ) : (
          <span className="font-mono text-xs uppercase tracking-wide text-accent">
            ▸ current
          </span>
        )}
      </Link>
    </li>
  )
}
