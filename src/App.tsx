import { RouterProvider } from "react-router"
import { router } from "./app/routes"
import { useEffect } from "react"
import site from "../.figma/make/site.json"

export default function App() {
  // The supervised preview may cache Vite's imported site configuration.
  useEffect(() => {
    document.title = site.title
    document.documentElement.lang = site.language
    for (const [attribute, name, content] of [
      ["name", "description", site.description],
      ["property", "og:title", site.title],
      ["property", "og:description", site.description],
    ]) {
      const selector = `meta[${attribute}="${name}"]`
      const tag =
        document.head.querySelector<HTMLMetaElement>(selector) ??
        document.createElement("meta")
      tag.setAttribute(attribute, name)
      tag.content = content
      if (!tag.isConnected) document.head.append(tag)
    }
  }, [])
  return <RouterProvider router={router} />
}
