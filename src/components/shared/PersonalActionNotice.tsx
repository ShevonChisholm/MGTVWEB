import { useLocation } from "react-router"
import { useAppState } from "@/context/AppStateContext"
import { Button, ButtonLink } from "@/components/ui/Button"
import { Text } from "@/components/ui/Text"
export function PersonalActionNotice() {
  const app = useAppState()
  const location = useLocation()
  if (import.meta.env.VITE_API_MODE === "connected" || !app.signInRequested || app.profile) return null
  return (
    <aside
      role="alert"
      className="fixed right-4 top-20 z-40 max-w-xs rounded-xl border border-gold/30 bg-bg-surface p-5 shadow-xl"
    >
      <Text className="mb-4 text-sm leading-relaxed">
        Sign in and choose a profile for saved items, playlists, reminders and
        personal actions. This is a local demo only.
      </Text>
      <div className="flex flex-wrap gap-2">
        <ButtonLink
          to={
            app.state.session === "signedIn"
              ? "/profiles"
              : `/auth/sign-in?returnTo=${encodeURIComponent(location.pathname + location.search)}`
          }
          size="sm"
          onClick={() => app.setSignInRequested(false)}
        >
          {app.state.session === "signedIn" ? "Choose profile" : "Demo sign in"}
        </ButtonLink>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => app.setSignInRequested(false)}
        >
          Dismiss
        </Button>
      </div>
    </aside>
  )
}
