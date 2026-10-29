import type { CSSProperties } from "react";

/**
 * Form layout L7: a field's width hints at the answer. Characters for fixed-length answers (ZIP 5ch,
 * a US state 2ch, a year 4ch, a phone 10ch…), `full` for everything else.
 */
export const fieldWidths = ["2ch", "4ch", "5ch", "10ch", "20ch", "full"] as const;

export type FieldWidth = (typeof fieldWidths)[number];

/**
 * Width for the field's shell: the characters plus the shell's own padding, border and insets (`chrome`,
 * a CSS length), never wider than its container. `ch` is the inherited body face's, so the shell has a
 * little room to spare at the smaller field sizes.
 */
export function fieldWidthStyle(width: FieldWidth, chrome: string): CSSProperties | undefined {
  if (width === "full") return undefined;
  return { width: `calc(${width} + ${chrome})`, maxWidth: "100%" };
}
