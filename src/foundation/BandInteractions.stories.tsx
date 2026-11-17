import type { CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Band } from "../components/atoms/Band/Band";
import { Button } from "../components/atoms/Button/Button";
import { Checkbox } from "../components/atoms/Checkbox/Checkbox";
import { Input } from "../components/atoms/Input/Input";
import { Switch } from "../components/atoms/Switch/Switch";
import { contrastRatio, mixSrgb } from "../lib/contrast";
import { PageColourExample, ThemeAClientExample } from "./BrandKit.stories";
import { brandKitPaper } from "./brandKitClient";

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

/** A computed colour (`rgb()`, `rgba()` or `color(srgb …)`) as opaque hex. */
function hex(computed: string) {
  const srgb = computed.match(/color\(srgb ([\d.]+) ([\d.]+) ([\d.]+)/);
  const channels = srgb
    ? srgb.slice(1, 4).map((value) => Math.round(Number(value) * 255))
    : (computed.match(/[\d.]+/g) ?? []).slice(0, 3).map(Number);
  if (channels.length !== 3 || channels.some(Number.isNaN)) throw new Error(`Unreadable colour: ${computed}`);
  return `#${channels.map((value) => value.toString(16).padStart(2, "0")).join("")}`;
}

/** Resolve a colour token in a scope: paint a probe with it and read the computed value back. */
function token(scope: Element, name: string) {
  const probe = scope.ownerDocument.createElement("span");
  probe.style.backgroundColor = `var(${name})`;
  scope.append(probe);
  const value = hex(getComputedStyle(probe).backgroundColor);
  probe.remove();
  return value;
}

/** A primary, a disabled primary and checked controls on one tone, for the measurements below. */
function PrimarySpecimen({ tone }: { tone: "inverse" | "field" }) {
  return (
    <Band tone={tone} aria-label={tone}>
      <div className="col-span-full flex flex-wrap items-center gap-3">
        <Button role="primary">Book a table</Button>
        <Button role="primary" disabled>
          Sold out
        </Button>
        <Checkbox label="Remember me" defaultChecked />
        <Switch label="Reminders" defaultChecked />
      </div>
    </Band>
  );
}

/** The primary on a tone reads enabled: AA label in every state, a fill that stands off the band, distinct states. */
function expectEnabledPrimary(canvas: ReturnType<typeof within>, canvasElement: HTMLElement, tone: string) {
  const band = canvas.getByRole("region", { name: tone });
  const page = hex(style(band).backgroundColor);
  const fill = token(band, "--color-primary");
  const label = token(band, "--color-on-primary");
  const hover = token(band, "--color-primary-hover");
  const active = token(band, "--color-primary-active");
  const ring = token(band, "--color-focus-ring");
  const ratios = {
    fillOnBand: contrastRatio(fill, page),
    label: contrastRatio(label, fill),
    labelOnHover: contrastRatio(label, hover),
    labelOnActive: contrastRatio(label, active),
    ringOnBand: contrastRatio(ring, page),
  };
  // Logged so a run records the measured values.
  console.info(`${tone} primary`, { page, fill, label, hover, active, ring, ratios });

  // The button is the token pair it claims to be.
  const button = canvas.getByRole("button", { name: "Book a table" });
  expect(hex(style(button).backgroundColor)).toBe(fill);
  expect(hex(style(button).color)).toBe(label);
  // Enabled: a fill that stands off the band (3:1, a control's edge) and an AA label in every state.
  expect(ratios.fillOnBand).toBeGreaterThanOrEqual(3);
  expect(ratios.label).toBeGreaterThanOrEqual(4.5);
  expect(ratios.labelOnHover).toBeGreaterThanOrEqual(4.5);
  expect(ratios.labelOnActive).toBeGreaterThanOrEqual(4.5);
  expect(ratios.ringOnBand).toBeGreaterThanOrEqual(3);
  // Rest, hover and active are three different fills.
  expect(new Set([fill, hover, active]).size).toBe(3);
  // Synthetic pointer events don't set :hover, so check the Button paints those tokens.
  expect(button.className).toContain("hover:bg-primary-hover");
  expect(button.className).toContain("active:bg-primary-active");

  // Disabled: drawn at the Button's opacity over the band, visibly dimmer, label still 3:1 (U6).
  const disabled = canvas.getByRole("button", { name: "Sold out" });
  const opacity = Number(style(disabled).opacity);
  expect(opacity).toBeLessThan(1);
  const dimFill = mixSrgb(fill, opacity, page);
  const dimLabel = mixSrgb(label, opacity, page);
  expect(contrastRatio(dimLabel, dimFill)).toBeGreaterThanOrEqual(3);
  expect(contrastRatio(fill, dimFill)).toBeGreaterThan(1.2);

  // Checked controls read the same primary: their fill stands off the band too.
  for (const name of ["Remember me", "Reminders"]) {
    const control = canvas.getByRole(name === "Reminders" ? "switch" : "checkbox", { name });
    const filled = control.closest("label")?.querySelector('[class*="bg-primary"]') ?? canvasElement.querySelector('[class*="bg-primary"]');
    expect(filled).not.toBeNull();
    expect(contrastRatio(hex(style(filled!).backgroundColor), page)).toBeGreaterThanOrEqual(3);
  }
}

export const InversePrimary: Story = {
  name: "on an inverse band the primary reads enabled: AA label, 3:1 fill, distinct states",
  render: () => <PrimarySpecimen tone="inverse" />,
  play: async ({ canvas, canvasElement }) => expectEnabledPrimary(canvas, canvasElement, "inverse"),
};

export const FieldPrimary: Story = {
  name: "on a field band the primary reads enabled: AA label, 3:1 fill, distinct states",
  render: () => <PrimarySpecimen tone="field" />,
  play: async ({ canvas, canvasElement }) => expectEnabledPrimary(canvas, canvasElement, "field"),
};

export const FieldPrimaryDark: Story = {
  name: "on a field band in a dark page the primary reads enabled too",
  render: () => (
    <div data-theme="dark">
      <PrimarySpecimen tone="field" />
    </div>
  ),
  play: async ({ canvas, canvasElement }) => expectEnabledPrimary(canvas, canvasElement, "field"),
};

const paperOnly = { "--color-paper": brandKitPaper.paper } as CSSProperties;
const paperKit = {
  "--color-paper": brandKitPaper.paper,
  "--color-on-paper": brandKitPaper.ink,
  "--color-on-paper-muted": brandKitPaper.muted,
  "--color-paper-rule": brandKitPaper.rule,
} as CSSProperties;

/** One page in a theme, with the roles the page-colour knobs feed. */
function PaperSpecimen({ name, theme, knobs }: { name: string; theme: "light" | "dark" | "soft"; knobs?: CSSProperties }) {
  return (
    <div data-theme={theme} data-testid={name} style={knobs} className="bg-body p-4">
      <p className="text-fg" data-testid={`${name}-ink`}>
        Ink
      </p>
      <p className="text-muted" data-testid={`${name}-muted`}>
        Muted
      </p>
      <div className="border-b border-border" data-testid={`${name}-rule`} />
      <div className="border-b border-border-emphasized" data-testid={`${name}-strong-rule`} />
      <div className="bg-surface p-2" data-testid={`${name}-surface`}>
        <Input aria-label={`${name} name`} placeholder="Your name" />
      </div>
    </div>
  );
}

export const PageColourKnobs: Story = {
  name: "the page-colour knobs set the light page, its text and rules; unset, the WMDS greys stay",
  render: () => (
    <div>
      <PaperSpecimen name="plain" theme="light" />
      <PaperSpecimen name="paper" theme="light" knobs={paperOnly} />
      <PaperSpecimen name="kit" theme="light" knobs={paperKit} />
      <PaperSpecimen name="dark" theme="dark" knobs={paperKit} />
      <PaperSpecimen name="soft" theme="soft" knobs={paperKit} />
    </div>
  ),
  play: async ({ canvas }) => {
    const read = (name: string) => ({
      page: hex(style(canvas.getByTestId(name)).backgroundColor),
      ink: hex(style(canvas.getByTestId(`${name}-ink`)).color),
      muted: hex(style(canvas.getByTestId(`${name}-muted`)).color),
      strongRule: hex(style(canvas.getByTestId(`${name}-strong-rule`)).borderBottomColor),
      surface: hex(style(canvas.getByTestId(`${name}-surface`)).backgroundColor),
      control: token(canvas.getByTestId(name), "--color-border-control"),
      placeholder: token(canvas.getByTestId(name), "--color-text-placeholder"),
    });

    // No knob set: every derived step is invalid, so each role is the WMDS grey it always was.
    const plain = read("plain");
    expect(plain).toEqual({
      page: "#f8f8f8",
      ink: "#171717",
      muted: "#404040",
      strongRule: "#d9d9d9",
      surface: "#ffffff",
      control: "#8c8c8c",
      placeholder: "#6e6e6e",
    });
    expect(style(canvas.getByTestId("plain-rule")).borderBottomColor).toBe("rgba(42, 36, 28, 0.06)");

    // The paper alone: the WMDS ink stays, and the muted text, rules and control edges mix it into the paper.
    const paper = read("paper");
    expect(paper.page).toBe(brandKitPaper.paper);
    expect(paper.ink).toBe("#171717");
    expect(paper.muted).toBe(mixSrgb("#171717", 0.72, brandKitPaper.paper));
    expect(paper.strongRule).toBe(mixSrgb("#171717", 0.16, brandKitPaper.paper));
    expect(paper.surface).toBe("#ffffff");
    expect(contrastRatio(paper.muted, paper.page)).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(paper.placeholder, paper.page)).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(paper.control, paper.page)).toBeGreaterThanOrEqual(3);
    // The hairline keeps its own value until the brand sets a rule.
    expect(style(canvas.getByTestId("paper-rule")).borderBottomColor).toBe("rgba(42, 36, 28, 0.06)");

    // The whole kit: each knob lands on its role.
    const kit = read("kit");
    expect(kit.page).toBe(brandKitPaper.paper);
    expect(kit.ink).toBe(brandKitPaper.ink);
    expect(kit.muted).toBe(brandKitPaper.muted);
    expect(kit.strongRule).toBe(brandKitPaper.rule);
    expect(hex(style(canvas.getByTestId("kit-rule")).borderBottomColor)).toBe(brandKitPaper.rule);
    expect(contrastRatio(kit.control, kit.page)).toBeGreaterThanOrEqual(3);

    // Dark and soft keep their own page and ink, whatever the knobs say.
    expect(read("dark").page).toBe("#1b1b1b");
    expect(read("dark").ink).not.toBe(brandKitPaper.ink);
    expect(read("soft").page).toBe("#f3eee6");
    expect(read("soft").muted).not.toBe(brandKitPaper.muted);
  },
};

export const PageColourSpecimen: Story = {
  name: "on a client's paper a band keeps its tone, and nothing scrolls sideways",
  render: () => <PageColourExample />,
  play: async ({ canvas }) => {
    const page = canvas.getByTestId("paper-page");
    expect(hex(style(page).backgroundColor)).toBe(brandKitPaper.paper);
    expect(hex(style(canvas.getByRole("heading", { name: "Open late, most nights" })).color)).toBe(brandKitPaper.ink);
    // The inverse band inside is still the navy with white ink.
    const band = canvas.getByRole("region", { name: "A dark section stays a Band" });
    expect(style(band).backgroundColor).toBe("rgb(1, 18, 114)");
    expect(style(canvas.getByRole("heading", { name: "A dark section stays a Band" })).color).toBe("rgb(255, 255, 255)");
    expect(page.scrollWidth).toBeLessThanOrEqual(page.clientWidth);
  },
};
