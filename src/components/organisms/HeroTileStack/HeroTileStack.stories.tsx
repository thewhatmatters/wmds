import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../../atoms/Button/Button";
import { storyMetaDocsDefaults, withStoryCopySource } from "../../../lib/storyCopySource";
import {
  HeroTileStack,
  heroTileStackDefaultMaxVertical,
  heroTileStackDefaultStrength,
  heroTileStackDefaultVelocityFactor,
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
    velocityFactor: heroTileStackDefaultVelocityFactor,
    maxVertical: heroTileStackDefaultMaxVertical,
  },
  ...storyMetaDocsDefaults(),
  parameters: {
    docs: {
      description: {
        component: `
## Usage

Marketing hero fan. Pass \`tiles\` (\`src\` and \`alt\`, plus optional resting \`offsetX\`, \`offsetY\`, \`rotate\`, and \`zIndex\`). While a fine pointer is over the stack, every card springs left or right away from the pointer. Closer cards travel farther, and the push adds a little tilt. A still pointer does not move the cards vertically. A quick pointer move — most of all a vertical one — adds a small springy vertical nudge that returns to 0 when the pointer slows. Leaving the stack springs the cards back to the resting fan. There is no scale change, dimming, reorder, click action, or idle motion.

\`strength\` multiplies the horizontal push. The default keeps tiles near the stack. Raise it when the fan should travel farther. \`0\` holds the resting stack. \`velocityFactor\` is px of vertical nudge per px/s of vertical pointer velocity. \`maxVertical\` clamps that nudge. \`spring\` overrides stiffness, damping, and mass.

\`prefers-reduced-motion\`, and \`MotionConfig\` \`reducedMotion="always"\`, render the resting fan and ignore the pointer.

A coarse pointer or a touch tap scatters once from the tap point, holds briefly, then springs back. That tap uses the same gentle horizontal push and does not add a velocity nudge.

The root clips the inline axis (\`overflow-x: clip\`) so a wide scatter cannot open a horizontal scrollbar. The row does not clip, and the block axis stays visible so cards can leave the stack vertically.

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
- Default \`strength\` is a gentle horizontal shift. Use the **Strength** story to raise it when cards should travel farther.
- Shadows travel with the cards. The surface uses \`shadow-soft-card\` and \`--radius-card-shell\`.
        `.trim(),
      },
    },
  },
} satisfies Meta<typeof HeroTileStack>;

export default meta;
type Story = StoryObj<typeof meta>;

const marketingHeroCopySource = `
import { Button, HeroTileStack } from "@whatmatters/wmds";

const tiles = [
  { src: "/hero-tiles/plan.svg", alt: "Weekly plan on a lime tile" },
  { src: "/hero-tiles/focus.svg", alt: "Blue focus card" },
  { src: "/hero-tiles/week.svg", alt: "Abstract shapes for the week" },
  { src: "/hero-tiles/note.svg", alt: "A pale note about what matters" },
];

export function MarketingHero() {
  return (
    <section className="flex min-h-dvh w-full flex-col items-center justify-center overflow-x-clip overflow-y-visible bg-body px-[var(--grid-margin)] py-16 text-center">
      <div className="flex w-full flex-col items-center gap-6">
        <h1 className="type-display-1 text-fg">We Are WhatMatters</h1>
        <p className="text-base text-muted">
          Your brand is already online. Make it impossible to ignore.
        </p>
        <HeroTileStack tiles={tiles} />
        <Button role="primary">Start a project</Button>
      </div>
    </section>
  );
}
`.trim();

function MarketingHero() {
  return (
    <section className="flex min-h-dvh w-full flex-col items-center justify-center overflow-x-clip overflow-y-visible bg-body px-[var(--grid-margin)] py-16 text-center">
      <div className="flex w-full flex-col items-center gap-6">
        <h1 className="type-display-1 text-fg">We Are WhatMatters</h1>
        <p className="text-base text-muted">
          Your brand is already online. Make it impossible to ignore.
        </p>
        <HeroTileStack tiles={heroTiles} />
        <Button role="primary">Start a project</Button>
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
            "Title-case display headline and 1rem body subtext above the fan, primary action below. The headline is an h1 with no uppercase transform. Move a fine pointer over the tiles — cards shift left and right away from it and tilt slightly. A quick vertical move adds a small springy lift that settles when the pointer slows. They spring back when the pointer leaves. A coarse pointer tap scatters once from that point, then returns. Reduced motion keeps the resting fan.",
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
    velocityFactor: heroTileStackDefaultVelocityFactor,
    maxVertical: heroTileStackDefaultMaxVertical,
  },
  argTypes: {
    strength: {
      control: { type: "range", min: 0, max: 1400, step: 10 },
    },
    velocityFactor: {
      control: { type: "range", min: 0, max: 0.08, step: 0.002 },
    },
    maxVertical: {
      control: { type: "range", min: 0, max: 80, step: 2 },
    },
  },
  parameters: {
    wmdsLayout: "padded",
    docs: {
      description: {
        story:
          "Drag **strength** for the horizontal push. The default shifts tiles sideways and keeps them near the stack. Higher values travel farther, until cards can leave the viewport. `0` does not move. **velocityFactor** and **maxVertical** tune the springy vertical nudge from pointer velocity.",
      },
    },
  },
  render: (args) => (
    <div className="flex min-h-[28rem] w-full items-center justify-center overflow-x-clip overflow-y-visible">
      <HeroTileStack
        tiles={heroTiles}
        strength={args.strength}
        velocityFactor={args.velocityFactor}
        maxVertical={args.maxVertical}
      />
    </div>
  ),
};
