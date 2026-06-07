// Level types from the backend contract. The flag is never present in any
// player-facing shape (the backend doesn't even select it).

// LevelListItem is one entry from GET /api/levels — the player's accessible
// levels (solved ones plus the next unsolved), ordered. No order_index is
// exposed; the slice order is the contract.
export interface LevelListItem {
  id: number
  title: string
  solved: boolean
}

// LevelDetail is GET /api/levels/{id} — one level's player view (no flag).
// `files` lists the names of downloadable attachments served from
// /files/levels/{id}/<name> (empty when the level has none).
export interface LevelDetail {
  id: number
  title: string
  description: string
  solved: boolean
  files: string[]
}

// SubmitResult is POST /api/levels/{id}/submit — only whether the answer was
// correct, never how close (the backend deliberately gives no other signal).
export interface SubmitResult {
  correct: boolean
}

// AdminLevel is the admin-surface view of a level (GET/POST/PUT /api/admin/levels)
// — it includes the flag and the raw order_index, unlike any player view. Field
// names are snake_case to match the admin API. Which tools a level unlocks lives
// on the tools side now (Tool.unlocks_at_level_id).
export interface AdminLevel {
  id: number
  order_index: number
  title: string
  description: string
  flag: string
}
