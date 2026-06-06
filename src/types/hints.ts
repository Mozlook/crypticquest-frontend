// Hint type from the backend contract (GET /api/levels/{id}/hints). Hints arrive
// already ordered; the array order is the contract (no order_index is exposed).
export interface Hint {
  id: number
  text: string
}
