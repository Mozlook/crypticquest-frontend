// Tool types from the backend contract (GET /api/tools — the player's unlocked
// toolkit). Tools carry no secrets, so every field is safe to render.

// link    → content is an external URL
// pdf     → content is a path under files/tools/ (gated download)
// builtin → an in-app mini-tool (content is an identifier; none exist yet)
export type ToolType = 'link' | 'pdf' | 'builtin'

export interface Tool {
  id: number
  type: ToolType
  title: string
  description: string
  content: string
}

// AdminTool is the admin-surface view (GET/POST/PUT /api/admin/tools). It adds
// unlocks_at_level_id — the level whose solve unlocks this tool, or null when the
// tool is tied to no level (never auto-unlocked). The player view omits it.
export interface AdminTool extends Tool {
  unlocks_at_level_id: number | null
}
