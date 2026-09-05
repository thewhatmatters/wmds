import type { ChartCartesianPoint } from "../components/organisms/Chart/chartCartesianContext";

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
