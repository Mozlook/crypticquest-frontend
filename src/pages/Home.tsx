import { useAuth } from '../auth/context'
import { useDecrypt } from '../hooks/useDecrypt'

// Home is a TEMPORARY index, rendered inside AppLayout. It shows a small agent
// dashboard to confirm the shell + session data. It will be replaced by the
// level list view (next Phase 2 item).
export default function Home() {
  const { user } = useAuth()
  const granted = useDecrypt('ACCESS GRANTED', { speed: 45 })

  if (!user) return null

  return (
    <div className="mx-auto max-w-2xl">
      <p className="font-display text-2xl font-bold tracking-tight text-accent">
        {granted}
      </p>
      <div className="mt-6 rounded-xl border border-border bg-surface px-6 py-5 font-mono text-sm">
        <Row label="agent" value={user.username} />
        <Row label="clearance" value={user.role} />
        <Row label="current level" value={String(user.currentLevel)} />
      </div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b border-border/60 py-2 last:border-0">
      <span className="uppercase tracking-[0.12em] text-fg-subtle">{label}</span>
      <span className="text-fg">{value}</span>
    </div>
  )
}
