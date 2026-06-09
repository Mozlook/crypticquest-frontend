import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './auth/context'
import FullScreenLoader from './components/FullScreenLoader'
import ConnectionError from './components/ConnectionError'
import ProtectedRoute from './routes/ProtectedRoute'
import PublicOnlyRoute from './routes/PublicOnlyRoute'
import AdminRoute from './routes/AdminRoute'
import AppLayout from './components/layout/AppLayout'
import AdminLayout from './components/layout/AdminLayout'
import Levels from './pages/Levels'
import Puzzle from './pages/Puzzle'
import About from './pages/About'
import AdminLevels from './pages/admin/AdminLevels'
import AdminTools from './pages/admin/AdminTools'
import AdminUsers from './pages/admin/AdminUsers'
import Login from './pages/Login'
import Register from './pages/Register'
import NotFound from './pages/NotFound'

// App holds the route map. A single bootstrap gate runs first: while /api/me is
// in flight we show the loader (never flashing the wrong page), and if it failed
// to reach the server we show a retry screen. Only once the session status is
// resolved (authenticated/unauthenticated) do the routes render — so the guards
// only ever deal with those two states. Gameplay and admin go under
// ProtectedRoute as later phases land.
function App() {
  const { status, retry } = useAuth()

  if (status === 'loading') return <FullScreenLoader />
  if (status === 'error') return <ConnectionError onRetry={retry} />

  return (
    <Routes>
      <Route element={<PublicOnlyRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Levels />} />
          <Route path="/levels/:id" element={<Puzzle />} />
          <Route path="/about" element={<About />} />

          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="/admin/levels" replace />} />
              <Route path="levels" element={<AdminLevels />} />
              <Route path="tools" element={<AdminTools />} />
              <Route path="users" element={<AdminUsers />} />
            </Route>
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
