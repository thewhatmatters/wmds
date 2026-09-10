import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { Chart } from "../components/organisms/Chart/Chart";
import {
  activityCells,
  activityColumns,
  activityRows,
  creatorComposition,
  creatorCompositionConfig,
  recentPostReach,
} from "../examples/ChartExplorations/chartExplorationsData";

const meta = {
  title: "Internal/Interactions/Chart exploration",
  tags: ["test", "!dev", "!autodocs"],
  parameters: {
    docs: { disable: true },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function ChartSet() {
  return (
    <>
      <Chart.UnitGrid
        aria-label="Audience composition"
        config={creatorCompositionConfig}
        parts={creatorComposition}
      />
      <Chart.DistributionStrip
        aria-label="Recent post reach distribution"
        items={recentPostReach}
        metricLabel="Reach"
        reference={{ value: 9300, label: "Typical 9.3K" }}
      />
      <Chart.Heatmap
        aria-label="Illustrative activity matrix"
        rows={activityRows}
        columns={activityColumns}
        cells={activityCells}
        metricLabel="Activity"
      />
    </>
  );
}

export const ResponsiveThemesAndLabels: Story = {
  name: "Chart explorations — responsive themes and labels",
  render: () => (
    <div className="flex flex-col gap-8">
      <section aria-label="Light charts" className="w-[320px] max-w-full bg-bg p-4">
        <ChartSet />
      </section>
      <section
        aria-label="Dark charts"
        data-theme="dark"
        className="w-[720px] max-w-full bg-bg p-4"
      >
        <ChartSet />
      </section>
    </div>
  ),
  play: async ({ canvas, canvasElement }) => {
    for (const regionName of ["Light charts", "Dark charts"]) {
      const region = canvas.getByRole("region", { name: regionName });
      const scoped = within(region);
      await waitFor(() => {
        expect(
          scoped.getByRole("img", { name: "Audience composition" }),
        ).toBeVisible();
        expect(
          scoped.getByRole("img", { name: "Recent post reach distribution" }),
        ).toBeVisible();
        expect(
          scoped.getByRole("img", { name: "Illustrative activity matrix" }),
        ).toBeVisible();
      });
      expect(scoped.getByText(/women: 68 of 100/i)).toBeInTheDocument();
      expect(scoped.getByText(/#1: 48/i, { selector: "li" })).toBeInTheDocument();
      expect(
        scoped.getByText(/morning, mon: 18/i, { selector: "li" }),
      ).toBeInTheDocument();
    }

    for (const svg of canvasElement.querySelectorAll("svg[role='img']")) {
      const svgBounds = svg.getBoundingClientRect();
      const parentBounds = svg.parentElement!.getBoundingClientRect();
      expect(svgBounds.width).toBeGreaterThan(0);
      expect(svgBounds.width).toBeCloseTo(parentBounds.width, 1);
      expect(svgBounds.height).toBeCloseTo(parentBounds.height, 1);
    }
  },
};

export const EmptyStates: Story = {
  name: "Chart explorations — explicit empty states",
  render: () => (
    <div className="grid gap-4">
      <Chart.UnitGrid aria-label="Empty composition" config={{}} parts={[]} />
      <Chart.DistributionStrip aria-label="Empty distribution" items={[]} />
      <Chart.Heatmap aria-label="Empty matrix" rows={[]} columns={[]} cells={[]} />
    </div>
  ),
  play: async ({ canvas }) => {
    expect(canvas.getByText("No composition data")).toBeVisible();
    expect(canvas.getByText("No distribution data")).toBeVisible();
    expect(canvas.getByText("No heatmap data")).toBeVisible();
  },
};

export const SharedHoverTooltips: Story = {
  name: "Chart explorations — shared hover tooltips",
  render: () => (
    <div className="w-[720px] max-w-full bg-bg p-4">
      <ChartSet />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const page = within(canvasElement.ownerDocument.body);
    const unitGrid = await canvas.findByRole("img", {
      name: "Audience composition",
    });
    const distribution = await canvas.findByRole("img", {
      name: "Recent post reach distribution",
    });
    const heatmap = await canvas.findByRole("img", {
      name: "Illustrative activity matrix",
    });
    const unitCells = unitGrid.querySelectorAll("rect");

    await userEvent.hover(unitCells[0]!);
    await waitFor(() => {
      expect(page.getByText("Composition")).toBeVisible();
      expect(page.getByText("68 of 100")).toBeVisible();
      expect(unitCells[0]).toHaveAttribute("fill-opacity", "1");
      expect(unitCells[68]).toHaveAttribute("fill-opacity", "0.28");
    });
    await userEvent.unhover(unitCells[0]!);
    await waitFor(() => {
      expect(unitCells[68]).toHaveAttribute("fill-opacity", "1");
    });

    await userEvent.hover(distribution.querySelector("circle")!);
    await waitFor(() => {
      expect(page.getByText("Reach")).toBeVisible();
    });
    await userEvent.unhover(distribution.querySelector("circle")!);

    await userEvent.hover(heatmap.querySelector("rect")!);
    await waitFor(() => {
      expect(page.getByText("Morning · Mon")).toBeVisible();
      expect(page.getByText("Activity")).toBeVisible();
    });
  },
};
