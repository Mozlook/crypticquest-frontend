import { useState } from 'react'
import { ApiError, api } from '../../lib/api'
import { endpoints } from '../../lib/endpoints'
import type { Role } from '../../types/auth'
import type { AdminUser } from '../../types/users'

// AdminUserCard manages one account: change role, set progress (simple "level N"
// mode), reset password (shows the one-time plaintext once), delete. The backend
// guards an admin from demoting or deleting themselves (409); for the actor's
// own card we also hide/disable those actions up front. onChanged reloads the
// list after a role/level change or deletion.
const controlClass =
  'rounded-md border border-border bg-surface-2/70 px-2.5 py-1.5 font-mono text-sm text-fg transition-colors focus:border-accent focus:outline-none'

export default function AdminUserCard({
  user,
  isSelf,
  onChanged,
}: {
  user: AdminUser
  isSelf: boolean
  onChanged: () => void
}) {
  const [levelInput, setLevelInput] = useState(String(user.current_level))
  const [busy, setBusy] = useState<null | 'role' | 'level' | 'reset' | 'delete'>(null)
  const [error, setError] = useState<string | null>(null)
  const [tempPassword, setTempPassword] = useState<string | null>(null)
  const [confirming, setConfirming] = useState(false)
  const [copied, setCopied] = useState(false)

  function fail(e: unknown) {
    setError(e instanceof ApiError ? e.message : 'Action failed.')
    setBusy(null)
  }

  async function changeRole(role: Role) {
    setBusy('role')
    setError(null)
    try {
      await api.put(endpoints.adminUser(user.id), { role })
      onChanged()
    } catch (e) {
      fail(e)
    }
  }

  async function setLevel() {
    setBusy('level')
    setError(null)
    try {
      await api.put(endpoints.adminUser(user.id), { level: Number(levelInput) })
      onChanged()
    } catch (e) {
      fail(e)
    }
  }

  async function resetPassword() {
    setBusy('reset')
    setError(null)
    setCopied(false)
    try {
      const res = await api.post<{ password: string }>(
        endpoints.adminUserResetPassword(user.id),
      )
      setTempPassword(res.password)
      setBusy(null)
    } catch (e) {
      fail(e)
    }
  }

  async function remove() {
    setBusy('delete')
    setError(null)
    try {
      await api.del(endpoints.adminUser(user.id))
      onChanged() // row unmounts on reload
    } catch (e) {
      setConfirming(false)
      fail(e)
    }
  }

  const levelChanged = levelInput !== String(user.current_level) && levelInput !== ''

  return (
    <div className="rounded-xl border border-border bg-surface p-5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-baseline gap-2">
          <span className="font-mono text-sm font-medium text-fg">{user.username}</span>
          {isSelf && <span className="font-mono text-xs text-accent">(you)</span>}
        </div>
        <span className="font-mono text-xs text-fg-subtle">
          registered {new Date(user.created_at).toLocaleDateString()}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-3">
        <label className="flex items-center gap-2">
          <span className="font-mono text-xs uppercase tracking-wide text-fg-muted">role</span>
          <select
            value={user.role}
            disabled={busy === 'role'}
            onChange={(e) => changeRole(e.target.value as Role)}
            className={controlClass}
          >
            <option value="player">player</option>
            <option value="admin">admin</option>
          </select>
        </label>

        <div className="flex items-center gap-2">
          <span className="font-mono text-xs uppercase tracking-wide text-fg-muted">level</span>
          <input
            type="number"
            min={1}
            value={levelInput}
            onChange={(e) => setLevelInput(e.target.value)}
            className={`${controlClass} w-20 tabular-nums`}
          />
          <button
            onClick={setLevel}
            disabled={!levelChanged || busy === 'level'}
            className="rounded-md border border-border px-2.5 py-1.5 font-mono text-xs lowercase tracking-wide text-fg-muted transition-colors hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-40"
          >
            {busy === 'level' ? '…' : 'set'}
          </button>
        </div>

        <button
          onClick={resetPassword}
          disabled={busy === 'reset'}
          className="rounded-md border border-border px-2.5 py-1.5 font-mono text-xs lowercase tracking-wide text-fg-muted transition-colors hover:border-accent hover:text-accent disabled:opacity-60"
        >
          {busy === 'reset' ? 'resetting…' : 'reset password'}
        </button>

        {!isSelf && (
          <div className="ml-auto">
            {confirming ? (
              <span className="inline-flex items-center gap-3">
                <span className="font-mono text-xs text-fg-muted">delete account?</span>
                <button
                  onClick={remove}
                  disabled={busy === 'delete'}
                  className="font-mono text-xs lowercase text-danger transition-colors hover:text-danger/80 disabled:opacity-60"
                >
                  {busy === 'delete' ? '…' : 'yes'}
                </button>
                <button
                  onClick={() => setConfirming(false)}
                  className="font-mono text-xs lowercase text-fg-muted transition-colors hover:text-fg"
                >
                  no
                </button>
              </span>
            ) : (
              <button
                onClick={() => setConfirming(true)}
                className="font-mono text-xs lowercase text-fg-muted transition-colors hover:text-danger"
              >
                delete
              </button>
            )}
          </div>
        )}
      </div>

      {tempPassword && (
        <div className="mt-4 rounded-md border border-warning/30 bg-warning/10 px-3 py-2.5">
          <p className="font-mono text-xs text-warning">
            one-time password — copy it now, it won&apos;t be shown again
          </p>
          <div className="mt-1.5 flex items-center gap-3">
            <code className="select-all font-mono text-sm text-fg">{tempPassword}</code>
            <button
              onClick={() => {
                navigator.clipboard?.writeText(tempPassword)
                setCopied(true)
              }}
              className="font-mono text-xs lowercase text-fg-muted transition-colors hover:text-accent"
            >
              {copied ? 'copied' : 'copy'}
            </button>
            <button
              onClick={() => setTempPassword(null)}
              className="font-mono text-xs lowercase text-fg-subtle transition-colors hover:text-fg"
            >
              dismiss
            </button>
          </div>
        </div>
      )}

      {error && (
        <p role="alert" className="mt-3 font-mono text-xs text-danger">
          <span className="text-danger/70">! </span>
          {error}
        </p>
      )}
    </div>
  )
}
