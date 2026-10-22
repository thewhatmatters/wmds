import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { PortalDashboard } from "../components/organisms/AppShell/AppShell.stories";

const meta = {
  title: "Internal/Interactions/App shell",
  tags: ["test", "!dev", "!autodocs"],
  parameters: {
    docs: { disable: true },
    wmdsLayout: "fullscreen",
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const ToggleAndAside: Story = {
  name: "AppShell — toggle, shortcut, and aside",
  render: () => <PortalDashboard />,
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("navigation", { name: "Portal" })).toBeVisible();
    await expect(canvas.getByRole("banner", { name: "Dashboard" })).toBeVisible();
    await expect(canvas.getByRole("main")).toBeVisible();

    const toggle = canvas.getByRole("button", { name: "Collapse sidebar" });
    await expect(toggle).toHaveAttribute("aria-expanded", "true");
    await userEvent.click(toggle);
    await expect(canvas.getByRole("button", { name: "Expand sidebar" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
    await expect(canvas.queryByRole("navigation", { name: "Portal" })).toBeNull();

    await userEvent.keyboard("{Control>}b{/Control}");
    await expect(canvas.getByRole("navigation", { name: "Portal" })).toBeVisible();

    const details = canvas.getByRole("button", { name: "Details" });
    await userEvent.click(details);
    const aside = within(document.body).getByRole("dialog", { name: "Stir in strength" });
    await expect(aside).toHaveAttribute("aria-modal", "false");

    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(within(document.body).queryByRole("dialog")).toBeNull());
    await expect(details).toHaveFocus();
  },
};

export const SkipLink: Story = {
  name: "the first Tab reaches a skip link that moves focus to the page",
  render: () => <PortalDashboard />,
  play: async ({ canvas }) => {
    await userEvent.tab();
    const skip = canvas.getByRole("link", { name: "Skip to content" });
    expect(skip).toHaveFocus();
    const before = window.location.href;
    await userEvent.keyboard("{Enter}");
    expect(canvas.getByRole("main")).toHaveFocus();
    expect(window.location.href).toBe(before);
  },
};
