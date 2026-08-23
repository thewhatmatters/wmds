/** Shared semantic palette roles — Badge, StatusDot, menu destructive rows. */
export type SemanticVariant = "neutral" | "info" | "success" | "warning" | "destructive";

export const semanticStatusDotClasses: Record<SemanticVariant, string> = {
  neutral: "bg-muted text-surface",
  info: "bg-info text-info-foreground",
  success: "bg-success text-success-foreground",
  warning: "bg-warning text-warning-foreground",
  destructive: "bg-destructive text-destructive-foreground",
};

export const semanticBadgeClasses: Record<SemanticVariant, string> = {
  neutral: "border border-border bg-surface text-muted",
  info:
    "border border-[color-mix(in_srgb,var(--color-info)_30%,var(--color-border))] " +
    "bg-[color-mix(in_srgb,var(--color-info)_12%,var(--color-surface))] text-info",
  success:
    "border border-[color-mix(in_srgb,var(--color-success)_30%,var(--color-border))] " +
    "bg-[color-mix(in_srgb,var(--color-success)_12%,var(--color-surface))] text-success",
  warning:
    "border border-[color-mix(in_srgb,var(--color-warning)_30%,var(--color-border))] " +
    "bg-[color-mix(in_srgb,var(--color-warning)_12%,var(--color-surface))] text-warning",
  destructive:
    "border border-[color-mix(in_srgb,var(--color-destructive)_30%,var(--color-border))] " +
    "bg-[color-mix(in_srgb,var(--color-destructive)_12%,var(--color-surface))] text-destructive",
};

export const semanticMenuDestructiveItemClasses =
  "text-destructive hover:bg-destructive/10 focus-visible:bg-destructive/10";

export const semanticMenuDestructiveDescriptionClasses = "text-destructive/80";
