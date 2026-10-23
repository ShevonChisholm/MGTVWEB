import { useEffect, useState } from "react"
import { useSearchParams } from "react-router"
import { useCatalog } from "@/hooks/useCatalog"
import { Input } from "@/components/ui/Input"
import { Button, ButtonLink } from "@/components/ui/Button"
import { Text } from "@/components/ui/Text"
import { DiscoveryResults } from "@/components/shared/DiscoveryResults"
export function SearchPage() {
  const { catalog } = useCatalog()
  const [params, setParams] = useSearchParams()
  const query = params.get("q") ?? ""
  const [input, setInput] = useState(query)
  useEffect(() => setInput(query), [query])
  const term = query.trim().toLowerCase()
  const results = term
    ? catalog.filter((item) =>
        [
          item.title,
          item.seriesTitle,
          item.artist,
          item.genre,
          item.description,
        ].some((value) => value?.toLowerCase().includes(term)),
      )
    : []
  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-7xl px-6 py-16 md:px-16">
        <Text as="h1" className="mb-6 font-display text-5xl">
          Search MGTV
        </Text>
        <form
          className="mb-6 flex max-w-2xl gap-3"
          onSubmit={(event) => {
            event.preventDefault()
            const next = new URLSearchParams(params)
            if (input.trim()) next.set("q", input.trim())
            else next.delete("q")
            setParams(next)
          }}
        >
          <Input
            aria-label="Search MGTV catalog"
            placeholder="Titles, artists, sports and stories…"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            className="min-w-0 flex-1"
          />
          <Button type="submit">Search</Button>
        </form>
        <Text className="text-sm text-text-secondary">
          {term
            ? `Sample catalog matches for “${query}”`
            : "Explore the sample catalog by title, artist, genre or story."}
        </Text>
        {term ? (
          <DiscoveryResults
            items={results}
            scope="search"
            title={results.length ? "Search results" : "No catalog matches"}
            layout="contained"
          />
        ) : (
          <div className="mt-8 flex flex-wrap gap-3">
            {[
              "shows",
              "movies",
              "music",
              "sports",
              "news",
              "lifestyle",
              "events",
            ].map((section) => (
              <ButtonLink
                key={section}
                to={`/${section}`}
                variant="outline"
                className="capitalize"
              >
                {section}
              </ButtonLink>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
