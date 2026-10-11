/**
 * Generate a reasonably unique id. Uses crypto.randomUUID when available
 * (all modern Chrome versions), with a small fallback for other contexts.
 */
export function createId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}
