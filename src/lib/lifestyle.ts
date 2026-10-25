import { useEffect, useState } from "react";
import { useMusic } from "@/context/MusicContext";
import { customerApi } from "./customerAuth";
import type { CatalogItem, LifestyleArticle } from "@/data/mockContent";
export const lifestyleCategories = {
  food: "Food & Cooking",
  travel: "Travel",
  fashion: "Fashion",
  culture: "Culture",
  wellness: "Wellness",
};
export type LifestyleStory = {
  id: string;
  title: string;
  summary: string;
  category: keyof typeof lifestyleCategories;
  author: string;
  imageAlt: string;
  imageCaption: string;
  coverUrl: string;
  publishedAt: string;
  readMinutes: number;
  blocks?: { type: "paragraph" | "heading" | "quote"; text: string }[];
};
export const lifestyleItem = (a: LifestyleStory): CatalogItem => ({
  id: a.id,
  type: "lifestyle",
  source: "api",
  title: a.title,
  thumbnail: a.coverUrl,
  description: a.summary,
  genre: lifestyleCategories[a.category],
  date: new Date(a.publishedAt).toLocaleDateString("en-JM"),
  readTime: a.readMinutes + " min read",
});
export const lifestyleArticle = (
  a: LifestyleStory,
  index: number,
): LifestyleArticle => ({
  id: a.id,
  title: a.title,
  subtitle: a.summary,
  image: a.coverUrl,
  category: a.category,
  readTime: a.readMinutes + " min read",
  date: new Date(a.publishedAt).toLocaleDateString("en-JM"),
  featured: index === 0,
  excerpt: a.summary,
});
export function useLifestyle(path = "/lifestyle?limit=24", personal = false) {
  const music = useMusic();
  const [data, setData] = useState<any>(null),
    [error, setError] = useState(""),
    [loading, setLoading] = useState(true),
    [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let active = true;
    const controller = new AbortController();
    setData(null);
    setError("");
    setLoading(true);
    if (
      import.meta.env.VITE_API_MODE !== "connected" ||
      (personal && !music.session?.activeProfileId)
    ) {
      setLoading(false);
      return;
    }
    const request = personal
      ? customerApi(path, "GET", undefined, {
          "X-Profile-Context": music.session.activeProfileId,
        })
      : fetch("/api/v1/catalog" + path, { signal: controller.signal }).then(
          async (r) => {
            const body = await r.json();
            if (!r.ok)
              throw Error(body.message ?? "Lifestyle stories are unavailable.");
            return body;
          },
        );
    void request
      .then((b) => {
        if (active) setData(b);
      })
      .catch((e) => {
        if (active && e.name !== "AbortError") setError(e.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
      controller.abort();
    };
  }, [path, personal, music.audience, attempt]);
  return {
    data,
    error,
    loading,
    session: music.session,
    audience: music.audience,
    retry: () => setAttempt((n) => n + 1),
  };
}
