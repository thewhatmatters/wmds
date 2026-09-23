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
        <SiteNav.Brand href="#home" aria-label="WhatMatters">
          <Sparkles aria-hidden />
        </SiteNav.Brand>
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
          <SiteNav.Brand href="#home" aria-label="WhatMatters">
          <Sparkles aria-hidden />
        </SiteNav.Brand>
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
