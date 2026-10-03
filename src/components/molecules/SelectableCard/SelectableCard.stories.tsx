import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { storyCopySource, storyMetaDocsDefaults } from "../../../lib/storyCopySource";
import { SegmentedControl } from "../SegmentedControl/SegmentedControl";
import { SelectableCard } from "./SelectableCard";

const options = [
  {
    value: "brand",
    title: "Brand identity",
    description: "Name, mark, and a system you can actually use.",
  },
  {
    value: "website",
    title: "Website",
    description: "A site that explains the work and earns the next conversation.",
  },
  {
    value: "product",
    title: "Product design",
    description: "Flows, screens, and the details in between.",
  },
  {
    value: "marketing",
    title: "Marketing site",
    description: "A campaign page with one clear ask.",
  },
  {
    value: "system",
    title: "Design system",
    description: "Components, tokens, and the rules that keep them honest.",
  },
  {
    value: "other",
    title: "Other",
    description: "Something that does not fit the list yet.",
  },
] as const;

const meta = {
  title: "Components/Card/SelectableCard",
  component: SelectableCard,
  tags: ["autodocs"],
  ...storyMetaDocsDefaults(),
  parameters: {
    wmdsLayout: "padded",
    docs: {
      description: {
        component: `
## Usage

Multi-select card grid. Each card is a checkbox. Two columns on mobile, three from \`lg\`.

The \`toggle\` slot sits above the grid. Put a hugged **SegmentedControl** there for Starting fresh / Refreshing what I have.

## Anatomy

\`\`\`
SelectableCard.Group
├── toggle — SegmentedControl layout="hug"
└── grid
    └── SelectableCard — checkbox, title, description, check
\`\`\`

Checked cards show **Badge** \`iconOnly\` with a Lucide check. The shell owns that glyph. Unchecked cards keep an empty corner circle.

## Best practices

- **Do** require at least one card before Continue.
- **Do** keep **SegmentedControl** on \`layout="hug"\`.
- **Don't** stretch the toggle across the grid.
- **Don't** replace the check with a hand-rolled icon.
        `.trim(),
      },
    },
  },
} satisfies Meta<typeof SelectableCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SelectableCardsPattern: Story = {
  name: "Pattern — selectable cards",
  args: {
    value: "brand",
    title: "Brand identity",
  },
  render: function SelectableCardsPatternRender() {
    const [mode, setMode] = useState("fresh");
    const [values, setValues] = useState<string[]>(["brand"]);

    return (
      <div className="w-full max-w-3xl">
        <SelectableCard.Group
          label="What do you need?"
          values={values}
          onValuesChange={setValues}
          toggle={
            <SegmentedControl
              aria-label="Project starting point"
              layout="hug"
              value={mode}
              onValueChange={setMode}
            >
              <SegmentedControl.Item value="fresh">Starting fresh</SegmentedControl.Item>
              <SegmentedControl.Item value="refresh">Refreshing what I have</SegmentedControl.Item>
            </SegmentedControl>
          }
        >
          {options.map((option) => (
            <SelectableCard
              key={option.value}
              value={option.value}
              title={option.title}
              description={option.description}
            />
          ))}
        </SelectableCard.Group>
      </div>
    );
  },
  parameters: storyCopySource(`
import { useState } from "react";
import { SegmentedControl, SelectableCard } from "@thewhatmatters/wmds";

const options = [
  { value: "brand", title: "Brand identity", description: "Name, mark, and a system you can actually use." },
  { value: "website", title: "Website", description: "A site that explains the work and earns the next conversation." },
  { value: "product", title: "Product design", description: "Flows, screens, and the details in between." },
  { value: "marketing", title: "Marketing site", description: "A campaign page with one clear ask." },
  { value: "system", title: "Design system", description: "Components, tokens, and the rules that keep them honest." },
  { value: "other", title: "Other", description: "Something that does not fit the list yet." },
];

export function WhatYouNeed() {
  const [mode, setMode] = useState("fresh");
  const [values, setValues] = useState(["brand"]);

  return (
    <SelectableCard.Group
      label="What do you need?"
      values={values}
      onValuesChange={setValues}
      toggle={
        <SegmentedControl
          aria-label="Project starting point"
          layout="hug"
          value={mode}
          onValueChange={setMode}
        >
          <SegmentedControl.Item value="fresh">Starting fresh</SegmentedControl.Item>
          <SegmentedControl.Item value="refresh">Refreshing what I have</SegmentedControl.Item>
        </SegmentedControl>
      }
    >
      {options.map((option) => (
        <SelectableCard
          key={option.value}
          value={option.value}
          title={option.title}
          description={option.description}
        />
      ))}
    </SelectableCard.Group>
  );
}
`),
};
