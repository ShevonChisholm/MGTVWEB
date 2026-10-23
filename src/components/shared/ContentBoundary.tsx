import { useEffect, type ReactNode } from "react"
import { useLocation } from "react-router"
import { catalogById } from "@/data/mockContent"
import { useAppState } from "@/context/AppStateContext"
import { AccessGate } from "./AccessGate"
export function ContentBoundary({ children }: { children: ReactNode }) {
  const app = useAppState()
  const location = useLocation()
  const parts = location.pathname.split("/").filter(Boolean)
  const id = parts[0] === "music" ? parts[2] : parts[1]
  const item = id ? catalogById[id] : undefined
  useEffect(() => {
    const state = app.ref.current
    const profileId =
      state.session === "signedIn" ? state.activeProfileId : null
    if (!profileId || !item || !app.allowed(item)) return
    const data = state.profileData[profileId]
    if (data.recentlyViewed[0] !== item.id)
      app.execute(
        {
          type: "data",
          id: profileId,
          data: {
            recentlyViewed: [
              item.id,
              ...data.recentlyViewed.filter((value) => value !== item.id),
            ].slice(0, 6),
          },
        },
        true,
      )
  }, [location.pathname, app.profile?.id])
  if (item && !app.allowed(item))
    return (
      <AccessGate reason="Not available for this profile. Ask an adult to review content controls." />
    )
  if (["my-list", "notifications"].includes(parts[0]) && !app.profile)
    return <AccessGate />
  if (
    parts[0] === "watch" ||
    (parts[0] === "events" && parts[2] === "watch") ||
    (parts[0] === "music" && parts[1] === "video")
  ) {
    const reason = item ? app.reason(item.id) : undefined
    if (reason) return <AccessGate reason={reason} />
  }
  return children
}
