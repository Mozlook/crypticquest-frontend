import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { api } from '../lib/api'
import { endpoints } from '../lib/endpoints'
import type { Me } from '../types/auth'
import { AuthContext, type AuthContextValue, type AuthStatus } from './context'

// AuthProvider owns the auth state machine: it bootstraps from /api/me on mount
// and exposes login/register/logout/refresh that keep the state in sync.
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Me | null>(null)
  const [status, setStatus] = useState<AuthStatus>('loading')

  // Bootstrap: is there already a valid session cookie? A 401 (or any failure)
  // simply means "not logged in" for now; a dedicated error screen for the
  // can't-reach-server case is a later backlog item.
  useEffect(() => {
    let cancelled = false
    api
      .get<Me>(endpoints.me)
      .then((me) => {
        if (cancelled) return
        setUser(me)
        setStatus('authenticated')
      })
      .catch(() => {
        if (cancelled) return
        setUser(null)
        setStatus('unauthenticated')
      })
    return () => {
      cancelled = true
    }
  }, [])

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
    () => ({ user, status, login, register, logout, refresh }),
    [user, status, login, register, logout, refresh],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
