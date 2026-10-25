import {connectedAuth} from "@/lib/customerAuth"
import {ConnectedNotificationFeed} from "./ConnectedNotifications"
import { useEffect, useRef } from "react"
import { useAppState } from "@/context/AppStateContext"
import { Button, ButtonLink } from "@/components/ui/Button"
import { Text } from "@/components/ui/Text"
import { NotificationList } from "./NotificationList"
export function NotificationPanel({ onClose }: { onClose: () => void }) {
  const app = useAppState()
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null
    ref.current?.focus()
    const outside = (event: PointerEvent) => {
      if (!ref.current?.contains(event.target as Node)) onClose()
    }
    const key = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose()
    }
    document.addEventListener("pointerdown", outside)
    document.addEventListener("keydown", key)
    return () => {
      document.removeEventListener("pointerdown", outside)
      document.removeEventListener("keydown", key)
      if (previous?.isConnected) previous.focus()
    }
  }, [])
  return (
    <div
      ref={ref}
      tabIndex={-1}
      role="region"
      aria-label="Notification preview"
      className="absolute right-0 top-full z-50 mt-3 max-h-[70dvh] w-80 max-w-[calc(100vw-2rem)] overflow-y-auto rounded-xl border border-text-muted/30 bg-bg-surface shadow-xl"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-text-muted/20 p-4">
        <Text className="font-semibold">Notifications{!connectedAuth&&` · ${app.unread}`}</Text>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          aria-label="Close notification preview"
        >
          Close
        </Button>
      </div>
      {connectedAuth?<div className="p-2"><ConnectedNotificationFeed panel onClose={onClose}/></div>:<>
      <Text className="px-5 py-3 text-xs text-text-secondary">
        Shared local feed · No real-time delivery
      </Text>
      <Button
        variant="ghost"
        size="sm"
        className="mx-3 mb-2"
        disabled={!app.unread}
        onClick={() =>
          app.execute({ type: "read", ids: app.notifications.map((n) => n.id) })
        }
      >
        Mark all as read
      </Button>
      <div className="max-h-80 overflow-y-auto">
        <NotificationList
          items={app.notifications.slice(0, 5)}
          onOpen={onClose}
          emptyTitle="You’re all caught up."
          emptyBody="No sample notices are available for this profile."
        />
      </div>
      <ButtonLink
        to="/notifications"
        onClick={onClose}
        variant="ghost"
        className="w-full"
      >
        View all notifications
      </ButtonLink></>}
    </div>
  )
}
