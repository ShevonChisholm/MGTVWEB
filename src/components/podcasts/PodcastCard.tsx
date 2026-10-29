import { Link } from "react-router";
import { podcastTime, type Podcast } from "@/lib/podcasts";
import "./podcasts.css";
export function PodcastGlyph({
  name = "mic",
  size = 24,
}: {
  name?: string;
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {name === "play" ? (
        <path d="m8 4 12 8-12 8Z" fill="currentColor" stroke="none" />
      ) : name === "video" ? (
        <>
          <rect x="3" y="5" width="13" height="14" rx="2" />
          <path d="m16 10 5-3v10l-5-3" />
        </>
      ) : (
        <>
          <rect x="9" y="2" width="6" height="12" rx="3" />
          <path d="M5 10a7 7 0 0 0 14 0M12 17v5m-4 0h8" />
        </>
      )}
    </svg>
  );
}
export function PodcastCard({
  item,
  resume = false,
}: {
  item: Podcast;
  resume?: boolean;
}) {
  return (
    <Link
      className={"pc-card " + (item.kind === "episode" ? "episode" : "")}
      to={
        item.kind === "episode"
          ? "/podcasts/episodes/" + item.id
          : "/podcasts/" + item.id
      }
    >
      <div className="pc-cover">
        {item.coverUrl ? (
          <img src={item.coverUrl} alt="" loading="lazy" />
        ) : (
          <PodcastGlyph size={60} />
        )}
        <span className="pc-kind">
          <PodcastGlyph
            name={item.format === "video" ? "video" : "mic"}
            size={15}
          />
          {item.format === "mixed" ? "Audio + Video" : item.format}
        </span>
        {item.accessTier === "premium" && (
          <span className="pc-premium">MGTV+</span>
        )}
        {resume && item.progress && (
          <div
            className="pc-progress"
            style={{
              width:
                Math.min(
                  100,
                  (100 * item.progress.seconds) / item.durationSeconds,
                ) + "%",
            }}
          />
        )}
      </div>
      <div className="pc-card-info">
        <p className="pc-category">
          {item.kind === "episode"
            ? `${item.seasonNumber ? "S" + item.seasonNumber + " · " : ""}EP ${item.episodeNumber}`
            : item.category}
        </p>
        <h3>{item.title}</h3>
        <p>{item.seriesTitle ?? item.host}</p>
        <span>
          {resume && item.progress
            ? "Resume at " + podcastTime(item.progress.seconds)
            : item.kind === "episode"
              ? podcastTime(item.durationSeconds) + " · " + item.classification
              : item.classification + " · " + item.category}
        </span>
        <span className="pc-open">
          {item.kind === "episode" ? "Open episode" : "Explore podcast"} ↗
        </span>
      </div>
    </Link>
  );
}
