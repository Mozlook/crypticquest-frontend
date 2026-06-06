import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { ApiError, api } from '../../lib/api'
import { endpoints } from '../../lib/endpoints'
import type { LevelListItem, SubmitResult } from '../../types/levels'
import TextField from '../ui/TextField'
import SubmitButton from '../ui/SubmitButton'

// SubmitFlag is the answer form on the puzzle view. A correct answer fires
// onSolved (the parent refreshes app state — current level, unlocks, solved
// badge) and swaps the form for a success state with a "next" button. An
// incorrect one shows a neutral "incorrect" — no "almost", matching the
// backend's no-signal philosophy.
type Feedback = 'idle' | 'correct' | 'incorrect'

export default function SubmitFlag({
  levelId,
  onSolved,
}: {
  levelId: string
  onSolved: () => void
}) {
  const navigate = useNavigate()
  const [answer, setAnswer] = useState('')
  const [feedback, setFeedback] = useState<Feedback>('idle')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [advancing, setAdvancing] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      const res = await api.post<SubmitResult>(endpoints.levelSubmit(levelId), { answer })
      setSubmitting(false)
      if (res.correct) {
        setFeedback('correct')
        onSolved()
      } else {
        setFeedback('incorrect')
      }
    } catch (err) {
      setSubmitting(false)
      setError(err instanceof ApiError ? err.message : 'Could not submit. Try again.')
    }
  }

  // Advance to the next unsolved level (the new current after this solve); if
  // there is none, the campaign is done — fall back to the archive.
  async function goNext() {
    setAdvancing(true)
    try {
      const levels = await api.get<LevelListItem[]>(endpoints.levels)
      const next = levels.find((l) => !l.solved)
      navigate(next ? `/levels/${next.id}` : '/')
    } catch {
      navigate('/')
    }
  }

  if (feedback === 'correct') {
    return (
      <div className="mt-6 space-y-4">
        <p
          role="status"
          className="rounded-md border border-success/30 bg-success/10 px-3 py-2 font-mono text-sm text-success"
        >
          <span className="text-success/70">✓ </span>
          correct — transmission decrypted
        </p>
        <button
          onClick={goNext}
          disabled={advancing}
          className="flex w-full items-center justify-center gap-2 rounded-md bg-accent px-4 py-2.5 font-mono text-sm font-semibold uppercase tracking-[0.12em] text-accent-fg transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60"
        >
          {advancing ? 'locating…' : 'next transmission →'}
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
      <TextField
        id="answer"
        label="answer"
        autoComplete="off"
        value={answer}
        onChange={(e) => {
          setAnswer(e.target.value)
          // Clear stale "incorrect" as soon as the player edits the answer.
          if (feedback !== 'idle') setFeedback('idle')
        }}
        required
      />

      {feedback === 'incorrect' && (
        <p
          role="status"
          className="rounded-md border border-danger/30 bg-danger/10 px-3 py-2 font-mono text-sm text-danger"
        >
          incorrect
        </p>
      )}
      {error && (
        <p
          role="alert"
          className="rounded-md border border-danger/30 bg-danger/10 px-3 py-2 font-mono text-sm text-danger"
        >
          <span className="text-danger/70">! </span>
          {error}
        </p>
      )}

      <SubmitButton loading={submitting}>
        {submitting ? 'verifying…' : 'submit →'}
      </SubmitButton>
    </form>
  )
}
