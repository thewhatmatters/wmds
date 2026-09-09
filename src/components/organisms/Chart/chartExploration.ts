export interface ChartUnitAllocationPart {
  key: string;
  value: number;
}

export function allocateChartUnits(
  parts: ChartUnitAllocationPart[],
  total: number,
): Array<string | null> {
  const safeTotal = Math.max(1, Math.round(total));
  const sanitized = parts.map((part) => ({
    key: part.key,
    value: Number.isFinite(part.value) ? Math.max(0, part.value) : 0,
  }));
  const sum = sanitized.reduce((current, part) => current + part.value, 0);
  const scale = sum > safeTotal ? safeTotal / sum : 1;
  const scaled = sanitized.map((part) => ({
    ...part,
    value: part.value * scale,
  }));
  const target = Math.min(safeTotal, Math.round(scaled.reduce((current, part) => current + part.value, 0)));
  const counts = scaled.map((part) => Math.floor(part.value));
  let remaining = target - counts.reduce((current, count) => current + count, 0);
  const remainderOrder = scaled
    .map((part, index) => ({ index, remainder: part.value - counts[index]! }))
    .sort((a, b) => b.remainder - a.remainder || a.index - b.index);

  for (const item of remainderOrder) {
    if (remaining <= 0) break;
    counts[item.index] = counts[item.index]! + 1;
    remaining -= 1;
  }

  const units = scaled.flatMap((part, index) =>
    Array.from({ length: counts[index]! }, () => part.key),
  );
  return [...units, ...Array.from({ length: safeTotal - units.length }, () => null)];
}

export function resolveDistributionDomain(
  values: number[],
  referenceValue?: number,
): [number, number] {
  const finiteValues = values.filter(Number.isFinite);
  if (referenceValue != null && Number.isFinite(referenceValue)) {
    finiteValues.push(referenceValue);
  }
  if (finiteValues.length === 0) return [0, 1];

  const min = Math.min(...finiteValues);
  const max = Math.max(...finiteValues);
  const spread = max - min;
  const pad = spread > 0 ? spread * 0.12 : Math.max(Math.abs(max) * 0.1, 1);
  return [Math.max(0, min - pad), max + pad];
}

export function normalizeHeatmapValue(value: number, max: number): number {
  if (!Number.isFinite(value) || max <= 0) return 0;
  return Math.min(1, Math.max(0, value / max));
}
