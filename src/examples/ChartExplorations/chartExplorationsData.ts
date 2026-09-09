import type {
  ChartDistributionItem,
  ChartHeatmapAxisItem,
  ChartHeatmapCell,
  ChartUnitGridPart,
} from "../../components/organisms/Chart/Chart";
import { chartSeriesConfigFromKeys } from "../../lib/chartTheme";

export const creatorCompositionConfig = chartSeriesConfigFromKeys([
  { key: "women", label: "Women" },
  { key: "men", label: "Men" },
  { key: "unspecified", label: "Not specified" },
]);

export const creatorComposition: ChartUnitGridPart[] = [
  { key: "women", value: 68 },
  { key: "men", value: 30 },
  { key: "unspecified", value: 2 },
];

export const recentPostReach: ChartDistributionItem[] = [
  { id: "coastal-table", label: "#1", value: 48200 },
  { id: "morning-studio", label: "#2", value: 41600 },
  { id: "market-flowers", label: "#3", value: 38900 },
  { id: "linen-details", label: "#4", value: 35100 },
  { id: "summer-table", label: "#5", value: 33700 },
  { id: "city-walk", label: "#6", value: 30900 },
];

export const activityRows: ChartHeatmapAxisItem[] = [
  { key: "morning", label: "Morning" },
  { key: "midday", label: "Midday" },
  { key: "evening", label: "Evening" },
];

export const activityColumns: ChartHeatmapAxisItem[] = [
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
  "Sun",
].map((label) => ({ key: label.toLowerCase(), label }));

const illustrativeActivity = [
  [18, 24, 31, 27, 38, 52, 46],
  [34, 42, 39, 48, 55, 62, 58],
  [44, 51, 47, 64, 72, 81, 76],
];

export const activityCells: ChartHeatmapCell[] = activityRows.flatMap(
  (row, rowIndex) =>
    activityColumns.map((column, columnIndex) => ({
      rowKey: row.key,
      columnKey: column.key,
      value: illustrativeActivity[rowIndex]![columnIndex]!,
    })),
);
