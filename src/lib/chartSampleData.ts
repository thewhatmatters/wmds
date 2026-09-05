import type { ChartCartesianPoint } from "../components/organisms/Chart/chartCartesianContext";
import {
  chartBucketPeriodData,
  chartPeriodKindFromValue,
  resolveChartPeriodDayCount,
  resolvePeriodSegments,
  type ChartPeriodKind,
} from "./chartTheme";

export { chartPeriodKindFromValue };

/** Story + demo data — daily occupancy counts for Cartesian area patterns. */
export function buildOccupancyAreaSeries(dayCount = 30): ChartCartesianPoint[] {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - (dayCount - 1));

  return Array.from({ length: dayCount }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    const occupied = Math.min(
      200,
      Math.max(80, Math.round(118 + Math.sin(index / 3) * 14 + index * 0.6)),
    );
    const available = 200 - occupied;

    return { date, occupied, available };
  });
}

function seriesCount(point: ChartCartesianPoint, key: string): number {
  const value = point[key];
  return typeof value === "number" && !Number.isNaN(value) ? value : 0;
}

function bucketOccupancyAreaSeries(
  sliced: ChartCartesianPoint[],
  segmentCount: number,
  capacity: number,
): ChartCartesianPoint[] {
  const occupiedRates = sliced.map((point) => seriesCount(point, "occupied") / capacity);
  const availableRates = sliced.map((point) => seriesCount(point, "available") / capacity);

  const occupiedBuckets = chartBucketPeriodData(occupiedRates, segmentCount, { aggregate: "avg" });
  const availableBuckets = chartBucketPeriodData(availableRates, segmentCount, { aggregate: "avg" });

  return occupiedBuckets.map((_, bucketIndex) => {
    const start = Math.floor((bucketIndex * sliced.length) / segmentCount);
    const end = Math.floor(((bucketIndex + 1) * sliced.length) / segmentCount);
    const midIndex = Math.min(Math.max(start, Math.floor((start + end - 1) / 2)), sliced.length - 1);
    const date = sliced[midIndex]!.date;

    return {
      date: new Date(date),
      occupied: Math.round(occupiedBuckets[bucketIndex]!.rate * capacity),
      available: Math.round(availableBuckets[bucketIndex]!.rate * capacity),
    };
  });
}

/**
 * Scope daily occupancy history to a dashboard period — slice trailing days, then
 * {@link chartBucketPeriodData} when display segments are fewer than raw days (quarter / year).
 */
export function occupancyAreaSeriesForPeriod(
  source: ChartCartesianPoint[],
  periodKind: ChartPeriodKind,
  capacity = 200,
): ChartCartesianPoint[] {
  const dayCount = resolveChartPeriodDayCount(periodKind);
  const sliced =
    source.length > dayCount ? source.slice(source.length - dayCount) : [...source];
  const segmentCount = resolvePeriodSegments({ kind: periodKind, dayCount: sliced.length });

  if (sliced.length <= segmentCount) {
    return sliced;
  }

  return bucketOccupancyAreaSeries(sliced, segmentCount, capacity);
}

/** Select value string → scoped Cartesian series (Card.Header period filter). */
export function occupancyAreaSeriesForSelectValue(
  source: ChartCartesianPoint[],
  selectValue: string,
  capacity = 200,
): ChartCartesianPoint[] {
  return occupancyAreaSeriesForPeriod(source, chartPeriodKindFromValue(selectValue), capacity);
}
