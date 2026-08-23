export type TabSize = "xs" | "sm" | "md";

/** Segment label + padding — height grows with size (xs ≈22px, sm ≈26px, md ≈32px). */
export const tabSegmentSizeClasses: Record<TabSize, string> = {
  xs: "gap-[length:var(--spacing-1-5)] px-[length:var(--spacing-2)] py-[2px] text-[11.5px] leading-[1.5]",
  sm: "gap-[length:var(--spacing-1-5)] px-[length:var(--spacing-2-5)] py-[length:var(--spacing-1)] text-xs leading-none",
  md: "gap-[length:var(--spacing-2)] px-[length:var(--spacing-3)] py-[length:var(--spacing-1-5)] text-sm leading-[var(--line-height-sm)]",
};

/** Icon-only segments — square-ish padding per size. */
export const tabIconOnlyPaddingClasses: Record<TabSize, string> = {
  xs: "px-[length:var(--spacing-2)]",
  sm: "px-[length:var(--spacing-2-5)]",
  md: "px-[length:var(--spacing-3)]",
};

export const tabLeadingIconSizeClasses: Record<TabSize, string> = {
  xs: "inline-flex size-3.5 shrink-0 text-inherit [&>svg]:size-full [&>svg]:shrink-0 [&>svg]:stroke-current",
  sm: "inline-flex size-3.5 shrink-0 text-inherit [&>svg]:size-full [&>svg]:shrink-0 [&>svg]:stroke-current",
  md: "inline-flex size-4 shrink-0 text-inherit [&>svg]:size-full [&>svg]:shrink-0 [&>svg]:stroke-current",
};

/** Shared pill track inset — matches segment density. */
export const tabTrackSizeClasses: Record<TabSize, string> = {
  xs: "gap-[2px] p-[2px]",
  sm: "gap-[2px] p-[2px]",
  md: "gap-[2px] p-[2px]",
};
