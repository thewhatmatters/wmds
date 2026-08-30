import { cn } from "./cn";
import { focusRingTransitionClasses } from "./motion";

/** Shared focus ring for Tab and Chip segment buttons. */
export const segmentedFocusRingClasses =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-body " +
  focusRingTransitionClasses;

/** Shared disabled treatment for Tab and Chip segment buttons. */
export const segmentedDisabledClasses =
  "cursor-pointer disabled:pointer-events-none disabled:opacity-50";

/** Hide scrollbars on horizontal chip/tab toolbars. Pair with layout classes on the scroller. */
export const horizontalScrollClasses =
  "overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden";

/** Trailing count pill — shared by Tab and Chip. */
export function CountPill({ active, count }: { active: boolean; count: number }) {
  return (
    <span
      className={cn(
        "rounded px-[length:var(--spacing-1)] text-[10.5px] leading-none tabular-nums",
        active ? "bg-secondary text-muted" : "text-muted",
      )}
    >
      {count.toLocaleString("en-US")}
    </span>
  );
}

/** Leading icon slot sizing for Tab segments. */
export const segmentedLeadingIconClasses =
  "inline-flex size-3.5 shrink-0 text-inherit [&>svg]:size-full [&>svg]:shrink-0 [&>svg]:stroke-current";
