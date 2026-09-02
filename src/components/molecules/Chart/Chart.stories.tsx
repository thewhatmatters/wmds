import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { Card, cardTitleClasses } from "../Card/Card";
import { Chart, type ChartPoint } from "./Chart";

/** Stable 30-day series — not random, so Storybook and visual review stay consistent. */
function sampleThirtyDayPoints(): ChartPoint[] {
  const end = Date.UTC(2026, 8, 2);
  return Array.from({ length: 30 }, (_, index) => {
    const day = new Date(end - (29 - index) * 86_400_000);
    const t = index / 29;
    const y = 36 + Math.sin(t * Math.PI * 1.6) * 7 + t * 14;
    return { x: day.toISOString().slice(0, 10), y: Math.round(y * 10) / 10 };
  });
}

const thirtyDayData = sampleThirtyDayPoints();

const meta = {
  title: "Molecules/Chart",
  component: Chart,
  tags: ["autodocs"],
  args: {
    data: thirtyDayData,
    "aria-label": "30-day trend",
  },
  parameters: {
    docs: {
      description: {
        component: `
## Usage

One **30-day area + line** — Nivo is the engine, WMDS tokens are the theme. Copy this story. Pitchkit imports \`Chart\` and passes Insights points.

| Pattern | Props |
|---------|--------|
| **30-day area** | \`data\` — one series of daily \`{ x, y }\` |
| **Empty** | omit \`data\`, pass \`[]\`, or non-finite \`y\` — **renders nothing** |

\`className\` is layout-only (height, width, margin). Series color is \`--color-accent\`; ticks/grid use muted + border. No legend, no vertical grid, monotone curve.

## Anatomy

\`\`\`
Chart (h-48 frame, layout className)
└── ResponsiveLine
    ├── area (accent, 12% opacity)
    ├── line (accent, monotone)
    ├── horizontal grid (border, quiet)
    └── muted date / value ticks
\`\`\`

## Best practices

- **Do** pass one series of daily points (\`Date\` or \`YYYY-MM-DD\`).
- **Do** hide surrounding Insights chrome in the app when the series is missing — Chart will also render nothing.
- **Do** size the plot with layout \`className\` (\`h-48\`, \`h-64\`, \`w-full\`).
- **Don't** pass a Nivo color scheme, legend, or multi-country demo data.
- **Don't** re-theme the line with \`className\` — tokens only.
        `.trim(),
      },
    },
  },
} satisfies Meta<typeof Chart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ThirtyDayArea: Story = {
  name: "Pattern — 30-day area",
  parameters: {
    docs: {
      description: {
        story:
          "Prescribed Pitchkit Insights plot — one series, area + line, token theme, no legend.",
      },
    },
  },
  play: async ({ canvasElement }) => {
    const svg = canvasElement.querySelector("svg");
    await expect(svg).toBeTruthy();
    await expect(canvasElement.textContent ?? "").not.toMatch(
      /japan|norway|france|germany|transportation/i,
    );
  },
};

export const InCard: Story = {
  name: "Pattern — in Card",
  parameters: {
    docs: {
      description: {
        story: "Compose with Card for a dashboard widget. Chart stays the plot only.",
      },
    },
  },
  render: (args) => (
    <Card padding="md" shape="rounded" className="max-w-xl">
      <h2 className={cardTitleClasses}>Insights</h2>
      <Chart {...args} className="mt-4 h-48" />
    </Card>
  ),
};

export const Empty: Story = {
  name: "Empty — renders nothing",
  args: {
    data: [],
  },
  parameters: {
    docs: {
      description: {
        story:
          "Missing or empty Insights — Chart returns `null`. Pitchkit should also hide the Insights chrome.",
      },
    },
  },
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelector("svg")).toBeNull();
    await expect(canvasElement.querySelector('[role="img"]')).toBeNull();
  },
};
