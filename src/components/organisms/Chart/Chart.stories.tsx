import type { Meta, StoryObj } from "@storybook/react-vite";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Button } from "../../atoms/Button/Button";
import { Skeleton } from "../../atoms/Skeleton/Skeleton";
import { Chip } from "../../molecules/Chip/Chip";
import { ChipFilterGroup } from "../../molecules/Chip/ChipFilterGroup";
import { Card, cardLayoutBodyOccupantInsetXClasses, cardLayoutBodyOccupantPadYClasses, cardLayoutBodyOccupantWellClasses, cardTitleClasses } from "../../molecules/Card/Card";
import { Select, type SelectOption } from "../../molecules/Select/Select";
import { typographyClass } from "../../../lib/typography";
import {
  chartSeriesConfigFromKeys,
  chartSeriesConfigFromTone,
  chartTooltipItemsFromConfig,
} from "../../../lib/chartTheme";
import { buildOccupancyAreaSeries } from "../../../lib/chartSampleData";
import { backgroundPatternDotGridClasses } from "../../../lib/backgroundPatterns";
import { cn } from "../../../lib/cn";
import { withStoryCopySource } from "../../../lib/storyCopySource";
import {
  Chart,
  chartFormatPercent,
  chartKpiHeroRowClasses,
  chartKpiHeroValueClasses,
  chartKpiTrendLabelClasses,
  chartKpiTrendRowClasses,
  chartKpiTrendValueClasses,
} from "./Chart";
import {
  chartCartesianWireframeClasses,
  chartTooltipCrosshairClasses,
} from "./chartStyles";
import {
  chartCardBodyStateArgType,
  chartCardBodyStateControlsParameters,
  chartCardBodyStateHints,
  chartCardBodyStateLabels,
  chartCardBodyStates,
  initialChartCardBodyState,
  type ChartCardBodyState,
} from "./chartCardBodyStateStory";

const kpiMetaClasses = `${typographyClass("caption")} text-muted`;

const occupancyPeriodOptions: SelectOption[] = [
  { value: "week", label: "This week" },
  { value: "month", label: "This month" },
  { value: "quarter", label: "This quarter" },
  { value: "year", label: "This year" },
];

const occupancySeriesConfig = chartSeriesConfigFromKeys([
  { key: "occupied", label: "Occupied units" },
  { key: "available", label: "Available units" },
]);

const occupancyAreaData = buildOccupancyAreaSeries(30);

const occupancyTooltipValues = { occupied: 144, available: 56 };

const occupiedToneConfig = chartSeriesConfigFromTone("occupied", "Occupied units", "primary");

function ChartCardBodyStateToolbar({
  bodyState,
  onBodyStateChange,
  resolvedHint,
}: {
  bodyState: ChartCardBodyState;
  onBodyStateChange: (state: ChartCardBodyState) => void;
  resolvedHint?: string;
}) {
  const hint =
    bodyState === "resolved" && resolvedHint != null ? resolvedHint : chartCardBodyStateHints[bodyState];

  return (
    <div className="flex max-w-lg flex-col gap-1.5">
      <ChipFilterGroup
        selectionMode="single"
        aria-label="Preview card body state"
        value={bodyState}
        onValueChange={(value) => onBodyStateChange(value as ChartCardBodyState)}
        className="self-start"
      >
        {chartCardBodyStates.map((state) => (
          <Chip key={state} value={state} size="sm">
            {chartCardBodyStateLabels[state]}
          </Chip>
        ))}
      </ChipFilterGroup>
      <span className={kpiMetaClasses}>{hint}</span>
    </div>
  );
}

function ChartCardBodyStatePreview({
  bodyState,
  onBodyStateChange,
  resolvedHint,
  children,
}: {
  bodyState: ChartCardBodyState;
  onBodyStateChange: (state: ChartCardBodyState) => void;
  resolvedHint?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex max-w-lg flex-col gap-4">
      <ChartCardBodyStateToolbar
        bodyState={bodyState}
        onBodyStateChange={onBodyStateChange}
        resolvedHint={resolvedHint}
      />
      {children}
    </div>
  );
}

