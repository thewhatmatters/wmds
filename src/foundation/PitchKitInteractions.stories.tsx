import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { PitchKitInsightsExample } from "../examples/PitchKit/PitchKitExample";
import { PitchKitShareableExample } from "../examples/PitchKit/PitchKitShareable";

const meta = {
  title: "Internal/Interactions/PitchKit",
  tags: ["test", "!dev", "!autodocs"],
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
      canvas.getByRole("heading", { name: /avery morgan/i }),
    ).toBeInTheDocument();
    expect(
      canvas.getByRole("heading", { name: /selected posts/i }),
    ).toBeInTheDocument();
    expect(
      canvas.getByRole("heading", { name: /^contact$/i }),
    ).toBeInTheDocument();
    expect(
      canvas.getByRole("heading", { name: /past brands/i }),
    ).toBeInTheDocument();
    expect(canvas.queryByText(/coming soon/i)).not.toBeInTheDocument();
    expect(
      canvas.queryByRole("button", { name: /edit/i }),
    ).not.toBeInTheDocument();
    expect(
      canvas.queryByRole("button", { name: /manage ranked post/i }),
    ).not.toBeInTheDocument();

    await userEvent.click(
      within(navigation).getByRole("radio", { name: /^insights$/i }),
    );
    expect(canvas.getByRole("heading", { name: /^insights$/i })).toBeInTheDocument();
  },
};

