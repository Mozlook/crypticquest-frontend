import { useState } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../../auth/context'
import { useApi } from '../../hooks/useApi'
import { endpoints } from '../../lib/endpoints'
import type { Tool } from '../../types/tools'
import ToolkitDrawer from './ToolkitDrawer'
import ToolkitList from '../toolkit/ToolkitList'

// AppLayout is the shell for the authenticated app: a terminal-style top bar
// (wordmark, nav, current-level indicator, logout) over an <Outlet> where the
// gameplay views render. The toolkit is a slide-over opened from the bar — not a
// route — so it's reachable from any view without leaving the puzzle. Mounted
// under ProtectedRoute, so the user is present. Logout flips auth status →
// unauthenticated, and ProtectedRoute redirects out.

const navItemClass =
  'font-mono text-sm lowercase tracking-wide transition-colors text-fg-muted hover:text-fg'

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  isActive ? navItemClass.replace('text-fg-muted hover:text-fg', 'text-accent') : navItemClass

export default function AppLayout() {
  const { user, logout } = useAuth()
  const [toolkitOpen, setToolkitOpen] = useState(false)
  const { data: tools, error: toolsError, loading: toolsLoading, reload: reloadTools } =
    useApi<Tool[]>(endpoints.tools)
  const level = String(user?.currentLevel ?? 1).padStart(2, '0')
  const toolCount = tools?.length ?? 0

  // Refetch on open so a tool unlocked since mount (by solving a level) shows up.
  const openToolkit = () => {
    reloadTools()
    setToolkitOpen(true)
  }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 border-b border-border bg-bg/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center gap-6 px-6 py-3">
          <Link to="/" className="font-display text-lg font-bold tracking-tight">
            <span className="text-fg">CRYPTIC</span>
            <span className="text-accent">QUEST</span>
          </Link>

          <nav className="flex items-center gap-5">
            {/* `end` so "/" is active only on the exact path, not every route. */}
            <NavLink to="/" end className={navLinkClass}>
              levels
            </NavLink>
            <button
              onClick={openToolkit}
              aria-haspopup="dialog"
              aria-expanded={toolkitOpen}
              className={navItemClass}
            >
              toolkit
              {toolCount > 0 && <span className="ml-1 text-accent">· {toolCount}</span>}
            </button>
            <NavLink to="/about" className={navLinkClass}>
              about
            </NavLink>
            {user?.role === 'admin' && (
              <NavLink to="/admin" className={navLinkClass}>
                admin
              </NavLink>
            )}
          </nav>

          <div className="ml-auto flex items-center gap-4">
            <span className="rounded border border-border bg-surface px-2.5 py-1 font-mono text-xs tracking-wide text-fg-muted">
              <span className="text-accent">▸</span> lvl {level}
            </span>
            <span className="hidden font-mono text-xs text-fg-subtle sm:inline">
              {user?.username}
            </span>
            <button
              onClick={() => logout()}
              className="rounded-md border border-border px-3 py-1.5 font-mono text-xs lowercase tracking-wide text-fg-muted transition-colors hover:border-danger hover:text-danger"
            >
              exit
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-8">
        <Outlet />
      </main>

      <ToolkitDrawer open={toolkitOpen} onClose={() => setToolkitOpen(false)}>
        <ToolkitList
          tools={tools}
          error={toolsError}
          loading={toolsLoading}
          onRetry={reloadTools}
        />
      </ToolkitDrawer>
    </div>
  )
}
