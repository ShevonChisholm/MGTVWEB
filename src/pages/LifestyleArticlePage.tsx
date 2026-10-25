import {ConnectedLifestyleArticle} from "./ConnectedLifestyle";
import { useParams } from "react-router"
import { lifestyleArticles, lifestyleContent } from "@/data/mockContent"
import { ContentUnavailable } from "@/components/shared/ContentUnavailable"
import { Text } from "@/components/ui/Text"
import { Button, ButtonLink } from "@/components/ui/Button"
import { useSaved } from "@/context/SavedContext"
import { ShareBar } from "@/components/shared/ShareBar"
import { ContentRail } from "@/components/home/ContentRail"

export function LifestyleArticlePage() {
  return import.meta.env.VITE_API_MODE === "connected" ? <ConnectedLifestyleArticle/> : <PrototypeLifestyleArticlePage/>;
}
function PrototypeLifestyleArticlePage() {
  const { id } = useParams()
  const article = lifestyleArticles.find((item) => item.id === id)
  const { toggle, isSaved } = useSaved()
  if (!article)
    return (
      <ContentUnavailable
        kind="Story"
        backTo="/lifestyle"
        backLabel="Browse Lifestyle"
      />
    )
  return (
    <main className="bg-bg-base pt-16">
      <img
        src={article.image}
        alt={article.title}
        className="aspect-video max-h-96 w-full object-cover"
      />
      <article className="mx-auto max-w-3xl px-6 py-12">
        <Text className="mb-4 text-sm font-semibold capitalize tracking-wide text-gold">
          {article.category} · Sample date: {article.date} · {article.readTime}
        </Text>
        <Text
          as="h1"
          className="mb-5 font-display text-5xl leading-tight text-text-primary md:text-6xl"
        >
          {article.title}
        </Text>
        <Text className="mb-8 text-xl leading-relaxed text-text-primary">
          {article.subtitle}
        </Text>
        <Text className="mb-8 text-base leading-loose text-text-secondary">
          {article.excerpt}
        </Text>
        <Text
          role="note"
          className="mb-8 border-l-2 border-gold pl-4 text-sm leading-relaxed text-text-secondary"
        >
          Sample editorial copy. This prototype includes an illustrative story
          introduction only, not a verified full article.
        </Text>
        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="outline"
            aria-pressed={isSaved(article.id)}
            onClick={() => toggle(article.id)}
          >
            {isSaved(article.id) ? "Saved to My List" : "Save story"}
          </Button>
          <ShareBar title={article.title} compact />
          <ButtonLink variant="ghost" to="/lifestyle">
            All Lifestyle
          </ButtonLink>
        </div>
      </article>
      <ContentRail
        title="More Stories"
        items={lifestyleContent.filter((item) => item.id !== id)}
        seeAllHref="/lifestyle"
        seeAllLabel="All lifestyle stories"
      />
    </main>
  )
}
