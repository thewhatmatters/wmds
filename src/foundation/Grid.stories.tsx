import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { GridOverlay } from "../lib/GridOverlay";
import { typographyClass } from "../lib/typography";
import { cn } from "../lib/cn";

const meta = {
  title: "Foundation/Grid",
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Müller-Brockmann **app** grid spine — `grid-page` + `band` + `GridOverlay`. " +
          "Press **g** to toggle column, baseline, and margin guides. " +
          "Guides share the `grid-page` content box (not the viewport). " +
          "`--spacing` stays 4px; baseline is 8px (even multiple). See **DESIGN.md → Grid**.",
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

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

export const PageAndBand: Story = {
  name: "grid-page + band + overlay",
  render: function Render() {
    const [on, setOn] = useState(true);

    return (
      <div className="min-h-[100svh] bg-body">
        <div className="grid-page">
          <GridOverlay visible={on} onVisibleChange={setOn} />

          <div className="band">
            <div className="col-span-full flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className={cn(typographyClass("overline"), "text-muted")}>Foundation / Grid</p>
                <h1 className={cn(typographyClass("page-heading"), "text-fg")}>
                  App grid spine
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
              Place by column line. This band is a subgrid of grid-page, so children share the
              same tracks as everything else on the page.
            </DemoBlock>
            <DemoBlock
              className="col-span-full md:col-span-4 lg:col-span-6"
              label="mid → end"
            >
              Relaxed rows (app profile) — no modular field lock. Vertical rhythm uses
              leading-base (24px = 3 × 8px baseline).
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
