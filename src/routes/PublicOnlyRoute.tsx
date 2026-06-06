import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../auth/context'

// PublicOnlyRoute guards the login/register pages: an already-authenticated user
// has no business there, so they're sent to where they were headed (the `from`
// stashed by ProtectedRoute) or to the app root. This also performs the
// post-login redirect — when login flips the status to authenticated, this
// re-renders and navigates away. App resolves loading/error upstream, so status
// here is authenticated or unauthenticated.
export default function PublicOnlyRoute() {
  const { status } = useAuth()
  const location = useLocation()

  if (status === 'authenticated') {
    const from = (location.state as { from?: { pathname?: string } } | null)?.from
    return <Navigate to={from?.pathname ?? '/'} replace />
  }
  return <Outlet />
}
