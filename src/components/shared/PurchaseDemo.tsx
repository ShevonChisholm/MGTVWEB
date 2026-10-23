import { useState } from "react"
import { Button, ButtonLink } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Text } from "@/components/ui/Text"
import { useAppState } from "@/context/AppStateContext"
import { SessionDialog } from "./SessionDialog"
export function PurchaseDemo({
  label,
  variant = "primary",
  className = "",
}: {
  label: string
  variant?: "primary" | "outline" | "ghost"
  className?: string
}) {
  const app = useAppState()
  const [open, setOpen] = useState(false)
  const [pin, setPin] = useState("")
  const [message, setMessage] = useState("")
  const close = () => {
    setOpen(false)
    setPin("")
    setMessage("")
  }
  return (
    <>
      <Button
        variant={variant}
        className={className}
        onClick={() => setOpen(true)}
      >
        {label}
      </Button>
      {open && (
        <SessionDialog title="Payments are not connected" onClose={close}>
          <Text className="mb-6 text-sm text-text-secondary">
            This is a mock purchase entry point. No payment, order, trial, plan
            change or cancellation will take place.
          </Text>
          {!app.profile ? (
            <ButtonLink to="/auth/sign-in" onClick={close}>
              Demo sign in
            </ButtonLink>
          ) : (
            <>
              {app.profile.controls.purchasePin && (
                <div>
                  <Text
                    as="label"
                    htmlFor="purchase-pin"
                    className="mb-2 block text-sm"
                  >
                    Demo purchase PIN (1234)
                  </Text>
                  <Input
                    id="purchase-pin"
                    type="password"
                    inputMode="numeric"
                    maxLength={4}
                    value={pin}
                    onChange={(event) => setPin(event.target.value)}
                  />
                </div>
              )}
              <Button
                className="mt-5"
                onClick={() =>
                  setMessage(
                    app.profile?.controls.purchasePin &&
                      pin !== app.state.account.pin
                      ? "Incorrect demo PIN. Nothing has changed."
                      : "Demo authorization complete. Payments are not connected; nothing was purchased or changed.",
                  )
                }
              >
                Check demo authorization
              </Button>
              {message && (
                <Text role="status" className="mt-4 text-sm text-gold">
                  {message}
                </Text>
              )}
            </>
          )}
        </SessionDialog>
      )}
    </>
  )
}
