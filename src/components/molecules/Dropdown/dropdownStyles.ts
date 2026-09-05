import { motionTransition } from "../../../lib/motion";
import { typographyClass } from "../../../lib/typography";
import { cn } from "../../../lib/cn";

/** Floating panel — fixed positioning applied by parent (Select, future DropdownMenu). */
export const dropdownMenuClasses = cn(
  "z-50 max-h-60 overflow-y-auto rounded-2xl border border-border bg-surface p-0.5 shadow-md",
  motionTransition("fast"),
);

/** Gap between anchor shell and menu when positioned with getBoundingClientRect. */
export const dropdownMenuOffsetPx = 4;

export const dropdownItemButtonClasses = cn(
  typographyClass("body"),
  "flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-left text-fg",
  "transition-[color,background-color] hover:bg-accent-muted focus-visible:outline-none focus-visible:bg-accent-muted",
  motionTransition("fast"),
);

/** Keyboard / pointer highlight — not used for the committed selection. */
export const dropdownItemActiveClasses = "bg-accent-muted";

export const dropdownItemDisabledClasses = "pointer-events-none opacity-50";

/** Leading icon, avatar, checkbox, or color swatch. */
export const dropdownItemStartClasses =
  "flex shrink-0 items-center text-muted [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:stroke-current";

/** Primary row copy — truncates when start/end are present. */
export const dropdownItemLabelClasses = "min-w-0 flex-1 truncate text-left";

/** Listbox labels — full copy; width comes from menu measurement (**Select**). */
export const dropdownItemLabelFullClasses = "min-w-0 flex-1 whitespace-nowrap text-left";

/** Shortcut hint, count, or meta — mono tabular for key caps. */
export const dropdownItemEndClasses = cn(
  typographyClass("caption"),
  "shrink-0 font-mono tabular-nums text-muted",
);

/** Selected check — end slot; selection is not a row fill. */
export const dropdownItemSelectedCheckClasses =
  "flex shrink-0 items-center text-fg [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:stroke-current";

export const dropdownMenuListClasses = "m-0 list-none p-0";
