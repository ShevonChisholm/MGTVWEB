import { useState } from "react"
import { Button, ButtonLink } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Text } from "@/components/ui/Text"
export function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)
  return (
    <div>
      <Text as="h1" className="mb-4 font-display text-5xl">
        {submitted ? "Demo reset requested" : "Forgot your password?"}
      </Text>
      <Text className="mb-8 text-sm leading-relaxed text-text-secondary">
        {submitted
          ? `Sample request for ${email}. No email has been sent. Continue below to demonstrate the reset screen.`
          : "Enter a sample email to demonstrate a reset request. No email will be sent and no real account is accessed."}
      </Text>
      {submitted ? (
        <ButtonLink to="/auth/reset-password" className="w-full">
          Continue simulated reset
        </ButtonLink>
      ) : (
        <form
          className="space-y-5"
          onSubmit={(event) => {
            event.preventDefault()
            setSubmitted(true)
          }}
        >
          <div>
            <Text
              as="label"
              htmlFor="forgot-email"
              className="mb-2 block text-sm"
            >
              Demo email
            </Text>
            <Input
              id="forgot-email"
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full"
            />
          </div>
          <Button type="submit" className="w-full">
            Simulate reset request
          </Button>
        </form>
      )}
      <ButtonLink to="/auth/sign-in" variant="ghost" className="mt-5">
        Back to demo sign in
      </ButtonLink>
    </div>
  )
}
