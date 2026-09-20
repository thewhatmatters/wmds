import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";
import {
  PitchKitInsightsExample,
  PitchKitOwnerExample,
} from "../examples/PitchKit/PitchKitExample";
import { PitchKitShareableExample } from "../examples/PitchKit/PitchKitShareable";
import { PitchKitPastBrandsExample } from "../examples/PitchKit/PitchKitPastBrands";
import { PitchKitThemePickerOwnerExample } from "../examples/PitchKit/PitchKitThemePicker";
import { PitchKitUserSettingsOwnerExample } from "../examples/PitchKit/PitchKitUserSettings";

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
      canvas.getByRole("heading", { name: /your pitchkit/i }),
    ).toBeInTheDocument();
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
      canvas.getByRole("button", { name: /manage selected post 1/i }),
    ).toBeInTheDocument();
    expect(
      canvas.queryByRole("button", { name: /manage ranked post/i }),
    ).not.toBeInTheDocument();
    expect(canvas.getByText("Creator")).toBeInTheDocument();
    expect(canvas.queryByText("Verified")).not.toBeInTheDocument();

    await userEvent.click(
      within(navigation).getByRole("radio", { name: /^insights$/i }),
    );
    expect(canvas.getByRole("heading", { name: /^insights$/i })).toBeInTheDocument();
    expect(
      canvas.queryByRole("button", { name: /share kit/i }),
    ).not.toBeInTheDocument();
    expect(
      canvas.queryByRole("button", { name: /manage ranked post/i }),
    ).not.toBeInTheDocument();
  },
};

