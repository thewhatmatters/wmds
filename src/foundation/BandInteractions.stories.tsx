import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { Band } from "../components/atoms/Band/Band";
import { Button } from "../components/atoms/Button/Button";
import { ThemeAClientExample } from "./BrandKit.stories";

/**
 * Browser interaction tests for Band tones and the brand kit — run via `npm run test:interactions`.
 */
const meta = {
  title: "Internal/Interactions/Band",
  tags: ["test", "!dev", "!autodocs"],
  parameters: {
    docs: { disable: true },
    wmdsLayout: "fullscreen",
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const style = (element: Element) => getComputedStyle(element);

export const TonesRemapRoles: Story = {
  name: "tones remap the roles every component inside reads",
  render: () => (
    <div>
      <Band tone="inverse" aria-label="inverse">
        <p className="text-fg">On the brand surface</p>
        <Button role="secondary">Secondary</Button>
      </Band>
      <Band tone="field" aria-label="field">
        <p className="text-muted">On the field</p>
      </Band>
    </div>
  ),
  play: async ({ canvas }) => {
    const inverse = canvas.getByRole("region", { name: "inverse" });
    const field = canvas.getByRole("region", { name: "field" });
    // Defaults: the navy brand surface with white ink; the field is the primary pair.
    expect(style(inverse).backgroundColor).toBe("rgb(1, 18, 114)");
    expect(style(canvas.getByText("On the brand surface")).color).toBe("rgb(255, 255, 255)");
    expect(inverse.getAttribute("data-theme")).toBe("dark");
    expect(style(field).backgroundColor).toBe("rgb(57, 72, 92)");
    // The muted step on the field defaults to the ink itself.
    expect(style(canvas.getByText("On the field")).color).toBe("rgb(250, 250, 250)");
    // A secondary button's label follows the tone, not the page's dark ink.
    expect(style(canvas.getByRole("button", { name: "Secondary" })).color).toBe("rgb(255, 255, 255)");
  },
};

export const BleedInsideGridPage: Story = {
  name: "inside a grid-page a band bleeds to the edges and keeps the page's columns",
  render: () => (
    <main className="grid-page">
      <p className="col-start-1 col-end-2" data-testid="page-col">
        Page
      </p>
      <Band tone="inverse" aria-label="bleed">
        <p className="col-start-1 col-end-2" data-testid="band-col">
          Band
        </p>
      </Band>
    </main>
  ),
  play: async ({ canvas }) => {
    const page = canvas.getByTestId("page-col").getBoundingClientRect();
    const band = canvas.getByTestId("band-col").getBoundingClientRect();
    expect(Math.round(band.left)).toBe(Math.round(page.left));
    expect(Math.round(band.width)).toBe(Math.round(page.width));
    // The bleed paints past the page edges without making the page scroll sideways.
    const outset = parseFloat(style(canvas.getByRole("region", { name: "bleed" })).borderImageOutset.split(" ")[1]);
    expect(outset).toBeGreaterThanOrEqual(Math.max(window.innerWidth, window.innerHeight));
    expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(document.documentElement.clientWidth);
  },
};

export const ClientBrandKit: Story = {
  name: "a client's brand kit reaches display type, tones and primary controls",
  render: () => <ThemeAClientExample />,
  play: async ({ canvas }) => {
    const hero = style(canvas.getByTestId("client-hero"));
    expect(hero.fontFamily).toContain("Anton");
    expect(hero.fontWeight).toBe("400");
    expect(hero.textTransform).toBe("uppercase");
    expect(hero.color).toBe("rgb(243, 227, 195)");
    expect(style(canvas.getByRole("region", { name: "Tacos for forty" })).backgroundColor).toBe("rgb(18, 13, 8)");
    expect(style(canvas.getByRole("region", { name: "Booking October" })).backgroundColor).toBe("rgb(226, 82, 43)");
    // Inside the inverse band, primary takes the client's dark value.
    expect(style(canvas.getByRole("button", { name: "Book a date" })).backgroundColor).toBe("rgb(232, 106, 62)");
    expect(canvas.queryAllByText("Fail")).toHaveLength(0);
  },
};
