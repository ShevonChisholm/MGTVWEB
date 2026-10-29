import { customerApi, CustomerAuthError } from "./customerAuth";
export type Podcast = {
  id: string;
  kind: "series" | "episode";
  seriesId: string | null;
  seriesTitle: string | null;
  title: string;
  description: string;
  host: string;
  category: string;
  format: "audio" | "video" | "mixed";
  classification: string;
  accessTier: "free" | "premium";
  eligibleTierIds: string[];
  coverUrl: string | null;
  featureUrl: string | null;
  previewAvailable: boolean;
  seasonNumber: number | null;
  episodeNumber: number | null;
  durationSeconds: number;
  progress?: {
    version: number;
    seconds: number;
    completed: boolean;
    mediaVersionId: string | null;
  };
};
export async function podcastRequest(
  path: string,
  profile?: string | null,
  signal?: AbortSignal,
): Promise<any> {
  if (profile)
    return customerApi("/podcasts" + path, "GET", undefined, {
      "X-Profile-Context": profile,
    });
  const r = await fetch("/api/v1/catalog/podcasts" + path, { signal });
  const b = await r.json();
  if (!r.ok)
    throw new CustomerAuthError(
      r.status,
      b.message ?? "Podcasts could not be loaded.",
      b.code,
    );
  return b;
}
export function podcastTime(seconds: number) {
  if (!Number.isFinite(seconds)) return "0:00";
  return (
    Math.floor(seconds / 60) +
    ":" +
    String(Math.floor(seconds % 60)).padStart(2, "0")
  );
}
