import {
  tileGridBreakpoints,
  tileGridDefaultColumns,
  type TileGridBreakpoint,
  type TileGridColumns,
} from "./tileGridStyles";

/** Columns at every breakpoint — each one left out takes the one below it; at least 1, whole. */
export function tileGridResolveColumns(
  columns: TileGridColumns = tileGridDefaultColumns,
): Record<TileGridBreakpoint, number> {
  const byBreakpoint: Partial<Record<TileGridBreakpoint, number>> =
    typeof columns === "number" ? { base: columns } : columns;
  let current = 1;
  const resolved = {} as Record<TileGridBreakpoint, number>;
  for (const breakpoint of tileGridBreakpoints) {
    const value = byBreakpoint[breakpoint];
    if (value != null && Number.isFinite(value)) current = Math.max(1, Math.round(value));
    resolved[breakpoint] = current;
  }
  return resolved;
}

/** How many row tracks an item of this height takes in a packed grid. */
export function tileGridRowSpan(heightPx: number, unitPx: number): number {
  return Math.max(1, Math.ceil(heightPx / unitPx));
}

/** The column count a computed `grid-template-columns` describes ("285px 285px 285px" → 3). */
export function tileGridColumnCount(template: string): number {
  const tracks = template.trim().split(/\s+/).filter((track) => track !== "" && track !== "none");
  return Math.max(1, tracks.length);
}
