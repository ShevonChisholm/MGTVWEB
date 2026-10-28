import { useState } from "react";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Text } from "@/components/ui/Text";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";
import { ProfileSettingLink } from "@/components/auth/ProfileVisual";
import { NotificationPreferences } from "@/components/notifications/ConnectedNotifications";
import { SubscriptionAccess } from "@/components/movies/SubscriptionAccess";
import {
  authChanged,
  customerApi,
  useCustomerSession,
} from "@/lib/customerAuth";
import "./profiles-flow.css";
export default function ConnectedAccount() {
  const { session, loading, error: sessionError } = useCustomerSession();
  const [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  if (loading)
    return (
      <main className="mx-auto max-w-5xl px-6 py-28">
        <LoadingSkeleton
          label="Checking your customer account…"
          variant="account"
          count={3}
        />
      </main>
    );
  return (
    <main className="mx-auto max-w-4xl px-6 py-28">
      <p className="mb-3 text-xs tracking-[.2em] text-gold">
        YOUR CORNER OF MGTV
      </p>
      <Text as="h1" className="mb-5 font-display text-5xl">
        {session ? "Make yourself at home." : "Come on in."}
      </Text>
      {(error || sessionError) && (
        <p role="alert" className="pf-error">
          {error || sessionError}
        </p>
      )}
      {!session ? (
        <ButtonLink to="/auth/sign-in">Customer sign-in</ButtonLink>
      ) : (
        <>
          <p className="mb-8 text-text-secondary">
            Welcome, {session.account.displayName}.
          </p>
          <div className="pf-settings-list mb-10">
            <ProfileSettingLink
              to="/profiles"
              icon="user"
              title="Choose a profile"
              description="Switch to your personal MGTV space"
            />
            <ProfileSettingLink
              to="/profiles/manage"
              icon="edit"
              title="Manage profiles"
              description="Names, avatars, preferences and parental controls"
            />
            <ProfileSettingLink
              to="/profiles/security"
              icon="lock"
              title="Parental PIN"
              description="Set or replace your account’s shared parental PIN"
            />
          </div>
          <SubscriptionAccess />
          {session.activeProfileId && <NotificationPreferences />}
          <section className="mt-10 rounded-xl border border-white/10 p-6">
            <h2 className="mb-5 text-xl">Your account, your control</h2>
            <div className="flex flex-wrap gap-3">
              {[false, true].map((all) => (
                <Button
                  key={String(all)}
                  variant="outline"
                  disabled={busy}
                  onClick={async () => {
                    setBusy(true);
                    setError("");
                    try {
                      await customerApi(
                        all ? "/auth/logout-all" : "/auth/logout",
                        "POST",
                      );
                      authChanged();
                    } catch (e) {
                      setError(
                        e instanceof Error
                          ? e.message
                          : "Sign-out could not be completed.",
                      );
                    } finally {
                      setBusy(false);
                    }
                  }}
                >
                  {all ? "Sign out all customer sessions" : "Sign out"}
                </Button>
              ))}
            </div>
            <p className="mt-4 text-xs text-text-secondary">
              Signing out all sessions ends access on your other browsers and
              devices.
            </p>
          </section>
        </>
      )}
    </main>
  );
}
