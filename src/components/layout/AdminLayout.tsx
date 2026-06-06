import { NavLink, Outlet } from 'react-router-dom'

// AdminLayout is the console shell: a heading and a tab bar (levels / tools /
// players) over an <Outlet> for each section. Rendered inside AppLayout (so the
// app header stays) and behind AdminRoute.

const tabClass = ({ isActive }: { isActive: boolean }) =>
  [
    '-mb-px border-b-2 px-3 py-2 font-mono text-sm lowercase tracking-wide transition-colors',
    isActive
      ? 'border-accent text-accent'
      : 'border-transparent text-fg-muted hover:text-fg',
  ].join(' ')

export default function AdminLayout() {
  return (
    <div className="mx-auto max-w-4xl">
      <header className="mb-5">
        <h1 className="font-display text-2xl font-bold tracking-tight text-fg">
          admin console
        </h1>
        <p className="mt-1 font-mono text-sm text-fg-muted">
          <span className="text-fg-subtle">{'// '}</span>
          content &amp; player management
        </p>
      </header>

      <nav className="flex gap-1 border-b border-border">
        <NavLink to="/admin/levels" className={tabClass}>
          levels
        </NavLink>
        <NavLink to="/admin/tools" className={tabClass}>
          tools
        </NavLink>
        <NavLink to="/admin/users" className={tabClass}>
          players
        </NavLink>
      </nav>

      <div className="mt-6">
        <Outlet />
      </div>
    </div>
  )
}
