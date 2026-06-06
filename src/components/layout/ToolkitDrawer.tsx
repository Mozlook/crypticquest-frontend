import { useEffect, useRef, type ReactNode } from 'react'

// ToolkitDrawer is a right-side slide-over for the player's toolkit. It overlays
// the current view (puzzle stays behind, lightly dimmed) so tools are reachable
// without navigating away. Always mounted; `open` toggles the slide + backdrop
// so enter and exit both animate. Closes on Esc or backdrop click.
//
// a11y: when closed the panel is `inert` (off-screen but otherwise still in the
// DOM — without this its buttons/links stay tabbable). On open, focus moves to
// the close button; on close, it returns to whatever was focused before.
export default function ToolkitDrawer({
  open,
  onClose,
  children,
}: {
  open: boolean
  onClose: () => void
  children?: ReactNode
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

  return (
    <>
      <div
        aria-hidden
        onClick={onClose}
        className={`fixed inset-0 z-30 bg-black/20 transition-opacity duration-200 ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Toolkit"
        inert={!open}
        className={`fixed right-0 top-0 z-40 flex h-full w-80 max-w-[85vw] flex-col border-l border-border bg-surface shadow-2xl shadow-black/60 transition-transform duration-200 ease-out ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <header className="flex items-center justify-between border-b border-border px-5 py-3.5">
          <h2 className="font-display text-sm font-bold uppercase tracking-[0.2em] text-fg">
            toolkit
          </h2>
          <button
            ref={closeRef}
            onClick={onClose}
            aria-label="Close toolkit"
            className="font-mono text-fg-muted transition-colors hover:text-fg"
          >
            ✕
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>
      </aside>
    </>
  )
}
