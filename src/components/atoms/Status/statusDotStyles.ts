import type { SemanticVariant } from "../../../lib/semanticVariants";

export const statusTones = ["neutral", "info", "success", "warning", "destructive"] as const;

export type StatusTone = (typeof statusTones)[number];

/** Fixed 8px dot — semantic fill from `tone`. */
export const statusDotBaseClasses = "inline-block size-2 shrink-0 rounded-full";

export const statusDotToneClasses: Record<StatusTone, string> = {
  neutral: "bg-muted",
  info: "bg-info",
  success: "bg-success",
  warning: "bg-warning",
  destructive: "bg-error",
};

export const statusDotPulseClass = "animate-status-dot-pulse";

export function isStatusTone(value: string): value is StatusTone {
  return (statusTones as readonly string[]).includes(value);
}

export type { SemanticVariant };
