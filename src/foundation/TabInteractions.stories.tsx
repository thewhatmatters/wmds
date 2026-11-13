import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { Tab } from "../components/organisms/Tab/Tab";

const meta = {
  title: "Internal/Interactions/Tab",
  tags: ["test", "!dev", "!autodocs"],
  parameters: {
    docs: { disable: true },
    wmdsLayout: "padded",
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const OverflowSelectionPromotion: Story = {
  name: "Tab — overflow selection promotion",
  render: function OverflowSelectionPromotionExample() {
    const [value, setValue] = useState("profile");

    return (
      <div className="w-[360px]">
        <Tab.Group aria-label="Settings pages" value={value} onValueChange={setValue}>
          <Tab value="profile">Profile</Tab>
          <Tab value="notifications">Notifications</Tab>
          <Tab value="security">Security</Tab>
          <Tab value="general">General</Tab>
          <Tab value="members" count={8}>Members</Tab>
          <Tab value="billing">Billing</Tab>
          <Tab value="connected">Connected apps</Tab>
          <Tab value="api">API keys</Tab>
        </Tab.Group>
      </div>
    );
  },
  play: async ({ canvas }) => {
    const tablist = canvas.getByRole("tablist", { name: /settings pages/i });

    await waitFor(() => {
      expect(canvas.getByRole("button", { name: /more/i })).toBeInTheDocument();
    });

    await userEvent.click(canvas.getByRole("button", { name: /more/i }));
    await userEvent.click(canvas.getByRole("menuitem", { name: /api keys/i }));

    await waitFor(() => {
      const promoted = within(tablist).getByRole("tab", { name: /api keys/i });
      const more = canvas.getByRole("button", { name: /more/i });
      expect(promoted).toHaveAttribute("aria-selected", "true");
      // The promoted tab takes the last slot, right before More (which sits outside the tablist).
      expect(tablist.lastElementChild).toBe(promoted);
      expect(tablist.nextElementSibling).toBe(more);
    });
  },
};

export const OverflowKeepsItsWidth: Story = {
  name: "Tab — tabs that don't fit never widen what holds them",
  render: function OverflowKeepsItsWidthExample() {
    const [value, setValue] = useState("essentials");

    return (
      <div className="w-[240px]" data-testid="holder">
        <Tab.Group aria-label="Packages" value={value} onValueChange={setValue} size="lg">
          <Tab value="essentials">Essentials</Tab>
          <Tab value="studio">Studio</Tab>
          <Tab value="partners">Partners</Tab>
          <Tab value="enterprise">Enterprise</Tab>
        </Tab.Group>
      </div>
    );
  },
  play: async ({ canvas }) => {
    await waitFor(() => {
      expect(canvas.getByRole("button", { name: /more/i })).toBeInTheDocument();
    });
    // The hidden measuring row is as wide as every tab side by side. It must not add to the
    // holder's scrollable width, or a phone page scrolls sideways.
    const holder = canvas.getByTestId("holder");
    expect(holder.scrollWidth).toBe(holder.clientWidth);
  },
};
