import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { Button } from "../../atoms/Button/Button";
import { MapLink } from "./MapLink";

/**
 * Browser interaction tests for MapLink — run via `npm run test:interactions`.
 */
const meta = {
  title: "Internal/Interactions/MapLink",
  tags: ["test", "!dev", "!autodocs"],
  parameters: {
    docs: { disable: true },
    wmdsLayout: "fullscreen",
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const viewports = {
  phone390: { name: "Phone 390", styles: { width: "390px", height: "844px" }, type: "mobile" as const },
  desktop1280: { name: "Desktop 1280", styles: { width: "1280px", height: "800px" }, type: "desktop" as const },
};

const box = (element: Element) => element.getBoundingClientRect();

const towns = ["Round Rock", "Cedar Park", "Leander", "Georgetown", "Pflugerville", "Hutto", "Taylor", "Liberty Hill"];

export const VisitOnAPhone: Story = {
  name: "On a phone: the address wraps, the buttons stay in reach",
  globals: { viewport: { value: "phone390", isRotated: false } },
  parameters: { viewport: { options: viewports } },
  render: () => (
    <div className="p-4">
      <MapLink
        address={"1201 South Lamar Boulevard, Suite 200\nAustin, TX 78704"}
        place="Busby's, 1201 S Lamar Blvd, Austin, TX 78704"
        actions={
          <Button role="outline" render={<a href="tel:+15125550100" />}>
            Call (512) 555-0100
          </Button>
        }
      />
    </div>
  ),
  play: async ({ canvas, canvasElement }) => {
    const link = canvas.getByRole("link", { name: /Get directions/ });
    await expect(link).toHaveAttribute(
      "href",
      "https://www.google.com/maps/dir/?api=1&destination=Busby's%2C%201201%20S%20Lamar%20Blvd%2C%20Austin%2C%20TX%2078704",
    );
    // Same tab: a phone hands the link to its maps app.
    await expect(link).not.toHaveAttribute("target");

    // The typed line break holds, and the town sits under the street.
    const address = canvasElement.querySelector("address")!;
    await expect(getComputedStyle(address).fontStyle).toBe("normal");
    await expect(box(address).height).toBeGreaterThan(parseFloat(getComputedStyle(address).lineHeight) * 1.5);

    // Both actions are tall enough for a thumb and inside the screen.
    const call = canvas.getByRole("link", { name: /Call/ });
    for (const action of [link, call]) {
      await expect(box(action).height).toBeGreaterThanOrEqual(44);
      await expect(box(action).right).toBeLessThanOrEqual(390);
    }
    await expect(box(link).top).toBeGreaterThan(box(address).bottom);
    await expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(document.documentElement.clientWidth);
  },
};

export const AreasWrap: Story = {
  name: "On a phone: the towns wrap inside the screen",
  globals: { viewport: { value: "phone390", isRotated: false } },
  parameters: { viewport: { options: viewports } },
  render: () => (
    <div className="p-4">
      <MapLink place="Round Rock, TX" mode="search" role="outline" areas={towns} areasLabel="Towns we serve" />
    </div>
  ),
  play: async ({ canvas }) => {
    const list = canvas.getByRole("list", { name: "Towns we serve" });
    const items = [...list.querySelectorAll("li")];
    await expect(items).toHaveLength(towns.length);
    // More than one row, and no town past the screen's edge.
    await expect(new Set(items.map((item) => Math.round(box(item).top))).size).toBeGreaterThan(1);
    for (const item of items) {
      await expect(box(item).right).toBeLessThanOrEqual(390);
    }
    const link = canvas.getByRole("link", { name: /See it on the map/ });
    await expect(link).toHaveAttribute("href", "https://www.google.com/maps/search/?api=1&query=Round%20Rock%2C%20TX");
    await expect(box(link).top).toBeGreaterThan(box(list).bottom);
    await expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(document.documentElement.clientWidth);
  },
};

export const NewTabSaysSo: Story = {
  name: "A new tab is announced in the link's name",
  globals: { viewport: { value: "desktop1280", isRotated: false } },
  parameters: { viewport: { options: viewports } },
  render: () => (
    <div className="p-6">
      <MapLink address="88 Main St, Round Rock, TX 78664" provider="apple" newTab />
    </div>
  ),
  play: async ({ canvas }) => {
    const link = canvas.getByRole("link", { name: /Get directions.*new tab/i });
    await expect(link).toHaveAttribute("target", "_blank");
    await expect(link.getAttribute("rel")).toContain("noopener");
    await expect(link).toHaveAttribute("href", "https://maps.apple.com/?daddr=88%20Main%20St%2C%20Round%20Rock%2C%20TX%2078664");
    link.focus();
    await expect(link).toHaveFocus();
  },
};
