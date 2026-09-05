import type { UseTooltipInPortal } from "@visx/tooltip";
import type { ScaleLinear, ScaleTime } from "@visx/vendor/d3-scale";
import { createContext, useContext, type ReactNode } from "react";
import type {
  ChartPeriodKind,
  ChartSeriesConfig,
  ChartVariant,
} from "../../../lib/chartTheme";

export type ChartCartesianPoint = {
  date: Date;
  [seriesKey: string]: Date | number | null | undefined;
};

export type ChartCartesianTooltipDatum = {
  point: ChartCartesianPoint;
  index: number;
};

export type ChartCartesianContextValue = {
  data: ChartCartesianPoint[];
  config: ChartSeriesConfig;
  seriesKeys: string[];
  variant: ChartVariant;
  periodKind?: ChartPeriodKind;
  width: number;
  height: number;
  margin: { top: number; right: number; bottom: number; left: number };
  innerWidth: number;
  innerHeight: number;
  xScale: ScaleTime<number, number>;
  yScale: ScaleLinear<number, number>;
  xAccessor: (point: ChartCartesianPoint) => Date;
  yAccessor: (point: ChartCartesianPoint, key: string) => number;
  TooltipInPortal: UseTooltipInPortal["TooltipInPortal"];
};

const ChartCartesianContext = createContext<ChartCartesianContextValue | null>(null);

export function ChartCartesianProvider({
  value,
  children,
}: {
  value: ChartCartesianContextValue;
  children: ReactNode;
}) {
  return <ChartCartesianContext.Provider value={value}>{children}</ChartCartesianContext.Provider>;
}

export function useChartCartesian(): ChartCartesianContextValue {
  const context = useContext(ChartCartesianContext);
  if (context == null) {
    throw new Error("[WMDS Chart] Cartesian subcomponents must render inside Chart.Cartesian.");
  }
  return context;
}
