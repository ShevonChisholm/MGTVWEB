import { useState } from "react"
import { useAppState } from "@/context/AppStateContext"
import { Button } from "@/components/ui/Button"
import { Text } from "@/components/ui/Text"
import { SessionDialog } from "./SessionDialog"
import { useLocation } from "react-router"
export function DemoControls() {
  const { pathname } = useLocation()
  const standalone =
    pathname.startsWith("/auth") || pathname === "/profiles/create"
  const app = useAppState()
  const [open, setOpen] = useState(false)
  const [resetting, setResetting] = useState(false)
  return (
    <>
      <div
        className={`border-b border-text-muted/20 bg-bg-surface px-6 py-2 md:px-16 ${
          standalone ? "" : "pt-20"
        }`}
      >
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
          <Text className="text-xs text-text-secondary">
            Local demo ·{" "}
            {app.state.session === "signedIn"
              ? app.profile
                ? `${app.profile.name} / ${app.profile.type}`
                : "Choose a profile"
              : app.state.session === "expired"
                ? "Session expired"
                : "Guest"}{" "}
            · Reload resets changes
          </Text>
          <Button variant="ghost" size="sm" onClick={() => setOpen(true)}>
            Demo controls
          </Button>
        </div>
      </div>
      {open && (
        <SessionDialog
          title="Demo controls"
          onClose={() => {
            setOpen(false)
            setResetting(false)
          }}
        >
          <Text className="mb-6 text-sm text-text-secondary">
            Reviewer tools, not real authentication or parental security. No
            data is sent or stored beyond this app session.
          </Text>
          <Text as="h3" className="mb-3 font-display text-2xl">
            Session & profile
          </Text>
          <div className="mb-6 flex flex-wrap gap-2">
            <Button
              variant="outline"
              onClick={() =>
                app.execute({ type: "scenario", session: "guest" })
              }
            >
              Guest
            </Button>
            {(["adult", "teen", "child"] as const).map((type) => (
              <Button
                key={type}
                variant="outline"
                onClick={() => {
                  const profile = app.state.profiles.find(
                    (p) => p.type === type,
                  )
                  if (profile)
                    app.execute({
                      type: "scenario",
                      session: "signedIn",
                      profileId: profile.id,
                    })
                }}
                disabled={!app.state.profiles.some((p) => p.type === type)}
              >
                Signed-in {type}
              </Button>
            ))}
            <Button
              variant="outline"
              onClick={() =>
                app.execute({ type: "scenario", session: "expired" })
              }
            >
              Expire session
            </Button>
          </div>
          <Text as="h3" className="mb-3 font-display text-2xl">
            Awards scenario
          </Text>
          <div className="mb-6 flex flex-wrap gap-2">
            {(["open", "closed", "resultsPending"] as const).map((phase) => (
              <Button
                key={phase}
                variant={app.state.phase === phase ? "primary" : "outline"}
                onClick={() => app.execute({ type: "phase", phase })}
              >
                {phase === "resultsPending" ? "Results pending" : phase}
              </Button>
            ))}
          </div>
          <Text as="h3" className="mb-3 font-display text-2xl">
            Viewing budget
          </Text>
          <Text className="mb-3 text-xs text-text-secondary">
            Fixed demo day: 10 September 2026 · Video only · Enable a daily
            limit in parental controls first.
          </Text>
          <div className="mb-6 flex flex-wrap gap-2">
            <Button
              variant="outline"
              disabled={!app.profile?.controls.dailyLimit}
              onClick={() =>
                app.execute({
                  type: "usage",
                  seconds: Math.max(
                    0,
                    (app.profile?.controls.dailyLimit ?? 0) - 10,
                  ),
                })
              }
            >
              10 seconds below limit
            </Button>
            <Button
              variant="ghost"
              onClick={() => app.execute({ type: "usage", seconds: 0 })}
            >
              Reset viewing usage
            </Button>
          </div>
          <Text className="mb-4 text-xs text-text-secondary">
            Demo parental PIN: 1234. This is not secure protection.
          </Text>
          {resetting ? (
            <div className="flex flex-wrap gap-3">
              <Text className="w-full text-sm">
                Reset all profiles, saved items, preferences, notifications,
                progress and mock votes?
              </Text>
              <Button
                onClick={() => {
                  app.reset()
                  setOpen(false)
                  setResetting(false)
                }}
              >
                Confirm reset
              </Button>
              <Button variant="ghost" onClick={() => setResetting(false)}>
                Cancel
              </Button>
            </div>
          ) : (
            <Button variant="outline" onClick={() => setResetting(true)}>
              Reset demo…
            </Button>
          )}
        </SessionDialog>
      )}
    </>
  )
}
