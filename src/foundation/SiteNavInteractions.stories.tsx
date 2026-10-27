import { expect, userEvent, waitFor, within } from "storybook/test";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Sparkles } from "lucide-react";
import { Button } from "../components/atoms/Button/Button";
import { SiteNav } from "../components/organisms/SiteNav/SiteNav";

const meta = {
  title: "Internal/Interactions/SiteNav",
  tags: ["test", "!dev", "!autodocs"],
  parameters: { wmdsLayout: "padded" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const CompactStateToggle: Story = {
  name: "compact state (controlled)",
  render: () => (
    <SiteNav
      placement="inline"
      state="compact"
      start={
        <SiteNav.Brand href="#home" aria-label="WhatMatters" icon={<Sparkles />} />
      }
      middle={
        <SiteNav.Links>
          <SiteNav.Link href="#product" current>
            Product
          </SiteNav.Link>
          <SiteNav.Link href="#pricing">Pricing</SiteNav.Link>
        </SiteNav.Links>
      }
      end={<Button role="primary" size="sm" render={<a href="#start" />}>Start</Button>}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const header = canvas.getByRole("banner", { name: "Site" });
    await expect(header).toHaveAttribute("data-state", "compact");
    await expect(canvas.getByRole("link", { name: "Product" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  },
};

export const MegaMenuKeyboard: Story = {
  name: "mega menu keyboard",
  render: () => (
    <div className="min-h-[12rem]">
      <SiteNav
        placement="inline"
        state="expanded"
        start={
          <SiteNav.Brand href="#home" aria-label="WhatMatters" icon={<Sparkles />} />
        }
        middle={
          <SiteNav.Links>
            <SiteNav.Link href="#product">Product</SiteNav.Link>
            <SiteNav.Menu label="Resources">
              <SiteNav.MenuSection label="Read">
                <SiteNav.MenuLink href="#blog">Blog</SiteNav.MenuLink>
              </SiteNav.MenuSection>
            </SiteNav.Menu>
          </SiteNav.Links>
        }
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole("button", { name: /Resources/i });
    await userEvent.tab();
    trigger.focus();
    await userEvent.keyboard("{Enter}");
    await waitFor(() => {
      expect(within(document.body).getByRole("link", { name: "Blog" })).toBeVisible();
    });
  },
};

/**
 * Known accessibility violations — listed in docs/audits/2026-10-03.md.
 * Checks fail on every other story. These report without failing until the component is fixed.
 * Remove a story from this list when it passes.
 */
for (const story of [MegaMenuKeyboard]) {
  story.parameters = { ...story.parameters, a11y: { test: "todo" } };
}

export const PinnedScrollPadding: Story = {
  name: "pinned compact bar keeps focused elements out from under it",
  render: () => (
    <SiteNav
      placement="fixed"
      state="compact"
      start={<SiteNav.Brand href="#home" aria-label="WhatMatters" icon={<Sparkles />} />}
      end={<Button role="primary" size="sm" render={<a href="#start" />}>Start</Button>}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement.ownerDocument.body);
    await waitFor(() => expect(canvas.getByRole("banner", { name: "Site" })).toHaveAttribute("data-state", "compact"));
    expect(document.documentElement.style.scrollPaddingTop).toContain("--site-nav-height");
  },
};

export const MobileMenuTrigger: Story = {
  name: "mobile menu trigger names its state and controls the sheet",
  render: () => (
    <SiteNav
      placement="inline"
      state="expanded"
      start={<SiteNav.Brand href="#home" aria-label="WhatMatters" icon={<Sparkles />} />}
      mobile={<SiteNav.MobileLink href="#product">Product</SiteNav.MobileLink>}
    />
  ),
  play: async ({ canvasElement }) => {
    // The trigger is display:none from `md` up, which empties its computed name — read aria-label.
    const trigger = canvasElement.querySelector<HTMLButtonElement>('button[aria-haspopup="dialog"]');
    if (trigger == null) throw new Error("mobile menu trigger not rendered");
    await expect(trigger).toHaveAttribute("aria-label", "Open menu");
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await expect(trigger).toHaveAttribute("aria-haspopup", "dialog");
    await expect(trigger).not.toHaveAttribute("aria-controls");

    trigger.click();
    const dialog = await within(document.body).findByRole("dialog", { name: "Menu" });
    await waitFor(() => expect(trigger).toHaveAttribute("aria-expanded", "true"));
    await expect(trigger).toHaveAttribute("aria-label", "Close menu");
    await expect(trigger).toHaveAttribute("aria-controls", dialog.id);

    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(trigger).toHaveAttribute("aria-label", "Open menu"));
    await expect(trigger).not.toHaveAttribute("aria-controls");
    // Let the exit animation finish so the a11y check doesn't read a half-faded panel.
    await waitFor(() => expect(dialog).not.toBeInTheDocument());
  },
};
