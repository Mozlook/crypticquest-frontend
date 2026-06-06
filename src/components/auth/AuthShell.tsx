import type { ReactNode } from 'react'
import { useDecrypt } from '../../hooks/useDecrypt'

// AuthShell is the framing for unauthenticated pages (login, register): an
// atmospheric terminal backdrop with a framed "secure channel" window. The
// CrypticQuest wordmark and a decrypting subtitle live here; pages pass their
// own subtitle, form (children), and footer.

const gridStyle: React.CSSProperties = {
  backgroundImage: `
    linear-gradient(to right, rgba(120, 180, 210, 0.05) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(120, 180, 210, 0.05) 1px, transparent 1px)`,
  backgroundSize: '46px 46px',
  // Fade the grid out toward the edges so it reads as atmosphere, not a table.
  maskImage: 'radial-gradient(ellipse 80% 70% at 50% 40%, black 30%, transparent 100%)',
  WebkitMaskImage:
    'radial-gradient(ellipse 80% 70% at 50% 40%, black 30%, transparent 100%)',
}

const glowStyle: React.CSSProperties = {
  background:
    'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(52, 245, 160, 0.10), transparent 70%)',
}

export default function AuthShell({
  subtitle,
  children,
  footer,
}: {
  subtitle: string
  children: ReactNode
  footer?: ReactNode
}) {
  const decoded = useDecrypt(subtitle, { delay: 250, speed: 26 })

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10">
      {/* Atmosphere layers. */}
      <div aria-hidden className="pointer-events-none absolute inset-0" style={gridStyle} />
      <div aria-hidden className="pointer-events-none absolute inset-0" style={glowStyle} />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 100% 100% at 50% 50%, transparent 55%, rgba(0,0,0,0.55) 100%)',
        }}
      />

      {/* Terminal window. */}
      <section className="cq-rise relative z-10 w-full max-w-md">
        <div className="overflow-hidden rounded-xl border border-border bg-surface/90 shadow-2xl shadow-black/60 backdrop-blur-sm">
          {/* Title bar. */}
          <div className="flex items-center justify-between border-b border-border bg-surface-2/60 px-4 py-2.5">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 animate-pulse rounded-full bg-accent shadow-[0_0_8px] shadow-accent" />
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-fg-muted">
                secure channel
              </span>
            </div>
            <span className="font-mono text-[11px] tracking-wider text-fg-subtle">
              0x1A · tls
            </span>
          </div>

          {/* Body. */}
          <div className="px-7 py-8 sm:px-9">
            <header className="mb-7">
              <h1 className="font-display text-3xl font-bold tracking-tight">
                <span className="text-fg">CRYPTIC</span>
                <span className="text-accent">QUEST</span>
              </h1>
              <p className="mt-2 font-mono text-sm text-cipher/80">
                <span className="text-fg-subtle">{'// '}</span>
                {decoded}
              </p>
            </header>

            {children}
          </div>
        </div>

        {footer && (
          <p className="mt-5 text-center font-mono text-sm text-fg-muted">{footer}</p>
        )}
      </section>
    </main>
  )
}
