import { useState } from "react"
import { useNavigate } from "react-router"
import { Button, ButtonLink } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Text } from "@/components/ui/Text"
export function RegisterPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirm: "",
  })
  const [error, setError] = useState("")
  const [show, setShow] = useState(false)
  return (
    <div>
      <Text as="h1" className="mb-3 font-display text-5xl">
        Create a demo account
      </Text>
      <Text className="mb-8 text-sm leading-relaxed text-text-secondary">
        Local demonstration only. No account or email is created. Use sample
        details and a made-up password.
      </Text>
      <form
        onSubmit={(event) => {
          event.preventDefault()
          if (form.password !== form.confirm) {
            setError("Demo passwords must match.")
            return
          }
          navigate("/auth/verify-email", {
            state: {
              name: `${form.firstName.trim()} ${form.lastName.trim()}`,
              email: form.email,
            },
          })
        }}
        className="space-y-4"
      >
        {([
          "firstName",
          "lastName",
          "email",
          "password",
          "confirm",
        ] as const).map((key) => (
          <div key={key}>
            <Text
              as="label"
              htmlFor={`register-${key}`}
              className="mb-2 block text-sm"
            >
              {
                {
                  firstName: "First name",
                  lastName: "Last name",
                  email: "Demo email",
                  password: "Demo password",
                  confirm: "Confirm demo password",
                }[key]
              }
            </Text>
            <Input
              id={`register-${key}`}
              type={
                key === "email"
                  ? "email"
                  : key === "password" || key === "confirm"
                    ? show
                      ? "text"
                      : "password"
                    : "text"
              }
              autoComplete="off"
              required
              minLength={key === "password" || key === "confirm" ? 8 : 1}
              maxLength={100}
              value={form[key]}
              className="w-full"
              onChange={(event) =>
                setForm({ ...form, [key]: event.target.value })
              }
              aria-describedby={error ? "register-error" : undefined}
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
            id="register-error"
            role="alert"
            className="text-sm text-rose-300"
          >
            {error}
          </Text>
        )}
        <Button type="submit" size="lg" className="w-full">
          Continue to demo verification
        </Button>
      </form>
      <ButtonLink to="/auth/sign-in" variant="ghost" className="mt-5">
        Already have a demo account? Sign in
      </ButtonLink>
    </div>
  )
}
