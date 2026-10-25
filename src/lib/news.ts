import { useEffect, useState } from "react";
import type { CatalogItem } from "@/data/mockContent";
export type NewsArticle = {
  id: string;
  title: string;
  summary: string;
  category: string;
  author: string;
  coverUrl: string;
  imageAlt: string;
  imageCaption: string;
  publishedAt: string;
  readMinutes: number;
  blocks?: { type: "paragraph" | "heading" | "quote"; text: string }[];
};
export function newsItem(a: NewsArticle): CatalogItem {
  return {
    id: a.id,
    type: "news",
    source: "api",
    title: a.title,
    description: a.summary,
    genre: a.category,
    thumbnail: a.coverUrl,
    date: new Date(a.publishedAt).toLocaleDateString("en-JM", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }),
    readTime: a.readMinutes + " min read",
  };
}
export function useNews(path = "/news?limit=24") {
  const [data, setData] = useState<any>(null),
    [error, setError] = useState(""),
    [loading, setLoading] = useState(true),
    [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    setData(null);
    setError("");
    setLoading(true);
    if (import.meta.env.VITE_API_MODE !== "connected") {
      setLoading(false);
      return;
    }
    void fetch("/api/v1/catalog" + path, { signal: controller.signal })
      .then(async (r) => {
        const b = await r.json();
        if (!r.ok) throw Error(b.message ?? "Stories are unavailable.");
        return b;
      })
      .then((b) => setData(b))
      .catch((e) => {
        if (e.name !== "AbortError") setError(e.message);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [path, attempt]);
  return { data, error, loading, retry: () => setAttempt((n) => n + 1) };
}
