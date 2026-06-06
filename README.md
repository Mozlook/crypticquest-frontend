# crypticquest-frontend

The web client for **CrypticQuest** — a cryptography puzzle game. Players log in,
work through sequential levels, submit flags, reveal timed hints, and earn tools;
admins manage puzzles, hints, tools, and players. It talks to the backend API
over `fetch`, with the session carried in an `HttpOnly` cookie.

Stack: **Vite + React 19 + TypeScript + Tailwind CSS v4 + React Router 7**. No
data-fetching or state library — the app is small enough that a thin `fetch`
wrapper plus React context cover it.

---

## Design language — "Intelligence Terminal"

A dark, refined secure-terminal aesthetic, not generic dashboard UI:

- **Type**: Chakra Petch (display / HUD headings) + IBM Plex Mono (everything
  else). Loaded in `index.html`.
- **Color**: a cold near-black surface stack, one sharp phosphor-green accent, a
  cipher-cyan secondary, and amber/red status — all defined as tokens in
  `src/index.css` under Tailwind's `@theme`, so each token auto-generates its
  utilities (`--color-accent` → `bg-accent` / `text-accent` / …). Re-theming is a
  one-file edit; nothing downstream hardcodes a hex.
- **Signature motion**: `useDecrypt` resolves text from scrambled glyphs to clear
  — the "decryption" effect on auth subtitles and the access screen. Honors
  `prefers-reduced-motion`.
- **Sizing knob**: `html { font-size }` in `index.css` scales the whole UI
  proportionally (Tailwind sizing is rem-based).

---

## Architecture

### Data & networking

- **`lib/api.ts`** — the only place that calls `fetch`. It always sends
  `credentials: 'include'` (required for the cross-origin session cookie), sets
  JSON headers, and turns any non-2xx into a thrown `ApiError` carrying the HTTP
  status and the backend's `{"error"}` message. It also exposes a global
  `onUnauthorized` hook (any `401` → the app clears auth and the route guards
  redirect to login) and `fileUrl()` for building absolute gated-download links.
- **`lib/endpoints.ts`** — the single source of truth for backend paths (mirrors
  the backend's `routes.go`). Nothing else hardcodes a URL; parameterized routes
  are functions.
- **`hooks/useApi.ts`** — a tiny GET hook (`data` / `error` / `errorStatus` /
  `loading` / `reload`) used by every read view.

### Auth & routing

- **`auth/`** — `AuthProvider` owns the auth state machine
  (`loading | authenticated | unauthenticated | error`). On load it bootstraps
  from `GET /api/me`; it exposes `login`, `register`, `logout`, `refresh`, and a
  `retry` for the connection-error screen. `useAuth()` is the consumer hook
  (kept in a separate module from the provider so Fast Refresh stays happy).
- **`routes/`** — route guards used as layout routes with `<Outlet/>`:
  `ProtectedRoute` (must be authenticated), `PublicOnlyRoute` (login/register —
  redirects authenticated users away, and performs the post-login redirect,
  honoring a deep-link `from`), and `AdminRoute` (`role == admin`).
- **`App.tsx`** — a single bootstrap gate (loader while `/api/me` is in flight,
  a retry screen if the server is unreachable) wrapping the route map.

### Layout & views

- **`components/layout/`** — `AppLayout` (the authenticated shell: nav,
  current-level indicator, logout, admin link), `AdminLayout` (the admin console
  tab bar), and `ToolkitDrawer` (a right-side slide-over so the toolkit is
  reachable without leaving the puzzle; `inert` + focus management when closed).
- **`pages/`** — `Login`, `Register`, `Levels` (the archive), `Puzzle`,
  `NotFound`, and `admin/` (`AdminLevels`, `AdminTools`, `AdminUsers`).
- **`components/`** is grouped by domain — `auth/`, `ui/` (shared `TextField`,
  `SubmitButton`), `levels/` (`LevelRow`, `SubmitFlag`, `Hints`), `toolkit/`
  (`ToolItem`, `ToolkitList`), `admin/` (forms, rows, the player card).
- **`types/`** — domain types split per file (`auth`, `levels`, `hints`,
  `tools`, `users`).

### Notable behaviors

- **Flag submission** shows only correct / a neutral "incorrect" (no "almost",
  matching the backend); a correct answer refreshes auth state (current level,
  unlocked tools) and offers a "next transmission" jump.
- **Hints** render as covered bars unlocked on a client-side schedule (`5 + 15·i`
  minutes), with the start time persisted per level in `localStorage`. The
  backend tracks no hint state.
- **Puzzle attachments** come from the level's `files[]` and link to the gated
  `/files/levels/{id}/...`; the browser sends the cookie automatically.

---

## Project layout

```
src/
  main.tsx            app entry: Router → AuthProvider → App
  App.tsx             bootstrap gate + route map
  index.css           Tailwind import + @theme tokens + base styles
  lib/
    api.ts            central fetch client, ApiError, fileUrl, 401 hook
    endpoints.ts      all backend paths (single source of truth)
  auth/               AuthProvider, context + useAuth
  routes/             ProtectedRoute, PublicOnlyRoute, AdminRoute
  hooks/              useApi, useDecrypt
  types/              per-domain API types
  components/
    layout/           AppLayout, AdminLayout, ToolkitDrawer
    auth/             AuthShell
    ui/               TextField, SubmitButton
    levels/           LevelRow, SubmitFlag, Hints
    toolkit/          ToolItem, ToolkitList
    admin/            LevelForm, HintsEditor, AdminLevelRow, ToolForm, AdminToolRow, AdminUserCard
  pages/              Login, Register, Levels, Puzzle, NotFound, admin/*
```

### Conventions

- **One component per file**; page files contain only the page (sub-components
  live under `components/<domain>/`).
- **Types split per domain** under `src/types/` — never a single `types.ts`.
- **All backend paths** come from `lib/endpoints.ts` — never hardcode a URL.

---

## Local development

The frontend expects the backend running at `VITE_API_URL` (default
`http://localhost:8080`). Start the backend first.

```sh
npm install
npm run dev       # Vite dev server on http://localhost:5173
npm run build     # type-check (tsc -b) + production build to dist/
npm run lint      # ESLint
```

### Environment

`VITE_API_URL` is the only variable — the base URL of the backend API, no
trailing slash. It's read in `lib/api.ts` and typed in `src/vite-env.d.ts`.

```sh
# .env (committed — local default, no secrets)
VITE_API_URL=http://localhost:8080
```

To point a local frontend at a different backend, create `.env.local`
(gitignored). See [`.env.example`](./.env.example).

> The dev server must run on `:5173` — that's the origin the backend's CORS
> allows by default. If the port is taken, free it rather than letting Vite pick
> another (`npm run dev -- --port 5173 --strictPort`).
