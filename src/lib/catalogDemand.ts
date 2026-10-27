export type CatalogKind = "movies" | "shows" | "music" | "sports" | "events" | "news" | "lifestyle" | "artists";
export type CatalogMode = "full" | "history" | "none";
/** Fetch only the catalogs the current surface consumes. Auth/playback still
 * revalidate through their own endpoints; this is request scheduling, not access. */
export function catalogMode(kind:CatalogKind,path:string):CatalogMode {
  if(path==="/music/player")return "none";
  if(path==="/my-list")return "full";
  if(path==="/")return ["movies","shows","sports"].includes(kind)?"history":"none";
  if(kind==="movies")return /^\/movies(?:\/|$)/.test(path)||/^\/watch\/(?!episodes(?:\/|$))[^/]+$/.test(path)?"full":"none";
  if(kind==="shows")return /^\/(?:shows|watch\/episodes)(?:\/|$)/.test(path)?"full":"none";
  if(kind==="artists")return /^\/music(?:\/|$)/.test(path)?"full":"none";
  return path===`/${kind}`||path.startsWith(`/${kind}/`)?"full":"none";
}
