import type { Meta, StoryObj } from "@storybook/react-vite";
import { MotionConfig } from "motion/react";
import { expect, waitFor } from "storybook/test";
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

\`expandLast\` (default false) lengthens the track to \`400svh\`. The horizontal travel keeps that same scroll distance. The window stays pinned for one more viewport while the last tile grows, via \`clip-path\`, until it fills the \`h-svh\` window edge to edge and the radius reaches 0. Earlier tiles fade out. The window then releases and that full-bleed tile scrolls away. Pass \`expanded\` for content in that section.

From \`sm\` each card is **400×500** with \`gap-8\` (32px). Below \`sm\` each card is **280×350** with \`gap-4\` (16px). Radius is \`rounded-xl\` (\`--radius-xl\`, 12px). Each card is a solid fill from \`color\`. The label is the accessible name (\`sr-only\`).

Omit \`color\` to cycle \`--color-brand\`, \`--color-brand-soft\`, \`--color-primary\`, \`--color-info-muted\`, and \`--color-accent\`. Pass a token (\`var(--color-*)\`) when you set \`color\`.

\`prefers-reduced-motion\`, and \`MotionConfig\` \`reducedMotion="always"\`, skip the transform. The track height is auto, the window is not sticky, and the row is a native horizontal scroller with vertical padding (\`py-12\`). The server render matches the motion shell. The OS preference is applied before paint.

## Anatomy

\`\`\`
ScrollHorizontal — 300svh track, or 400svh with expandLast (auto when reduced)
└── sticky svh viewport (relative, full width, overflow-x auto when reduced)
    ├── heading (optional)
    ├── window — 400px, centered (280px below sm; full-width scroller when reduced)
    │   └── row — translateX, or no transform when reduced
    │       └── card — solid token color; label is sr-only
    ├── expand layer — full window, clip-path from the last card to inset 0 (expandLast, motion)
    └── expanded slot (optional; on the full-bleed tile)
└── reduced section — last tile, h-svh, radius 0 (expandLast, reduced motion only)
\`\`\`

## Best practices

- Place **ScrollHorizontal** directly under the marketing hero, full width. Do not nest it in a clipping page column.
- Give every item an \`id\` and a \`label\`. The label is the accessible name, not visible copy.
- Pass \`color\` as a semantic token to override the default cycle. The marketing placeholders set all five.
- Leave \`expandLast\` off when the track should release on the last centered card.
- Turn \`expandLast\` on when the last tile should fill the viewport and scroll away as its own section. Pass \`expanded\` for content there. The slot is mounted twice; the motion layer and the reduced-motion section each hide the other.
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

export const ExpandLast: Story = {
  name: "Expand last",
  parameters: {
    wmdsLayout: "fullscreen",
    docs: {
      description: {
        story:
          "expandLast keeps the horizontal travel on the same scroll distance as the default gallery, then holds the window while the last tile grows to the viewport and the radius reaches 0. The full-bleed tile then scrolls away. prefers-reduced-motion keeps the horizontal scroller and follows it with that tile as a static full-viewport section.",
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
        expandLast
      />
      <div className="flex h-svh items-center justify-center px-[var(--grid-margin)]">
        <p className="type-heading-2 text-fg">After the gallery</p>
      </div>
    </div>
  ),
};

export const ExpandLastContract: Story = {
  tags: ["test", "!dev", "!autodocs"],
  parameters: {
    docs: { disable: true },
  },
  render: () => (
    <div>
      <ScrollHorizontal items={scrollHorizontalMarketingItems.slice(0, 3)} />
      <ScrollHorizontal
        items={scrollHorizontalMarketingItems}
        expandLast
        expanded={<p>Expanded slot</p>}
      />
      <MotionConfig reducedMotion="always">
        <ScrollHorizontal
          items={scrollHorizontalMarketingItems}
          expandLast
          expanded={<p>Reduced slot</p>}
        />
      </MotionConfig>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const sections = [...canvasElement.querySelectorAll("[data-scroll-horizontal]")];
    expect(sections).toHaveLength(3);
    expect(sections[0]?.getAttribute("data-expand-last")).toBe("false");
    expect(sections[0]?.className).toContain("h-[300svh]");
    expect(sections[0]?.querySelector("[data-scroll-horizontal-expanded]")).toBeNull();

    expect(sections[1]?.getAttribute("data-expand-last")).toBe("true");
    expect(sections[1]?.className).toContain("h-[400svh]");
    expect(sections[1]?.querySelectorAll("[data-scroll-horizontal-expanded]")).toHaveLength(2);
    expect(sections[1]?.textContent).toContain("Expanded slot");

    await waitFor(() => {
      expect(sections[2]?.getAttribute("data-reduce")).toBe("true");
    });
    expect(sections[2]?.getAttribute("data-expand-last")).toBe("true");
    const reduced = [...(sections[2]?.querySelectorAll("[data-scroll-horizontal-expanded]") ?? [])].find(
      (host) => host.className.includes("h-svh"),
    );
    expect(reduced).toBeTruthy();
    await waitFor(() => {
      expect(reduced ? getComputedStyle(reduced).display : "").toBe("block");
    });
    expect(reduced?.textContent).toContain("Project Five");
    expect(reduced?.textContent).toContain("Reduced slot");
    const layer = [...(sections[2]?.querySelectorAll("[data-scroll-horizontal-expanded]") ?? [])].find(
      (host) => host.className.includes("will-change-[clip-path]"),
    );
    expect(layer ? getComputedStyle(layer).display : "").toBe("none");
    expect(sections[2]?.querySelectorAll("li")).toHaveLength(5);
  },
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
