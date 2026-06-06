import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../auth/context'

// ProtectedRoute gates authenticated areas. App resolves loading/error upstream,
// so status here is authenticated or unauthenticated. Unauthenticated users are
// sent to /login with the intended location remembered, so login can return them
// there (deep-link support).
export default function ProtectedRoute() {
  const { status } = useAuth()
  const location = useLocation()

  if (status === 'authenticated') return <Outlet />
  return <Navigate to="/login" replace state={{ from: location }} />
}
