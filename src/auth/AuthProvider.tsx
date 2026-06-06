import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { ApiError, api } from '../lib/api'
import { endpoints } from '../lib/endpoints'
import type { Me } from '../types/auth'
import { AuthContext, type AuthContextValue, type AuthStatus } from './context'

// AuthProvider owns the auth state machine: it bootstraps from /api/me on mount
// and exposes login/register/logout/refresh that keep the state in sync.
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Me | null>(null)
  const [status, setStatus] = useState<AuthStatus>('loading')

  // Bootstrap: is there already a valid session cookie? A clean 401 means "not
  // logged in"; anything else (network failure, 5xx) is an error state, so we
  // show a retry screen instead of dumping the user on login. Only the async
  // resolution touches state here (the initial state is already 'loading'), so
  // nothing is set synchronously from the effect.
  const runBootstrap = useCallback(() => {
    api
      .get<Me>(endpoints.me)
      .then((me) => {
        setUser(me)
        setStatus('authenticated')
      })
      .catch((err) => {
        setUser(null)
        setStatus(err instanceof ApiError && err.status === 401 ? 'unauthenticated' : 'error')
      })
  }, [])

  useEffect(() => {
    runBootstrap()
  }, [runBootstrap])

  // retry is invoked from the connection-error screen (a click handler, not an
  // effect), so flipping back to 'loading' here is fine.
  const retry = useCallback(() => {
    setStatus('loading')
    runBootstrap()
  }, [runBootstrap])

  const refresh = useCallback(async () => {
    const me = await api.get<Me>(endpoints.me)
    setUser(me)
    setStatus('authenticated')
  }, [])

  const login = useCallback(async (username: string, password: string) => {
    // POST /api/login sets the cookie but returns no currentLevel; read /api/me
    // so the state has the full Me shape from a single source of truth.
    await api.post(endpoints.login, { username, password })
    await refresh()
  }, [refresh])

  const register = useCallback(async (username: string, password: string) => {
    await api.post(endpoints.register, { username, password })
    // No session is created by register; state stays unauthenticated.
  }, [])

  const logout = useCallback(async () => {
    try {
      await api.post(endpoints.logout)
    } finally {
      // Clear local state even if the network call failed — the user intends
      // to be logged out.
      setUser(null)
      setStatus('unauthenticated')
    }
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({ user, status, login, register, logout, refresh, retry }),
    [user, status, login, register, logout, refresh, retry],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
