import type { Meta, StoryObj } from "@storybook/react-vite";
import { storyMetaDocsDefaults, withStoryCopySource } from "../../../lib/storyCopySource";
import { Button } from "../Button/Button";
import { Card } from "../../molecules/Card/Card";
import { Band, bandSpacings, bandTones } from "./Band";

const meta = {
  title: "Components/Band",
  component: Band,
  tags: ["autodocs"],
  ...storyMetaDocsDefaults(),
  argTypes: {
    tone: { control: "inline-radio", options: [...bandTones] },
    spacing: { control: "inline-radio", options: [...bandSpacings] },
    children: { control: false },
  },
  args: {
    tone: "inverse",
    spacing: "md",
    children: null,
  },
  parameters: {
    wmdsLayout: "fullscreen",
    docs: {
      description: {
        component: `
## Usage

A full-bleed page section in one of the brand kit's tones. Its \`tone\` sets \`data-tone\`, which remaps the surface, text, border and fill roles the way \`data-theme\` swaps the palette, so every WMDS component inside re-skins with no \`className\`.

| Tone | Colours | Use |
|------|---------|-----|
| \`default\` | The page's own | A plain section on the page's columns |
| \`inverse\` | \`--color-brand-surface\` / \`--color-on-brand-surface\` | A dark section in the brand's colour (heroes, a closing call to action). Also \`data-theme="dark"\`, so status, chart and focus roles take their dark values |
| \`field\` | \`--color-field\` / \`--color-on-field\` | One saturated section colour (an offer, a highlight). Cards sit flat on it |

An app sets the colours once in \`brand.css\` (**Foundations/Brand kit**). Defaults: the WhatMatters navy for \`inverse\`, the primary for \`field\`.

## Anatomy

\`\`\`
Band (section, data-band, data-tone)
└── grid-page — the shared --grid-* columns, margins and max width
    └── children, placed with col-span-* / col-start-*
\`\`\`

**Standing alone** (a sibling of other sections), Band is a full-width section and its \`grid-page\` centres the columns. **Inside a \`grid-page\`**, it spans every column, paints its colour out to the viewport edges, and its inner page becomes a subgrid, so its columns are the page's. The bleed never adds a horizontal scrollbar.

| Prop | Values |
|------|--------|
| \`spacing\` | \`md\` (default, 48px above and below), \`lg\` (96px, a hero), \`none\` |
| \`as\` | \`section\` (default), \`div\`, \`header\`, \`footer\`, \`aside\` |

## Best practices

- **Do** name a \`section\` band with \`aria-labelledby\` (its heading) when it's a landmark people jump to.
- **Do** use one \`field\` band per page at most — it's the loud moment.
- **Don't** re-colour what's inside with \`className\`; change the tone, or the app's brand-kit colours.
- **Don't** put validation messages on a \`field\` band: status colours aren't remapped there.
- **Don't** nest a \`default\` band in a toned one to get the page colours back — close the toned band instead.
        `.trim(),
      },
    },
  },
} satisfies Meta<typeof Band>;

export default meta;
type Story = StoryObj<typeof meta>;

function ToneContent({ heading }: { heading: string }) {
  return (
    <div className="col-span-full flex flex-col gap-4 md:col-span-6">
      <h2 className="type-display-2 text-fg">{heading}</h2>
      <p className="type-reading text-muted">Every component inside follows the tone: text, borders, buttons and cards.</p>
      <div className="flex flex-wrap gap-2">
        <Button role="primary">Book a table</Button>
        <Button role="secondary">See the menu</Button>
      </div>
    </div>
  );
}

export const Playground: Story = {
  render: (args) => (
    <Band {...args}>
      <ToneContent heading="A band in a tone" />
    </Band>
  ),
};

export const Tones: Story = {
  name: "Reference — tones",
  render: () => (
    <div>
      {bandTones.map((tone) => (
        <Band key={tone} tone={tone} aria-label={`tone ${tone}`}>
          <ToneContent heading={`tone="${tone}"`} />
          <Card padding="md" className="col-span-full md:col-span-6 lg:col-span-4">
            <p className="type-label text-fg">A card</p>
            <p className="type-supporting text-muted">Lifts on inverse, sits flat on field.</p>
          </Card>
        </Band>
      ))}
    </div>
  ),
};

export const PageInBands: Story = {
  name: "Pattern — page in bands",
  render: () => <PageInBandsExample />,
  parameters: withStoryCopySource(
    {
      docs: {
        description: {
          story:
            "A page on one `grid-page` with bands inside it: each band spans the columns, paints to the viewport edges, and its content stays on the page's columns. The column guides line up through every band.",
        },
      },
    },
    `
import { Band, Button } from "@thewhatmatters/wmds";

export function PageInBandsExample() {
  return (
    <main className="grid-page !py-0">
      <Band tone="inverse" spacing="lg" aria-labelledby="hero-title">
        <div className="col-span-full flex flex-col gap-6 lg:col-span-10">
          <h1 id="hero-title" className="type-display-hero text-fg">
            Smoke and chili
          </h1>
          <p className="type-reading text-muted">Wood-fired tacos on East Cesar Chavez, open late.</p>
          <div className="flex flex-wrap gap-2">
            <Button role="primary">Book a table</Button>
            <Button role="secondary">See the menu</Button>
          </div>
        </div>
      </Band>
      <Band aria-labelledby="menu-title">
        <h2 id="menu-title" className="type-display-xl col-span-full text-fg">
          The menu
        </h2>
        <p className="type-reading col-span-full text-muted md:col-span-4">Six tacos, two salsas, one mezcal list.</p>
      </Band>
      <Band tone="field" aria-labelledby="catering-title">
        <h2 id="catering-title" className="type-display-1 col-span-full text-fg md:col-span-6">
          Catering for forty
        </h2>
        <div className="col-span-full flex flex-col items-start gap-4 md:col-span-2">
          <p className="type-body text-fg">From $1,500, staff included.</p>
          <Button role="outline">Ask for a date</Button>
        </div>
      </Band>
    </main>
  );
}
`,
  ),
};

export function PageInBandsExample() {
  return (
    <main className="grid-page !py-0">
      <Band tone="inverse" spacing="lg" aria-labelledby="hero-title">
        <div className="col-span-full flex flex-col gap-6 lg:col-span-10">
          <h1 id="hero-title" className="type-display-hero text-fg">
            Smoke and chili
          </h1>
          <p className="type-reading text-muted">Wood-fired tacos on East Cesar Chavez, open late.</p>
          <div className="flex flex-wrap gap-2">
            <Button role="primary">Book a table</Button>
            <Button role="secondary">See the menu</Button>
          </div>
        </div>
      </Band>
      <Band aria-labelledby="menu-title">
        <h2 id="menu-title" className="type-display-xl col-span-full text-fg">
          The menu
        </h2>
        <p className="type-reading col-span-full text-muted md:col-span-4">Six tacos, two salsas, one mezcal list.</p>
      </Band>
      <Band tone="field" aria-labelledby="catering-title">
        <h2 id="catering-title" className="type-display-1 col-span-full text-fg md:col-span-6">
          Catering for forty
        </h2>
        <div className="col-span-full flex flex-col items-start gap-4 md:col-span-2">
          <p className="type-body text-fg">From $1,500, staff included.</p>
          <Button role="outline">Ask for a date</Button>
        </div>
      </Band>
    </main>
  );
}
