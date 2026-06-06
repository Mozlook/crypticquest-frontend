import { useCallback, useEffect, useState } from 'react'
import { ApiError, api } from '../lib/api'

// useApi fetches a GET endpoint and tracks data/error/loading. `path` is the
// stable endpoint string (build it via the endpoints map). It refetches when
// `path` changes and on reload().
//
// Only async callbacks touch state (never synchronously in the effect), so it
// stays clear of react-hooks/set-state-in-effect. reload() keeps the current
// data on screen until the new response arrives (no flash); loading is true only
// until the first response.
export function useApi<T>(path: string) {
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<string | null>(null)
  // HTTP status of the error (e.g. 404/403) so callers can branch on it; null
  // when there is no error or it wasn't an ApiError (network failure).
  const [errorStatus, setErrorStatus] = useState<number | null>(null)
  const [reloadKey, setReloadKey] = useState(0)

  const reload = useCallback(() => setReloadKey((k) => k + 1), [])

  useEffect(() => {
    let cancelled = false
    api
      .get<T>(path)
      .then((d) => {
        if (cancelled) return
        setData(d)
        setError(null)
        setErrorStatus(null)
      })
      .catch((e) => {
        if (cancelled) return
        setError(e instanceof ApiError ? e.message : 'Request failed.')
        setErrorStatus(e instanceof ApiError ? e.status : null)
      })
    return () => {
      cancelled = true
    }
  }, [path, reloadKey])

  return { data, error, errorStatus, loading: data === null && error === null, reload }
}
