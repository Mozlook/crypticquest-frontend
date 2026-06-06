import type { Role } from './auth'

// AdminUser is the player-management view (GET /api/admin/users): account
// identity, role, registration time, and the derived current level (no password
// hash). created_at is an ISO timestamp string.
export interface AdminUser {
  id: number
  username: string
  role: Role
  created_at: string
  current_level: number
}
