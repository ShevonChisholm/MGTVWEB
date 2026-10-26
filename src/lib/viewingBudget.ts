/** Ask the delivery layer for a fresh authorized window before resuming expired video. */
export function playAuthorizedMedia(
  element: HTMLMediaElement | null,
  fromStart = false,
): Promise<void> {
  if (!element) return Promise.resolve();
  if (fromStart) element.dispatchEvent(new Event("mgtv:budget-restart"));
  if (element.dataset.mgtvBudgetDeferred === "true") {
    element.dispatchEvent(new Event("mgtv:budget-play"));
    return Promise.resolve();
  }
  return element.play();
}
