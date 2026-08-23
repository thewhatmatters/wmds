import { useLayoutEffect, useState, type RefObject } from "react";
import {
  buildColumnTemplate,
  computeScrollEdge,
  computeStickyCounts,
  computeStickyOffsets,
  type ScrollEdgeState,
  type StickyCounts,
  type StickyOffsets,
  type StickySide,
} from "./tableLayout";

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

export function useMeasureTableLayout(tableRef: RefObject<HTMLTableElement | null>) {
  const [metrics, setMetrics] = useState<TableLayoutMetrics>({
    stickyOffsets: { start: [], end: [] },
    stickyCounts: { start: 0, end: 0 },
    columnTemplate: null,
  });

  useLayoutEffect(() => {
    const table = tableRef.current;
    if (!table) return;

    const measure = () => {
      const headerRow = table.querySelector("thead tr");
      if (!headerRow) {
        setMetrics({
          stickyOffsets: { start: [], end: [] },
          stickyCounts: { start: 0, end: 0 },
          columnTemplate: null,
        });
        return;
      }

      const headerCells = Array.from(headerRow.querySelectorAll<HTMLElement>("th"));
      const measuredWidths = headerCells.map((cell) => cell.getBoundingClientRect().width);
      const stickyByColumn = readStickyByColumn(headerRow);
      const columnTemplate = buildColumnTemplate(measuredWidths);

      if (columnTemplate) {
        table.style.setProperty("--wmds-table-column-template", columnTemplate);
      }

      const stickyOffsets = computeStickyOffsets(measuredWidths, stickyByColumn);
      const stickyCounts = computeStickyCounts(stickyByColumn);
      setMetrics({ stickyOffsets, stickyCounts, columnTemplate });
    };

    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(table);

    const header = table.querySelector("thead");
    if (header) observer.observe(header);

    return () => observer.disconnect();
  }, [tableRef]);

  return metrics;
}

export function useScrollEdgeState(scrollerRef: RefObject<HTMLDivElement | null>): ScrollEdgeState {
  const [state, setState] = useState<ScrollEdgeState>({
    canScrollStart: false,
    canScrollEnd: false,
  });

  useLayoutEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const update = () => {
      const { scrollLeft, clientWidth, scrollWidth } = scroller;
      setState(computeScrollEdge(scrollLeft, clientWidth, scrollWidth));
    };

    update();
    scroller.addEventListener("scroll", update, { passive: true });

    const observer = new ResizeObserver(update);
    observer.observe(scroller);
    const table = scroller.querySelector("table");
    if (table) observer.observe(table);

    return () => {
      scroller.removeEventListener("scroll", update);
      observer.disconnect();
    };
  }, [scrollerRef]);

  return state;
}
