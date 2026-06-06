import { Link } from 'react-router-dom'

// NotFound is the catch-all route for unmatched URLs.
export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center px-6 text-center">
      <p className="font-mono text-5xl font-semibold text-accent">404</p>
      <h1 className="mt-4 text-xl font-medium text-fg">Page not found</h1>
      <p className="mt-2 text-fg-muted">
        This route doesn&apos;t exist — or it&apos;s still locked.
      </p>
      <Link
        to="/"
        className="mt-6 rounded-md bg-accent px-4 py-2 font-medium text-accent-fg transition-colors hover:bg-accent-hover"
      >
        Back to start
      </Link>
    </main>
  )
}
