import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  backgroundPatternDiagonalLinesClasses,
  backgroundPatternDotGridClasses,
  backgroundPatterns,
} from "../lib/backgroundPatterns";

const meta = {
  title: "Foundation/Patterns",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Named background textures in **`src/theme/patterns.css`**. Import class recipes from **`src/lib/backgroundPatterns.ts`** — not one-off `background-image` utilities in apps.",
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const DotGrid: Story = {
  name: "Dot grid",
  parameters: {
    docs: {
      description: {
        story:
          "**`backgroundPatternDotGridClasses`** — page-floor base (`bg-body`) with a 14px dot lattice. Dark mode bumps dot contrast to 12%.",
      },
    },
  },
  render: () => (
    <div className="flex max-w-2xl flex-col gap-6">
      <div className="flex flex-col gap-2">
        <span className="font-mono text-xs text-muted">{backgroundPatterns.dotGrid.id}</span>
        <div className={`h-40 rounded-lg border border-border ${backgroundPatternDotGridClasses}`} />
      </div>
      <div className="flex flex-col gap-2">
        <span className="font-mono text-xs text-muted">on surface (inset well context)</span>
        <div className="rounded-lg border border-border bg-surface p-4">
          <div className={`h-32 rounded-lg ${backgroundPatternDotGridClasses}`} />
        </div>
      </div>
    </div>
  ),
};

export const DiagonalLines: Story = {
  name: "Diagonal lines",
  parameters: {
    docs: {
      description: {
        story:
          "**`backgroundPatternDiagonalLinesClasses`** — page-floor base with 1px stripes at **-45°** on a 14px repeat. Same contrast tiers as dot grid.",
      },
    },
  },
  render: () => (
    <div className="flex max-w-2xl flex-col gap-6">
      <div className="flex flex-col gap-2">
        <span className="font-mono text-xs text-muted">{backgroundPatterns.diagonalLines.id}</span>
        <div className={`h-40 rounded-lg border border-border ${backgroundPatternDiagonalLinesClasses}`} />
      </div>
      <div className="flex flex-col gap-2">
        <span className="font-mono text-xs text-muted">on surface (inset well context)</span>
        <div className="rounded-lg border border-border bg-surface p-4">
          <div className={`h-32 rounded-lg ${backgroundPatternDiagonalLinesClasses}`} />
        </div>
      </div>
    </div>
  ),
};
