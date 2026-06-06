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
