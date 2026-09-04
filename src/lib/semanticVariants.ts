/** Shared semantic palette roles — menu destructive rows. Status dot tones live in statusDotStyles.ts. */
export type SemanticVariant = "neutral" | "info" | "success" | "warning" | "destructive";

export const semanticMenuDestructiveItemClasses =
  "text-error hover:bg-error-muted focus-visible:bg-error-muted";

export const semanticMenuDestructiveDescriptionClasses = "text-error";
