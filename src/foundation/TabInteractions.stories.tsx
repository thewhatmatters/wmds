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
      expect(within(tablist).getByRole("button", { name: /more/i })).toBeInTheDocument();
    });

    await userEvent.click(within(tablist).getByRole("button", { name: /more/i }));
    await userEvent.click(canvas.getByRole("menuitem", { name: /api keys/i }));

    await waitFor(() => {
      const promoted = within(tablist).getByRole("tab", { name: /api keys/i });
      const more = within(tablist).getByRole("button", { name: /more/i });
      expect(promoted).toHaveAttribute("aria-selected", "true");
      expect(promoted.nextElementSibling).toBe(more);
    });
  },
};
