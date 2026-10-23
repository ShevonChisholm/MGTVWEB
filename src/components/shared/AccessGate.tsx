import { ButtonLink } from "@/components/ui/Button"
import { Text } from "@/components/ui/Text"
import { useAppState } from "@/context/AppStateContext"
export function AccessGate({
  reason = "Sign in and choose a profile to continue.",
}: {
  reason?: string
}) {
  const { state } = useAppState()
  return (
    <main className="mx-auto min-h-screen max-w-3xl px-6 pb-20 pt-32">
      <Text className="mb-3 text-xs uppercase tracking-widest text-gold">
        MGTV · Local prototype
      </Text>
      <Text as="h1" className="mb-4 font-display text-5xl">
        {state.session === "expired"
          ? "Demo session expired"
          : "Your profile matters"}
      </Text>
      <Text role="status" className="mb-8 leading-relaxed text-text-secondary">
        {reason}
      </Text>
      <div className="flex flex-wrap gap-3">
        <ButtonLink
          to={
            state.session === "signedIn"
              ? "/profiles"
              : `/auth/sign-in?returnTo=${encodeURIComponent(location.pathname + location.search)}`
          }
        >
          {state.session === "signedIn" ? "Choose profile" : "Demo sign in"}
        </ButtonLink>
        <ButtonLink to="/" variant="outline">
          Explore MGTV
        </ButtonLink>
      </div>
      <Text className="mt-6 text-xs text-text-secondary">
        No real account, payment, or security service is connected.
      </Text>
    </main>
  )
}
