import { useEffect, useSyncExternalStore } from "react";
import { useLocation } from "react-router";
import { connectedAuth } from "./customerAuth";
import { createStartupGate } from "./startupGate";
const gate = createStartupGate();
export function useHomeStartupReady() {
  const { pathname } = useLocation();
  const ready = useSyncExternalStore(
    gate.subscribe,
    gate.getSnapshot,
    gate.getSnapshot,
  );
  useEffect(() => {
    if (!connectedAuth || pathname !== "/") gate.release();
    else gate.ensure();
  }, [pathname]);
  return !connectedAuth || pathname !== "/" || ready;
}
export const releaseHomeStartup = gate.release;
export const waitForHomeStartup = gate.wait;
export function homePosterReady(image?: HTMLImageElement | null) {
  const afterDecode = () =>
    requestAnimationFrame(() => requestAnimationFrame(gate.release));
  if (image?.decode)
    void image
      .decode()
      .catch(() => {})
      .then(afterDecode);
  else afterDecode();
}
