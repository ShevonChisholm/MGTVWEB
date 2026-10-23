import { useState } from "react"
import { useAppState } from "@/context/AppStateContext"
import { Button, ButtonLink } from "@/components/ui/Button"
import { Text } from "@/components/ui/Text"
import { NotificationList } from "@/components/notifications/NotificationList"
export function NotificationsPage() {
  const app = useAppState()
  const [category, setCategory] = useState("All")
  const [unreadOnly, setUnreadOnly] = useState(false)
  const items = app.notifications.filter(
    (n) =>
      (category === "All" || n.category === category) &&
      (!unreadOnly || !n.read),
  )
  return (
    <main className="mx-auto min-h-screen max-w-4xl px-6 py-16">
      <Text className="mb-3 text-xs uppercase tracking-widest text-gold">
        {app.profile?.name}'s local feed
      </Text>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <Text as="h1" className="font-display text-5xl">
          Notifications
        </Text>
        <Button
          variant="outline"
          disabled={!app.unread}
          onClick={() =>
            app.execute({
              type: "read",
              ids: app.notifications.map((n) => n.id),
            })
          }
        >
          Mark all as read
        </Button>
      </div>
      <Text role="status" className="mb-3 mt-4 text-sm text-text-secondary">
        {app.unread} unread · {app.notifications.length} visible notifications
      </Text>
      <Text className="mb-8 text-xs leading-relaxed text-text-secondary">
        Sample notices and local reminder confirmations only. No emails, push
        messages, billing activity or real submissions are connected.
      </Text>
      <div className="mb-4 flex flex-wrap gap-2">
        {["All", "Shows", "Music", "Sports", "Events", "Awards", "System"].map(
          (value) => (
            <Button
              key={value}
              variant={category === value ? "primary" : "ghost"}
              size="sm"
              aria-pressed={category === value}
              onClick={() => setCategory(value)}
            >
              {value}
            </Button>
          ),
        )}
      </div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <Button
          variant="ghost"
          aria-pressed={unreadOnly}
          onClick={() => setUnreadOnly(!unreadOnly)}
        >
          Unread only: {unreadOnly ? "On" : "Off"}
        </Button>
        <ButtonLink to="/account" variant="ghost">
          Notification preferences
        </ButtonLink>
      </div>
      <div className="overflow-hidden rounded-xl border border-text-muted/20 bg-bg-surface">
        <NotificationList
          items={items}
          emptyTitle={
            app.unread === 0 && (unreadOnly || !app.notifications.length)
              ? "You’re all caught up."
              : undefined
          }
          emptyBody={
            app.unread === 0 && unreadOnly
              ? "Turn off Unread only to see read notices."
              : !app.notifications.length
                ? "No sample notices are available for this profile."
                : undefined
          }
        />
      </div>
    </main>
  )
}
