import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { PitchKitInsightsExample } from "../examples/PitchKit/PitchKitExample";

const meta = {
  title: "Foundation/PitchKit interactions",
  tags: ["test", "!autodocs"],
  parameters: {
    docs: { disable: true },
    wmdsLayout: "fullscreen",
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const PrimaryNavigation: Story = {
  name: "PitchKit — primary navigation",
  render: () => <PitchKitInsightsExample />,
  play: async ({ canvas }) => {
    const navigation = canvas.getByRole("radiogroup", {
      name: /pitchkit primary navigation/i,
    });

    await userEvent.click(
      within(navigation).getByRole("radio", { name: /^pitchkit$/i }),
    );
    expect(
      canvas.getByRole("heading", { name: /shareable pitchkit/i }),
    ).toBeInTheDocument();

    await userEvent.click(
      within(navigation).getByRole("radio", { name: /^insights$/i }),
    );
    expect(canvas.getByRole("heading", { name: /^insights$/i })).toBeInTheDocument();
  },
};

export const UnavailableData: Story = {
  name: "PitchKit — unavailable Graph data",
  render: () => <PitchKitInsightsExample dataState="unavailable" />,
  play: async ({ canvas }) => {
    expect(
      canvas.getByRole("heading", { name: /insights are unavailable/i }),
    ).toBeInTheDocument();
    expect(
      canvas.queryByRole("img", {
        name: /daily and typical instagram reach/i,
      }),
    ).not.toBeInTheDocument();
    expect(canvas.getByText(/never substitutes zero/i)).toBeInTheDocument();
  },
};

export const RecentProofTabs: Story = {
  name: "PitchKit — recent proof ranking tabs",
  render: () => <PitchKitInsightsExample />,
  play: async ({ canvas }) => {
    const tabs = canvas.getByRole("tablist", {
      name: /rank recent proof posts by/i,
    });
    const panel = canvas.getByRole("tabpanel");

    expect(within(tabs).getByRole("tab", { name: /reach/i })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(within(panel).getAllByRole("img")[0]).toHaveAccessibleName(
      /bright kitchen with a coastal dining table/i,
    );

    await userEvent.click(
      within(tabs).getByRole("tab", { name: /engagement/i }),
    );
    await waitFor(() => {
      expect(within(panel).getAllByRole("img")[0]).toHaveAccessibleName(
        /sunlit modern studio interior/i,
      );
      expect(canvas.getByText(/ranked by likes \+ comments/i)).toBeVisible();
    });

    await userEvent.click(within(tabs).getByRole("tab", { name: /saves/i }));
    await waitFor(() => {
      expect(within(panel).getAllByRole("img")[0]).toHaveAccessibleName(
        /bright kitchen with a coastal dining table/i,
      );
    });
  },
};

export const LiveColumnGap: Story = {
  name: "PitchKit — live column gap",
  render: () => <PitchKitInsightsExample />,
  play: async ({ canvas, canvasElement }) => {
    const main = canvasElement.querySelector("main");
    const metricGroup = canvas.getByRole("group", {
      name: /instagram performance summary/i,
    });
    const metrics = Array.from(metricGroup.children);

    expect(main).not.toBeNull();
    expect(
      metrics[1]!.getBoundingClientRect().left -
        metrics[0]!.getBoundingClientRect().right,
    ).toBe(8);

    await userEvent.click(canvas.getByRole("button", { name: /layout/i }));
    const panel = within(document.body).getByRole("dialog", {
      name: /grid layout/i,
    });
    const gapInput = within(panel).getByRole("spinbutton", {
      name: /column gap/i,
    });

    await userEvent.clear(gapInput);
    await userEvent.type(gapInput, "24");

    await waitFor(() => {
      expect(
        getComputedStyle(main!).getPropertyValue("--grid-column-gap").trim(),
      ).toBe("24px");
      expect(
        metrics[1]!.getBoundingClientRect().left -
          metrics[0]!.getBoundingClientRect().right,
      ).toBe(24);
    });

    await userEvent.clear(gapInput);
    await userEvent.type(gapInput, "8");

    await waitFor(() => {
      expect(
        getComputedStyle(main!).getPropertyValue("--grid-column-gap").trim(),
      ).toBe("8px");
      expect(
        metrics[1]!.getBoundingClientRect().left -
          metrics[0]!.getBoundingClientRect().right,
      ).toBe(8);

      const columnCount = Number(
        getComputedStyle(main!).getPropertyValue("--grid-cols"),
      );
      const expectedSpan = columnCount === 12 ? 3 : columnCount === 8 ? 4 : 2;
      const gridColumns = Array.from(
        canvasElement.querySelectorAll(".grid-guides-col"),
      );
      expect(metrics[0]!.getBoundingClientRect().right).toBeCloseTo(
        gridColumns[expectedSpan - 1]!.getBoundingClientRect().right,
        1,
      );

      if (columnCount === 12) {
        const reachCard = canvas
          .getByRole("heading", { name: /reach over 30 days/i })
          .closest('[data-layout="shell"]');
        const audienceCard = canvas
          .getByRole("heading", { name: /audience fit/i })
          .closest('[data-layout="shell"]');
        expect(reachCard!.getBoundingClientRect().height).toBeCloseTo(
          audienceCard!.getBoundingClientRect().height,
          1,
        );
      }
    });
  },
};

export const SharedCardBodyRadius: Story = {
  name: "PitchKit — shared Card body radius",
  render: () => <PitchKitInsightsExample />,
  play: async ({ canvas, canvasElement }) => {
    const main = canvasElement.querySelector("main");
    const reachCard = canvas
      .getByRole("heading", { name: /reach over 30 days/i })
      .closest('[data-layout="shell"]');
    const audienceCard = canvas
      .getByRole("heading", { name: /audience fit/i })
      .closest('[data-layout="shell"]');
    const reachWell = reachCard?.querySelector(":scope > div > div");
    const audienceWell = audienceCard?.querySelector(":scope > div > div");
    const postImages = Array.from(canvasElement.querySelectorAll("img"));

    expect(main).not.toBeNull();
    expect(
      getComputedStyle(main!).getPropertyValue("--radius-card-body").trim(),
    ).toBe("14px");
    expect(getComputedStyle(reachWell!).borderRadius).toBe("14px");
    expect(getComputedStyle(audienceWell!).borderRadius).toBe("14px");
    expect(getComputedStyle(reachCard!).borderTopWidth).toBe("1px");
    expect(getComputedStyle(reachCard!).boxShadow).toBe("none");
    expect(getComputedStyle(audienceCard!).borderTopWidth).toBe("1px");
    expect(getComputedStyle(audienceCard!).boxShadow).toBe("none");
    expect(
      reachCard!.getBoundingClientRect().bottom -
        reachWell!.getBoundingClientRect().bottom,
    ).toBeCloseTo(2, 0);
    expect(
      audienceCard!.getBoundingClientRect().bottom -
        audienceWell!.getBoundingClientRect().bottom,
    ).toBeCloseTo(2, 0);
    expect(postImages).toHaveLength(6);
    postImages.forEach((image) => {
      expect(getComputedStyle(image).borderRadius).toBe("14px");
    });
  },
};
