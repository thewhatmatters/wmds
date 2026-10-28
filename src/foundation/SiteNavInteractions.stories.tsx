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
  name: "phone menu: Menu becomes Close, focus moves in and cycles, a link tap or Escape closes it",
  globals: { viewport: { value: "mobile", isRotated: false } },
  render: () => (
    <div>
      <SiteNav
        placement="inline"
        state="expanded"
        start={<SiteNav.Brand href="#home" aria-label="WhatMatters" icon={<Sparkles />} />}
        end={<Button size="sm" render={<a href="#sketch" />}>Get my free sketch</Button>}
        mobile={
          <>
            <SiteNav.MobileLink href="#services">Services</SiteNav.MobileLink>
            <SiteNav.MobileLink href="#work" current>
              Work
            </SiteNav.MobileLink>
          </>
        }
        mobileAction={<Button render={<a href="#sketch" />}>Get my free sketch</Button>}
      />
      <main>
        <a href="#page">Page link</a>
      </main>
    </div>
  ),
  play: async ({ canvasElement }) => {
    await expect(window.innerWidth).toBeLessThanOrEqual(400);
    // The bar never runs off the screen (N7: its main button gives way first when it can't fit).
    await expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(window.innerWidth);
    const trigger = within(canvasElement).getByRole("button", { name: "Menu" });
    await expect(trigger.getBoundingClientRect().height).toBeGreaterThanOrEqual(44);
    // N7 / QA #28: the visible word is the name, and it changes.
    await expect(trigger).toHaveTextContent("Menu");
    await expect(trigger).not.toHaveAttribute("aria-label");
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await expect(trigger).not.toHaveAttribute("aria-controls");

    trigger.click();
    const dialog = await within(document.body).findByRole("dialog", { name: "Menu" });
    await waitFor(() => expect(trigger).toHaveTextContent("Close"));
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    await expect(trigger).toHaveAttribute("aria-controls", dialog.id);
    // N6: focus moves to the first link; the page behind is inert and doesn't scroll.
    const services = within(dialog).getByRole("link", { name: "Services" });
    await waitFor(() => expect(services).toHaveFocus());
    await expect(canvasElement.querySelector("main")?.closest("[inert]")).not.toBeNull();
    await expect(document.body.style.overflow).toBe("hidden");
    // N2: the current page is marked by more than colour.
    const work = within(dialog).getByRole("link", { name: "Work" });
    await expect(work).toHaveAttribute("aria-current", "page");
    await expect(Number(getComputedStyle(work).fontWeight)).toBeGreaterThanOrEqual(600);
    // N5: rows are at least 56px tall.
    await expect(services.getBoundingClientRect().height).toBeGreaterThanOrEqual(56);
    // N8: the main action sits in the menu.
    await expect(within(dialog).getByRole("link", { name: "Get my free sketch" })).toBeInTheDocument();

    // Tab cycles through the panel and back to the bar's Close button, never into the page.
    for (let i = 0; i < 6; i++) {
      await userEvent.tab();
      const active = document.activeElement;
      await expect(dialog.contains(active) || canvasElement.querySelector("header")?.contains(active)).toBe(true);
    }

    // Escape closes and returns focus to the Menu button.
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(trigger).toHaveTextContent("Menu"));
    await waitFor(() => expect(trigger).toHaveFocus());
    await expect(trigger).not.toHaveAttribute("aria-controls");
    await expect(canvasElement.querySelector("[inert]")).toBeNull();

    // N6 / QA #25: tapping a link closes the menu. (The test frame mustn't navigate, so the click's
    // default is stopped at the document; the menu closes on the click itself.)
    const stayHere = (event: MouseEvent) => event.preventDefault();
    document.addEventListener("click", stayHere);
    trigger.click();
    const reopened = await within(document.body).findByRole("dialog", { name: "Menu" });
    await userEvent.click(within(reopened).getByRole("link", { name: "Services" }));
    await waitFor(() => expect(within(document.body).queryByRole("dialog", { name: "Menu" })).toBeNull());
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    document.removeEventListener("click", stayHere);
  },
};

export const MobileMenuAt320: Story = {
  name: "phone menu at 320: the bar's main button hides first, the Menu word stays (N7)",
  globals: { viewport: { value: "narrow320", isRotated: false } },
  parameters: {
    viewport: {
      options: {
        narrow320: { name: "320", styles: { width: "320px", height: "640px" }, type: "mobile" as const },
      },
    },
  },
  render: () => (
    <SiteNav
      placement="inline"
      state="expanded"
      start={<SiteNav.Brand href="#home">WhatMatters</SiteNav.Brand>}
      end={<Button size="sm" render={<a href="#sketch" />}>Get my free sketch</Button>}
      mobile={<SiteNav.MobileLink href="#services">Services</SiteNav.MobileLink>}
      mobileAction={<Button render={<a href="#sketch" />}>Get my free sketch</Button>}
    />
  ),
  play: async ({ canvasElement }) => {
    await expect(window.innerWidth).toBeLessThanOrEqual(330);
    const trigger = within(canvasElement).getByRole("button", { name: "Menu" });
    await expect(trigger).toBeVisible();
    await expect(trigger.getBoundingClientRect().right).toBeLessThanOrEqual(window.innerWidth);
    await expect(within(canvasElement).queryByRole("link", { name: "Get my free sketch" })).toBeNull();
    await expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(window.innerWidth);
  },
};

export const MobileMenuTrailingEdge: Story = {
  name: "phone bar: the actions and Menu sit at the trailing edge",
  globals: { viewport: { value: "mobile", isRotated: false } },
  render: () => (
    <SiteNav
      placement="inline"
      state="expanded"
      start={<SiteNav.Brand href="#home">WhatMatters</SiteNav.Brand>}
      middle={
        <SiteNav.Links>
          <SiteNav.Link href="#services">Services</SiteNav.Link>
        </SiteNav.Links>
      }
      end={<Button size="sm" render={<a href="#sketch" />}>Book</Button>}
      mobile={<SiteNav.MobileLink href="#services">Services</SiteNav.MobileLink>}
      mobileAction={<Button render={<a href="#sketch" />}>Book</Button>}
    />
  ),
  play: async ({ canvasElement }) => {
    const header = within(canvasElement).getByRole("banner");
    const trigger = within(canvasElement).getByRole("button", { name: "Menu" });
    const book = within(canvasElement).getByRole("link", { name: "Book" });
    const edge = header.querySelector("[data-state]")!.getBoundingClientRect().right;
    // The Menu button ends near the bar's inner edge, and the short CTA still fits beside it.
    await expect(edge - trigger.getBoundingClientRect().right).toBeLessThanOrEqual(32);
    await expect(book).toBeVisible();
  },
};
