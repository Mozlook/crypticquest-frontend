import { useApi } from '../../hooks/useApi'
import { useAuth } from '../../auth/context'
import { endpoints } from '../../lib/endpoints'
import type { AdminUser } from '../../types/users'
import AdminUserCard from '../../components/admin/AdminUserCard'

// AdminUsers is the player-management section: every account as a card with
// role, progress, password-reset and delete controls.
export default function AdminUsers() {
  const { data: users, error, loading, reload } = useApi<AdminUser[]>(endpoints.adminUsers)
  const { user: me } = useAuth()

  return (
    <div>
      <p className="mb-4 font-mono text-sm text-fg-muted">
        {users ? `${users.length} account${users.length === 1 ? '' : 's'}` : ''}
      </p>

      {loading && (
        <p className="font-mono text-sm text-fg-muted">
          <span className="cq-caret">loading accounts</span>
        </p>
      )}

      {error && (
        <div className="rounded-md border border-danger/30 bg-danger/10 px-4 py-3 font-mono text-sm text-danger">
          <span className="text-danger/70">! </span>
          {error}
          <button
            onClick={reload}
            className="ml-3 text-fg-muted underline underline-offset-2 transition-colors hover:text-fg"
          >
            retry
          </button>
        </div>
      )}

      {users && (
        <div className="space-y-3">
          {users.map((user) => (
            <AdminUserCard
              key={user.id}
              user={user}
              isSelf={me?.id === user.id}
              onChanged={reload}
            />
          ))}
        </div>
      )}
    </div>
  )
}
