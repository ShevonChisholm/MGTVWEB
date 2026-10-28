import { useState, type ReactNode } from "react";
import { Link } from "react-router";
export const avatarPalette: Record<string, string> = {
  gold: "#C9A84C",
  blue: "#60a5fa",
  coral: "#fb7185",
  jade: "#34d399",
  purple: "#c084fc",
};
const paths: Record<string, string> = {
  lock: "M5 10h14v11H5zM8 10V6a4 4 0 0 1 8 0v4",
  edit: "m15 3 6 6-12 12H3v-6L15 3Zm-3 3 6 6",
  plus: "M12 4v16M4 12h16",
  back: "M19 12H5m6-6-6 6 6 6",
  arrow: "M5 12h14m-6-6 6 6-6 6",
  settings: "M4 6h16M4 12h16M4 18h16M8 3v6m8 0v6m-7 0v6",
  play: "m8 4 12 8-12 8V4Z",
  bell: "M5 17h14l-2-3V9a5 5 0 0 0-10 0v5l-2 3m5 3h4",
  shield: "M12 2 3 6v6c0 5 9 10 9 10s9-5 9-10V6L12 2Zm-4 9 3 3 5-6",
  trash: "M3 6h18M9 3h6M5 6l1 15h12l1-15M10 10v7m4-7v7",
  check: "M5 12l4 4L19 6",
  refresh: "M20 8a8 8 0 1 0 0 8M20 3v5h-5",
  language: "M3 5h12M9 2v3m-4 4 7 8M13 5C12 11 8 16 3 18m12 3 4-11 4 11m-7-3h6",
  user: "M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10ZM3 22v-2a9 9 0 0 1 18 0v2",
};
export function ProfileIcon({
  name,
  size = 20,
}: {
  name: string;
  size?: number;
}) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={paths[name] ?? paths.user} />
    </svg>
  );
}
export function ProfileAvatar({
  name,
  avatar,
  type,
  small = false,
  src,
}: {
  name: string;
  avatar: string;
  type?: string;
  small?: boolean;
  src?: string | null;
}) {
  const color = avatarPalette[avatar] ?? avatarPalette.gold;
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  return (
    <span
      aria-hidden="true"
      className={"pf-avatar " + (small ? "pf-avatar--small" : "")}
      style={{
        color,
        background: `radial-gradient(ellipse at 80% 0, ${color}40, transparent 85%), #17191b`,
      }}
    >
      {src && src !== failedSrc ? (
        <img
          src={src}
          alt=""
          referrerPolicy="same-origin"
          className="h-full w-full rounded-[inherit] object-cover"
          onError={() => setFailedSrc(src)}
        />
      ) : (
        <>
          <svg
            className="pf-avatar-lines"
            viewBox="0 0 150 150"
            fill="none"
            stroke="currentColor"
          >
            <path d="M-10 125Q65 40 160 110M-10 145Q65 60 160 130" />
            <path d="m102 13 11 15 19-4" />
          </svg>
          <span className="pf-avatar-initial">
            {name.slice(0, 1).toLocaleUpperCase() || "M"}
          </span>
          {type === "child" && <span className="pf-avatar-star">✦</span>}
        </>
      )}
    </span>
  );
}
export function ProfileSettingLink({
  to,
  icon,
  title,
  description,
  danger = false,
}: {
  to: string;
  icon: string;
  title: string;
  description: string;
  danger?: boolean;
}) {
  return (
    <Link
      className={"pf-setting " + (danger ? "pf-setting--danger" : "")}
      to={to}
    >
      <span className="pf-setting-icon">
        <ProfileIcon name={icon} />
      </span>
      <span>
        <strong>{title}</strong>
        <small>{description}</small>
      </span>
      <ProfileIcon name="arrow" size={17} />
    </Link>
  );
}
export function ProfilePanel({ children }: { children: ReactNode }) {
  return <div className="pf-panel">{children}</div>;
}
