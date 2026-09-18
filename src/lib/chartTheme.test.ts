import { describe, expect, it } from "vitest";
import {
  chartFormatAxisDateLabel,
  chartFormatTooltipLabel,
  chartTooltipItemsFromConfig,
} from "./chartTheme";

describe("chart date labels", () => {
  const date = new Date(2026, 7, 30);

  it("keeps month-period axis ticks compact", () => {
    const label = chartFormatAxisDateLabel(date, "month");

    expect(label).toContain("Aug");
    expect(label).toContain("30");
    expect(label).not.toContain("2026");
  });

  it("keeps the full date in the tooltip", () => {
    expect(chartFormatTooltipLabel(date, "month")).toContain("2026");
  });

  it("uses month-only ticks for a year period", () => {
    expect(chartFormatAxisDateLabel(date, "year")).toBe("Aug");
  });
});

describe("chartTooltipItemsFromConfig", () => {
  it("omits null and non-finite series values", () => {
    const items = chartTooltipItemsFromConfig(
      {
        reach: { label: "Reach", color: "var(--color-primary)" },
        typical: { label: "Typical", color: "var(--color-muted)" },
      },
      { reach: Number.NaN, typical: 4200 },
    );

    expect(items).toHaveLength(1);
    expect(items[0]).toMatchObject({
      key: "typical",
      label: "Typical",
      color: "var(--color-muted)",
    });
  });
});
