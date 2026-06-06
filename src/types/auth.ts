// Auth/identity types from the backend contract.

export type Role = 'player' | 'admin'

// User is the account identity returned by POST /api/login.
export interface User {
  id: number
  username: string
  role: Role
}

// Me is GET /api/me: the identity plus the player's current level (the ordinal
// "solved count + 1"). This is the source of truth for auth state.
export interface Me extends User {
  currentLevel: number
}
