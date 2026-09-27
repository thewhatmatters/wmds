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

Marketing gallery that sits under the hero. Pass \`items\` (\`id\`, \`label\`, \`image\`, optional \`color\`) and an optional \`heading\`. \`className\` is layout only, on the root.

Vertical scroll drives the row. The track is \`300svh\`. A sticky \`h-svh\` window, one card wide and centered, shows the first card at the start and the last card at the end. The travel is \`(items.length - 1) * (item width + gap)\`, measured from the row.

From \`sm\` each card is **400×500** with \`gap-8\` (32px). Below \`sm\` each card is **280×350** with \`gap-4\` (16px). Radius is \`rounded-xl\` (\`--radius-xl\`, 12px). The image covers the card. A bottom gradient in the item color uses multiply. The number is \`type-code\` in that color. The label is white (\`text-on-brand\`).

Omit \`color\` to cycle \`--color-brand\` and chart categorical tokens.

\`prefers-reduced-motion\`, and \`MotionConfig\` \`reducedMotion="always"\`, skip the transform. The track height is auto, the window is not sticky, and the row is a native horizontal scroller with vertical padding (\`py-12\`). The server render matches the motion shell. The OS preference is applied before paint.

## Anatomy

\`\`\`
ScrollHorizontal — 300svh track (auto when reduced)
└── sticky svh viewport (relative, full width, overflow-x auto when reduced)
    ├── heading (optional)
    └── window — 400px, centered (280px below sm; full-width scroller when reduced)
        └── row — translateX, or no transform when reduced
            └── card — image, multiply gradient, number, label
\`\`\`

## Best practices

- Place **ScrollHorizontal** directly under the marketing hero, full width. Do not nest it in a clipping page column.
- Give every item an \`id\`, a \`label\`, and a local \`image\`. The image is decorative; the label is the name.
- Pass \`color\` only to override the default token cycle.
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
  { id: "project-one", label: "Project One", image: "/scroll-horizontal/project-one.svg" },
  { id: "project-two", label: "Project Two", image: "/scroll-horizontal/project-two.svg" },
  { id: "project-three", label: "Project Three", image: "/scroll-horizontal/project-three.svg" },
  { id: "project-four", label: "Project Four", image: "/scroll-horizontal/project-four.svg" },
  { id: "project-five", label: "Project Five", image: "/scroll-horizontal/project-five.svg" },
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
            "Paste this under the marketing hero. Five items, token colors, local posters. Scroll to move from Project One centered to Project Five centered. Reduced motion keeps a horizontal scroller.",
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
