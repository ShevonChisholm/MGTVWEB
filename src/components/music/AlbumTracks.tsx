import { Link } from "react-router";
import { Button } from "@/components/ui/Button";
import { useState } from "react";
import { useMusic, type ApiMusic } from "@/context/MusicContext";
import { ConnectedPlaylistMenu } from "./ConnectedPlaylistMenu";
function TrackArt({ src }: { src?: string }) {
  const [failed, setFailed] = useState(false);
  return (
    <div className="album-track__art">
      {src && !failed ? (
        <img
          src={src}
          alt=""
          width={64}
          height={64}
          loading="lazy"
          onError={() => setFailed(true)}
        />
      ) : (
        <span aria-hidden="true">♫</span>
      )}
    </div>
  );
}
function AlbumTrack({
  item,
  index,
  busy,
  onPlay,
}: {
  item: ApiMusic;
  index: number;
  busy: boolean;
  onPlay: () => void;
}) {
  const library = useMusic(),
    [saving, setSaving] = useState(false),
    [error, setError] = useState("");
  const release = { id: item.id, preference: item.preference },
    saved = library.preference(release).saved;
  return (
    <li className="album-track">
      <div className="album-track__primary">
        <span
          className="album-track__number"
          aria-label={"Track " + (index + 1)}
        >
          {String(index + 1).padStart(2, "0")}
        </span>
        <Link className="album-track__release" to={"/music/track/" + item.id}>
          <TrackArt
            key={item.artwork?.portraitUrl}
            src={item.artwork?.portraitUrl}
          />
          <span className="min-w-0">
            <span className="album-track__title">{item.title}</span>
            <span className="album-track__artist">
              {item.artist} ·{" "}
              <span
                className={item.accessTier === "premium" ? "text-gold" : ""}
              >
                {item.accessTier === "premium" ? "MGTV+" : "Free"}
              </span>
            </span>
          </span>
        </Link>
      </div>
      <div className="album-track__actions">
        <span className="album-track__duration">
          {Math.floor(item.durationSeconds / 60)}:
          {String(Math.floor(item.durationSeconds % 60)).padStart(2, "0")}
        </span>
        <Button
          size="sm"
          variant="ghost"
          disabled={busy}
          onClick={onPlay}
          aria-label={"Play " + item.title}
        >
          Play <span aria-hidden="true">▷</span>
        </Button>
        {library.session ? (
          <Button
            variant="ghost"
            size="sm"
            disabled={saving}
            aria-pressed={saved}
            aria-label={`${saved ? "Remove" : "Save"} ${item.title} ${saved ? "from" : "to"} My List`}
            onClick={() => {
              setSaving(true);
              setError("");
              void library
                .save(release, { saved: !saved })
                .catch((e) => setError(e.message))
                .finally(() => setSaving(false));
            }}
          >
            {saved ? "Saved" : "Save"}
          </Button>
        ) : (
          <Link
            className="inline-flex min-h-11 items-center px-2 text-xs text-gold"
            to="/auth/sign-in"
            aria-label={"Sign in to save " + item.title}
          >
            Save
          </Link>
        )}
        <ConnectedPlaylistMenu musicId={item.id} format="audio" compact />
      </div>
      {error && (
        <p role="alert" className="text-sm text-rose-300">
          {error}
        </p>
      )}
    </li>
  );
}
export function AlbumTracks({
  items,
  busy,
  onPlay,
}: {
  items: ApiMusic[];
  busy: boolean;
  onPlay: (index: number) => void;
}) {
  return (
    <ol className="album-tracks" aria-label="Album track order">
      {items.map((item, index) => (
        <AlbumTrack
          key={item.id}
          item={item}
          index={index}
          busy={busy}
          onPlay={() => onPlay(index)}
        />
      ))}
    </ol>
  );
}
