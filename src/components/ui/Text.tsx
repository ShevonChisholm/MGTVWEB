import { createElement, type HTMLAttributes } from "react"

export function Text({
  as = "p",
  ...props
}: HTMLAttributes<HTMLElement> & {
  htmlFor?: string
  as?: "p" | "span" | "h1" | "h2" | "h3" | "label"
}) {
  return createElement(as, props)
}
