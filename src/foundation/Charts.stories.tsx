import type { Meta, StoryObj } from "@storybook/react-vite";
import { chartCategoricalCount, chartCategoricalPalette } from "../lib/chartTheme";

const categoricalSwatches = Array.from({ length: chartCategoricalCount }, (_, index) => {
  const slot = index + 1;
  return {
    slot,
    token: `--color-chart-categorical-${slot}`,
    utility: `bg-chart-categorical-${slot}`,
  };
});

const meta = {
  title: "Foundation/Charts",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Chart color tiers from **`src/theme/colors.css`** and **`src/lib/chartTheme.ts`**. " +
          "**Semantic** tones (`ChartTone`) encode meaning — success, error, brand. " +
          "**Threshold / RAG** fills (`fill=\"semantic\"` on **Chart.SegmentedBar**) map position to status hues. " +
          "**Categorical** tokens (`--color-chart-categorical-*`) identify series with **no implied meaning** — resolve via **`chartSeriesColor(index)`**. " +
          "See **ADR-0013**.",
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function CategoricalGrid() {
  return (
    <div className="grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
      {categoricalSwatches.map(({ slot, token, utility }) => (
        <div key={slot} className="flex flex-col gap-1.5">
          <div className={`h-20 rounded-lg border border-border ${utility}`} aria-hidden />
          <span className="font-mono text-xs text-fg">{slot}</span>
          <span className="font-mono text-[10px] text-muted">{token}</span>
        </div>
      ))}
    </div>
  );
}

export const CategoricalPalette: Story = {
  name: "Categorical palette (v1)",
  render: () => (
    <div className="flex max-w-3xl flex-col gap-4">
      <p className="text-sm text-muted">
        Twelve ordered hues for multi-series charts, legends, and stacked marks. Values swap under{" "}
        <code className="font-mono text-xs">[data-theme=&quot;dark&quot;]</code> — same token names.
        Use <code className="font-mono text-xs">chartSeriesColor(i)</code> in visx compositions; do not
        reuse <code className="font-mono text-xs">success</code> / <code className="font-mono text-xs">error</code>{" "}
        for series identity.
      </p>
      <CategoricalGrid />
      <p className="font-mono text-xs text-muted">
        Palette length: {chartCategoricalPalette.length} — index wraps with modulo.
      </p>
    </div>
  ),
};

export const CategoricalOnSurface: Story = {
  name: "Categorical on surface",
  render: () => (
    <div className="rounded-lg border border-border bg-surface p-4">
      <p className="mb-3 text-sm text-muted">Specimen on raised surface — typical Card body context.</p>
      <CategoricalGrid />
    </div>
  ),
};