export const ShareableKit: Story = {
  name: "PitchKit — shareable kit",
  render: () => <PitchKitShareableExample />,
  play: async ({ canvas }) => {
    expect(
      canvas.getByRole("heading", { name: /avery morgan/i }),
    ).toBeInTheDocument();
    expect(canvas.getByText("@averymorgan")).toBeInTheDocument();
    expect(canvas.getByText("Verified")).toBeInTheDocument();
    expect(
      canvas.getByRole("group", { name: /verified instagram summary/i }),
    ).toBeInTheDocument();
    expect(
      canvas.getByRole("link", { name: /hello@averymorgan.com/i }),
    ).toBeInTheDocument();
    expect(
      canvas.getByRole("heading", { name: /hearth & home/i }),
    ).toBeInTheDocument();
    expect(canvas.queryByText(/coming soon/i)).not.toBeInTheDocument();
    expect(
      canvas.queryByRole("radiogroup", {
        name: /pitchkit primary navigation/i,
      }),
    ).not.toBeInTheDocument();
    expect(
      canvas.queryByRole("button", { name: /edit/i }),
    ).not.toBeInTheDocument();
    expect(
      canvas.queryByRole("button", { name: /manage ranked post/i }),
    ).not.toBeInTheDocument();
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

export const InsufficientReachData: Story = {
  name: "PitchKit — insufficient reach data",
  render: () => <PitchKitInsightsExample dataState="insufficientReach" />,
  play: async ({ canvas }) => {
    expect(
      canvas.getByRole("heading", { name: /reach over 30 days/i }),
    ).toBeInTheDocument();
    expect(
      canvas.getByRole("heading", { name: /not enough reach history yet/i }),
    ).toBeInTheDocument();
    expect(
      canvas.queryByRole("img", {
        name: /daily and typical instagram reach/i,
      }),
    ).not.toBeInTheDocument();
    expect(
      canvas.getByRole("heading", { name: /audience fit/i }),
    ).toBeInTheDocument();
    expect(
      canvas.getByRole("heading", { name: /recent proof/i }),
    ).toBeInTheDocument();
    expect(
      canvas.queryByRole("heading", { name: /insights are unavailable/i }),
    ).not.toBeInTheDocument();
    expect(canvas.queryByText(/retrieving data/i)).not.toBeInTheDocument();
  },
};

export const LoadingInsights: Story = {
  name: "PitchKit — creator Insights loading",
  render: () => <PitchKitInsightsExample dataState="loading" />,
  play: async ({ canvas }) => {
    expect(canvas.getByRole("heading", { name: /^insights$/i })).toBeInTheDocument();
    expect(
      canvas.getByRole("group", {
        name: /loading instagram performance summary/i,
      }),
    ).toBeInTheDocument();
    expect(
      canvas.getByLabelText(/loading reach over 30 days/i),
    ).toHaveAttribute("aria-busy", "true");
    expect(
      canvas.getByLabelText(/loading audience fit/i),
    ).toHaveAttribute("aria-busy", "true");
    expect(
      canvas.getByLabelText(/loading recent proof/i),
    ).toHaveAttribute("aria-busy", "true");
    expect(canvas.getByLabelText(/followers/i)).toHaveAttribute("aria-busy", "true");
    expect(canvas.queryByText("84.2K")).not.toBeInTheDocument();
    expect(canvas.queryByText("—")).not.toBeInTheDocument();
    expect(
      canvas.queryByRole("heading", { name: /reach over 30 days/i }),
    ).not.toBeInTheDocument();
    expect(
      canvas.queryByRole("img", {
        name: /daily and typical instagram reach/i,
      }),
    ).not.toBeInTheDocument();
    expect(
      canvas.queryByRole("heading", { name: /insights are unavailable/i }),
    ).not.toBeInTheDocument();
  },
};

export const RetrievingInsights: Story = {
  name: "PitchKit — creator Insights retrieving",
  render: () => (
    <PitchKitInsightsExample dataState="loading" loadingPhase="retrieving" />
  ),
  play: async ({ canvas }) => {
    expect(
      canvas.getByRole("heading", { name: /reach over 30 days/i }),
    ).toBeInTheDocument();
    expect(
      canvas.getByRole("heading", { name: /audience fit/i }),
    ).toBeInTheDocument();
    expect(canvas.getAllByText(/retrieving data/i).length).toBeGreaterThan(0);
    expect(
      canvas.queryByRole("img", {
        name: /daily and typical instagram reach/i,
      }),
    ).not.toBeInTheDocument();
    expect(canvas.queryByText("84.2K")).not.toBeInTheDocument();
    expect(
      canvas.queryByRole("heading", { name: /not enough reach history yet/i }),
    ).not.toBeInTheDocument();
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

export const HidePostConfirmation: Story = {
  name: "PitchKit — hide post confirmation",
  render: () => <PitchKitInsightsExample />,
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole("button", {
      name: /manage ranked post 1/i,
    });
    await userEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(getComputedStyle(trigger).backgroundColor).not.toBe(
      "rgba(0, 0, 0, 0)",
    );

    const menu = within(document.body).getByRole("menu");
    await userEvent.click(
      within(menu).getByRole("menuitem", { name: /hide from kit/i }),
    );

    const dialog = within(document.body).getByRole("alertdialog", {
      name: /hide this post from pitchkit/i,
    });
    await waitFor(() => expect(dialog).toBeVisible());
    expect(within(dialog).getByText(/you can add it back later/i)).toBeVisible();

    await userEvent.click(
      within(dialog).getByRole("button", { name: /^hide from kit$/i }),
    );

    await waitFor(() => {
      expect(
        within(document.body).queryByRole("alertdialog"),
      ).not.toBeInTheDocument();
      expect(canvas.getByText(/post hidden from the shareable kit preview/i)).toBeVisible();
      expect(canvas.getByText("5 shown")).toBeVisible();
    });

    const notifications = within(document.body).getByRole("list", {
      name: /notifications/i,
    });
    await waitFor(() => {
      expect(within(notifications).getByRole("status")).toHaveTextContent(
        /post hidden from kit/i,
      );
    });

    await userEvent.click(
      within(notifications).getByRole("button", { name: /undo/i }),
    );
    await waitFor(() => {
      expect(canvas.getByText(/post restored to the shareable kit preview/i)).toBeVisible();
      expect(canvas.getByText("6 shown")).toBeVisible();
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
        reachWell!.getBoundingClientRect().bottom -
        Number.parseFloat(getComputedStyle(reachCard!).borderBottomWidth),
    ).toBeCloseTo(2, 0);
    expect(
      audienceCard!.getBoundingClientRect().bottom -
        audienceWell!.getBoundingClientRect().bottom -
        Number.parseFloat(getComputedStyle(audienceCard!).borderBottomWidth),
    ).toBeCloseTo(2, 0);
    expect(postImages).toHaveLength(6);
    postImages.forEach((image) => {
      expect(getComputedStyle(image).borderRadius).toBe("14px");
    });
  },
};
