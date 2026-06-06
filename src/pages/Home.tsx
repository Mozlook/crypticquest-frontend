import { Navigate } from 'react-router-dom'
import { useAuth } from '../auth/context'
import { useDecrypt } from '../hooks/useDecrypt'

// Home is a TEMPORARY authenticated landing used to verify the auth loop end to
// end (login → cookie → /api/me → state). The loading/redirect guard here is the
// seed of the real ProtectedRoute + app shell (Phase 1/2 backlog items).
export default function Home() {
  const { status, user, logout } = useAuth()
  const granted = useDecrypt('ACCESS GRANTED', { speed: 45 })

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center font-mono text-sm text-fg-muted">
        <span className="cq-caret">establishing link</span>
      </div>
    )
  }
  if (status === 'unauthenticated' || !user) {
    return <Navigate to="/login" replace />
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center px-6">
      <p className="font-display text-2xl font-bold tracking-tight text-accent">
        {granted}
      </p>
      <div className="mt-6 rounded-xl border border-border bg-surface px-6 py-5 font-mono text-sm">
        <Row label="agent" value={user.username} />
        <Row label="clearance" value={user.role} />
        <Row label="current level" value={String(user.currentLevel)} />
      </div>
      <button
        onClick={() => logout()}
        className="mt-6 self-start rounded-md border border-border px-4 py-2 font-mono text-sm text-fg-muted transition-colors hover:border-danger hover:text-danger"
      >
        terminate session
      </button>
    </main>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b border-border/60 py-2 last:border-0">
      <span className="text-fg-subtle uppercase tracking-[0.12em]">{label}</span>
      <span className="text-fg">{value}</span>
    </div>
  )
}
