const paths: Record<string, string> = {
  like: "M7 10h-4v11h4M7 10l5-8c3 0 2 5 1 7h6a2 2 0 0 1 2 2l-2 8a3 3 0 0 1-3 2H7V10Z",
  save: "M6 3h12v19l-6-4-6 4V3Z",
  share:
    "M18 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm0 14a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM6 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm3-5 6-4m-6 8 6 4",
  comment: "M21 11a8 8 0 0 1-8 8H7l-5 3V11a9 9 0 0 1 19 0Z",
  check: "M5 12l4 4L19 6",
  calendar: "M4 5h16v16H4zM8 2v6M16 2v6M4 10h16",
};
export function EngagementIcon({
  name,
  active = false,
}: {
  name: string;
  active?: boolean;
}) {
  return (
    <svg
      aria-hidden="true"
      className="h-5 w-5 shrink-0"
      viewBox="0 0 24 24"
      fill={active ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <title>{name==="save"?(active?"Remove from My List":"Save to My List"):name==="like"?(active?"Unlike":"Like"):name==="share"?"Share":name==="comment"?"Comments":name==="check"?"Copied":"Interested"}</title>
      <path d={paths[name] ?? paths.like} />
    </svg>
  );
}
