export function musicDuration(seconds?: number, fallback = "") {
  if (typeof seconds !== "number" || !Number.isFinite(seconds) || seconds < 0)
    return fallback;
  const whole = Math.floor(seconds),
    minutes = Math.floor(whole / 60),
    tail = String(whole % 60).padStart(2, "0");
  return minutes >= 60
    ? `${Math.floor(minutes / 60)}:${String(minutes % 60).padStart(2, "0")}:${tail}`
    : `${minutes}:${tail}`;
}
