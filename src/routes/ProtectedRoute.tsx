import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../auth/context'
import FullScreenLoader from '../components/FullScreenLoader'

// ProtectedRoute gates authenticated areas. While the bootstrap is in flight it
// shows the loader (never flashing login); once resolved it admits the user or
// redirects to /login, remembering the intended location so login can return
// the user there (deep-link support).
export default function ProtectedRoute() {
  const { status } = useAuth()
  const location = useLocation()

  if (status === 'loading') return <FullScreenLoader />
  if (status === 'unauthenticated') {
    return <Navigate to="/login" replace state={{ from: location }} />
  }
  return <Outlet />
}
