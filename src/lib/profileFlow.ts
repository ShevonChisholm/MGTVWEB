import { safeReturnTo } from "./appState";
/** Returning to the chooser after successful selection would create a loop. */
export function profileDestination(value: string | null) {
  const target = safeReturnTo(value);
  return /^\/profiles(?:\/|\?|$)/i.test(target) ? "/" : target;
}
export function profileHasRoom(count: number, limit: number) {
  return Number.isInteger(limit) && limit > 0 && count < Math.min(5, limit);
}
