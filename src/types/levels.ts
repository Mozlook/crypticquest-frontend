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
