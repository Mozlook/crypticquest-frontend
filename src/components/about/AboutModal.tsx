import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import AboutContent from './AboutContent'

// AboutModal is the centered briefing dialog for the login screen: same
// content as /about, framed as a terminal window over the auth backdrop.
// Always mounted; `open` toggles opacity/scale so enter and exit both animate.
// Closes on Esc, backdrop click, or the dismiss buttons.
//
// a11y mirrors ToolkitDrawer: `inert` when closed (its controls stay out of
// the tab order), focus moves to the close button on open and returns to the
// previously focused element on close.
//
// Rendered through a portal: the login window animates with a transform
// (cq-rise), and a transformed ancestor becomes the containing block for
// position:fixed — without the portal the overlay would pin to the window
// frame instead of the viewport.
export default function AboutModal({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const closeRef = useRef<HTMLButtonElement>(null)
  const prevFocus = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  useEffect(() => {
    if (open) {
      prevFocus.current = document.activeElement as HTMLElement | null
      closeRef.current?.focus()
    } else {
      prevFocus.current?.focus?.()
    }
  }, [open])

  return createPortal(
    <div
      className={`fixed inset-0 z-30 flex items-center justify-center px-4 py-8 transition-opacity duration-200 ${
        open ? 'opacity-100' : 'pointer-events-none opacity-0'
      }`}
    >
      <div aria-hidden onClick={onClose} className="absolute inset-0 bg-black/60" />

      <section
        role="dialog"
        aria-modal="true"
        aria-label="Briefing"
        inert={!open}
        className={`relative flex max-h-full w-full max-w-lg flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-2xl shadow-black/60 transition-transform duration-200 ease-out ${
          open ? 'scale-100' : 'scale-95'
        }`}
      >
        <header className="flex items-center justify-between border-b border-border bg-surface-2/60 px-5 py-3">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 animate-pulse rounded-full bg-accent shadow-[0_0_8px] shadow-accent" />
            <h2 className="font-display text-sm font-bold uppercase tracking-[0.2em] text-fg">
              briefing
            </h2>
          </div>
          <button
            ref={closeRef}
            onClick={onClose}
            aria-label="Close briefing"
            className="font-mono text-fg-muted transition-colors hover:text-fg"
          >
            ✕
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          <AboutContent />
        </div>

        <footer className="border-t border-border px-6 py-4">
          <button
            onClick={onClose}
            className="w-full rounded-md border border-accent/40 bg-accent/10 px-4 py-2 font-mono text-sm lowercase tracking-wide text-accent transition-colors hover:border-accent hover:bg-accent/20"
          >
            understood →
          </button>
        </footer>
      </section>
    </div>,
    document.body,
  )
}
