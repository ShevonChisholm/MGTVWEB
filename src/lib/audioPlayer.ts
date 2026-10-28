export function audioClock(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const whole = Math.floor(seconds);
  const hours = Math.floor(whole / 3600);
  return hours
    ? `${hours}:${String(Math.floor(whole / 60) % 60).padStart(2, "0")}:${String(whole % 60).padStart(2, "0")}`
    : `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, "0")}`;
}
export function ringPosition(x: number, y: number, cx: number, cy: number) {
  return (((Math.atan2(y - cy, x - cx) * 180) / Math.PI + 450) % 360) / 360;
}
export function seekKey(
  key: string,
  current: number,
  duration: number,
): number | null {
  if (!Number.isFinite(duration) || duration <= 0) return null;
  const delta: Record<string, number> = {
    ArrowRight: 5,
    ArrowUp: 5,
    ArrowLeft: -5,
    ArrowDown: -5,
    PageUp: 10,
    PageDown: -10,
  };
  const target =
    key === "Home"
      ? 0
      : key === "End"
        ? duration
        : key in delta
          ? current + delta[key]
          : null;
  return target === null ? null : Math.max(0, Math.min(duration, target));
}
