import { createContext, useContext } from 'react'
import type { Me } from '../types/auth'

// AuthStatus is a small state machine for the bootstrap:
//   loading        — /api/me in flight; render nothing decisive yet
//   authenticated  — user is set
//   unauthenticated— no valid session (a clean 401)
//   error          — the bootstrap could not complete (network/server down) —
//                    distinct from unauthenticated so we don't dump the user on
//                    login when the truth is "couldn't reach the server"
export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated' | 'error'

export interface AuthContextValue {
  user: Me | null
  status: AuthStatus
  // login verifies credentials (sets the cookie) then loads /api/me. Throws
  // ApiError on bad credentials so the form can show the message.
  login: (username: string, password: string) => Promise<void>
  // register creates an account but does NOT log in (matches the backend);
  // the caller decides where to go next. Throws ApiError on validation/conflict.
  register: (username: string, password: string) => Promise<void>
  // logout clears the server session and local state.
  logout: () => Promise<void>
  // refresh re-reads /api/me — e.g. after solving a level unlocks the next one.
  refresh: () => Promise<void>
  // retry re-runs the bootstrap; used by the connection-error screen.
  retry: () => void
}

// Undefined default lets useAuth detect "used outside a provider".
export const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (ctx === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return ctx
}
