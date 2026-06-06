// ConnectionError is shown when the auth bootstrap can't reach the backend
// (network down, server unreachable, 5xx) — as opposed to a clean 401, which
// just means "not logged in". It offers a retry rather than stranding the user.
export default function ConnectionError({ onRetry }: { onRetry: () => void }) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-fg-subtle">
        secure channel
      </p>
      <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-danger">
        CONNECTION FAILED
      </h1>
      <p className="mt-3 max-w-sm font-mono text-sm text-fg-muted">
        <span className="text-fg-subtle">{'// '}</span>
        could not reach the server — it may be offline or unreachable.
      </p>
      <button
        onClick={onRetry}
        className="mt-7 rounded-md bg-accent px-5 py-2.5 font-mono text-sm font-semibold uppercase tracking-[0.12em] text-accent-fg transition-colors hover:bg-accent-hover"
      >
        retry →
      </button>
    </main>
  )
}
