import { Link } from "react-router"
import { useAppState } from "@/context/AppStateContext"
import { Text } from "@/components/ui/Text"
import type { NotificationRecord } from "@/lib/appState"
export function NotificationList({
  items,
  onOpen,
  emptyTitle = "No notifications in this view.",
  emptyBody = "Try another category or change the unread filter.",
}: {
  items: NotificationRecord[]
  onOpen?: () => void
  emptyTitle?: string
  emptyBody?: string
}) {
  const app = useAppState()
  if (!items.length)
    return (
      <div role="status" className="space-y-3 px-5 py-12">
        <Text as="h2" className="font-display text-2xl text-text-primary">
          {emptyTitle}
        </Text>
        <Text className="text-sm text-text-secondary">{emptyBody}</Text>
      </div>
    )
  return (
    <div>
      {items.map((item) => (
        <Link
          key={item.id}
          to={app.notificationPath(item.contentId, item.to)}
          onClick={() => {
            app.execute({ type: "read", ids: [item.id] })
            onOpen?.()
          }}
          className={`flex gap-4 border-b border-text-muted/20 px-5 py-5 transition-colors hover:bg-bg-elevated ${
            item.read ? "" : "bg-gold-dim/30"
          }`}
        >
          <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-gold-dim text-gold">
            <svg
              className="h-4 w-4"
              aria-hidden="true"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeWidth={1.5}
                d="M18 8a6 6 0 0 0-12 0v6l-2 3h16l-2-3V8Zm-8 12h4"
              />
            </svg>
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3">
              <Text
                className={`text-sm font-semibold ${
                  item.read ? "text-text-secondary" : "text-text-primary"
                }`}
              >
                {item.title}
              </Text>
              {!item.read && (
                <Text as="span" className="shrink-0 text-xs text-gold">
                  Unread
                </Text>
              )}
            </div>
            <Text className="mt-2 text-xs leading-relaxed text-text-secondary">
              {item.body}
            </Text>
            <Text className="mt-2 text-xs text-gold">
              {item.category} · Demo
            </Text>
          </div>
        </Link>
      ))}
    </div>
  )
}
