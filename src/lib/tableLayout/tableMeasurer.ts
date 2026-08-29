import type { StickySide } from "./tableLayout";
import {
  buildColumnTemplate,
  computeStickyCounts,
  computeStickyOffsets,
  type StickyCounts,
  type StickyOffsets,
} from "./tableLayout";

export interface TableMeasureResult {
  measuredWidths: number[];
  stickyByColumn: Array<StickySide | undefined>;
}

/** Seam for DOM measurement — swap in tests without Playwright. */
export interface TableMeasurer {
  measure(table: HTMLTableElement): TableMeasureResult | null;
}

export interface TableLayoutMetrics {
  stickyOffsets: StickyOffsets;
  stickyCounts: StickyCounts;
  columnTemplate: string | null;
}

function readStickyByColumn(headerRow: Element): Array<StickySide | undefined> {
  return Array.from(headerRow.querySelectorAll<HTMLElement>("th")).map((cell) => {
    const sticky = cell.dataset.sticky;
    return sticky === "start" || sticky === "end" ? sticky : undefined;
  });
}

/** Default adapter — reads header cells from a live table. */
export function createDomTableMeasurer(): TableMeasurer {
  return {
    measure(table) {
      const headerRow = table.querySelector("thead tr");
      if (!headerRow) return null;

      const headerCells = Array.from(headerRow.querySelectorAll<HTMLElement>("th"));
      return {
        measuredWidths: headerCells.map((cell) => cell.getBoundingClientRect().width),
        stickyByColumn: readStickyByColumn(headerRow),
      };
    },
  };
}

/** Pure layout computation — test through this, not the DOM adapter. */
export function computeTableLayoutMetrics(result: TableMeasureResult): TableLayoutMetrics {
  const columnTemplate = buildColumnTemplate(result.measuredWidths);
  return {
    columnTemplate,
    stickyOffsets: computeStickyOffsets(result.measuredWidths, result.stickyByColumn),
    stickyCounts: computeStickyCounts(result.stickyByColumn),
  };
}

export function applyColumnTemplate(table: HTMLTableElement, columnTemplate: string | null): void {
  if (columnTemplate) {
    table.style.setProperty("--wmds-table-column-template", columnTemplate);
  }
}
