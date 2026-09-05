import { motionTransition } from "../../../lib/motion";
import { typographyClass } from "../../../lib/typography";
import { cn } from "../../../lib/cn";

/** Floating panel — fixed positioning applied by parent (Select, MoreMenu). */
export const dropdownMenuClasses = cn(
  "z-50 max-h-60 overflow-y-auto rounded-2xl border border-border bg-surface p-0.5 shadow-md",
  motionTransition("fast"),
);

/** Vertical stack — 2px gap; item radius 14px = shell 16px − inset 2px. */
export const dropdownMenuListClasses = "m-0 flex list-none flex-col gap-0.5 p-0";

/** Gap between anchor shell and menu when positioned with getBoundingClientRect. */
export const dropdownMenuOffsetPx = 4;

export const dropdownItemButtonClasses = cn(
  typographyClass("body"),
  "flex w-full cursor-pointer items-center gap-2 rounded-[14px] px-3.5 py-2 text-left text-fg",
  "transition-[color,background-color] hover:bg-accent-muted focus-visible:outline-none focus-visible:bg-accent-muted",
  motionTransition("fast"),
);

/** Off-DOM row measure — intrinsic width from longest label + slots (not trigger width). */
export const dropdownItemMeasureButtonClasses = cn(
  dropdownItemButtonClasses,
  "inline-flex w-max max-w-none",
);

/** Keyboard / pointer highlight — not used for the committed selection. */
export const dropdownItemActiveClasses = "bg-accent-muted";

export const dropdownItemDisabledClasses = "pointer-events-none opacity-50";

/** Leading icon, avatar, checkbox, or color swatch. */
export const dropdownItemStartClasses =
  "flex shrink-0 items-center text-muted [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:stroke-current";

/** Primary row copy — truncates when start/end are present. */
export const dropdownItemLabelClasses = "min-w-0 flex-1 truncate text-left";

/** Listbox labels — full copy; width comes from menu measurement (**Select**, **MoreMenu**). */
export const dropdownItemLabelFullClasses = "min-w-0 flex-1 whitespace-nowrap text-left";

/** Off-DOM menu measure — no flex shrink so labels size to full copy. */
export const dropdownItemMeasureLabelClasses = cn(typographyClass("body"), "whitespace-nowrap text-left");

/** Shortcut hint, count, or meta — mono tabular for key caps. */
export const dropdownItemEndClasses = cn(
  typographyClass("caption"),
  "shrink-0 font-mono tabular-nums text-muted",
);

/** Selected check — end slot; selection is not a row fill. */
export const dropdownItemSelectedCheckClasses =
  "flex shrink-0 items-center text-fg [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:stroke-current";
