import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthShell from '../components/auth/AuthShell'
import TextField from '../components/ui/TextField'
import SubmitButton from '../components/ui/SubmitButton'
import { useAuth } from '../auth/context'
import { ApiError } from '../lib/api'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    // The only check the backend can't make for us; everything else (length,
    // charset, uniqueness) is validated server-side and surfaced as-is.
    if (password !== confirm) {
      setError('Passphrases do not match.')
      return
    }
    setSubmitting(true)
    try {
      await register(username, password)
      // Registration creates no session — hand the new agent to login, with a
      // success banner and their identifier prefilled.
      navigate('/login', { replace: true, state: { registered: true, username } })
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Something went wrong.')
      setSubmitting(false)
    }
  }

  return (
    <AuthShell
      subtitle="request access // new operative"
      footer={
        <>
          already cleared?{' '}
          <Link to="/login" className="text-accent transition-colors hover:text-accent-hover">
            authenticate
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5" autoComplete="off" noValidate>
        <TextField
          id="username"
          label="identifier"
          autoComplete="off"
          noAutofill
          hint="3–32 chars · letters, digits, . _ -"
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
          hint="8–72 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <TextField
          id="confirm"
          label="confirm passphrase"
          type="password"
          autoComplete="off"
          noAutofill
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
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
          {submitting ? 'provisioning…' : 'request access →'}
        </SubmitButton>
      </form>
    </AuthShell>
  )
}
