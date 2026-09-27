import type { Meta, StoryObj } from "@storybook/react-vite";
import { MotionConfig } from "motion/react";
import { storyMetaDocsDefaults, withStoryCopySource } from "../../../lib/storyCopySource";
import { ScrollHorizontal } from "./ScrollHorizontal";
import { scrollHorizontalMarketingItems } from "./scrollHorizontalExamples";

const meta = {
  title: "Components/Layout/ScrollHorizontal",
  component: ScrollHorizontal,
  tags: ["autodocs"],
  args: {
    items: scrollHorizontalMarketingItems,
  },
  ...storyMetaDocsDefaults(),
  parameters: {
    docs: {
      description: {
        component: `
## Usage

Marketing gallery that sits under the hero. Pass \`items\` (\`id\`, \`label\`, optional \`color\`) and an optional \`heading\`. \`className\` is layout only, on the root.

Vertical scroll drives the row. The track is \`300svh\`. A sticky \`h-svh\` window, one card wide and centered, shows the first card at the start and the last card at the end. The travel is \`(items.length - 1) * (item width + gap)\`, measured from the row.

From \`sm\` each card is **400×500** with \`gap-8\` (32px). Below \`sm\` each card is **280×350** with \`gap-4\` (16px). Radius is \`rounded-xl\` (\`--radius-xl\`, 12px). Each card is a solid fill from \`color\`. The label is the accessible name (\`sr-only\`).

Omit \`color\` to cycle \`--color-brand\`, \`--color-brand-soft\`, \`--color-primary\`, \`--color-info-muted\`, and \`--color-accent\`. Pass a token (\`var(--color-*)\`) when you set \`color\`.

\`prefers-reduced-motion\`, and \`MotionConfig\` \`reducedMotion="always"\`, skip the transform. The track height is auto, the window is not sticky, and the row is a native horizontal scroller with vertical padding (\`py-12\`). The server render matches the motion shell. The OS preference is applied before paint.

## Anatomy

\`\`\`
ScrollHorizontal — 300svh track (auto when reduced)
└── sticky svh viewport (relative, full width, overflow-x auto when reduced)
    ├── heading (optional)
    └── window — 400px, centered (280px below sm; full-width scroller when reduced)
        └── row — translateX, or no transform when reduced
            └── card — solid token color; label is sr-only
\`\`\`

## Best practices

- Place **ScrollHorizontal** directly under the marketing hero, full width. Do not nest it in a clipping page column.
- Give every item an \`id\` and a \`label\`. The label is the accessible name, not visible copy.
- Pass \`color\` as a semantic token to override the default cycle. The marketing placeholders set all five.
- The heading is a slot. Use a real heading element so the section name is in the tree.
        `.trim(),
      },
    },
  },
} satisfies Meta<typeof ScrollHorizontal>;

export default meta;
type Story = StoryObj<typeof meta>;

const projectGalleryCopySource = `
import { ScrollHorizontal } from "@whatmatters/wmds";

const projects = [
  { id: "project-one", label: "Project One", color: "var(--color-brand)" },
  { id: "project-two", label: "Project Two", color: "var(--color-brand-soft)" },
  { id: "project-three", label: "Project Three", color: "var(--color-primary)" },
  { id: "project-four", label: "Project Four", color: "var(--color-info-muted)" },
  { id: "project-five", label: "Project Five", color: "var(--color-accent)" },
];

export function ProjectGallery() {
  return (
    <ScrollHorizontal
      items={projects}
      heading={<h2 className="type-heading-2 text-fg">Selected work</h2>}
    />
  );
}
`.trim();

export const Default: Story = {
  parameters: {
    wmdsLayout: "fullscreen",
    docs: {
      description: {
        story:
          "Scroll the page. The row moves from the first card centered to the last card centered. prefers-reduced-motion turns the track off: height auto, no sticky window, no transform, and a native horizontal swipe with vertical padding. The same branch runs when MotionConfig reducedMotion is always. The server render stays on the motion shell so hydration matches; the OS preference is applied before paint.",
      },
    },
  },
  render: () => (
    <div className="bg-body">
      <div className="flex h-[40svh] items-end justify-center px-[var(--grid-margin)] pb-8">
        <p className="type-heading-2 text-fg">Scroll into the gallery</p>
      </div>
      <ScrollHorizontal
        items={scrollHorizontalMarketingItems}
        heading={<h2 className="type-heading-2 text-fg">Selected work</h2>}
      />
      <div className="flex h-svh items-center justify-center px-[var(--grid-margin)]">
        <p className="type-heading-2 text-fg">After the gallery</p>
      </div>
    </div>
  ),
};

export const ReducedMotion: Story = {
  name: "Reduced motion",
  parameters: {
    wmdsLayout: "fullscreen",
    docs: {
      description: {
        story:
          "MotionConfig reducedMotion always uses the same branch as prefers-reduced-motion. The section is only as tall as the cards. Swipe or scroll the row sideways. Nothing translates with page scroll.",
      },
    },
  },
  render: () => (
    <MotionConfig reducedMotion="always">
      <div className="bg-body py-8">
        <ScrollHorizontal
          items={scrollHorizontalMarketingItems}
          heading={<h2 className="type-heading-2 text-fg">Selected work</h2>}
        />
      </div>
    </MotionConfig>
  ),
};

export const ProjectGalleryPattern: Story = {
  name: "Pattern — project gallery",
  parameters: withStoryCopySource(
    {
      wmdsLayout: "fullscreen",
      docs: {
        description: {
          story:
            "Paste this under the marketing hero. Five solid token-color placeholders. The label is the accessible name. Scroll to move from Project One centered to Project Five centered. Reduced motion keeps a horizontal scroller.",
        },
      },
    },
    projectGalleryCopySource,
  ),
  render: () => (
    <div className="bg-body">
      <ScrollHorizontal
        items={scrollHorizontalMarketingItems}
        heading={<h2 className="type-heading-2 text-fg">Selected work</h2>}
      />
    </div>
  ),
};