export const ShareableKit: Story = {
  name: "PitchKit — shareable kit",
  render: () => <PitchKitShareableExample />,
  play: async ({ canvas }) => {
    expect(
      canvas.getByRole("heading", { name: /avery morgan/i }),
    ).toBeInTheDocument();
    expect(
      canvas.getByText(/@averymorgan · 84.2K followers/i),
    ).toBeInTheDocument();
    expect(canvas.queryByText("Verified")).not.toBeInTheDocument();
    const summary = canvas.getByRole("group", {
      name: /instagram performance summary/i,
    });
    expect(within(summary).getByText("Followers")).toBeInTheDocument();
    expect(within(summary).getByText("Engagement rate")).toBeInTheDocument();
    expect(within(summary).getByText("Typical reach")).toBeInTheDocument();
    expect(within(summary).getByText("Typical saves")).toBeInTheDocument();
    expect(
      canvas.getByRole("heading", { name: /reach over 30 days/i }),
    ).toBeInTheDocument();
    expect(
      canvas.getByRole("heading", { name: /top countries/i }),
    ).toBeInTheDocument();
    expect(
      canvas.getByRole("link", { name: /hello@averymorgan.com/i }),
    ).toBeInTheDocument();
    expect(
      canvas.getByRole("heading", { name: /past brands/i }),
    ).toBeInTheDocument();
    const publicBrands = canvas.getByRole("list", { name: /^past brands$/i });
    expect(publicBrands).toHaveTextContent(/hearth & home/i);
    expect(publicBrands).toHaveTextContent(/3\.2x roas/i);
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
    expect(
      canvas.queryByRole("button", { name: /manage selected post/i }),
    ).not.toBeInTheDocument();
    expect(
      canvas.getByRole("heading", { name: /^create your pitchkit$/i }),
    ).toBeInTheDocument();
    expect(
      canvas.getByText(/turn your instagram into a shareable media kit/i),
    ).toBeInTheDocument();
    expect(
      canvas.getByRole("button", { name: /continue with instagram/i }),
    ).toBeInTheDocument();
    expect(
      canvas.queryByRole("button", { name: /^create your pitchkit$/i }),
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
    expect(canvas.getByText("No data")).toBeInTheDocument();
    expect(
      canvas.getByRole("heading", { name: /no reach data yet/i }),
    ).toBeInTheDocument();
    expect(
      canvas.getByText(/connect more instagram activity to plot the last 30 days/i),
    ).toBeInTheDocument();
    expect(
      canvas.queryByText(/invent a chart from a/i),
    ).not.toBeInTheDocument();
    expect(
      canvas.queryByRole("img", {
        name: /daily and typical instagram reach/i,
      }),
    ).not.toBeInTheDocument();
    expect(
      canvas.getByRole("heading", { name: /audience fit/i }),
    ).toBeInTheDocument();
    expect(
      canvas.getByRole("list", { name: /audience by countries/i }),
    ).toBeInTheDocument();
    expect(
      canvas.queryByRole("heading", { name: /no audience data yet/i }),
    ).not.toBeInTheDocument();
    expect(
      canvas.getByRole("heading", { name: /recent proof/i }),
    ).toBeInTheDocument();
    expect(
      canvas.queryByRole("heading", { name: /insights are unavailable/i }),
    ).not.toBeInTheDocument();
    expect(canvas.queryByText(/retrieving data/i)).not.toBeInTheDocument();
  },
};

export const InsufficientAudienceData: Story = {
  name: "PitchKit — insufficient audience data",
  render: () => <PitchKitInsightsExample dataState="insufficientAudience" />,
  play: async ({ canvas }) => {
    expect(
      canvas.getByRole("heading", { name: /audience fit/i }),
    ).toBeInTheDocument();
    expect(canvas.getByText("No data")).toBeInTheDocument();
    expect(
      canvas.getByRole("heading", { name: /no audience data yet/i }),
    ).toBeInTheDocument();
    expect(
      canvas.getByText(/connect instagram insights demographics when available/i),
    ).toBeInTheDocument();
    expect(
      canvas.queryByRole("list", { name: /audience by countries/i }),
    ).not.toBeInTheDocument();
    expect(
      canvas.getByRole("heading", { name: /reach over 30 days/i }),
    ).toBeInTheDocument();
    expect(canvas.getAllByText("Typical reach").length).toBeGreaterThan(1);
    expect(canvas.getByText("Daily reach")).toBeInTheDocument();
    expect(
      canvas.getByRole("heading", { name: /recent proof/i }),
    ).toBeInTheDocument();
    expect(
      canvas.queryByRole("heading", { name: /insights are unavailable/i }),
    ).not.toBeInTheDocument();
    expect(
      canvas.queryByRole("heading", { name: /no reach data yet/i }),
    ).not.toBeInTheDocument();
    expect(canvas.queryByText(/retrieving data/i)).not.toBeInTheDocument();
  },
};

export const InsufficientReachAndAudienceData: Story = {
  name: "PitchKit — insufficient reach and audience data",
  render: () => (
    <PitchKitInsightsExample dataState="insufficientReachAndAudience" />
  ),
  play: async ({ canvas }) => {
    expect(
      canvas.getByRole("heading", { name: /reach over 30 days/i }),
    ).toBeInTheDocument();
    expect(
      canvas.getByRole("heading", { name: /no reach data yet/i }),
    ).toBeInTheDocument();
    expect(
      canvas.getByRole("heading", { name: /audience fit/i }),
    ).toBeInTheDocument();
    expect(
      canvas.getByRole("heading", { name: /no audience data yet/i }),
    ).toBeInTheDocument();
    expect(canvas.getAllByText("No data")).toHaveLength(2);
    expect(
      canvas.queryByRole("img", {
        name: /daily and typical instagram reach/i,
      }),
    ).not.toBeInTheDocument();
    expect(
      canvas.queryByRole("list", { name: /audience by countries/i }),
    ).not.toBeInTheDocument();
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
    expect(
      canvas.queryByRole("heading", { name: /no reach data yet/i }),
    ).not.toBeInTheDocument();
    expect(
      canvas.queryByRole("heading", { name: /no audience data yet/i }),
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

export const OwnerKit: Story = {
  name: "PitchKit — owner kit",
  render: () => <PitchKitOwnerExample />,
  play: async ({ canvas }) => {
    expect(
      canvas.getByRole("heading", { name: /avery morgan/i }),
    ).toBeInTheDocument();
    expect(canvas.getByText(/@averymorgan · 84.2K followers/i)).toBeInTheDocument();
    expect(canvas.getByText("Creator")).toBeInTheDocument();
    expect(canvas.queryByText("Verified")).not.toBeInTheDocument();
    expect(
      canvas.getByRole("heading", { name: /your pitchkit/i }),
    ).toBeInTheDocument();
    expect(canvas.getByText(/edit what brands see/i)).toBeInTheDocument();
    expect(
      canvas.getByRole("group", { name: /instagram performance summary/i }),
    ).toBeInTheDocument();
    expect(canvas.getByText("Typical saves")).toBeInTheDocument();
    expect(
      canvas.getByRole("heading", { name: /reach over 30 days/i }),
    ).toBeInTheDocument();
    expect(
      canvas.getByRole("heading", { name: /top countries/i }),
    ).toBeInTheDocument();
    expect(
      canvas.getByRole("heading", { name: /selected posts/i }),
    ).toBeInTheDocument();
    expect(
      canvas.getByRole("button", { name: /manage selected post 1/i }),
    ).toBeInTheDocument();
    expect(
      canvas.queryByRole("button", { name: /manage ranked post/i }),
    ).not.toBeInTheDocument();
    expect(
      canvas.getByRole("link", { name: /hello@averymorgan.com/i }),
    ).toBeInTheDocument();
    expect(
      canvas.getByRole("heading", { name: /past brands/i }),
    ).toBeInTheDocument();
    expect(canvas.queryByText(/coming soon/i)).not.toBeInTheDocument();
    expect(
      canvas.queryByRole("menuitem", { name: /swap post/i }),
    ).not.toBeInTheDocument();
  },
};

export const OwnerHidePostConfirmation: Story = {
  name: "PitchKit — owner kit hide post",
  render: () => <PitchKitOwnerExample />,
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole("button", {
      name: /manage selected post 1/i,
    });
    await userEvent.click(trigger);

    const menu = within(document.body).getByRole("menu");
    expect(
      within(menu).queryByRole("menuitem", { name: /swap post/i }),
    ).not.toBeInTheDocument();
    await userEvent.click(
      within(menu).getByRole("menuitem", { name: /hide from kit/i }),
    );

    const dialog = within(document.body).getByRole("alertdialog", {
      name: /hide this post from pitchkit/i,
    });
    await waitFor(() => expect(dialog).toBeVisible());

    await userEvent.click(
      within(dialog).getByRole("button", { name: /^hide from kit$/i }),
    );

    await waitFor(() => {
      expect(
        within(document.body).queryByRole("alertdialog"),
      ).not.toBeInTheDocument();
      expect(
        canvas.getByText(/post hidden from the shareable kit/i),
      ).toBeVisible();
      expect(
        canvas.queryByRole("button", { name: /manage selected post 6/i }),
      ).not.toBeInTheDocument();
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
      expect(
        canvas.getByText(/post restored to the shareable kit/i),
      ).toBeVisible();
      expect(
        canvas.getByRole("button", { name: /manage selected post 6/i }),
      ).toBeInTheDocument();
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
    const postImages = Array.from(
      canvasElement.querySelectorAll('[data-layout="shell"] img'),
    );

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

export const UserSettingsOwner: Story = {
  name: "PitchKit — account settings (owner)",
  render: () => <PitchKitUserSettingsOwnerExample />,
  play: async ({ canvas }) => {
    const portal = within(document.body);

    await userEvent.click(
      canvas.getByRole("button", { name: /my account/i }),
    );

    const menu = await waitFor(() => portal.getByRole("menu", { name: /my account/i }));
    expect(within(menu).getByText("My account")).toBeInTheDocument();
    expect(
      within(menu).getByRole("menuitem", { name: /account settings/i }),
    ).toBeInTheDocument();
    expect(
      within(menu).getByRole("menuitem", { name: /share kit/i }),
    ).toBeInTheDocument();
    expect(
      within(menu).getByRole("menuitem", { name: /sign out/i }),
    ).toBeInTheDocument();
    expect(
      within(menu).getByRole("menuitem", { name: /disconnect/i }),
    ).toBeInTheDocument();
    expect(
      within(menu).getByRole("menuitem", { name: /^delete$/i }),
    ).toBeInTheDocument();

    await userEvent.click(
      within(menu).getByRole("menuitem", { name: /account settings/i }),
    );

    await waitFor(() => {
      expect(portal.getByRole("dialog")).toBeInTheDocument();
    });

    const settings = portal.getByRole("dialog");
    await expect(settings).toHaveAccessibleName(/account settings/i);
    expect(
      within(settings).getByRole("heading", { name: /connected instagram/i }),
    ).toBeInTheDocument();
    expect(within(settings).getByText("Avery Morgan")).toBeInTheDocument();
    expect(within(settings).getByText("Creator")).toBeInTheDocument();
    expect(within(settings).getByText(/last synced/i)).toBeInTheDocument();
    expect(within(settings).queryByRole("button", { name: /^copy$/i })).not.toBeInTheDocument();
    expect(within(settings).queryByRole("button", { name: /sign out/i })).not.toBeInTheDocument();
    expect(within(settings).queryByText(/bio/i)).not.toBeInTheDocument();

    await userEvent.click(
      within(settings).getByRole("button", { name: /close/i }),
    );
    await waitFor(() => {
      expect(portal.queryByRole("dialog")).not.toBeInTheDocument();
    });

    await userEvent.click(
      canvas.getByRole("button", { name: /my account/i }),
    );
    await userEvent.click(
      within(portal.getByRole("menu")).getByRole("menuitem", { name: /^delete$/i }),
    );

    await waitFor(() => {
      expect(portal.getByRole("alertdialog")).toBeInTheDocument();
    });

    const confirm = portal.getByRole("alertdialog");
    await expect(confirm).toHaveAccessibleName(/delete your pitchkit account/i);
    await expect(confirm).toHaveAccessibleDescription(
      /permanently deletes your kit, stored media copies, and connection/i,
    );
    expect(confirm).toHaveTextContent(/your instagram account is not deleted/i);
    expect(confirm).toHaveTextContent(/this cannot be undone/i);

    await userEvent.click(
      within(confirm).getByRole("button", { name: /^cancel$/i }),
    );

    await waitFor(() => {
      expect(portal.queryByRole("alertdialog")).not.toBeInTheDocument();
    });
    expect(portal.queryByRole("dialog")).not.toBeInTheDocument();

    await userEvent.click(
      canvas.getByRole("button", { name: /my account/i }),
    );
    await userEvent.click(
      within(portal.getByRole("menu")).getByRole("menuitem", { name: /^delete$/i }),
    );
    await waitFor(() => {
      expect(portal.getByRole("alertdialog")).toBeInTheDocument();
    });

    await userEvent.click(
      within(portal.getByRole("alertdialog")).getByRole("button", {
        name: /^delete account$/i,
      }),
    );

    await waitFor(() => {
      expect(portal.queryByRole("alertdialog")).not.toBeInTheDocument();
      expect(portal.queryByRole("dialog")).not.toBeInTheDocument();
    });
  },
};

export const ThemePickerOwner: Story = {
  name: "PitchKit — theme picker owner",
  render: () => <PitchKitThemePickerOwnerExample />,
  play: async ({ canvas }) => {
    const themeGroup = canvas.getByRole("radiogroup", { name: /kit theme/i });
    const save = canvas.getByRole("button", { name: /save theme/i });
    const page = canvas.getByRole("main");

    expect(save).toBeDisabled();
    expect(page).toHaveAttribute("data-theme", "light");
    expect(canvas.queryByText("Public kit preview")).not.toBeInTheDocument();
    expect(
      canvas.queryByRole("radiogroup", { name: /pitchkit primary navigation/i }),
    ).not.toBeInTheDocument();
    expect(canvas.getAllByText("PitchKit")).toHaveLength(1);
    expect(
      canvas.getByRole("heading", { name: /avery morgan/i }),
    ).toBeInTheDocument();
    expect(canvas.getByText("Typical saves")).toBeInTheDocument();
    expect(
      canvas.queryByRole("heading", { name: /^create your pitchkit$/i }),
    ).not.toBeInTheDocument();

    await userEvent.click(within(themeGroup).getByRole("radio", { name: /^dark$/i }));
    expect(page).toHaveAttribute("data-theme", "dark");
    expect(save).toBeEnabled();

    await userEvent.click(save);
    await waitFor(() => {
      expect(save).toBeDisabled();
    });
    const notifications = within(document.body).getByRole("list", {
      name: /notifications/i,
    });
    await waitFor(() => {
      expect(within(notifications).getByRole("status")).toHaveTextContent(
        /theme saved/i,
      );
    });

    await userEvent.click(within(themeGroup).getByRole("radio", { name: /^soft$/i }));
    expect(page).toHaveAttribute("data-theme", "soft");
    expect(save).toBeEnabled();
  },
};

export const PastBrandsOwnerResult: Story = {
  name: "PitchKit — past brands owner result",
  render: () => <PitchKitPastBrandsExample chrome="owner" brandState="filled" />,
  play: async ({ canvas }) => {
    const portal = within(document.body);

    expect(
      canvas.getByRole("heading", { name: /past brands/i }),
    ).toBeInTheDocument();
    expect(canvas.getByText("3.2x ROAS")).toBeInTheDocument();
    expect(canvas.getByText("+12% CTR")).toBeInTheDocument();
    expect(canvas.queryByText("—")).not.toBeInTheDocument();

    await userEvent.click(
      canvas.getByRole("button", { name: /manage studio line/i }),
    );
    const addMenu = portal.getByRole("menu");
    await userEvent.click(
      within(addMenu).getByRole("menuitem", { name: /add result/i }),
    );

    const dialog = await waitFor(() => portal.getByRole("dialog"));
    await expect(dialog).toHaveAccessibleName(/past brands/i);
    expect(within(dialog).getByLabelText(/brand name/i)).toHaveValue("Studio Line");
    const result = within(dialog).getByLabelText(/^result$/i);
    await userEvent.type(result, "1.4M views");
    await userEvent.click(within(dialog).getByRole("button", { name: /^save$/i }));

    await waitFor(() => {
      expect(portal.queryByRole("dialog")).not.toBeInTheDocument();
      expect(canvas.getByText("1.4M views")).toBeInTheDocument();
    });

    await userEvent.click(
      canvas.getByRole("button", { name: /manage hearth & home/i }),
    );
    const clearMenu = portal.getByRole("menu");
    await userEvent.click(
      within(clearMenu).getByRole("menuitem", { name: /clear result/i }),
    );
    await waitFor(() => {
      expect(canvas.queryByText("3.2x ROAS")).not.toBeInTheDocument();
    });
  },
};

export const PastBrandsPublicOmit: Story = {
  name: "PitchKit — past brands public omit",
  render: () => <PitchKitPastBrandsExample chrome="public" brandState="empty" />,
  play: async ({ canvas }) => {
    expect(
      canvas.queryByRole("heading", { name: /past brands/i }),
    ).not.toBeInTheDocument();
    expect(
      canvas.queryByRole("button", { name: /add brands you've worked with/i }),
    ).not.toBeInTheDocument();
  },
};

export const PastBrandsPublicOverflow: Story = {
  name: "PitchKit — past brands public overflow",
  render: () => (
    <PitchKitPastBrandsExample chrome="public" brandState="overflow" />
  ),
  play: async ({ canvas, canvasElement }) => {
    expect(
      canvas.getByRole("heading", { name: /past brands/i }),
    ).toBeInTheDocument();
    const overflowBrands = canvas.getByRole("list", { name: /^past brands$/i });
    expect(overflowBrands).toHaveTextContent("Nike");
    expect(overflowBrands).toHaveTextContent("+12% CTR");
    const rail = canvasElement.querySelector("[data-overflow]");
    expect(rail).not.toBeNull();
    await waitFor(() => {
      expect(rail).toHaveAttribute("data-overflow", "true");
    });
    expect(
      canvas.queryByRole("button", { name: /add result/i }),
    ).not.toBeInTheDocument();
  },
};

export const ShareableInsufficientReach: Story = {
  name: "PitchKit — shareable insufficient reach",
  render: () => <PitchKitShareableExample reachState="insufficient" />,
  play: async ({ canvas }) => {
    expect(
      canvas.getByRole("heading", { name: /reach over 30 days/i }),
    ).toBeInTheDocument();
    expect(canvas.getByText("No data")).toBeInTheDocument();
    expect(
      canvas.getByRole("heading", { name: /no reach data yet/i }),
    ).toBeInTheDocument();
    expect(canvas.queryByText("Engagement rate")).not.toBeInTheDocument();
    expect(canvas.getByText("Typical reach")).toBeInTheDocument();
    expect(canvas.getByText("—")).toBeInTheDocument();
    expect(canvas.getByText("Followers")).toBeInTheDocument();
    expect(canvas.getByText("Typical saves")).toBeInTheDocument();
  },
};
