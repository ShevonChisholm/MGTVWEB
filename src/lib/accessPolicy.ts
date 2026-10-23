import { broadcasts, catalogById, type CatalogItem } from "../data/mockContent"
import type { AppState, ProfileType } from "./appState"
export const ceiling = (type: ProfileType) =>
  ({ adult: 4, teen: 3, child: 1 })[type]
const activeProfile = (state: AppState) =>
  state.session === "signedIn"
    ? state.profiles.find((p) => p.id === state.activeProfileId)
    : undefined

const levels: Record<string, number> = {
  G: 0,
  "TV-G": 0,
  PG: 1,
  "TV-PG": 1,
  "PG-13": 2,
  "TV-14": 3,
  R: 4,
  "TV-MA": 4,
}
export const ratingLevel = (rating?: string) =>
  rating ? levels[rating] : undefined
export function contentForMedia(id: string) {
  return catalogById[broadcasts[id]?.eventId ?? id]
}
export function canDiscover(state: AppState, item?: CatalogItem): boolean {
  if (!item) return false
  const profile = activeProfile(state)
  if (!profile || profile.type === "adult")
    return (
      !profile ||
      (ratingLevel(item.classification) ?? 4) <= profile.controls.maxRating
    )
  const rating = ratingLevel(item.classification)
  return (
    rating !== undefined &&
    rating <= Math.min(ceiling(profile.type), profile.controls.maxRating)
  )
}
export function playbackReason(
  state: AppState,
  id: string,
): string | undefined {
  const item = contentForMedia(id)
  if (!item) return "This preview is not available."
  if (!canDiscover(state, item))
    return "Not available for this profile. Ask an adult to review content controls."
  if (item.access === "premium" && state.session !== "signedIn")
    return "Sign in to the demo account for premium previews."
  if (state.session === "signedIn" && !activeProfile(state))
    return "Choose a profile before starting playback."
  const profile = activeProfile(state)
  if (
    item.type !== "track" &&
    profile?.controls.dailyLimit &&
    state.profileData[profile.id].usedSeconds >= profile.controls.dailyLimit
  )
    return "This profile has reached its daily demo viewing limit. Browsing and audio are still available."
}
