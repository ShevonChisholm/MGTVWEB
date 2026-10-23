import { ButtonLink } from "@/components/ui/Button"
import { Text } from "@/components/ui/Text"
import { useAppState } from "@/context/AppStateContext"
export function AuthLandingPage() {
  const { execute } = useAppState()
  return (
    <div className="text-center">
      <Text className="mb-5 font-display text-3xl tracking-widest text-gold">
        MGTV
      </Text>
      <Text as="h1" className="mb-4 font-display text-5xl">
        Welcome to MGTV
      </Text>
      <Text className="mx-auto mb-10 max-w-sm text-sm leading-relaxed text-text-secondary">
        Explore Jamaican and Caribbean series, music and cultural stories.
        Choose a demo account or browse the sample collection as a guest.
      </Text>
      <div className="space-y-3">
        <ButtonLink to="/auth/register" size="lg" className="w-full">
          Create demo account
        </ButtonLink>
        <ButtonLink
          to="/auth/sign-in"
          size="lg"
          variant="outline"
          className="w-full"
        >
          Demo sign in
        </ButtonLink>
      </div>
      <ButtonLink
        to="/"
        variant="ghost"
        className="mt-6 w-full"
        onClick={() => execute({ type: "scenario", session: "guest" })}
      >
        Continue browsing as guest
      </ButtonLink>
      <div className="mt-8 grid grid-cols-3 gap-3">
        {["Series & films", "Caribbean music", "Sport & culture"].map(
          (label) => (
            <div
              key={label}
              className="rounded-lg border border-text-muted/20 bg-bg-surface p-3"
            >
              <svg
                aria-hidden="true"
                className="mx-auto mb-3 h-5 w-5 text-gold"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeWidth={1.5} d="M5 4h14v16H5V4Zm4 4 6 4-6 4V8Z" />
              </svg>
              <Text className="text-xs text-text-secondary">{label}</Text>
            </div>
          ),
        )}
      </div>
      <Text className="mt-8 text-xs text-text-secondary">
        Local prototype only. No real accounts, authentication or emails.
      </Text>
    </div>
  )
}