/** Docs + Canvas body-state — React state only (no Storybook preview hooks). */
function useChartCardBodyStateFromArgs(args: { bodyState?: ChartCardBodyState }) {
  const [bodyState, setBodyState] = useState<ChartCardBodyState>(() => initialChartCardBodyState(args));
  const [enterGeneration, setEnterGeneration] = useState(0);
  const previousBodyStateRef = useRef<ChartCardBodyState>(initialChartCardBodyState(args));

  useEffect(() => {
    if (args.bodyState == null) {
      return;
    }
    const next = args.bodyState as ChartCardBodyState;
    if (next === previousBodyStateRef.current) {
      return;
    }
    previousBodyStateRef.current = next;
    setBodyState(next);
    if (next === "resolved") {
      setEnterGeneration((generation) => generation + 1);
    }
  }, [args.bodyState]);

  const setBodyStateWithReplay = (state: ChartCardBodyState) => {
    previousBodyStateRef.current = state;
    setBodyState(state);
    if (state === "resolved") {
      setEnterGeneration((generation) => generation + 1);
    }
  };

  return {
    bodyState,
    enterGeneration,
    setBodyState: setBodyStateWithReplay,
  };
}

const meta = {
  title: "Organisms/Chart",
  component: Chart,
  tags: ["autodocs"],
  argTypes: {
    bodyState: {
      ...chartCardBodyStateArgType,
      table: { disable: true },
    },
  },
  args: {
    bodyState: "resolved",
  },
  parameters: {
    wmdsLayout: "padded",
    controls: {
      exclude: ["bodyState"],
    },
    docs: {
      source: {
        disable: true,
      },
      description: {
        component: `
## Usage

Dashboard visualizations on **visx v4** — WMDS owns the **shell**; patterns own **marks**. Not every chart uses x/y axes.

| Plot family | Pattern | Axes |
|-------------|---------|------|
| **Capacity meter** | \`Chart.SegmentedBar\` — \`value\` / \`max\`, \`fill="velocity"\` \| \`semantic\` | No |
| **Cartesian** | \`Chart.Cartesian\` + \`Chart.Cartesian.Area\` — daily / multi-series history | Yes |

**Tooltip + legend** — **ADR-0015**. Hover a Cartesian plot for crosshair + frosted tooltip; **Chart.Legend** uses the same \`ChartSeriesConfig\` / \`chartSeriesColor\` palette (**ADR-0013**). **SegmentedBar** has no tooltip.

**Card pattern stories** — use the state chips above each Card preview, or **Controls → Body state** (Docs and Canvas), to toggle initial skeleton, retrieving, and resolved.

## Anatomy

\`\`\`
Chart.Frame          — responsive width, segment height var, no axes assumed
└── Chart.SegmentedBar — capacity meter only (\`role="meter"\`); not for daily history
\`\`\`

Card.Header / Footer usually carry KPI copy; the chart mark sits in **Card.Body**.

## Best practices

- **Do** wrap marks in \`Chart.Frame\` — set \`segmentHeight\` when the default tick height is wrong.
- **Do** pair scalar charts with hero KPI + inline mono trend (\`chartKpiTrend*\` classes) — not **Badge**.
- **Do** use \`chartFormatPercent(value, max)\` for headline percent copy.
- **Do** pass \`label\` when \`role="meter"\` needs more context than a percent.
- **Do** use \`Chart.SegmentedBar\` only for **capacity** — snapshot fill (\`value\` / \`max\`). Daily history → **Chart.Cartesian** + **Chart.Cartesian.Area** (ADR-0015).
- **Do** use \`fill="velocity"\` for occupancy-style capacity bars; \`fill="semantic"\` for RAG utilization meters (red → orange → yellow → green).
- **Do** use **Chart.Loading** in **Card.Body** while chart data fetches — keep **Card.Header** mounted; swap the well for **Chart.Cartesian** when resolved (default \`animate="initial"\` fades the plot in once).
- **Do** use **Skeleton** (**Atoms/Skeleton**) for initial page/card skeleton screens — mirror layout, then swap for **Chart.Loading** or live marks.
- **Don't** use \`Chart.SegmentedBar\` for per-day or per-week strips — ticks are not calendar buckets.
- **Do** use **Chart.Cartesian** hairline defaults — 1.5px stroke, light area fill, solid horizontal grid + dashed vertical columns at x-axis ticks; y-axis \`chartFormatAxisValue\` or \`yTickFormat\`; pass \`verticalGrid={false}\` only when columns add noise.
- **Don't** put axis assumptions in \`Chart.Frame\` — use \`Chart.Cartesian\` for time series (ADR-0015).
        `.trim(),
      },
    },
  },
} satisfies Meta<typeof Chart>;

