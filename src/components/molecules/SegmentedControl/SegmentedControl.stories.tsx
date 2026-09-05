import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { BarChart3, LayoutGrid, List } from "lucide-react";
import { storyCopySource, storyMetaDocsDefaults } from "../../../lib/storyCopySource";
import { ButtonIcon } from "../../atoms/Button/ButtonIcon";
import {
  SegmentedControl,
  segmentedControlLayouts,
  segmentedControlSizes,
} from "./SegmentedControl";

const meta = {
  title: "Molecules/SegmentedControl",
  component: SegmentedControl,
  tags: ["autodocs"],
  ...storyMetaDocsDefaults(),
  argTypes: {
    size: { control: "select", options: [...segmentedControlSizes] },
    layout: { control: "select", options: [...segmentedControlLayouts] },
    value: { control: false },
    onValueChange: { control: false },
    children: { control: false },
  },
  args: {
    "aria-label": "Card shape",
    size: "md",
    layout: "hug",
    disabled: false,
  },
  parameters: {
    wmdsLayout: "centered",
    docs: {
      description: {
        component: `
## Usage

Connected **segmented control** — one track, sliding inset thumb, mutually exclusive options. Use for **view switchers** (list / grid) and **inline settings** (rounded / pill) where **Select** would be heavy.

| Pattern | Props |
|---------|--------|
| **Label only** | \`SegmentedControl.Item\` + \`children\` — shape toggles, short view names |
| **Icon + label** | \`start\` slot — wrap Lucide in **ButtonIcon** (\`size="xs"\` beside **sm** track) |
| **Label + meta** | \`end\` slot — mono count or key cap (rare) |
| **Equal-width rail** | \`layout="stretch"\` + \`className="w-full max-w-xs"\` on the track |
| **Controlled** | \`value\` + \`onValueChange\` |

**Sizes:** \`sm\` | \`md\` (default) | \`lg\` — **cluster tiers** (**Foundation → Cluster**): 28 / 36 / 44px outer track, same as **Chip**. Prop names match cluster directly (\`sm\` = cluster sm) — unlike **Button** (\`xs\` / \`sm\` / \`md\`). **Badge** \`sm\` / \`md\` is a smaller inline label scale — not header-cluster pairing.

**Not this pattern:** filter rails with gaps → **ChipFilterGroup**; primary actions → **Button**; many options or search → **Select**.

## Anatomy

- **Track** — \`rounded-full\` \`bg-body\` recessed well, **2px** inset (\`p-0.5\`), hairline border
- **Thumb** — Motion \`layoutId\` slide on \`bg-surface\` + \`shadow-raised\` (hairline + drop)
- **Item** — \`start\` | label (\`children\`) | \`end\` — same three-slot row as **Dropdown.Item** / **Select** options; \`role="radio"\`

## Best practices

- **Do** keep segments to **2–4** short labels — truncate long copy.
- **Do** use \`layout="stretch"\` when the control should fill a header slot evenly.
- **Do** use stable string \`value\` props — labels are display only.
- **Do** pass icons in \`start\` via **ButtonIcon** / **BadgeIcon** — not raw Lucide in app TSX against the molecule.
- **Don't** mix uneven \`start\` / \`end\` slots with \`layout="stretch"\` when segments should look equal width.
- **Don't** use for multi-select filters — **ChipFilterGroup**.
- **Don't** restyle segment colors with \`className\` — layout width/margin on the track only.
        `.trim(),
      },
    },
  },
} satisfies Meta<typeof SegmentedControl>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ShapeToggle: Story = {
  name: "Pattern — shape toggle (2-up)",
  parameters: {
    ...storyCopySource(`
import { useState } from "react";
import { SegmentedControl } from "@whatmatters/wmds";

function CardShapeToggle() {
  const [shape, setShape] = useState("rounded");

  return (
    <SegmentedControl aria-label="Card shape" value={shape} onValueChange={setShape} size="sm">
      <SegmentedControl.Item value="rounded">Rounded</SegmentedControl.Item>
      <SegmentedControl.Item value="pill">Pill</SegmentedControl.Item>
    </SegmentedControl>
  );
}
`),
    docs: {
      description: {
        story: "Inline setting — rounded vs pill card chrome. Sliding thumb on **Motion** `layoutId`.",
      },
    },
  },
  render: () => {
    const [shape, setShape] = useState("rounded");

    return (
      <SegmentedControl aria-label="Card shape" value={shape} onValueChange={setShape} size="sm">
        <SegmentedControl.Item value="rounded">Rounded</SegmentedControl.Item>
        <SegmentedControl.Item value="pill">Pill</SegmentedControl.Item>
      </SegmentedControl>
    );
  },
};

