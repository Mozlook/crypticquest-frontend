import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../auth/context'

// AdminRoute gates the admin console. It sits under ProtectedRoute (so the user
// is authenticated); here we additionally require the admin role. Non-admins are
// sent back to the app root rather than shown a forbidden page — the admin area
// simply doesn't exist for them.
export default function AdminRoute() {
  const { user } = useAuth()
  if (user?.role !== 'admin') return <Navigate to="/" replace />
  return <Outlet />
}
