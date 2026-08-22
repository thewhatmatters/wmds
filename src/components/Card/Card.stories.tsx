import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../Button/Button";
import { Card, type CardElevation, type CardPadding, type CardVariant } from "./Card";

const variants: CardVariant[] = ["surface", "outlined", "ghost"];
const elevations: CardElevation[] = ["none", "sm", "md", "raised"];
const paddings: CardPadding[] = ["none", "sm", "md", "lg"];

const sampleTitle = "Card title";
const sampleBody =
  "Card content goes here. Use variants for surface treatment, elevation for depth, and padding for density.";

const meta = {
  title: "Components/Card",
  component: Card,
  tags: ["autodocs"],
  argTypes: {
    variant: { control: "select", options: variants },
    elevation: { control: "select", options: elevations },
    padding: { control: "select", options: paddings },
    as: { control: "select", options: ["div", "article", "section"] },
  },
  args: {
    variant: "surface",
    elevation: "md",
    padding: "md",
    as: "div",
    children: sampleBody,
  },
  parameters: {
    docs: {
      description: {
        component:
          "WMDS card — token-driven surface, border, shadow, and spacing. " +
          "Compose with `Card.Header`, `Card.Body`, `Card.Footer`, and `Card.Divider` for divided layouts (set `padding=\"none\"` on the root). " +
          "Elevation maps to `--shadow-*` tokens, similar to Astryx's graded `elevation` prop.",
      },
    },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <Card {...args} className="max-w-sm">
      {args.padding === "none" ? (
        <>
          <Card.Header>
            <h2 className="text-sm font-semibold leading-[var(--line-height-sm)]">{sampleTitle}</h2>
          </Card.Header>
          <Card.Body>
            <p className="text-sm leading-[var(--line-height-sm)] text-muted">{sampleBody}</p>
          </Card.Body>
        </>
      ) : (
        <>
          <h2 className="mb-2 text-sm font-semibold leading-[var(--line-height-sm)]">{sampleTitle}</h2>
          <p className="text-sm leading-[var(--line-height-sm)] text-muted">{sampleBody}</p>
        </>
      )}
    </Card>
  ),
};

export const Variants: Story = {
  name: "Variants",
  parameters: {
    docs: {
      description: {
        story:
          "Surface (default) uses `--color-surface`. Outlined sits on `--color-bg` with a border. Ghost is transparent — pair with elevation when you need separation.",
      },
    },
  },
  render: () => (
    <div className="flex flex-wrap items-start gap-4">
      {variants.map((variant) => (
        <Card key={variant} variant={variant} elevation="md" padding="md" className="w-56">
          <h3 className="mb-1 text-sm font-semibold capitalize">{variant}</h3>
          <p className="text-sm text-muted">{sampleBody}</p>
        </Card>
      ))}
    </div>
  ),
};

export const Elevation: Story = {
  name: "Elevation",
  parameters: {
    docs: {
      description: {
        story:
          "Graded depth via shadow tokens — flat by default (`none`), raise only when the surface needs to read above the page. Maps to Astryx `none | low | med` (we use `sm | md | raised`).",
      },
    },
  },
  render: () => (
    <div className="flex flex-wrap items-start gap-4 rounded-lg bg-bg p-6">
      {elevations.map((elevation) => (
        <Card key={elevation} variant="surface" elevation={elevation} padding="md" className="w-44">
          <p className="text-xs font-medium uppercase tracking-wider text-muted">{elevation}</p>
          <p className="mt-1 text-sm">{sampleBody.slice(0, 48)}…</p>
        </Card>
      ))}
    </div>
  ),
};

export const Padding: Story = {
  name: "Padding",
  render: () => (
    <div className="flex flex-wrap items-start gap-4">
      {paddings.map((padding) => (
        <Card key={padding} variant="outlined" elevation="raised" padding={padding} className="w-52">
          {padding === "none" ? (
            <>
              <Card.Header>
                <p className="text-xs font-medium uppercase tracking-wider text-muted">{padding}</p>
              </Card.Header>
              <Card.Divider />
              <Card.Body>
                <p className="text-sm text-muted">Section padding when root is `none`.</p>
              </Card.Body>
            </>
          ) : (
            <>
              <p className="text-xs font-medium uppercase tracking-wider text-muted">{padding}</p>
              <p className="mt-2 text-sm text-muted">Uniform container padding.</p>
            </>
          )}
        </Card>
      ))}
    </div>
  ),
};

export const Composition: Story = {
  name: "Composition",
  parameters: {
    docs: {
      description: {
        story:
          "Divided card with header, body, and footer — the pattern RestockCard uses. Root `padding=\"none\"` lets dividers span edge to edge.",
      },
    },
  },
  render: () => (
    <Card variant="surface" elevation="md" padding="none" className="max-w-sm">
      <Card.Header>
        <h2 className="text-sm font-semibold leading-[var(--line-height-sm)]">
          Want me to place this restock order?
        </h2>
        <p className="text-sm leading-[var(--line-height-sm)] text-muted">
          Reorder waffle cones from Cone King with lead time 7 days.
        </p>
      </Card.Header>
      <Card.Divider />
      <Card.Body>
        <p className="text-xs font-medium uppercase tracking-wider text-muted">Other options</p>
        <p className="mt-2 text-sm">Switch to Vanilla Madagascar</p>
      </Card.Body>
      <Card.Footer>
        <span className="text-sm text-muted">High confidence</span>
        <div className="flex gap-2">
          <Button variant="secondary" size="xs">
            Alternatives
          </Button>
          <Button variant="success" size="xs">
            Accepted
          </Button>
        </div>
      </Card.Footer>
    </Card>
  ),
};

export const VariantElevationMatrix: Story = {
  name: "Variant × elevation",
  render: () => (
    <div className="grid grid-cols-[5rem_repeat(4,1fr)] items-start gap-x-4 gap-y-4 rounded-lg bg-bg p-4">
      <span />
      {elevations.map((elevation) => (
        <span key={elevation} className="text-center text-xs tracking-wide text-muted uppercase">
          {elevation}
        </span>
      ))}
      {variants.flatMap((variant) => [
        <span key={`${variant}-label`} className="text-sm capitalize text-fg">
          {variant}
        </span>,
        ...elevations.map((elevation) => (
          <Card
            key={`${variant}-${elevation}`}
            variant={variant}
            elevation={elevation}
            padding="sm"
            className="min-h-20"
          >
            <p className="text-xs text-muted">Label</p>
          </Card>
        )),
      ])}
    </div>
  ),
};
