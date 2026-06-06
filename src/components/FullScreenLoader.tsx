// FullScreenLoader — a centered terminal "working" line with a blinking caret.
// Used while the auth bootstrap (/api/me) is in flight so we never flash the
// wrong UI before the session status is known.
export default function FullScreenLoader({
  label = 'establishing link',
}: {
  label?: string
}) {
  return (
    <div className="flex min-h-screen items-center justify-center font-mono text-sm text-fg-muted">
      <span className="cq-caret">{label}</span>
    </div>
  )
}
