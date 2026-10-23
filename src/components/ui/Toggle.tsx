import { Button } from "./Button"
import { Text } from "./Text"
export function Toggle({
  label,
  checked,
  onChange,
  description,
}: {
  label: string
  checked: boolean
  onChange: () => void
  description?: string
}) {
  return (
    <div className="flex items-center justify-between gap-5 border-b border-text-muted/20 py-4">
      <div>
        <Text className="text-sm font-medium">{label}</Text>
        {description && (
          <Text className="mt-1 text-xs text-text-secondary">
            {description}
          </Text>
        )}
      </div>
      <Button
        variant={checked ? "primary" : "outline"}
        size="sm"
        role="switch"
        aria-label={label}
        aria-checked={checked}
        onClick={onChange}
      >
        {checked ? "On" : "Off"}
      </Button>
    </div>
  )
}
