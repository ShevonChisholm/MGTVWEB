import { useState } from "react"
import { useLocation, useNavigate } from "react-router"
import { useAppState } from "@/context/AppStateContext"
import { Button, ButtonLink } from "@/components/ui/Button"
import { Text } from "@/components/ui/Text"
export function VerifyEmailPage() {
  const app = useAppState()
  const { state } = useLocation()
  const navigate = useNavigate()
  const details = state as {
    name?: string
    email?: string
  } | null
  const [confirmed, setConfirmed] = useState(false)
  return (
    <div>
      <Text as="h1" className="mb-4 font-display text-5xl">
        Demo verification
      </Text>
      <Text className="mb-3 text-gold">
        {details?.email ?? "No registration draft"}
      </Text>
      <Text className="mb-8 text-sm leading-relaxed text-text-secondary">
        No verification email has been sent. Use the action below to simulate
        verification and create your first profile.
      </Text>
      {details?.name && details.email ? (
        <>
          <Text className="mb-5 text-sm text-text-secondary">
            This replaces the current demo account, profiles, saved items and
            mock votes for this app session.
          </Text>
          {!confirmed ? (
            <Button variant="outline" onClick={() => setConfirmed(true)}>
              Replace existing demo account…
            </Button>
          ) : (
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={() => {
                  app.execute({
                    type: "register",
                    name: details.name!,
                    email: details.email!,
                  })
                  navigate("/profiles/create")
                }}
              >
                Confirm replacement & simulate verification
              </Button>
              <Button variant="ghost" onClick={() => setConfirmed(false)}>
                Cancel
              </Button>
            </div>
          )}
        </>
      ) : (
        <ButtonLink to="/auth/register">Create demo account</ButtonLink>
      )}
      <ButtonLink to="/auth/register" variant="ghost" className="mt-5">
        Change demo details
      </ButtonLink>
    </div>
  )
}
