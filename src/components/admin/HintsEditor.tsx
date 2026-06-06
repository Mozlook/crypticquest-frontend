import { useEffect, useState } from 'react'
import { ApiError, api } from '../../lib/api'
import { endpoints } from '../../lib/endpoints'
import type { Hint } from '../../types/hints'

// HintsEditor edits a level's hint list and saves it whole (the backend's
// replace-all PUT: the array order becomes hint order, an empty list clears
// them). It loads and saves independently of the level fields, so it only makes
// sense for an existing level (needs its id). Blank lines are dropped on save.

const fieldClass =
  'w-full rounded-md border border-border bg-surface-2/70 px-3 py-2 font-mono text-sm text-fg placeholder:text-fg-subtle transition-[border-color,box-shadow] focus:border-accent focus:shadow-[0_0_0_3px_rgba(52,245,160,0.12)] focus:outline-none'
const iconBtn =
  'rounded border border-border px-2 py-1 font-mono text-xs text-fg-muted transition-colors hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-40'

export default function HintsEditor({ levelId }: { levelId: number }) {
  const [items, setItems] = useState<string[] | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    let cancelled = false
    api
      .get<Hint[]>(endpoints.adminLevelHints(levelId))
      .then((hints) => {
        if (!cancelled) setItems(hints.map((h) => h.text))
      })
      .catch((e) => {
        if (!cancelled) setLoadError(e instanceof ApiError ? e.message : 'Could not load hints.')
      })
    return () => {
      cancelled = true
    }
  }, [levelId])

  function update(next: string[]) {
    setItems(next)
    setSaved(false)
  }

  const setAt = (i: number, value: string) =>
    update(items!.map((t, j) => (j === i ? value : t)))
  const add = () => update([...(items ?? []), ''])
  const removeAt = (i: number) => update(items!.filter((_, j) => j !== i))
  const move = (i: number, dir: -1 | 1) => {
    const next = [...items!]
    const j = i + dir
    ;[next[i], next[j]] = [next[j], next[i]]
    update(next)
  }

  async function save() {
    const payload = (items ?? []).map((t) => t.trim()).filter((t) => t !== '')
    setSaving(true)
    setSaveError(null)
    setSaved(false)
    try {
      const updated = await api.put<Hint[]>(endpoints.adminLevelHints(levelId), {
        hints: payload,
      })
      setItems(updated.map((h) => h.text)) // canonical order, blanks dropped
      setSaved(true)
    } catch (e) {
      setSaveError(e instanceof ApiError ? e.message : 'Could not save hints.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="rounded-xl border border-border bg-surface/60 p-5">
      <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-fg-subtle">hints</h3>

      {loadError && (
        <p className="mt-3 font-mono text-sm text-danger">
          <span className="text-danger/70">! </span>
          {loadError}
        </p>
      )}

      {!loadError && items === null && (
        <p className="mt-3 font-mono text-sm text-fg-muted">
          <span className="cq-caret">loading hints</span>
        </p>
      )}

      {items !== null && (
        <>
          {items.length === 0 ? (
            <p className="mt-3 font-mono text-sm text-fg-muted">
              <span className="text-fg-subtle">{'// '}</span>
              no hints — add one below.
            </p>
          ) : (
            <ul className="mt-3 space-y-2">
              {items.map((text, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="w-6 shrink-0 font-mono text-xs tabular-nums text-warning">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <input
                    value={text}
                    onChange={(e) => setAt(i, e.target.value)}
                    placeholder="hint text"
                    aria-label={`Hint ${i + 1}`}
                    className={fieldClass}
                  />
                  <button type="button" onClick={() => move(i, -1)} disabled={i === 0} className={iconBtn} aria-label="Move up">
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => move(i, 1)}
                    disabled={i === items.length - 1}
                    className={iconBtn}
                    aria-label="Move down"
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    onClick={() => removeAt(i)}
                    className="rounded border border-border px-2 py-1 font-mono text-xs text-fg-muted transition-colors hover:border-danger hover:text-danger"
                    aria-label="Remove hint"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-4 flex items-center gap-3">
            <button
              type="button"
              onClick={add}
              className="rounded-md border border-border px-3 py-1.5 font-mono text-sm lowercase tracking-wide text-fg-muted transition-colors hover:border-accent hover:text-accent"
            >
              + add hint
            </button>
            <button
              type="button"
              onClick={save}
              disabled={saving}
              className="rounded-md bg-accent px-3.5 py-1.5 font-mono text-sm font-semibold lowercase tracking-wide text-accent-fg transition-colors hover:bg-accent-hover disabled:opacity-60"
            >
              {saving ? 'saving…' : 'save hints'}
            </button>
            {saved && <span className="font-mono text-xs text-success">saved</span>}
          </div>

          {saveError && (
            <p className="mt-3 font-mono text-sm text-danger">
              <span className="text-danger/70">! </span>
              {saveError}
            </p>
          )}
        </>
      )}
    </section>
  )
}
