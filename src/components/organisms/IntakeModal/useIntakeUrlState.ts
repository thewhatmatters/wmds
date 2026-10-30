"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * Contact and booking forms T9: the intake modal is a shortcut to a page, and its URL says it's open
 * (`?sketch`), so the link can be shared and a refresh reopens it. Opening pushes a history entry, so the
 * browser's Back closes the modal; closing drops the parameter.
 *
 * ```tsx
 * const [open, setOpen] = useIntakeUrlState("sketch");
 * <IntakeModal open={open} onOpenChange={setOpen} … />
 * ```
 */
export function useIntakeUrlState(param = "sketch"): [boolean, (open: boolean) => void] {
  const [open, setOpenState] = useState(false);

  useEffect(() => {
    const sync = () => setOpenState(new URLSearchParams(window.location.search).has(param));
    sync();
    window.addEventListener("popstate", sync);
    return () => window.removeEventListener("popstate", sync);
  }, [param]);

  const setOpen = useCallback(
    (next: boolean) => {
      const url = new URL(window.location.href);
      const isOpen = url.searchParams.has(param);
      if (next && !isOpen) {
        url.searchParams.set(param, "");
        window.history.pushState(window.history.state, "", url.toString().replace(`${param}=`, param));
      } else if (!next && isOpen) {
        url.searchParams.delete(param);
        window.history.replaceState(window.history.state, "", url.toString());
      }
      setOpenState(next);
    },
    [param],
  );

  return [open, setOpen];
}
