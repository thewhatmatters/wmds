/** Circular icon-only control — square hit target from {@link iconButtonSizeClasses}. */
export const iconButtonShapeClass = "shrink-0 rounded-full";

/** FAB pattern — raised elevation on primary fill. */
export const iconButtonFabClasses = "shadow-md";

/** Pill shell for a compact row of ghost IconButtons — Pattern: toolbar group. */
export const iconButtonToolbarGroupClasses =
  "inline-flex items-center gap-1 rounded-full border border-border bg-surface p-1";

/** Inset dismiss hit targets — removable Chip trailing × (pairs with sm | md | lg). */
export const iconButtonInsetHitClasses: Record<"sm" | "md" | "lg", string> = {
  sm: "size-5",
  md: "size-6",
  lg: "size-7",
};

/** Inset dismiss glyph scale — paired with {@link iconButtonInsetHitClasses}. */
export const iconButtonInsetIconSizeClasses: Record<"sm" | "md" | "lg", string> = {
  sm: "size-2.5 shrink-0 stroke-current",
  md: "size-3 shrink-0 stroke-current",
  lg: "size-3.5 shrink-0 stroke-current",
};

/** Tighter focus ring when nested inside a chip or compact row shell. */
export const iconButtonInsetFocusClasses =
  "focus-visible:ring-offset-1 focus-visible:ring-offset-surface";
