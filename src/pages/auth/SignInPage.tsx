import { useState } from "react"
import { useNavigate, useSearchParams } from "react-router"
import { useAppState } from "@/context/AppStateContext"
import { Button, ButtonLink } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Text } from "@/components/ui/Text"
import { safeReturnTo } from "@/lib/appState"
export function SignInPage() {
  const app = useAppState()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  return (
    <div>
      <Text as="h1" className="mb-3 font-display text-5xl">
        Welcome back
      </Text>
      <Text className="mb-8 text-sm leading-relaxed text-text-secondary">
        {app.state.session === "expired" ? "Your demo session expired. " : ""}
        Simulated sign-in only. Any valid email and non-empty demo password
        works. Do not use real credentials.
      </Text>
      <form
        onSubmit={(event) => {
          event.preventDefault()
          if (loading) return
          setLoading(true)
          setPassword("")
          app.execute({ type: "signIn" })
          navigate(
            `/profiles?returnTo=${encodeURIComponent(safeReturnTo(params.get("returnTo")))}`,
          )
        }}
        className="space-y-5"
      >
        <div>
          <Text
            as="label"
            htmlFor="signin-email"
            className="mb-2 block text-sm"
          >
            Demo email
          </Text>
          <Input
            id="signin-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            className="w-full"
          />
        </div>
        <div>
          <Text
            as="label"
            htmlFor="signin-password"
            className="mb-2 block text-sm"
          >
            Demo password
          </Text>
          <Input
            id="signin-password"
            type={show ? "text" : "password"}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="off"
            required
            className="w-full"
          />
          <Button
            variant="ghost"
            size="sm"
            aria-pressed={show}
            onClick={() => setShow(!show)}
          >
            {show ? "Hide" : "Show"} demo password
          </Button>
        </div>
        <Button type="submit" size="lg" disabled={loading} className="w-full">
          {loading ? "Continuing…" : "Simulate sign in"}
        </Button>
      </form>
      <div className="mt-6 flex flex-wrap gap-3">
        <ButtonLink to="/auth/forgot-password" variant="ghost">
          Forgot password
        </ButtonLink>
        <ButtonLink to="/auth/register" variant="ghost">
          Create demo account
        </ButtonLink>
      </div>
    </div>
  )
}
