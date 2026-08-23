import { shadowElevationClass } from "../../foundation/shadows";

export type ListVariant = "contained" | "separated";

export const listRootVariantClasses: Record<ListVariant, string> = {
  contained: "flex w-full flex-col gap-[length:var(--spacing-0)]",
  separated: "flex w-full flex-col gap-[length:var(--spacing-2)]",
};

export const listItemVariantClasses: Record<ListVariant, string> = {
  contained: "border-b border-border last:border-b-0",
  separated: [
    "overflow-hidden rounded-lg bg-surface",
    shadowElevationClass("raised"),
  ].join(" "),
};

/** Fixed 24px leading lane — badges, step rings, icons. */
export const listItemMediaClasses =
  "flex size-6 shrink-0 items-center justify-center";

export const listItemRowClasses =
  "flex h-11 w-full items-center gap-[length:var(--spacing-2-5)] px-[length:var(--spacing-2-5)] text-left";

export const listItemButtonClasses =
  listItemRowClasses +
  " cursor-pointer transition-[background-color] hover:bg-secondary-hover " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg";

export const listItemLabelClasses =
  "min-w-0 flex-1 truncate text-sm font-medium leading-[var(--line-height-sm)] text-fg";

export const listItemMetaClasses =
  "shrink-0 text-[12.5px] leading-[var(--line-height-sm)] text-muted tabular-nums";

export const listItemTrailingClasses =
  "flex shrink-0 items-center gap-[length:var(--spacing-1-5)]";

export const listItemChevronClasses =
  "flex size-7 shrink-0 items-center justify-center text-muted transition-transform";

export const listItemPanelInnerClasses =
  "mb-[length:var(--spacing-2-5)] flex items-stretch gap-[length:var(--spacing-2-5)] px-[length:var(--spacing-2-5)]";

/** Invisible lane matching {@link listItemChevronClasses} — keeps panel content aligned to header meta. */
export const listItemPanelChevronSpacerClasses =
  listItemChevronClasses + " pointer-events-none invisible";

export const listItemDetailRailLaneClasses =
  "flex w-6 shrink-0 justify-center self-stretch";

export const listItemDetailRailClasses = "w-px shrink-0 self-stretch bg-border";

export const listItemDetailLabelClasses =
  "text-xs leading-[var(--line-height-xs)] text-muted";

export const listItemDetailMetaClasses =
  "font-mono text-[11.5px] leading-[var(--line-height-xs)] text-muted tabular-nums";
