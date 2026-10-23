import { useState } from "react"
import { Button, ButtonLink } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Text } from "@/components/ui/Text"
export function ResetPasswordPage() {
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [show, setShow] = useState(false)
  const [error, setError] = useState("")
  const [done, setDone] = useState(false)
  return (
    <div>
      <Text as="h1" className="mb-4 font-display text-5xl">
        {done ? "Demo reset complete" : "Set a demo password"}
      </Text>
      <Text className="mb-8 text-sm leading-relaxed text-text-secondary">
        {done
          ? "No real password was changed. Continue to simulated sign-in with any non-empty demo password."
          : "Use a made-up password of at least eight characters. This demonstration does not change a real account password."}
      </Text>
      {done ? (
        <ButtonLink to="/auth/sign-in" className="w-full">
          Continue to demo sign in
        </ButtonLink>
      ) : (
        <form
          className="space-y-5"
          onSubmit={(event) => {
            event.preventDefault()
            if (password !== confirm) {
              setError("Demo passwords must match.")
              return
            }
            setPassword("")
            setConfirm("")
            setDone(true)
          }}
        >
          {[
            {
              id: "reset-password",
              label: "New demo password",
              value: password,
              set: setPassword,
            },
            {
              id: "reset-confirm",
              label: "Confirm demo password",
              value: confirm,
              set: setConfirm,
            },
          ].map((field) => (
            <div key={field.id}>
              <Text
                as="label"
                htmlFor={field.id}
                className="mb-2 block text-sm"
              >
                {field.label}
              </Text>
              <Input
                id={field.id}
                type={show ? "text" : "password"}
                autoComplete="off"
                required
                minLength={8}
                value={field.value}
                onChange={(event) => field.set(event.target.value)}
                aria-invalid={!!error}
                aria-describedby={error ? "reset-error" : undefined}
                className="w-full"
              />
            </div>
          ))}
          <Button
            variant="ghost"
            aria-pressed={show}
            onClick={() => setShow(!show)}
          >
            {show ? "Hide" : "Show"} demo passwords
          </Button>
          {error && (
            <Text
              id="reset-error"
              role="alert"
              className="text-sm text-rose-300"
            >
              {error}
            </Text>
          )}
          <Button type="submit" className="w-full">
            Complete simulated reset
          </Button>
        </form>
      )}
    </div>
  )
}
