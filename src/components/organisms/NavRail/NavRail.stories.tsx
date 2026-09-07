import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { BarChart3, Home, Settings, Users } from "lucide-react";
import { NavRail, navRailItemSurfaces } from "./NavRail";
import { storyCopySource, storyMetaDocsDefaults } from "../../../lib/storyCopySource";

const primaryItems = [
  { id: "overview", label: "Home", icon: <Home strokeWidth={1.75} /> },
  { id: "content", label: "Content", icon: <BarChart3 strokeWidth={1.75} /> },
  { id: "audience", label: "Audience", icon: <Users strokeWidth={1.75} /> },
];

const footerItems = [
  { id: "settings", label: "Settings", icon: <Settings strokeWidth={1.75} /> },
];

const meta = {
  title: "Organisms/NavRail",
  component: NavRail,
  tags: ["autodocs"],
  ...storyMetaDocsDefaults(),
  argTypes: {
    itemSurface: { control: "select", options: [...navRailItemSurfaces] },
    brand: { control: false },
  },
  args: {
    items: primaryItems,
    footerItems,
    activeId: "overview",
    itemSurface: "glass",
  },
  parameters: {
    wmdsLayout: "padded",
    docs: {
      description: {
        component: `
## Usage

Primary **icon-only rail** on \`bg-accent\` — brand band, centered main nav, optional footer (e.g. settings). Use only in products whose navigation density warrants persistent rail chrome.

| Pattern | Props |
|---------|--------|
| **Accent rail** | \`items\` + \`activeId\` + \`onSelect\`; optional \`footerItems\` |
| **Glass chrome** | \`itemSurface="glass"\` (default) — frosted active plate + hover ring |
| **Flat chrome** | \`itemSurface="flat"\` — solid \`on-accent\` fills |
| **Custom brand** | \`brand\` slot — default **NavRailBrandMark** sparkle |

Static active indicator per item — no Motion thumb.

## Anatomy

\`\`\`
NavRail
├── brand band (56px) — logo mark; not a nav item
├── main nav — IconButton column (cluster md)
└── footer? — end-of-rail icons (settings)
\`\`\`

Each item: active plate (behind) + **IconButton** \`role="ghost"\`.

## Best practices

- **Do** keep one \`activeId\` — instant swap; plate lives on the wrap, not the button fill.
- **Do** use \`itemSurface="glass"\` on floating accent rails over \`bg-body\` gutter.
- **Do** pair footer settings icon with **NavList** when the destination has section nav.
- **Don't** use for secondary section lists — **NavList**.
- **Don't** re-theme item plates with \`className\` — layout margin only on the slot.
        `.trim(),
      },
    },
  },
} satisfies Meta<typeof NavRail>;

export default meta;
type Story = StoryObj<typeof meta>;

export const GlassAccentRail: Story = {
  name: "Pattern — accent rail (glass)",
  render: function GlassAccentRailDemo() {
    const [activeId, setActiveId] = useState("overview");

    return (
      <div className="h-[520px] w-fit rounded-2xl bg-body p-1">
        <NavRail
          items={primaryItems}
          footerItems={footerItems}
          activeId={activeId}
          onSelect={setActiveId}
          itemSurface="glass"
        />
      </div>
    );
  },
  parameters: storyCopySource(`
import { useState } from "react";
import { BarChart3, Home, Settings, Users, NavRail } from "@whatmatters/wmds";

const items = [
  { id: "overview", label: "Home", icon: <Home strokeWidth={1.75} /> },
  { id: "content", label: "Content", icon: <BarChart3 strokeWidth={1.75} /> },
];

export function PrimaryNavRail() {
  const [activeId, setActiveId] = useState("overview");

  return (
    <NavRail
      items={items}
      footerItems={[{ id: "settings", label: "Settings", icon: <Settings strokeWidth={1.75} /> }]}
      activeId={activeId}
      onSelect={setActiveId}
      itemSurface="glass"
    />
  );
}
`),
};

export const FlatItemSurface: Story = {
  name: "Pattern — flat item surface",
  render: function FlatItemSurfaceDemo() {
    const [activeId, setActiveId] = useState("overview");

    return (
      <div className="h-[520px] w-fit rounded-2xl bg-body p-1">
        <NavRail
          items={primaryItems}
          footerItems={footerItems}
          activeId={activeId}
          onSelect={setActiveId}
          itemSurface="flat"
        />
      </div>
    );
  },
};

export const SurfaceComparison: Story = {
  name: "Reference — glass vs flat",
  render: function SurfaceComparisonDemo() {
    const [glassActive, setGlassActive] = useState("overview");
    const [flatActive, setFlatActive] = useState("overview");

    return (
      <div className="flex gap-4">
        <div className="flex flex-col gap-2">
          <span className="text-xs text-muted">Glass</span>
          <div className="h-[480px] rounded-2xl bg-body p-1">
            <NavRail
              items={primaryItems}
              footerItems={footerItems}
              activeId={glassActive}
              onSelect={setGlassActive}
              itemSurface="glass"
            />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-xs text-muted">Flat</span>
          <div className="h-[480px] rounded-2xl bg-body p-1">
            <NavRail
              items={primaryItems}
              footerItems={footerItems}
              activeId={flatActive}
              onSelect={setFlatActive}
              itemSurface="flat"
            />
          </div>
        </div>
      </div>
    );
  },
};
