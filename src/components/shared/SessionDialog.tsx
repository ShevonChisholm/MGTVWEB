import { useEffect, useRef, type ReactNode, type RefObject } from "react"
import { createPortal } from "react-dom"
import { Button } from "@/components/ui/Button"
import { Text } from "@/components/ui/Text"

let openDialogs = 0
let previousOverflow = ""

export function SessionDialog({
  title,
  onClose,
  children,
  placement = "center",
  initialFocus,
}: {
  title: string
  onClose: () => void
  children: ReactNode
  placement?: "center" | "drawer"
  initialFocus?: RefObject<HTMLElement | null>
}) {
  const ref = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null
    const element = ref.current
    element?.showModal()
    if (!openDialogs) previousOverflow = document.body.style.overflow
    openDialogs++
    document.body.style.overflow = "hidden"
    const focusable = () =>
      [
        ...(element?.querySelectorAll<HTMLElement>(
          'a[href], button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), summary, [tabindex]:not([tabindex="-1"])',
        ) ?? []),
      ].filter((control) => control.getClientRects().length > 0)
    const trap = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return
      const controls = focusable()
      const first = controls[0]
      const last = controls[controls.length - 1]
      const current = document.activeElement
      if (!first) {
        event.preventDefault()
        element?.focus()
        return
      }
      if (
        event.shiftKey &&
        (current === first || !controls.includes(current as HTMLElement))
      ) {
        event.preventDefault()
        last.focus()
      } else if (
        !event.shiftKey &&
        (current === last || !controls.includes(current as HTMLElement))
      ) {
        event.preventDefault()
        first.focus()
      }
    }
    element?.addEventListener("keydown", trap)
    const focusTarget = initialFocus?.current ?? focusable()[0]
    focusTarget?.focus()
    return () => {
      element?.removeEventListener("keydown", trap)
      element?.close()
      openDialogs--
      if (!openDialogs) document.body.style.overflow = previousOverflow
      if (previous?.isConnected) previous.focus()
      else
        queueMicrotask(() => {
          const heading = document.querySelector<HTMLElement>("main h1")
          if (heading) {
            heading.tabIndex = -1
            heading.focus()
          }
        })
    }
  }, [])
  return createPortal(
    <dialog
      ref={ref}
      tabIndex={-1}
      aria-label={title}
      onCancel={(event) => {
        event.stopPropagation()
        onClose()
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
      className={`fixed w-full overflow-y-auto border border-text-muted/30 bg-bg-surface p-5 text-text-primary backdrop:bg-bg-base/90 md:p-8 ${
        placement === "drawer"
          ? "inset-y-0 left-auto right-0 m-0 h-dvh max-h-dvh max-w-md"
          : "inset-0 m-auto max-h-[85dvh] max-w-2xl rounded-xl"
      }`}
    >
      <div className="mb-6 flex items-center justify-between gap-4">
        <Text as="h2" className="font-display text-3xl">
          {title}
        </Text>
        <Button variant="ghost" onClick={onClose} aria-label={`Close ${title}`}>
          Close
        </Button>
      </div>
      {children}
    </dialog>,
    document.body,
  )
}
