import { useCallback, useSyncExternalStore } from "react";
import { readSheetParam, withSheetParam } from "./sheetParam";

const CHANGE_EVENT = "wmds:sheetparam";

export interface UseSheetParamOptions {
  /**
   * The request URL on the server, so the first paint already has the sheet open.
   * Ignored in the browser once the page is live — the address bar wins.
   */
  initialUrl?: string | URL;
}

export interface UseSheetParamResult {
  /** `true` when the URL asks for this `kind` of sheet. Pass to **Sheet** `open`. */
  open: boolean;
  /** The id in the URL while `open`, otherwise `null`. */
  id: string | null;
  /**
   * Pass to **Sheet** `onOpenChange`. Opening needs an `id` (`onOpenChange(true, "maya-chen")`) and
   * pushes a history entry; closing replaces the current one. Opening without an id does nothing.
   */
  onOpenChange: (open: boolean, id?: string) => void;
}

function subscribe(notify: () => void): () => void {
  window.addEventListener("popstate", notify);
  window.addEventListener(CHANGE_EVENT, notify);
  return () => {
    window.removeEventListener("popstate", notify);
    window.removeEventListener(CHANGE_EVENT, notify);
  };
}

function readLocation(): string {
  return `${window.location.pathname}${window.location.search}`;
}

/**
 * Keeps one kind of sheet in the URL as `?sheet=<kind>&id=<id>` with the History API — no router.
 * Back closes the sheet and a deep link opens it on the first render. Rows can stay real links
 * (`href={withSheetParam(url, id, kind)}`) so they work without JavaScript.
 */
export function useSheetParam(kind: string, options: UseSheetParamOptions = {}): UseSheetParamResult {
  const { initialUrl } = options;
  const serverUrl = initialUrl == null ? "/" : typeof initialUrl === "string" ? initialUrl : initialUrl.href;

  const current = useSyncExternalStore(subscribe, readLocation, () => serverUrl);
  const value = readSheetParam(current);
  const open = value.kind === kind;

  const onOpenChange = useCallback(
    (next: boolean, id?: string) => {
      if (next) {
        if (id == null || id === "") {
          return;
        }
        window.history.pushState(null, "", withSheetParam(readLocation(), id, kind));
      } else {
        window.history.replaceState(null, "", withSheetParam(readLocation(), null, kind));
      }
      window.dispatchEvent(new Event(CHANGE_EVENT));
    },
    [kind],
  );

  return { open, id: open ? value.id : null, onOpenChange };
}
