import { EngagementIcon } from "@/components/shared/EngagementIcon";
import LifestyleCard from "@/components/lifestyle/LifestyleCard";
import ArticleCard from "@/components/news/ArticleCard";
import { ApiSportsCard } from "./ApiSportsCard";
import { LibraryCard } from "@/components/music/LibraryCard";
import { ApiEventCard } from "./ApiEventCard";
import { ApiMusicCard } from "./ApiMusicCard";
import { ApiShowCard } from "./ApiShowCard";
import { Link } from "react-router";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Text } from "@/components/ui/Text";
import { useSaved } from "@/context/SavedContext";
import { catalogById, contentPath, type ContentItem } from "@/data/mockContent";
import { TrackCard } from "@/components/music/TrackCard";
import { EventSummary } from "@/components/events/EventSummary";
import { allEventDetails, broadcasts } from "@/data/mockContent";
import { getEventPresentation } from "@/lib/eventPresentation";
import { useAppState } from "@/context/AppStateContext";
import { useViewing } from "@/hooks/useViewing";
import { ApiMovieCard } from "./ApiMovieCard";

export interface MediaCardProps {
  item: ContentItem;
  mode?: "standard" | "continue";
  fluid?: boolean;
  railFormat?: "poster" | "landscape" | "music" | "artist";
  trackIds?: string[];
  trackOrigin?: string;
}