export default meta;
type Story = StoryObj<typeof meta>;

const occupancyHistoryWellClasses = `flex flex-col gap-3 ${cardLayoutBodyOccupantPadYClasses} ${cardLayoutBodyOccupantWellClasses} ${cardLayoutBodyOccupantInsetXClasses}`;

const occupancyKpiWellClasses = `flex flex-col gap-2 ${cardLayoutBodyOccupantPadYClasses} ${cardLayoutBodyOccupantWellClasses} ${cardLayoutBodyOccupantInsetXClasses}`;

const occupancyCardHeaderSkeleton = {
  start: <Skeleton width={148} height={18} radius="inner" index={0} />,
  end: <Skeleton width={144} height={28} radius="full" index={1} />,
} as const;

function OccupancyHistoryCardPattern({
  bodyState,
  period,
  onPeriodChange,
  chartEnterKey,
}: {
  bodyState: ChartCardBodyState;
  period: string;
  onPeriodChange: (value: string) => void;
  chartEnterKey: number;
}) {
  if (bodyState === "skeleton") {
    return (
      <Card
        shape="rounded"
        bodyTerminal
        className="max-w-lg"
        aria-busy="true"
        aria-label="Loading occupancy history"
      >
        <Card.Header {...occupancyCardHeaderSkeleton} />
        <Card.Body>
          <div className={occupancyHistoryWellClasses}>
            <Skeleton width="100%" height={220} radius="element" index={2} />
            <div className="flex flex-wrap gap-4">
              <Skeleton width={112} height={12} radius="inner" index={3} />
              <Skeleton width={96} height={12} radius="inner" index={4} />
            </div>
          </div>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card shape="rounded" bodyTerminal className="max-w-lg">
      <Card.Header
        start={<h2 className={cardTitleClasses}>Occupancy history</h2>}
        end={
          <Select
            aria-label="Reporting period"
            size="sm"
            options={occupancyPeriodOptions}
            value={period}
            onValueChange={onPeriodChange}
            className="w-36"
          />
        }
      />
      <Card.Body>
        <div className={occupancyHistoryWellClasses}>
          {bodyState === "retrieving" ? (
            <Chart.Loading minHeight={220} />
          ) : (
            <>
              <Chart.Cartesian
                key={chartEnterKey}
                data={occupancyAreaData}
                config={occupancySeriesConfig}
                periodKind="month"
                minHeight={220}
                animate="initial"
                aria-label="Occupied and available units over the selected period"
              />
              <Chart.Legend config={occupancySeriesConfig} />
            </>
          )}
        </div>
      </Card.Body>
    </Card>
  );
}

function OccupancyKpiCardPattern({
  bodyState,
  period,
  onPeriodChange,
  barEnterKey,
}: {
  bodyState: ChartCardBodyState;
  period: string;
  onPeriodChange: (value: string) => void;
  barEnterKey: number;
}) {
  const occupied = 144;
  const total = 200;

  if (bodyState === "skeleton") {
    return (
      <Card
        shape="rounded"
        className="max-w-lg"
        aria-busy="true"
        aria-label="Loading occupancy score"
      >
        <Card.Header {...occupancyCardHeaderSkeleton} />
        <Card.Body>
          <div className={occupancyKpiWellClasses}>
            <Skeleton width={160} height={40} radius="inner" index={2} />
            <Skeleton width="100%" height={32} radius="element" index={3} />
          </div>
        </Card.Body>
        <Card.Footer>
          <Skeleton width={160} height={14} radius="inner" index={4} />
          <Skeleton width={112} height={28} radius="full" index={5} />
        </Card.Footer>
      </Card>
    );
  }

  return (
    <Card shape="rounded" className="max-w-lg">
      <Card.Header
        start={<h2 className={cardTitleClasses}>Occupancy score</h2>}
        end={
          <Select
            aria-label="Reporting period"
            size="sm"
            options={occupancyPeriodOptions}
            value={period}
            onValueChange={onPeriodChange}
            className="w-36"
          />
        }
      />
      <Card.Body>
        <div className={occupancyKpiWellClasses}>
          {bodyState === "retrieving" ? (
            <Chart.Loading minHeight={120} />
          ) : (
            <>
              <div className={chartKpiHeroRowClasses}>
                <span className={chartKpiHeroValueClasses}>{chartFormatPercent(occupied, total)}</span>
                <div className={chartKpiTrendRowClasses}>
                  <span className={`${chartKpiTrendValueClasses} text-success`}>+4.2%</span>
                  <span className={chartKpiTrendLabelClasses}>From last month</span>
                </div>
              </div>
              <Chart.Frame>
                <Chart.SegmentedBar
                  key={barEnterKey}
                  value={occupied}
                  max={total}
                  tone="primary"
                  fill="velocity"
                  animate="initial"
                />
              </Chart.Frame>
            </>
          )}
        </div>
      </Card.Body>
      <Card.Footer>
        <span className={kpiMetaClasses}>Occupied units: {occupied}/{total}</span>
        <Button role="secondary" size="sm">
          View breakdown
        </Button>
      </Card.Footer>
    </Card>
  );
}

export const TooltipContentReference: Story = {
  name: "Reference — tooltip content",
  parameters: {
    docs: {
      description: {
        story:
          "Static **Chart.Tooltip.Content** — shadcn Chart parity on WMDS popover tokens. Header label + indicator + series name + tabular value. Wired to visx on **Chart.Area** (ADR-0015).",
      },
    },
  },
  render: () => (
    <div className="flex max-w-md flex-col gap-8">
      <div className="flex flex-col gap-2">
        <span className={kpiMetaClasses}>Single series</span>
        <Chart.Tooltip.Content
          label="Apr 12, 2026"
          items={[
            {
              key: "occupied",
              label: "Occupied units",
              value: "144",
              color: occupancySeriesConfig.occupied.color,
            },
          ]}
        />
      </div>
      <div className="flex flex-col gap-2">
        <span className={kpiMetaClasses}>Multi series</span>
        <Chart.Tooltip.Content
          label="Apr 12, 2026"
          items={chartTooltipItemsFromConfig(occupancySeriesConfig, occupancyTooltipValues)}
        />
      </div>
    </div>
  ),
};

export const TooltipIndicatorsReference: Story = {
  name: "Reference — tooltip indicators",
  parameters: {
    docs: {
      description: {
        story: "Indicator variants — `dot` (default), `line`, `dashed` — shadcn `ChartTooltipContent` parity.",
      },
    },
  },
  render: () => (
    <div className="flex flex-wrap gap-6">
      {(["dot", "line", "dashed"] as const).map((indicator) => (
        <div key={indicator} className="flex flex-col gap-2">
          <span className={kpiMetaClasses}>{indicator}</span>
          <Chart.Tooltip.Content
            label="Apr 12, 2026"
            indicator={indicator}
            items={chartTooltipItemsFromConfig(occupancySeriesConfig, occupancyTooltipValues)}
          />
        </div>
      ))}
    </div>
  ),
};

export const LegendReference: Story = {
  name: "Reference — legend",
  parameters: {
    docs: {
      description: {
        story:
          "**Chart.Legend** — same `ChartSeriesConfig` as tooltip rows. Typical placement: **Card.Body** below the plot.",
      },
    },
  },
  render: () => <Chart.Legend config={occupancySeriesConfig} />,
};

export const TooltipLegendPairingReference: Story = {
  name: "Reference — tooltip + legend pairing",
  parameters: {
    docs: {
      description: {
        story:
          "Multi-series Cartesian specimen — frosted-glass **Chart.Tooltip.Content** over plot marks; legend below. Static wireframe until **Chart.Area** ships.",
      },
    },
  },
  render: () => (
    <div className="flex w-full max-w-lg flex-col gap-3">
      <div className={chartCartesianWireframeClasses}>
        <div className={`absolute inset-0 ${backgroundPatternDotGridClasses}`} aria-hidden />
        <div className="absolute inset-x-8 bottom-8 top-10 flex items-end justify-between gap-1" aria-hidden>
          {[28, 42, 55, 72, 68, 48, 36].map((height, index) => (
            <div
              key={height}
              className={cn(
                "w-2 rounded-full bg-border/80",
                index === 4 && "bg-primary/35 shadow-[0_0_18px_4px_color-mix(in_srgb,var(--color-primary)_35%,transparent)]",
              )}
              style={{ height: `${height}%` }}
            />
          ))}
        </div>
        <div
          className={chartTooltipCrosshairClasses}
          style={{ left: "62%", bottom: "2rem", top: "1.5rem" }}
          aria-hidden
        />
        <div className="absolute left-[54%] top-6 z-10">
          <Chart.Tooltip.Content
            label="Apr 12, 2026"
            items={chartTooltipItemsFromConfig(occupancySeriesConfig, occupancyTooltipValues)}
          />
        </div>
      </div>
      <Chart.Legend config={occupancySeriesConfig} />
    </div>
  ),
};

export const AreaSingleSeries: Story = {
  name: "Pattern — area (single series)",
  parameters: {
    docs: {
      description: {
        story:
          "Single semantic series — `chartSeriesConfigFromTone` + primary stroke. Hover for crosshair tooltip; categorical palette not used.",
      },
    },
  },
  render: () => (
    <Chart.Cartesian
      className="max-w-lg"
      data={occupancyAreaData}
      config={occupiedToneConfig}
      seriesKeys={["occupied"]}
      periodKind="month"
      aria-label="Occupied units over time"
    />
  ),
};

export const AreaMultiSeries: Story = {
  name: "Pattern — area (multi series + legend)",
  parameters: {
    docs: {
      description: {
        story:
          "Multi-series — `chartSeriesConfigFromKeys` assigns **chartSeriesColor** indices. Tooltip rows and **Chart.Legend** share the same config.",
      },
    },
  },
  render: () => (
    <div className="flex w-full max-w-lg flex-col gap-3">
      <Chart.Cartesian
        data={occupancyAreaData}
        config={occupancySeriesConfig}
        periodKind="month"
        aria-label="Occupied and available units over time"
      />
      <Chart.Legend config={occupancySeriesConfig} />
    </div>
  ),
};

export const OccupancyHistoryInCard: Story = {
  name: "Pattern — occupancy history in Card",
  argTypes: {
    bodyState: chartCardBodyStateArgType,
  },
  args: {
    bodyState: "resolved",
  },
  parameters: {
    ...chartCardBodyStateControlsParameters,
    ...withStoryCopySource(
    {
      docs: {
        description: {
          story:
            "History companion to the capacity KPI — **Card.Header** Select scopes period; inset well + **`bodyTerminal`**. State chips: **Initial load** = Skeleton shimmer ([Motion Dev](https://motion.dev/examples/react-skeleton-shimmer)); **Retrieving** = **Chart.Loading**; **Resolved** = path draw enter — click **Resolved** again to replay.",
        },
      },
    },
    `
import { Card, Chart, Select, chartSeriesConfigFromKeys, cardLayoutBodyOccupantInsetXClasses, cardLayoutBodyOccupantPadYClasses, cardLayoutBodyOccupantWellClasses, cardTitleClasses } from "@whatmatters/wmds";

const config = chartSeriesConfigFromKeys([
  { key: "occupied", label: "Occupied units" },
  { key: "available", label: "Available units" },
]);

<Card shape="rounded" bodyTerminal className="max-w-lg">
  <Card.Header
    start={<h2 className={cardTitleClasses}>Occupancy history</h2>}
    end={<Select aria-label="Reporting period" size="sm" options={periodOptions} defaultValue="month" className="w-36" />}
  />
  <Card.Body>
    <div className={\`flex flex-col gap-3 \${cardLayoutBodyOccupantPadYClasses} \${cardLayoutBodyOccupantWellClasses} \${cardLayoutBodyOccupantInsetXClasses}\`}>
      <Chart.Cartesian data={data} config={config} periodKind="month" minHeight={220} animate="initial" />
      <Chart.Legend config={config} />
    </div>
  </Card.Body>
</Card>
    `,
    ),
  },
  render: function OccupancyHistoryInCardRender(args) {
    const { bodyState, enterGeneration, setBodyState } = useChartCardBodyStateFromArgs(args);
    const [period, setPeriod] = useState("month");

    return (
      <ChartCardBodyStatePreview
        bodyState={bodyState}
        onBodyStateChange={setBodyState}
        resolvedHint="Path draw enter (Motion)"
      >
        <OccupancyHistoryCardPattern
          bodyState={bodyState}
          period={period}
          onPeriodChange={setPeriod}
          chartEnterKey={enterGeneration}
        />
      </ChartCardBodyStatePreview>
    );
  },
};

export const SegmentedBarFillReference: Story = {
  name: "Reference — segment fills",
  parameters: {
    docs: {
      description: {
        story:
          "Fill variants on the same `144/200` meter — **`velocity`** (occupancy-style tone fade) vs **`semantic`** (RAG red → orange → yellow → green). Prefer **velocity** in KPI cards; **semantic** for utilization / health thresholds.",
      },
    },
  },
  render: () => (
    <div className="flex max-w-lg flex-col gap-8">
      <div className="flex flex-col gap-2">
        <span className={kpiMetaClasses}>fill=&quot;velocity&quot;</span>
        <Chart.Frame>
          <Chart.SegmentedBar value={144} max={200} tone="primary" fill="velocity" label="Occupancy 72%" />
        </Chart.Frame>
      </div>
      <div className="flex flex-col gap-2">
        <span className={kpiMetaClasses}>fill=&quot;semantic&quot; (RAG)</span>
        <Chart.Frame>
          <Chart.SegmentedBar value={144} max={200} fill="semantic" label="Utilization 72%" />
        </Chart.Frame>
      </div>
    </div>
  ),
};

export const OccupancyInCard: Story = {
  name: "Pattern — occupancy KPI in Card",
  argTypes: {
    bodyState: chartCardBodyStateArgType,
  },
  args: {
    bodyState: "resolved",
  },
  parameters: {
    ...chartCardBodyStateControlsParameters,
    ...withStoryCopySource(
    {
      docs: {
        description: {
          story:
            "Dashboard widget — hero percent + inline mono trend, **Chart.SegmentedBar** in inset well (same shell as history pattern), **Card.Footer** on skeleton and resolved. **Retrieving** = **Chart.Loading**; **Resolved** = spring fill ([Motion progress bar](https://motion.dev/examples/react-loading-progress-bar)). Click **Resolved** to replay.",
        },
      },
    },
    `
import { Button, Card, Chart, Select, chartFormatPercent, chartKpiHeroRowClasses, chartKpiHeroValueClasses, chartKpiTrendLabelClasses, chartKpiTrendRowClasses, chartKpiTrendValueClasses, cardLayoutBodyOccupantInsetXClasses, cardLayoutBodyOccupantPadYClasses, cardLayoutBodyOccupantWellClasses, cardTitleClasses } from "@whatmatters/wmds";

const occupied = 144;
const total = 200;
const periodOptions = [
  { value: "week", label: "This week" },
  { value: "month", label: "This month" },
  { value: "quarter", label: "This quarter" },
  { value: "year", label: "This year" },
];

<Card shape="rounded" className="max-w-lg">
  <Card.Header
    start={<h2 className={cardTitleClasses}>Occupancy score</h2>}
    end={
      <Select
        aria-label="Reporting period"
        size="sm"
        options={periodOptions}
        defaultValue="month"
        className="w-36"
      />
    }
  />
  <Card.Body>
    <div className={\`flex flex-col gap-2 \${cardLayoutBodyOccupantPadYClasses} \${cardLayoutBodyOccupantWellClasses} \${cardLayoutBodyOccupantInsetXClasses}\`}>
      <div className={chartKpiHeroRowClasses}>
        <span className={chartKpiHeroValueClasses}>{chartFormatPercent(occupied, total)}</span>
        <div className={chartKpiTrendRowClasses}>
          <span className={\`\${chartKpiTrendValueClasses} text-success\`}>+4.2%</span>
          <span className={chartKpiTrendLabelClasses}>From last month</span>
        </div>
      </div>
      <Chart.Frame>
        <Chart.SegmentedBar value={occupied} max={total} tone="primary" fill="velocity" animate="initial" />
      </Chart.Frame>
    </div>
  </Card.Body>
  <Card.Footer>
    <span className="type-supporting text-muted">Occupied units: {occupied}/{total}</span>
    <Button role="secondary" size="sm">
      View breakdown
    </Button>
  </Card.Footer>
</Card>
    `,
    ),
  },
  render: function OccupancyInCardRender(args) {
    const { bodyState, enterGeneration, setBodyState } = useChartCardBodyStateFromArgs(args);
    const [period, setPeriod] = useState("month");

    return (
      <ChartCardBodyStatePreview
        bodyState={bodyState}
        onBodyStateChange={setBodyState}
        resolvedHint="Spring fill enter (Motion progress bar)"
      >
        <OccupancyKpiCardPattern
          bodyState={bodyState}
          period={period}
          onPeriodChange={setPeriod}
          barEnterKey={enterGeneration}
        />
      </ChartCardBodyStatePreview>
    );
  },
};
