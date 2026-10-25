import { useState } from "react"
import { useInteraction } from "@/context/InteractionContext"
import { useToast } from "@/context/ToastContext"
import { useAppState } from "@/context/AppStateContext"
import { Button } from "@/components/ui/Button"
import { Text } from "@/components/ui/Text"

export function RatingWidget({
  id,
  label = "Rate this",
  remote,
}: {
  id: string
  label?: string
  remote?: { value:number|null; busy:boolean; onRate:(value:number)=>void }
}) {
  const app = useAppState()
  const { getRating, rateItem } = useInteraction()
  const { addToast } = useToast()
  const [hovered, setHovered] = useState<number | null>(null)
  const [editing, setEditing] = useState(false)
  const current = remote ? remote.value : getRating(id)
  const display = hovered ?? current
  if (current !== null && !editing)
    return (
      <div className="flex flex-wrap items-center gap-3">
        <Text
          role="status"
          className="rounded-md border border-gold/30 bg-gold-dim px-3 py-2 text-sm text-gold"
        >
          Your rating: {current}/10
        </Text>
        <Button
          variant="ghost"
          size="sm"
          className="min-h-11"
          onClick={() => setEditing(true)}
          aria-label={`Edit ${label.toLowerCase()} rating`}
        >
          Edit rating
        </Button>
      </div>
    )
  return (
    <fieldset className="min-w-0">
      <legend className="mb-3 text-xs font-semibold uppercase tracking-widest text-text-secondary">
        {label}
      </legend>
      <div
        className="flex flex-wrap gap-1"
        onMouseLeave={() => setHovered(null)}
      >
        {Array.from({ length: 10 }, (_, index) => index + 1).map((value) => (
          <Button
            key={value}
            disabled={remote?.busy}
            variant="ghost"
            size="sm"
            className={`min-h-11 min-w-11 px-2 ${
              display !== null && value <= display
                ? "bg-gold-dim text-gold"
                : "bg-bg-elevated text-text-secondary"
            }`}
            aria-label={`Rate ${value} out of 10`}
            aria-pressed={current === value}
            onMouseEnter={() => setHovered(value)}
            onFocus={() => setHovered(value)}
            onBlur={() => setHovered(null)}
            onClick={() => {
              if(remote){remote.onRate(value);setEditing(false);return}
              if (!app.requirePersonal(id)) return
              rateItem(id, value)
              setEditing(false)
              addToast(`You rated this ${value}/10`, "success")
            }}
          >
            {value}
          </Button>
        ))}
      </div>
      {display !== null && (
        <Text className="mt-2 text-xs text-text-secondary">
          {display <= 3
            ? "Not for me"
            : display <= 5
              ? "It was okay"
              : display <= 7
                ? "Good"
                : display <= 9
                  ? "Great"
                  : "Perfect"}
        </Text>
      )}
    </fieldset>
  )
}
