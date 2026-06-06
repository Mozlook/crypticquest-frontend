// Single source of truth for backend paths. Nothing else in the app should
// hardcode a URL string — import from here. Mirrors the backend's routes.go, so
// a path change is one edit, and every caller stays in sync.
//
// Parameterized routes are functions; static ones are strings. Paths are
// relative (no host) — the API client prepends VITE_API_URL, and /files/* paths
// are used directly as <a href> (the browser prepends the origin).

export const endpoints = {
  // Auth (public)
  register: '/api/register',
  login: '/api/login',
  logout: '/api/logout',

  // Player (authenticated)
  me: '/api/me',
  levels: '/api/levels',
  level: (id: number | string) => `/api/levels/${id}`,
  levelSubmit: (id: number | string) => `/api/levels/${id}/submit`,
  levelHints: (id: number | string) => `/api/levels/${id}/hints`,
  tools: '/api/tools',

  // Gated downloads (used as <a href>, not via the API client)
  levelFile: (id: number | string, path: string) => `/files/levels/${id}/${path}`,
  toolFile: (path: string) => `/files/tools/${path}`,

  // Admin (role == admin)
  adminLevels: '/api/admin/levels',
  adminLevel: (id: number | string) => `/api/admin/levels/${id}`,
  adminLevelHints: (id: number | string) => `/api/admin/levels/${id}/hints`,
  adminTools: '/api/admin/tools',
  adminTool: (id: number | string) => `/api/admin/tools/${id}`,
  adminUsers: '/api/admin/users',
  adminUser: (id: number | string) => `/api/admin/users/${id}`,
  adminUserResetPassword: (id: number | string) =>
    `/api/admin/users/${id}/reset-password`,
} as const
