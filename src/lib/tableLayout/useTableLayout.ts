import { useLayoutEffect, useState, type RefObject } from "react";
import { computeScrollEdge, type ScrollEdgeState } from "./tableLayout";
import {
  applyColumnTemplate,
  computeTableLayoutMetrics,
  createDomTableMeasurer,
  type TableLayoutMetrics,
  type TableMeasurer,
} from "./tableMeasurer";

export function useMeasureTableLayout(
  tableRef: RefObject<HTMLTableElement | null>,
  measurer: TableMeasurer = createDomTableMeasurer(),
) {
  const [metrics, setMetrics] = useState<TableLayoutMetrics>({
    stickyOffsets: { start: [], end: [] },
    stickyCounts: { start: 0, end: 0 },
    columnTemplate: null,
  });

  useLayoutEffect(() => {
    const table = tableRef.current;
    if (!table) return;

    const measure = () => {
      const result = measurer.measure(table);
      if (!result) {
        setMetrics({
          stickyOffsets: { start: [], end: [] },
          stickyCounts: { start: 0, end: 0 },
          columnTemplate: null,
        });
        return;
      }

      const next = computeTableLayoutMetrics(result);
      applyColumnTemplate(table, next.columnTemplate);
      setMetrics(next);
    };

    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(table);

    const header = table.querySelector("thead");
    if (header) observer.observe(header);

    return () => observer.disconnect();
  }, [tableRef, measurer]);

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
