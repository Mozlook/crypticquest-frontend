// PalettePreview renders the design tokens defined in index.css's @theme block.
// It's a temporary scaffold-era component: a visual smoke test proving Tailwind
// utilities resolve from our theme, and a living reference for the palette.
// Remove it once real views exist.

type Swatch = { token: string; className: string; note: string }

const surfaces: Swatch[] = [
  { token: 'bg', className: 'bg-bg', note: 'page background' },
  { token: 'surface', className: 'bg-surface', note: 'cards, panels' },
  { token: 'surface-2', className: 'bg-surface-2', note: 'inputs, hover rows' },
  { token: 'border', className: 'bg-border', note: 'hairlines, dividers' },
]

const status: Swatch[] = [
  { token: 'accent', className: 'bg-accent', note: 'brand / primary action' },
  { token: 'success', className: 'bg-success', note: 'solved, correct' },
  { token: 'danger', className: 'bg-danger', note: 'wrong answer, errors' },
  { token: 'warning', className: 'bg-warning', note: 'hint timers, caution' },
]

function SwatchGrid({ items }: { items: Swatch[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {items.map((s) => (
        <div
          key={s.token}
          className="overflow-hidden rounded-lg border border-border bg-surface"
        >
          <div className={`h-16 w-full ${s.className}`} />
          <div className="px-3 py-2">
            <code className="font-mono text-sm text-fg">{s.token}</code>
            <p className="text-xs text-fg-muted">{s.note}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function PalettePreview() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <header className="mb-10">
        <h1 className="font-mono text-3xl font-semibold text-accent">
          CrypticQuest
        </h1>
        <p className="mt-1 text-fg-muted">
          Color scheme preview — edit tokens in{' '}
          <code className="font-mono text-fg">src/index.css</code>.
        </p>
      </header>

      <section className="mb-8">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-fg-subtle">
          Surfaces
        </h2>
        <SwatchGrid items={surfaces} />
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-fg-subtle">
          Accent &amp; status
        </h2>
        <SwatchGrid items={status} />
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-fg-subtle">
          Text
        </h2>
        <div className="space-y-1 rounded-lg border border-border bg-surface p-5">
          <p className="text-fg">Primary text — text-fg</p>
          <p className="text-fg-muted">Muted text — text-fg-muted</p>
          <p className="text-fg-subtle">Subtle text — text-fg-subtle</p>
          <p className="text-accent">Accent text — text-accent</p>
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-fg-subtle">
          Components
        </h2>
        <div className="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-surface p-5">
          <button className="rounded-md bg-accent px-4 py-2 font-medium text-accent-fg transition-colors hover:bg-accent-hover">
            Submit flag
          </button>
          <button className="rounded-md border border-border bg-surface-2 px-4 py-2 font-medium text-fg transition-colors hover:border-accent">
            Secondary
          </button>
          <input
            placeholder="flag{...}"
            className="rounded-md border border-border bg-surface-2 px-3 py-2 font-mono text-fg placeholder:text-fg-subtle focus:border-accent focus:outline-none"
          />
        </div>
      </section>
    </main>
  )
}
