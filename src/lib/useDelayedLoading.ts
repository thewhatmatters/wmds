import { useEffect, useRef, useState } from "react";

export interface DelayedLoadingOptions {
  /** Wait this long before showing the indicator, so a quick load shows nothing. Default 400ms. */
  delay?: number;
  /** Once shown, keep it at least this long, so it never flashes. Default 400ms. */
  minDuration?: number;
}

/**
 * Loading states Y7: whether to show a loading indicator for a `loading` flag. Nothing for the first
 * `delay` (most loads finish sooner); once shown, at least `minDuration` (no flash). The data still swaps
 * in as soon as it arrives where the caller doesn't gate it; only the indicator is timed.
 */
export function useDelayedLoading(loading: boolean, { delay = 400, minDuration = 400 }: DelayedLoadingOptions = {}): boolean {
  const [shown, setShown] = useState(false);
  const shownAt = useRef<number | null>(null);

  useEffect(() => {
    if (loading) {
      if (shown) return;
      const timer = setTimeout(() => {
        shownAt.current = Date.now();
        setShown(true);
      }, delay);
      return () => clearTimeout(timer);
    }
    if (!shown) return;
    const elapsed = Date.now() - (shownAt.current ?? 0);
    const timer = setTimeout(() => {
      shownAt.current = null;
      setShown(false);
    }, Math.max(0, minDuration - elapsed));
    return () => clearTimeout(timer);
  }, [loading, shown, delay, minDuration]);

  return shown;
}
