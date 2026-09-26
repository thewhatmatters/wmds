import type { Meta, StoryObj } from "@storybook/react-vite";
import { storyMetaDocsDefaults, withStoryCopySource } from "../../../lib/storyCopySource";
import {
  HeroTileStack,
  heroTileStackDefaultStrength,
  type HeroTileStackTile,
} from "./HeroTileStack";

const heroTiles: HeroTileStackTile[] = [
  { src: "/hero-tiles/plan.svg", alt: "Weekly plan on a lime tile" },
  { src: "/hero-tiles/focus.svg", alt: "Blue focus card" },
  { src: "/hero-tiles/week.svg", alt: "Abstract shapes for the week" },
  { src: "/hero-tiles/note.svg", alt: "A pale note about what matters" },
];

const meta = {
  title: "Components/Layout/HeroTileStack",
  component: HeroTileStack,
  tags: ["autodocs"],
  args: {
    tiles: heroTiles,
    strength: heroTileStackDefaultStrength,
  },
  ...storyMetaDocsDefaults(),
  parameters: {
    docs: {
      description: {
        component: `
## Usage

Marketing hero fan. Pass \`tiles\` (\`src\` and \`alt\`, plus optional resting \`offsetX\`, \`offsetY\`, \`rotate\`, and \`zIndex\`). While a fine pointer is over the stack, every card springs away from that point. Closer cards travel farther, and the push adds tilt. Leaving the stack springs the cards back to the resting fan. There is no scale change, dimming, reorder, click action, or idle motion.

\`strength\` multiplies the push. The default is the full scatter — cards near the pointer can leave the viewport. Pass a lower number for a softer fan. \`0\` holds the resting stack. \`spring\` overrides stiffness, damping, and mass.

\`prefers-reduced-motion\`, and \`MotionConfig\` \`reducedMotion="always"\`, render the resting fan and ignore the pointer.

A coarse pointer or a touch tap scatters once from the tap point, holds briefly, then springs back.

The root clips the inline axis (\`overflow-x: clip\`) so the scatter cannot open a horizontal scrollbar. The row does not clip, and the block axis stays visible so cards can leave the stack vertically.

## Anatomy

\`\`\`
HeroTileStack — full width, overflow-x clip, overflow-y visible
└── row — resting hit area, overflow visible
    └── slot — resting offset, z-index (stays put)
        └── surface — --radius-card-shell, shadow-soft-card
            └── img (alt)
            x / y / rotate springs — scatter only
\`\`\`

## Best practices

- Give every image an \`alt\`. The scatter is decorative: it does not trap focus and it does not hide the images.
- Place **HeroTileStack** in a full-width hero. The component clips inline overflow. Do not add \`overflow-hidden\` on the stack — that clips the scatter and can turn the block axis into a scroll container.
- The first four tiles use the default fan (alternating tilt, a small vertical nudge, later tiles in front). Override \`rotate\`, \`offsetX\`, \`offsetY\`, or \`zIndex\` per tile when the fan should differ.
- Default \`strength\` is the wild scatter. Use the **Strength** story to pick a softer value, then pass that number.
- Shadows travel with the cards. The surface uses \`shadow-soft-card\` and \`--radius-card-shell\`.
        `.trim(),
      },
    },
  },
} satisfies Meta<typeof HeroTileStack>;

export default meta;
type Story = StoryObj<typeof meta>;

const marketingHeroCopySource = `
import { HeroTileStack } from "@whatmatters/wmds";

const tiles = [
  { src: "/hero-tiles/plan.svg", alt: "Weekly plan on a lime tile" },
  { src: "/hero-tiles/focus.svg", alt: "Blue focus card" },
  { src: "/hero-tiles/week.svg", alt: "Abstract shapes for the week" },
  { src: "/hero-tiles/note.svg", alt: "A pale note about what matters" },
];

export function MarketingHero() {
  return (
    <section className="flex min-h-dvh w-full flex-col items-center justify-center overflow-x-clip overflow-y-visible bg-body px-[var(--grid-margin)] py-16 text-center">
      <div className="flex w-full flex-col items-center gap-1">
        <p className="type-supporting font-medium uppercase tracking-wider text-muted">WhatMatters</p>
        <h1 className="type-display-1 text-balance text-fg">Plan the week</h1>
        <HeroTileStack className="my-1" tiles={tiles} />
        <p className="type-display-2 text-balance text-muted">One calm list.</p>
      </div>
    </section>
  );
}
`.trim();

function MarketingHero() {
  return (
    <section className="flex min-h-dvh w-full flex-col items-center justify-center overflow-x-clip overflow-y-visible bg-body px-[var(--grid-margin)] py-16 text-center">
      <div className="flex w-full flex-col items-center gap-1">
        <p className="type-supporting font-medium uppercase tracking-wider text-muted">WhatMatters</p>
        <h1 className="type-display-1 text-balance text-fg">Plan the week</h1>
        <HeroTileStack className="my-1" tiles={heroTiles} />
        <p className="type-display-2 text-balance text-muted">One calm list.</p>
      </div>
    </section>
  );
}

export const MarketingHeroPattern: Story = {
  name: "Pattern — marketing hero",
  parameters: withStoryCopySource(
    {
      wmdsLayout: "fullscreen",
      docs: {
        description: {
          story:
            "Headline above the fan, subline below. Move a fine pointer over the tiles — every card springs away from it, and they spring back when the pointer leaves. A coarse pointer tap scatters once from that point, then returns. Reduced motion keeps the resting fan.",
        },
      },
    },
    marketingHeroCopySource,
  ),
  render: () => <MarketingHero />,
};

export const Strength: Story = {
  name: "Strength",
  args: {
    strength: heroTileStackDefaultStrength,
  },
  argTypes: {
    strength: {
      control: { type: "range", min: 0, max: 1400, step: 20 },
    },
  },
  parameters: {
    wmdsLayout: "padded",
    docs: {
      description: {
        story:
          "Drag **strength**. The default is the full scatter. Lower values keep the fan closer to the stack. `0` does not move.",
      },
    },
  },
  render: (args) => (
    <div className="flex min-h-[28rem] w-full items-center justify-center overflow-x-clip overflow-y-visible">
      <HeroTileStack tiles={heroTiles} strength={args.strength} />
    </div>
  ),
};
