import { useState } from "react"
import { Button } from "@/components/ui/Button"
import { Text } from "@/components/ui/Text"
import { SessionDialog } from "./SessionDialog"
import type { DiscoveryState } from "@/hooks/useDiscoveryFilters"
export function FilterSidebar({
  discovery,
  count = discovery.filtered.length,
}: {
  discovery: DiscoveryState
  count?: number
}) {
  const [open, setOpen] = useState(false)
  const groups = (
    <div className="space-y-7">
      {discovery.groups.map((group) => (
        <fieldset key={group.id}>
          <legend className="mb-3 text-xs font-semibold uppercase tracking-widest text-gold">
            {group.label}
          </legend>
          <div className="grid gap-1">
            <Button
              variant="ghost"
              size="sm"
              className={`min-h-11 justify-start ${
                !discovery.selection[group.id] ? "bg-gold-dim text-gold" : ""
              }`}
              aria-pressed={!discovery.selection[group.id]}
              onClick={() => discovery.set(group.id)}
            >
              Any
            </Button>
            {group.options.map((option) => (
              <Button
                key={option.value}
                size="sm"
                variant="ghost"
                className={`min-h-11 justify-start whitespace-normal break-words text-left ${
                  discovery.selection[group.id] === option.value
                    ? "bg-gold-dim text-gold"
                    : ""
                }`}
                aria-pressed={discovery.selection[group.id] === option.value}
                onClick={() => discovery.set(group.id, option.value)}
              >
                {option.label}
              </Button>
            ))}
          </div>
        </fieldset>
      ))}
    </div>
  )
  return (
    <>
      <aside
        aria-label="Discovery filters"
        className="hidden w-48 shrink-0 lg:block"
      >
        {groups}
      </aside>
      <div className="lg:hidden">
        <Button
          variant="outline"
          aria-expanded={open}
          onClick={() => setOpen(true)}
        >
          Filters
          {discovery.active
            ? ` · ${Object.keys(discovery.selection).length}`
            : ""}
        </Button>
      </div>
      {open && (
        <SessionDialog title="Discovery filters" onClose={() => setOpen(false)}>
          <Text className="mb-3 text-sm text-text-secondary">
            Selections combine. Changes apply immediately; choose more than one
            group.
          </Text>
          <Text role="status" className="mb-6 text-sm text-gold">
            {count} results
          </Text>
          {groups}
          <div className="mt-8 flex gap-3">
            <Button onClick={() => setOpen(false)}>Done</Button>
            <Button variant="ghost" onClick={discovery.clear}>
              Clear filters
            </Button>
          </div>
        </SessionDialog>
      )}
    </>
  )
}
