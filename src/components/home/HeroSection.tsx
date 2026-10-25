import {SponsorStrip} from "@/components/shared/SponsorStrip";
import { HeroBackdrop } from "@/components/shared/HeroBackdrop";
import { useShows, seriesItem } from "@/context/ShowsContext";
import { useMovies, movieItem } from "@/context/MovieContext";
import { useState } from "react";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Text } from "@/components/ui/Text";
import { catalogById, contentPath, type CatalogItem } from "@/data/mockContent";
import { useAppState } from "@/context/AppStateContext";
import { useViewing } from "@/hooks/useViewing";
import { EmptyFeature } from "@/components/shared/EmptyFeature";

export function HeroSection({items}:{items?:CatalogItem[]}={}) {
  const [active, setActive] = useState(0);
  const app = useAppState();
  const { playableItem, watchPath } = useViewing();
  const movies = useMovies(),
    shows = useShows();
  const slides = items ?? (
    import.meta.env.VITE_API_MODE === "connected"
      ? [
          ...shows.items
            .slice(0, 1)
            .map((s) => ({
              ...seriesItem(s),
              thumbnail: s.artwork.landscapeUrl,
            })),
          ...movies.items
            .filter(m=>m.featureUrl)
            .slice(0, 2)
            .map((movie) => ({
              ...movieItem(movie),
              thumbnail: movie.artwork.landscapeUrl,
            })),
        ]
      : app.visible(["t1", "m11", "m12"].map((id) => catalogById[id])));
  const item = slides[active] ?? slides[0];
  const displayedIndex = slides[active] ? active : 0;
  if (!item) return <EmptyFeature />;
  const playable = playableItem(item);
  return (
    <section className="hero-card">
      <HeroBackdrop key={item.id} poster={item.landscapeThumbnail??item.thumbnail} featureUrl={item.featureUrl}/>
      <div className="hero-card__content">
        <div className="max-w-2xl">
          <div className="mb-4 flex flex-wrap items-center gap-3 text-xs text-text-secondary">
            {item.badge && <Badge variant={item.badge} />}
            <Text as="span">
              {[item.genre,item.classification].filter(Boolean).join(" · ")}
            </Text>
            <Text as="span">{item.duration??item.readTime??item.date}</Text>
          </div>
          <Text className="mb-2 text-sm font-semibold uppercase tracking-widest text-gold">
            {item.type === "show" ? "Series in the spotlight" : item.type === "movie" ? "Featured film" : "In the MGTV spotlight"}
          </Text>
          <Text
            as="h1"
            className="mb-5 font-display text-5xl leading-none tracking-wide text-text-primary md:text-7xl"
          >
            {item.title}
          </Text>
          <Text className="mb-8 max-w-lg text-base leading-relaxed text-text-secondary">
            {item.description}
          </Text>
          <div className="flex flex-wrap gap-3">
            <ButtonLink
              size="lg"
              to={
                item.source === "api" && !["movie","episode","sports"].includes(item.type)
                  ? contentPath(item)
                  : watchPath(item)!
              }
            >
              {playable?.type === "episode"
                ? `${
                    (playable.progress ?? 0) > 0 &&
                    (playable.progress ?? 0) < 100
                      ? "Resume"
                      : "Watch"
                  } S${playable.seasonNumber} · E${playable.episodeNumber}`
                : item.type === "show" ? "Explore series" : item.type === "movie" ? "Watch movie" : item.type === "sports" ? "Watch coverage" : item.type === "episode" ? "Watch episode" : ["news","lifestyle"].includes(item.type) ? "Read story" : item.type === "event" ? "Explore event" : "Explore release"}
            </ButtonLink>
            <ButtonLink size="lg" variant="outline" to={contentPath(item)}>
              {item.type === "show" ? "View series" : item.type === "movie" ? "About this film" : "More details"}
            </ButtonLink>
          </div>
          {item.source==="api"&&["show","event"].includes(item.type)&&<SponsorStrip key={item.type+item.id} kind={item.type==="show"?"shows":"events"} id={item.id} compact context={item.title}/>}
        </div>
        <div className="mt-8 flex gap-2" aria-label="Featured content">
          {slides.map((slide, i) => (
            <Button
              key={slide.id}
              variant="ghost"
              size="sm"
              className={`min-h-11 ${displayedIndex === i ? "text-gold" : ""}`}
              onClick={() => setActive(i)}
              aria-label={`Feature ${slide.title}`}
              aria-pressed={displayedIndex === i}
            >
              {String(i + 1).padStart(2, "0")}
            </Button>
          ))}
        </div>
      </div>
    </section>
  );
}
