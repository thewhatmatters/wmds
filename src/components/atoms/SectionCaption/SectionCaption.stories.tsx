import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../Button/Button";
import { storyMetaDocsDefaults, withStoryCopySource } from "../../../lib/storyCopySource";
import { SectionCaption, sectionCaptionElements } from "./SectionCaption";

const meta = {
  title: "Components/SectionCaption",
  component: SectionCaption,
  tags: ["autodocs"],
  ...storyMetaDocsDefaults(),
  argTypes: {
    as: { control: "inline-radio", options: [...sectionCaptionElements] },
    marker: { control: "boolean" },
    rule: { control: "boolean" },
    end: { control: false },
  },
  args: {
    children: "Metadata",
    as: "h2",
    marker: true,
    rule: true,
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-sm">
        <Story />
      </div>
    ),
  ],
  parameters: {
    wmdsLayout: "centered",
    docs: {
      description: {
        component: `
## Usage

The small uppercase mono caption over a page column — "/ Metadata", "/ Article", "/ Filters" — on a hairline rule. Set in \`type-eyebrow\`.

| Pattern | Props |
|---------|--------|
| **Column caption** | \`children\` in sentence case; \`as="h2"\` (default) names a region — pair \`id\` with \`aria-labelledby\` |
| **Label only** | \`as="p"\` — labels a column without adding a heading |
| **With an action** | \`end\` — **Button** \`size="xs"\` (Clear all); it does not grow the row |
| **Bare** | \`rule={false}\`, \`marker={false}\` |

## Anatomy

\`\`\`
SectionCaption (div — rule under it)
├── h2 | h3 | h4 | p — type-eyebrow text-muted
│   ├── "/ " — aria-hidden marker
│   └── children
└── end? — an action at the row's end
\`\`\`

## Best practices

- **Do** write the caption in sentence case — screen readers read it as written; the capitals are CSS.
- **Do** keep the "/" to the \`marker\` — never type it into \`children\`, or screen readers say "slash".
- **Do** use \`as="h2"\` when the caption is the region's name, \`as="p"\` when the region already has one.
- **Don't** use it for app UI section labels inside cards — \`typographyClass("overline")\`.
        `.trim(),
      },
    },
  },
} satisfies Meta<typeof SectionCaption>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ColumnCaption: Story = {
  name: "Pattern — column caption",
  render: function ColumnCaptionRender() {
    return (
      <aside aria-labelledby="post-metadata" className="flex flex-col">
        <SectionCaption id="post-metadata">Metadata</SectionCaption>
        <p className="type-body text-muted mt-4">The column's content sits under the rule.</p>
      </aside>
    );
  },
  parameters: withStoryCopySource(
    {
      docs: {
        description: {
          story: "A caption that names its column: an `h2`, linked to the region with `aria-labelledby`. The \"/\" is decoration.",
        },
      },
    },
    `
import { useId, type ReactNode } from "react";
import { SectionCaption } from "@thewhatmatters/wmds";

export function MetadataColumn({ children }: { children: ReactNode }) {
  const headingId = useId();
  return (
    <aside aria-labelledby={headingId} className="flex flex-col">
      <SectionCaption id={headingId}>Metadata</SectionCaption>
      {children}
    </aside>
  );
}
`,
  ),
};

export const WithAction: Story = {
  name: "Pattern — caption with an action",
  render: function WithActionRender() {
    const [active, setActive] = useState(2);
    return (
      <SectionCaption
        end={
          <Button role="ghost" size="xs" disabled={active === 0} onClick={() => setActive(0)}>
            Clear all
          </Button>
        }
      >
        Filters
      </SectionCaption>
    );
  },
  parameters: withStoryCopySource(
    {
      docs: {
        description: {
          story: "An action at the row's end. A 28px **Button** `size=\"xs\"` sits in the 16px caption line without growing it.",
        },
      },
    },
    `
import { Button, SectionCaption } from "@thewhatmatters/wmds";

export function FiltersCaption({ activeCount, onClear }: { activeCount: number; onClear: () => void }) {
  return (
    <SectionCaption
      end={
        <Button role="ghost" size="xs" disabled={activeCount === 0} onClick={onClear}>
          Clear all
        </Button>
      }
    >
      Filters
    </SectionCaption>
  );
}
`,
  ),
};

export const Variants: Story = {
  name: "Reference — marker and rule",
  render: () => (
    <div className="flex flex-col gap-8">
      <SectionCaption as="p">Article</SectionCaption>
      <SectionCaption as="p" marker={false}>
        Without the marker
      </SectionCaption>
      <SectionCaption as="p" rule={false}>
        Without the rule
      </SectionCaption>
    </div>
  ),
};
