import { useState, type FormEvent } from 'react'
import { Link, useLocation } from 'react-router-dom'
import AuthShell from '../components/auth/AuthShell'
import TextField from '../components/ui/TextField'
import SubmitButton from '../components/ui/SubmitButton'
import { useAuth } from '../auth/context'
import { ApiError } from '../lib/api'

export default function Login() {
  const { login } = useAuth()
  // After registration we land here with a success flag and the identifier to
  // prefill (set by the register page via navigation state).
  const nav = useLocation().state as { registered?: boolean; username?: string } | null
  const [username, setUsername] = useState(nav?.username ?? '')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      await login(username, password)
      // On success the status flips to authenticated and PublicOnlyRoute
      // redirects away (honoring any deep-link `from`); no navigate here.
    } catch (err) {
      // Backend returns a single generic message for bad credentials; show it
      // as-is (no "almost", no field-level hints).
      setError(err instanceof ApiError ? err.message : 'Something went wrong.')
      setSubmitting(false)
    }
  }

  return (
    <AuthShell
      subtitle="authenticate to access the archive"
      footer={
        <>
          no clearance?{' '}
          <Link to="/register" className="text-accent transition-colors hover:text-accent-hover">
            request access
          </Link>
        </>
      }
    >
      {nav?.registered && (
        <p
          role="status"
          className="mb-5 rounded-md border border-accent/30 bg-accent/10 px-3 py-2 font-mono text-sm text-accent"
        >
          <span className="text-accent/70">✓ </span>
          account created — authenticate to continue
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-5" autoComplete="off" noValidate>
        <TextField
          id="username"
          label="identifier"
          autoComplete="off"
          noAutofill
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoFocus
          required
        />
        <TextField
          id="password"
          label="passphrase"
          type="password"
          autoComplete="off"
          noAutofill
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && (
          <p
            role="alert"
            className="rounded-md border border-danger/30 bg-danger/10 px-3 py-2 font-mono text-sm text-danger"
          >
            <span className="text-danger/70">! </span>
            {error}
          </p>
        )}

        <SubmitButton loading={submitting}>
          {submitting ? 'authenticating…' : 'authenticate →'}
        </SubmitButton>
      </form>
    </AuthShell>
  )
}