export const ViewSwitcher: Story = {
  name: "Pattern — view switcher (stretch)",
  parameters: {
    ...storyCopySource(`
import { useState } from "react";
import { SegmentedControl } from "@whatmatters/wmds";

function ReportViewSwitcher() {
  const [view, setView] = useState("chart");

  return (
    <SegmentedControl
      aria-label="Report view"
      value={view}
      onValueChange={setView}
      layout="stretch"
      className="w-full max-w-xs"
    >
      <SegmentedControl.Item value="list">List</SegmentedControl.Item>
      <SegmentedControl.Item value="grid">Grid</SegmentedControl.Item>
      <SegmentedControl.Item value="chart">Chart</SegmentedControl.Item>
    </SegmentedControl>
  );
}
`),
    docs: {
      description: {
        story: "Equal-width segments — `layout=\"stretch\"` fills the track for three view modes.",
      },
    },
  },
  render: () => {
    const [view, setView] = useState("chart");

    return (
      <SegmentedControl
        aria-label="Report view"
        value={view}
        onValueChange={setView}
        layout="stretch"
        className="w-full max-w-xs"
      >
        <SegmentedControl.Item value="list">List</SegmentedControl.Item>
        <SegmentedControl.Item value="grid">Grid</SegmentedControl.Item>
        <SegmentedControl.Item value="chart">Chart</SegmentedControl.Item>
      </SegmentedControl>
    );
  },
};

export const ViewSwitcherWithIcons: Story = {
  name: "Pattern — view switcher (start icons)",
  parameters: {
    ...storyCopySource(`
import { useState } from "react";
import { LayoutGrid, List, BarChart3 } from "lucide-react";
import { ButtonIcon, SegmentedControl } from "@whatmatters/wmds";

function ReportViewSwitcher() {
  const [view, setView] = useState("chart");

  return (
    <SegmentedControl aria-label="Report view" value={view} onValueChange={setView} size="sm">
      <SegmentedControl.Item
        value="list"
        start={
          <ButtonIcon size="xs">
            <List strokeWidth={2} />
          </ButtonIcon>
        }
      >
        List
      </SegmentedControl.Item>
      <SegmentedControl.Item
        value="grid"
        start={
          <ButtonIcon size="xs">
            <LayoutGrid strokeWidth={2} />
          </ButtonIcon>
        }
      >
        Grid
      </SegmentedControl.Item>
      <SegmentedControl.Item
        value="chart"
        start={
          <ButtonIcon size="xs">
            <BarChart3 strokeWidth={2} />
          </ButtonIcon>
        }
      >
        Chart
      </SegmentedControl.Item>
    </SegmentedControl>
  );
}
`),
    docs: {
      description: {
        story:
          "Icon-led segments — `start` slot matches **Dropdown.Item** / **Select** option anatomy. Prefer label-only when copy is enough.",
      },
    },
  },
  render: () => {
    const [view, setView] = useState("chart");

    return (
      <SegmentedControl aria-label="Report view" value={view} onValueChange={setView} size="sm">
        <SegmentedControl.Item
          value="list"
          start={
            <ButtonIcon size="xs">
              <List strokeWidth={2} />
            </ButtonIcon>
          }
        >
          List
        </SegmentedControl.Item>
        <SegmentedControl.Item
          value="grid"
          start={
            <ButtonIcon size="xs">
              <LayoutGrid strokeWidth={2} />
            </ButtonIcon>
          }
        >
          Grid
        </SegmentedControl.Item>
        <SegmentedControl.Item
          value="chart"
          start={
            <ButtonIcon size="xs">
              <BarChart3 strokeWidth={2} />
            </ButtonIcon>
          }
        >
          Chart
        </SegmentedControl.Item>
      </SegmentedControl>
    );
  },
};

export const SizeReference: Story = {
  name: "Reference — sizes",
  parameters: {
    docs: {
      description: {
        story: "Cluster-aligned heights — **sm** (28px), **md** (36px), **lg** (44px).",
      },
    },
  },
  render: () => {
    const [value, setValue] = useState("a");

    return (
      <div className="flex flex-col items-start gap-4">
        {segmentedControlSizes.map((size) => (
          <SegmentedControl
            key={size}
            aria-label={`Segment size ${size}`}
            size={size}
            value={value}
            onValueChange={setValue}
          >
            <SegmentedControl.Item value="a">Overview</SegmentedControl.Item>
            <SegmentedControl.Item value="b">Details</SegmentedControl.Item>
          </SegmentedControl>
        ))}
      </div>
    );
  },
};

export const Disabled: Story = {
  name: "Reference — disabled",
  render: () => (
    <SegmentedControl
      aria-label="Disabled shape"
      value="rounded"
      onValueChange={() => undefined}
      disabled
      size="sm"
    >
      <SegmentedControl.Item value="rounded">Rounded</SegmentedControl.Item>
      <SegmentedControl.Item value="pill">Pill</SegmentedControl.Item>
    </SegmentedControl>
  ),
};
