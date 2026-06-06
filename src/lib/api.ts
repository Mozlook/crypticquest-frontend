// Central API client. Every request goes through here so three things are
// guaranteed in one place:
//   1. credentials: 'include' — the session lives in an HttpOnly cookie the
//      browser only sends cross-origin when this is set.
//   2. JSON headers on requests that carry a body.
//   3. uniform error handling — non-2xx responses become a thrown ApiError
//      carrying the status and the backend's {"error": "..."} message.
//
// File downloads (/files/*) are NOT fetched through here — those are plain
// <a href> links the browser handles, sending the cookie automatically.

const BASE_URL = import.meta.env.VITE_API_URL

// ApiError carries the HTTP status so callers can branch (401 → login,
// 403 → forbidden, 409 → conflict) without string-matching messages.
// status 0 means the request never reached the server (network/CORS failure).
export class ApiError extends Error {
  readonly status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
): Promise<T> {
  const init: RequestInit = {
    method,
    credentials: 'include',
  }
  if (body !== undefined) {
    init.headers = { 'Content-Type': 'application/json' }
    init.body = JSON.stringify(body)
  }

  let res: Response
  try {
    res = await fetch(`${BASE_URL}${path}`, init)
  } catch {
    // Connection refused, DNS failure, offline, or a CORS preflight rejection.
    throw new ApiError(0, 'Could not reach the server. Check your connection.')
  }

  // 204 No Content (logout, deletes) has no body to parse.
  if (res.status === 204) {
    return undefined as T
  }

  let data: unknown
  try {
    data = await res.json()
  } catch {
    if (!res.ok) {
      throw new ApiError(res.status, `Request failed (${res.status})`)
    }
    throw new ApiError(res.status, 'Malformed response from the server.')
  }

  if (!res.ok) {
    const message =
      (data as { error?: string })?.error ?? `Request failed (${res.status})`
    throw new ApiError(res.status, message)
  }

  return data as T
}

// Thin verb helpers. Generic <T> is the expected success-response shape.
export const api = {
  get: <T>(path: string) => request<T>('GET', path),
  post: <T>(path: string, body?: unknown) => request<T>('POST', path, body),
  put: <T>(path: string, body?: unknown) => request<T>('PUT', path, body),
  del: <T>(path: string) => request<T>('DELETE', path),
}
