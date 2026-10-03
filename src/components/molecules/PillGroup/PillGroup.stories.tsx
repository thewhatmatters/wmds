import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { storyCopySource, storyMetaDocsDefaults } from "../../../lib/storyCopySource";
import { PillGroup } from "./PillGroup";

const meta = {
  title: "Components/PillGroup",
  component: PillGroup,
  tags: ["autodocs"],
  ...storyMetaDocsDefaults(),
  parameters: {
    wmdsLayout: "padded",
    docs: {
      description: {
        component: `
## Usage

Single-select pills that wrap. Each item is a radio. **Not sure yet** uses \`emphasis="muted"\`.

Idle pills use the existing **Badge** neutral surfaces. \`solid\` is the raised neutral pill. \`muted\` is **Badge** \`emphasis="muted"\` — the same fill without the raised shadow. Selected pills use brand navy (\`--color-brand\`). That selected fill belongs to **PillGroup**. It is not a Badge variant.

## Anatomy

\`\`\`
PillGroup — role="radiogroup"
└── PillGroup.Item — radio pill, wraps
\`\`\`

## Best practices

- **Do** use one group for a budget or similar single choice.
- **Do** mark the uncertain option with \`emphasis="muted"\`.
- **Don't** add a Badge emphasis for this pill. The muted surface already exists.
- **Don't** use **SegmentedControl** when the options must wrap onto more than one line.
        `.trim(),
      },
    },
  },
} satisfies Meta<typeof PillGroup>;

export default meta;
/** Stories that pass required props in their own JSX — args stay optional. */
type Story = StoryObj<typeof PillGroup>;

export const PillGroupPattern: Story = {
  name: "Pattern — pill group",
  args: {
    "aria-label": "Budget",
    value: "10-25",
    onValueChange: () => undefined,
  },
  render: function PillGroupPatternRender() {
    const [value, setValue] = useState<string | null>("10-25");

    return (
      <PillGroup aria-label="Budget" value={value} onValueChange={setValue}>
        <PillGroup.Item value="under-10">{"<$10k"}</PillGroup.Item>
        <PillGroup.Item value="10-25">$10–25k</PillGroup.Item>
        <PillGroup.Item value="25-50">$25–50k</PillGroup.Item>
        <PillGroup.Item value="50-plus">$50k+</PillGroup.Item>
        <PillGroup.Item value="unsure" emphasis="muted">
          Not sure yet
        </PillGroup.Item>
      </PillGroup>
    );
  },
  parameters: storyCopySource(`
import { useState } from "react";
import { PillGroup } from "@thewhatmatters/wmds";

export function BudgetPills() {
  const [value, setValue] = useState<string | null>(null);

  return (
    <PillGroup aria-label="Budget" value={value} onValueChange={setValue}>
      <PillGroup.Item value="under-10">{"<$10k"}</PillGroup.Item>
      <PillGroup.Item value="10-25">$10–25k</PillGroup.Item>
      <PillGroup.Item value="25-50">$25–50k</PillGroup.Item>
      <PillGroup.Item value="50-plus">$50k+</PillGroup.Item>
      <PillGroup.Item value="unsure" emphasis="muted">
        Not sure yet
      </PillGroup.Item>
    </PillGroup>
  );
}
`),
};
