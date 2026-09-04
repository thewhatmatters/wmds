import { useEffect, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { GridOverlay } from "../lib/GridOverlay";
import { readGridColumnCount } from "../lib/gridOverlayUtils";
import { typographyClass } from "../lib/typography";
import { cn } from "../lib/cn";
import {
  gridColumnSteps,
  gridScale,
  minTouchTargetPx,
  storybookViewports,
} from "../lib/viewports";

const meta = {
  title: "Foundation/Grid",
  tags: ["autodocs"],
  parameters: {
    wmdsLayout: "padded",
    docs: {
      description: {
        component:
          "**Breakpoints and the page grid are one contract.** `--grid-cols` steps at the same `md:` / `lg:` tokens as the mobile-first scale — 4 → 8 → 12. " +
          "`sm:` exists as a utility prefix; the column count does not change there. " +
          "Live spine: `grid-page` + `band` + **g** overlay (same content box). " +
          "`--spacing` stays 4px; baseline is 8px. See **DESIGN.md → Grid**, **ADR-0003**, **ADR-0010**.",
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function useLiveGridStep() {
  const [cols, setCols] = useState(4);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const read = () => {
      setCols(readGridColumnCount(document.documentElement));
      setWidth(window.innerWidth);
    };
    read();
    window.addEventListener("resize", read);
    return () => window.removeEventListener("resize", read);
  }, []);

  const step =
    [...gridColumnSteps].reverse().find((entry) => width >= entry.minWidthPx) ??
    gridColumnSteps[0];

  return { cols, step };
}

function DemoBlock({
  className,
  label,
  children,
}: {
  className?: string;
  label: string;
  children: string;
}) {
  return (
    <div className={cn("min-h-24 bg-surface shadow-raised px-3 py-2", className)}>
      <p className={cn(typographyClass("caption"), "text-muted")}>{label}</p>
      <p className={cn(typographyClass("body"), "leading-base text-fg")}>{children}</p>
    </div>
  );
}

export const Scale: Story = {
  name: "Breakpoint × column scale",
  render: () => (
    <div className="flex max-w-3xl flex-col gap-6">
      <p className={cn(typographyClass("body"), "text-muted")}>
        Review at Mobile (390), Tablet (768), Desktop (1280) — those three widths are the
        column steps. Other prefixes do not add tracks.
      </p>
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-border text-left text-muted">
            <th className="py-2 pr-4 font-medium">Prefix</th>
            <th className="py-2 pr-4 font-medium">Min width</th>
            <th className="py-2 pr-4 font-medium">Columns</th>
            <th className="py-2 pr-4 font-medium">Gutter / margin</th>
            <th className="py-2 font-medium">Review</th>
          </tr>
        </thead>
        <tbody>
          {gridScale.map((step) => (
            <tr key={step.prefix} className="border-b border-border-emphasized">
              <td className="py-2 pr-4 font-mono text-xs">{step.prefix}</td>
              <td className="py-2 pr-4 font-mono text-xs text-muted">{step.minWidth}</td>
              <td className="py-2 pr-4 font-mono text-xs text-fg">{step.cols}</td>
              <td className="py-2 pr-4 font-mono text-xs text-muted">
                {step.gutterPx}px
              </td>
              <td className="py-2 text-fg">
                {step.reviewViewport
                  ? storybookViewports[step.reviewViewport].name
                  : "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ),
};

export const PageAndBand: Story = {
  name: "Spine — grid-page + overlay",
  parameters: {
    wmdsLayout: "fullscreen",
    docs: {
      description: {
        story:
          "Use the viewport toolbar. Column count in the kicker tracks `--grid-cols` live. Press **g**.",
      },
    },
  },
  render: function Render() {
    const [on, setOn] = useState(true);
    const { cols, step } = useLiveGridStep();

    return (
      <div className="min-h-[100svh] bg-body">
        <div className="grid-page">
          <GridOverlay visible={on} onVisibleChange={setOn} />

          <div className="band">
            <div className="col-span-full flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className={cn(typographyClass("overline"), "text-muted")}>
                  Foundation / Grid · {cols} columns
                  {step.reviewViewport ? ` · ${storybookViewports[step.reviewViewport].name}` : ""}
                </p>
                <h1 className={cn(typographyClass("page-heading"), "text-fg")}>
                  Breakpoint + spine
                </h1>
              </div>
              <button
                type="button"
                className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-border bg-surface px-4 type-label text-fg"
                onClick={() => setOn((current) => !current)}
                aria-pressed={on}
              >
                {on ? "Hide grid (g)" : "Show grid (g)"}
              </button>
            </div>
          </div>

          <div className="band">
            <DemoBlock
              className="col-span-full md:col-span-4 lg:col-span-6"
              label="col 1 → mid"
            >
              Place by column line. Resize the viewport — tracks and this overlay stay the
              same box. 4 at mobile, 8 at md, 12 at lg.
            </DemoBlock>
            <DemoBlock
              className="col-span-full md:col-span-4 lg:col-span-6"
              label="mid → end"
            >
              Relaxed rows (app profile). Vertical rhythm is leading-base (24px = 3 × 8px
              baseline). sm: does not add columns.
            </DemoBlock>
          </div>

          <div className="band">
            <DemoBlock className="col-span-2" label="2 cols">
              Quarter on mobile, sixth at lg.
            </DemoBlock>
            <DemoBlock className="col-span-2" label="2 cols">
              Same track width.
            </DemoBlock>
            <DemoBlock className="col-span-full md:col-span-4 lg:col-span-8" label="remainder">
              Overlay columns, baseline, and margin lines read --grid-* — they cannot drift
              from this layout.
            </DemoBlock>
          </div>
        </div>
      </div>
    );
  },
};

export const TouchTarget: Story = {
  name: "Touch target minimum",
  render: () => (
    <div className="flex flex-col gap-3 text-sm text-fg">
      <p className="text-muted">
        Atoms on mobile: minimum {minTouchTargetPx}×{minTouchTargetPx}px hit area (
        <code className="font-mono text-xs">min-h-11 min-w-11</code> or padding equivalent).
        Same mobile-first contract as the 4-column grid.
      </p>
      <button
        type="button"
        className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md bg-primary px-4 text-sm text-primary-foreground"
      >
        44px min
      </button>
    </div>
  ),
};
