import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { CalendarDays, Dog, Leaf, MapPin } from "lucide-react";
import { Chip, ChipFilterGroup, chipSizes } from "./Chip";

const meta = {
  title: "Molecules/Chip",
  component: Chip,
  tags: ["autodocs"],
  argTypes: {
    size: { control: "select", options: [...chipSizes] },
    icon: { control: false },
    count: { control: "number" },
    selected: { control: "boolean" },
    readOnly: { control: "boolean" },
    disabled: { control: "boolean" },
    onRemove: { control: false },
    onSelectedChange: { control: false },
    value: { control: "text" },
    children: { control: "text" },
  },
  args: {
    children: "Open today",
    size: "md",
    disabled: false,
    readOnly: false,
  },
  parameters: {
    docs: {
      description: {
        component: `
## Usage

**Four prescribed patterns** — pick one story, copy the code. Not a composable slot API.

| Pattern | Props |
|---------|--------|
| **Filter (multi-select)** | \`ChipFilterGroup\` + \`Chip value\` — default for filter rails |
| **Filter (single)** | \`ChipFilterGroup selectionMode="single"\` + \`Chip value\` |
| **Standalone toggle** | \`selected\` + \`onSelectedChange\` — one chip outside a group |
| **Removable token** | \`onRemove\` — Find pill committed state, applied filters |
| **Read-only label** | \`readOnly\` — SNAP on a list row (use Badge if never chip-shaped) |

**Sizes:** \`sm\` | \`md\` (default) | \`lg\` — \`lg\` meets 44px touch target (ADR-0003).

Optional **\`icon\`** (Lucide) and **\`count\`** on filter/toggle chips — not with \`onRemove\`.

## Best practices

- **Do** wrap filter rails in \`ChipFilterGroup\` with \`aria-label\` — multi-select by default.
- **Do** give each filter chip a stable \`value\` string inside the group.
- **Do** use \`readOnly\` for metadata on rows — not clickable filters.
- **Do** use \`onRemove\` for committed search tokens (ZIP, city).
- **Don't** mix \`ChipFilterGroup\` with \`onRemove\` or standalone \`selected\` on child chips.
- **Don't** use chips for primary actions — use **Button**.
        `.trim(),
      },
    },
  },
} satisfies Meta<typeof Chip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FilterMultiSelect: Story = {
  name: "Pattern — filter (multi-select)",
  parameters: {
    docs: {
      description: {
        story: "Filter rail — Open today, Saturday, Dogs, etc. Multi-select by default.",
      },
    },
  },
  render: () => {
    const [filters, setFilters] = useState<string[]>(["open-today"]);

    return (
      <ChipFilterGroup
        aria-label="Market filters"
        value={filters}
        onValueChange={setFilters}
      >
        <Chip value="open-today" icon={<CalendarDays strokeWidth={2} />}>
          Open today
        </Chip>
        <Chip value="saturday">Saturday</Chip>
        <Chip value="dogs" icon={<Dog strokeWidth={2} />}>
          Dogs
        </Chip>
        <Chip value="snap" count={12}>
          SNAP
        </Chip>
      </ChipFilterGroup>
    );
  },
};

export const FilterSingleSelect: Story = {
  name: "Pattern — filter (single)",
  render: () => {
    const [view, setView] = useState("list");

    return (
      <ChipFilterGroup
        aria-label="View mode"
        selectionMode="single"
        value={view}
        onValueChange={setView}
      >
        <Chip value="list">List</Chip>
        <Chip value="map" icon={<MapPin strokeWidth={2} />}>
          Map
        </Chip>
      </ChipFilterGroup>
    );
  },
};

export const StandaloneToggle: Story = {
  name: "Pattern — standalone toggle",
  render: () => {
    const [selected, setSelected] = useState(false);

    return (
      <Chip selected={selected} onSelectedChange={setSelected} icon={<Leaf strokeWidth={2} />}>
        Organic only
      </Chip>
    );
  },
};

export const Removable: Story = {
  name: "Pattern — removable",
  parameters: {
    docs: {
      description: {
        story: "Committed Find pill / applied filter — trailing × dismisses.",
      },
    },
  },
  render: () => (
    <Chip onRemove={() => undefined} icon={<MapPin strokeWidth={2} />}>
      90210
    </Chip>
  ),
};

export const ReadOnly: Story = {
  name: "Pattern — read-only",
  args: {
    readOnly: true,
    children: "SNAP",
  },
};

export const Sizes: Story = {
  name: "Sizes",
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Chip size="sm" selected>
        Small
      </Chip>
      <Chip size="md" selected>
        Medium
      </Chip>
      <Chip size="lg" selected>
        Large
      </Chip>
    </div>
  ),
};

export const WithCount: Story = {
  name: "With count",
  render: () => {
    const [filters, setFilters] = useState<string[]>([]);

    return (
      <ChipFilterGroup
        aria-label="Category filters"
        value={filters}
        onValueChange={setFilters}
      >
        <Chip value="produce" count={48}>
          Produce
        </Chip>
        <Chip value="bakery" count={6}>
          Bakery
        </Chip>
      </ChipFilterGroup>
    );
  },
};
