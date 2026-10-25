import ConnectedSearchModal from "./ConnectedSearchModal";
import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router";
import { contentPath, contentLabels } from "@/data/mockContent";
import { Input } from "@/components/ui/Input";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Text } from "@/components/ui/Text";
import { TrackPlay } from "@/components/music/TrackCard";
import { usePlayback } from "@/context/MediaPlaybackContext";
import { statusLabel } from "@/lib/playback";
import { useCatalog } from "@/hooks/useCatalog";
import { SessionDialog } from "@/components/shared/SessionDialog";

export function SearchModal({onClose}:{onClose:()=>void}){return import.meta.env.VITE_API_MODE==="connected"?<ConnectedSearchModal onClose={onClose}/>:<PrototypeSearchModal onClose={onClose}/>;}
function PrototypeSearchModal({ onClose }: { onClose: () => void }) {
  const { catalog } = useCatalog();
  const suggestions = catalog
    .filter((item) => ["show", "artist", "news"].includes(item.type))
    .slice(0, 5)
    .map((item) => item.title);
  const [query, setQuery] = useState("");
  const input = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { state } = usePlayback();
  const term = query.trim().toLowerCase();
  const results = term
    ? catalog
        .filter((item) =>
          [item.title, item.seriesTitle, item.genre, item.artist].some(
            (value) => value?.toLowerCase().includes(term),
          ),
        )
        .slice(0, 8)
    : [];
  return (
    <SessionDialog title="Search MGTV" onClose={onClose} initialFocus={input}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          navigate(`/search?q=${encodeURIComponent(query.trim())}`);
          onClose();
        }}
        className="mb-4 flex gap-2"
      >
        <Input
          ref={input}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search titles, artists and stories"
          placeholder="Titles, artists, sports, stories…"
          className="min-w-0 flex-1"
        />
        <Button type="submit" disabled={!term}>
          Search
        </Button>
      </form>
      {results.length ? (
        <div className="space-y-1">
          {results.map((item) => (
            <div
              key={item.id}
              className="flex flex-wrap items-center gap-3 rounded-lg p-3 hover:bg-bg-elevated"
            >
              <Link
                to={contentPath(item)}
                onClick={onClose}
                className="flex min-w-0 flex-1 items-center gap-3"
              >
                <img
                  src={item.thumbnail}
                  alt=""
                  className={`${
                    item.type === "track" || item.type === "artist"
                      ? "h-12 w-12"
                      : "h-12 w-16"
                  } shrink-0 object-cover ${
                    item.type === "artist" ? "rounded-full" : "rounded-md"
                  }`}
                />
                <div className="min-w-0 flex-1">
                  <Text className="text-sm font-semibold">{item.title}</Text>
                  <Text className="text-xs text-text-secondary">
                    {item.artist ?? item.seriesTitle ?? item.genre}
                  </Text>
                  {item.type === "track" &&
                    state.audio?.media.id === item.id && (
                      <Text className="mt-1 text-xs text-gold">
                        {statusLabel(state.audio)}
                      </Text>
                    )}
                </div>
              </Link>
              <Text as="span" className="shrink-0 text-xs text-gold">
                {contentLabels[item.type]}
              </Text>
              {item.type === "track" && (
                <TrackPlay
                  track={item}
                  ids={results
                    .filter((entry) => entry.type === "track")
                    .map((entry) => entry.id)}
                  origin="Quick search"
                />
              )}
            </div>
          ))}
          <ButtonLink
            to={`/search?q=${encodeURIComponent(query)}`}
            onClick={onClose}
            variant="ghost"
          >
            See all results
          </ButtonLink>
        </div>
      ) : term ? (
        <Text className="py-6 text-sm text-text-secondary">
          No matches in this sample catalog.
        </Text>
      ) : (
        <div className="flex flex-wrap gap-2">
          {suggestions.map((suggestion) => (
            <Button
              key={suggestion}
              variant="ghost"
              size="sm"
              onClick={() => setQuery(suggestion)}
            >
              {suggestion}
            </Button>
          ))}
        </div>
      )}
      {term && import.meta.env.VITE_API_MODE === "connected" && (
        <ButtonLink
          to={`/movies?q=${encodeURIComponent(query.trim())}`}
          onClick={onClose}
          variant="outline"
          className="mt-5"
        >
          Search all films
        </ButtonLink>
      )}
      {term && import.meta.env.VITE_API_MODE === "connected" && (
        <ButtonLink
          to={`/shows?q=${encodeURIComponent(query.trim())}`}
          onClick={onClose}
          variant="outline"
          className="mt-5"
        >
          Search all series
        </ButtonLink>
      )}
    </SessionDialog>
  );
}