export function MediaCard(props: MediaCardProps) {
  if(props.item.source === "api" && props.item.type === "news") return <ArticleCard item={props.item}/>;
  if (props.item.source === "api" && props.item.type === "sports")
    return (
      <ApiSportsCard
        item={props.item}
        fluid={props.fluid}
        continuing={props.mode === "continue"}
      />
    );
  return props.item.source === "api" && props.item.type === "lifestyle" ? <LifestyleCard item={props.item}/> : props.item.source === "api" &&
    ["news"].includes(props.item.type ?? "") ? (
    <Link
      to={"/" + props.item.type + "/" + props.item.id}
      className={
        (props.fluid ? "w-full" : "w-72 shrink-0 md:w-80") +
        " group overflow-hidden rounded-xl border border-white/5 bg-bg-surface"
      }
    >
      <img
        src={props.item.thumbnail}
        alt=""
        className="aspect-video w-full object-cover"
        loading="lazy"
      />
      <div className="p-5">
        <p className="text-xs uppercase tracking-widest text-gold">
          {props.item.genre}
        </p>
        <h3 className="mt-2 font-display text-2xl text-text-primary group-hover:text-gold">
          {props.item.title}
        </h3>
        <p className="mt-3 text-sm text-text-secondary">
          {props.item.description}
        </p>
        <p className="mt-4 text-xs text-text-secondary">
          {props.item.date} · {props.item.readTime}
        </p>
      </div>
    </Link>
  ) : props.item.source === "api" && props.item.type === "artist" ? (
    <div className="w-44 shrink-0 md:w-52">
      <LibraryCard
        kind="artists"
        item={{ ...props.item, coverUrl: props.item.thumbnail }}
      />
    </div>
  ) : props.item.source === "api" && props.item.type === "event" ? (
    <ApiEventCard item={props.item} event={props.item.eventRecord} fluid={props.fluid} />
  ) : props.item.source === "api" &&
    ["track", "musicVideo"].includes(props.item.type ?? "") ? (
    <ApiMusicCard
      item={props.item}
      fluid={props.fluid}
      railFormat={props.railFormat}
      continuing={props.mode === "continue"}
    />
  ) : props.item.source === "api" && props.item.type !== "movie" ? (
    <ApiShowCard
      item={props.item}
      fluid={props.fluid}
      railFormat={props.railFormat}
      continuing={props.mode === "continue"}
    />
  ) : props.item.source === "api" ? (
    <ApiMovieCard
      item={props.item}
      railFormat={props.railFormat}
      fluid={props.fluid}
      continuing={props.mode === "continue"}
    />
  ) : (
    <PrototypeMediaCard {...props} />
  );
}
function PrototypeMediaCard({
  item: supplied,
  mode = "standard",
  fluid = false,
  trackIds,
  trackOrigin,
}: MediaCardProps) {
  const { isSaved, toggle } = useSaved();
  const app = useAppState();
  const { itemWithProgress, playableItem, watchPath } = useViewing();
  const canonical = catalogById[supplied.id];
  if (!canonical || !app.allowed(canonical)) return null;
  const item = itemWithProgress(canonical);
  if (item.type === "track")
    return (
      <TrackCard
        track={item}
        fluid={fluid}
        ids={trackIds}
        origin={trackOrigin}
      />
    );
  const continuing = mode === "continue";
  const playable = playableItem(item);
  const media = continuing && playable ? playable : item;
  const portrait =
    !continuing && (item.type === "show" || item.type === "movie");
  const artist = item.type === "artist";
  const editorial = item.type === "news" || item.type === "lifestyle";
  const event = item.type === "event";
  const href = continuing
    ? (watchPath(item) ?? contentPath(item))
    : contentPath(item);
  const actionHref = watchPath(item) ?? contentPath(item);
  const progress = Math.max(0, Math.min(100, media.progress ?? 0));
  const remaining = Math.ceil(
    ((media.durationSeconds ?? 0) * (1 - progress / 100)) / 60,
  );
  const episodeContext =
    media.type === "episode"
      ? `S${media.seasonNumber} · E${media.episodeNumber}: ${media.title}`
      : null;
  const saved = isSaved(item.id);
  const eventDetail =
    item.type === "event" ? allEventDetails[item.id] : undefined;
  const eventPresentation = eventDetail
    ? getEventPresentation(
        eventDetail,
        broadcasts[eventDetail.broadcastId ?? ""],
      )
    : undefined;
  const action = continuing
    ? "Resume"
    : item.type === "musicVideo"
      ? "Watch video"
      : editorial
        ? "Read story"
        : event
          ? "View event"
          : artist
            ? "View artist"
            : item.type === "sports"
              ? "Watch replay"
              : item.type === "show" &&
                  (playable?.progress ?? 0) > 0 &&
                  (playable?.progress ?? 0) < 100
                ? "Resume"
                : item.type === "episode" && progress > 0 && progress < 100
                  ? "Resume"
                  : "Watch";
  const label =
    continuing && media.seriesTitle ? media.seriesTitle : item.title;
  const actionLabel =
    playable?.type === "episode"
      ? `${action} ${playable.seriesTitle}, season ${playable.seasonNumber}, episode ${playable.episodeNumber}: ${playable.title}`
      : `${action}: ${item.title}`;
  const width = fluid
    ? "w-full"
    : portrait
      ? "w-44 md:w-52"
      : artist
        ? "w-44 md:w-52"
        : "w-64 md:w-72";

  return (
    <article
      data-content-id={item.id}
      data-content-type={item.type}
      data-card-mode={mode}
      className={`group flex flex-1 shrink-0 flex-col min-w-0 ${width}`}
    >
      <Link
        to={href}
        aria-label={`${continuing ? "Resume" : "Open"} ${label}`}
        className={`relative block overflow-hidden bg-bg-elevated ${
          artist
            ? "aspect-square rounded-full"
            : portrait
              ? "aspect-[2/3] rounded-xl"
              : "aspect-video rounded-xl"
        }`}
      >
        <img
          src={media.thumbnail}
          alt=""
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 ease-out motion-safe:group-hover:scale-105"
        />
        {!artist && (
          <div className="absolute inset-0 bg-gradient-to-t from-bg-base/70 via-transparent to-transparent" />
        )}
        {item.badge && !artist && !event && (
          <Badge variant={item.badge} className="absolute left-2 top-2" />
        )}
        {(item.type === "musicVideo" || item.type === "sports") && (
          <Text
            as="span"
            className="absolute bottom-2 left-2 rounded bg-bg-base/90 px-2 py-1 text-xs font-semibold text-text-primary"
          >
            {item.type === "musicVideo" ? "Video" : "Replay"}
          </Text>
        )}
        {media.duration && !portrait && !editorial && !event && !artist && (
          <Text
            as="span"
            className="absolute bottom-2 right-2 rounded bg-bg-base/90 px-2 py-1 text-xs text-text-primary"
          >
            {media.duration}
          </Text>
        )}
      </Link>
      {(continuing || item.type === "episode") && (
        <progress
          className="media-progress mt-2"
          max={100}
          value={progress}
          aria-label={`${label}: ${progress}% watched`}
        />
      )}
      <div
        className={`flex flex-1 flex-col gap-2 pt-3 ${
          artist ? "text-center" : ""
        }`}
      >
        {event && (
          <div className="flex items-start gap-3">
            <div className="flex shrink-0 flex-col items-center rounded-md bg-gold px-2 py-2 text-bg-base">
              <Text as="span" className="text-xs font-bold uppercase">
                {item.date?.split(" ")[0].slice(0, 3)}
              </Text>
              <Text as="span" className="font-display text-2xl leading-none">
                {item.date?.split(" ")[1].replace(",", "")}
              </Text>
            </div>
            <div className="min-w-0">
              <EventSummary eventId={item.id} compact />
              <Text className="text-sm leading-relaxed text-text-secondary">
                Sample · {item.date} · {item.time}
              </Text>
            </div>
          </div>
        )}
        {editorial && (
          <Text className="text-xs font-semibold capitalize tracking-wide text-gold">
            {item.genre}
          </Text>
        )}
        {item.type === "episode" && !continuing && (
          <Text className="text-xs font-semibold text-gold">
            {item.seriesTitle}
          </Text>
        )}
        <Link
          to={href}
          className="text-sm font-semibold leading-snug text-text-primary transition-colors hover:text-gold break-words"
        >
          {label}
        </Link>
        <div className="space-y-1 text-sm leading-relaxed text-text-secondary">
          {item.type === "musicVideo" && (
            <Text>
              {item.artist} · {item.duration}
            </Text>
          )}
          {artist && <Text>{item.genre}</Text>}
          {portrait && (
            <Text>
              {item.type === "movie"
                ? `${item.year} · ${item.duration}`
                : item.duration}
            </Text>
          )}
          {portrait && (
            <Text>
              {item.classification} · {item.genre}
            </Text>
          )}
          {event && <Text>{item.location}</Text>}
          {eventDetail && (
            <Text>
              {eventDetail.timeZone} ·{" "}
              {eventDetail.locationKind === "online"
                ? "Online event"
                : "In-person event"}
            </Text>
          )}
          {editorial && (
            <Text>
              Sample · {item.date} · {item.readTime}
            </Text>
          )}
          {item.type === "sports" && (
            <Text>
              {item.genre} · {item.duration}
            </Text>
          )}
          {episodeContext && <Text>{episodeContext}</Text>}
          {item.type === "episode" && !continuing && (
            <Text className="line-clamp-2">{item.description}</Text>
          )}
          {continuing && (
            <Text className="text-gold">
              {remaining} min remaining · {app.profile?.name}'s demo progress
            </Text>
          )}
        </div>
        {eventPresentation?.watchLabel && (
          <Link
            to={`/events/${item.id}/watch`}
            aria-label={`${eventPresentation.watchLabel}: ${item.title} (demo)`}
            className="inline-flex min-h-11 items-center text-sm font-semibold text-gold hover:text-gold-light"
          >
            {eventPresentation.watchLabel}
          </Link>
        )}
        <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-2">
          <Link
            to={actionHref}
            aria-label={actionLabel}
            className="inline-flex min-h-11 items-center gap-1 text-xs font-semibold text-gold hover:text-gold-light"
          >
            {action}
            <svg
              aria-hidden="true"
              className="h-3 w-3"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            className="min-h-11 px-2"
            aria-pressed={saved}
            aria-label={`${saved ? "Remove" : "Save"} ${item.title}${
              saved ? " from" : " to"
            } My List`}
            onClick={() => toggle(item.id)}
          >
            <EngagementIcon name="save" active={saved}/>
          </Button>
        </div>
      </div>
    </article>
  );
}
