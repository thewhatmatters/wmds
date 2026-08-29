import type { SemanticVariant } from "../../../lib/semanticVariants";

export const statusDotVariants = ["neutral", "info", "success", "warning", "destructive"] as const;

export type StatusDotVariant = (typeof statusDotVariants)[number];

/** Fixed 8px dot — semantic fill from variant. */
export const statusDotBaseClasses = "inline-block size-2 shrink-0 rounded-full";

export const statusDotVariantClasses: Record<StatusDotVariant, string> = {
  neutral: "bg-muted",
  info: "bg-info",
  success: "bg-success",
  warning: "bg-warning",
  destructive: "bg-destructive",
};

export const statusDotPulseClass = "animate-status-dot-pulse";

export function isStatusDotVariant(value: string): value is StatusDotVariant {
  return (statusDotVariants as readonly string[]).includes(value);
}

export type { SemanticVariant };
