import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { cn } from "../../../lib/cn";
import { storyMetaDocsDefaults, withStoryCopySource } from "../../../lib/storyCopySource";
import { typographyClass } from "../../../lib/typography";
import { Checkbox } from "../Checkbox/Checkbox";
import { Kbd, kbdSizes } from "./Kbd";
import { useKbdChoiceKeys } from "./useKbdChoiceKeys";

const meta = {
  title: "Components/Kbd",
  component: Kbd,
  tags: ["autodocs"],
  ...storyMetaDocsDefaults(),
  argTypes: {
    size: { control: "select", options: [...kbdSizes] },
    children: { control: "text" },
  },
  args: {
    children: "K",
    size: "sm",
  },
  parameters: {
    docs: {
      description: {
        component: `
## Usage

Use **Kbd** to display one physical key in a shortcut, command menu, or keyboard-help surface. Compose multiple keycaps beside each other for combinations.

Numbered choice rows (starter gates, option lists) pair a trailing **Kbd** with **\`useKbdChoiceKeys\`** so digit keys select the same way a click does. **Kbd** itself stays display-only.

## Anatomy

\`\`\`
Kbd (\`kbd\`)
└── key label
\`\`\`

## Best practices

- **Do** keep labels short: \`K\`, \`⌘\`, \`Enter\`, \`Esc\`, digits, or arrow symbols.
- **Do** add \`aria-label\` when a symbol needs a spoken expansion.
- **Do** compose separate **Kbd** elements for each physical key.
- **Do** use **\`useKbdChoiceKeys\`** when digit keys should select numbered choices; keep **Kbd** as the visible keycap only.
- **Don't** make **Kbd** itself interactive; place it beside the command or choice it documents.
- **Don't** use it for status, tags, or counts—use **Badge**.
        `.trim(),
      },
    },
  },
} satisfies Meta<typeof Kbd>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Shortcut: Story = {
  name: "Pattern — keyboard shortcut",
  parameters: withStoryCopySource(
    {
      docs: {
        description: {
          story:
            "A command hint composed from one semantic keycap per physical key.",
        },
      },
    },
    `
import { Kbd } from "@whatmatters/wmds";

<span className="inline-flex items-center gap-1">
  <Kbd aria-label="Command">⌘</Kbd>
  <span aria-hidden>+</span>
  <Kbd>K</Kbd>
</span>
`,
  ),
  render: () => (
    <span className="inline-flex items-center gap-1 text-muted">
      <Kbd aria-label="Command">⌘</Kbd>
      <span aria-hidden>+</span>
      <Kbd>K</Kbd>
    </span>
  ),
};

export const CommandRow: Story = {
  name: "Pattern — command row",
  parameters: withStoryCopySource(
    {
      docs: {
        description: {
          story:
            "Keep the command label primary and align the shortcut as trailing supporting information.",
        },
      },
    },
    `
import { Kbd } from "@whatmatters/wmds";

<div className="flex items-center justify-between gap-6">
  <span>Open command menu</span>
  <span className="inline-flex items-center gap-1">
    <Kbd aria-label="Command">⌘</Kbd>
    <Kbd>K</Kbd>
  </span>
</div>
`,
  ),
  render: () => (
    <div
      className={cn(
        typographyClass("body"),
        "flex w-72 items-center justify-between gap-6 rounded-lg bg-surface px-3 py-2 text-fg shadow-hairline",
      )}
    >
      <span>Open command menu</span>
      <span className="inline-flex items-center gap-1">
        <Kbd aria-label="Command">⌘</Kbd>
        <Kbd>K</Kbd>
      </span>
    </div>
  ),
};

const numberedChoices = [
  { value: "brand", label: "Brand identity", number: "1" },
  { value: "website", label: "Website", number: "2" },
  { value: "product", label: "Product design", number: "3" },
  { value: "system", label: "Design system", number: "4" },
] as const;

function NumberedChoicesDemo() {
  const [values, setValues] = useState<string[]>([]);

  function toggle(value: string, checked: boolean) {
    if (checked) {
      setValues((current) => [...current, value]);
      return;
    }
    setValues((current) => current.filter((item) => item !== value));
  }

  useKbdChoiceKeys({
    choices: Object.fromEntries(
      numberedChoices.map((option) => [
        option.number,
        () => toggle(option.value, !values.includes(option.value)),
      ]),
    ),
  });

  return (
    <div className="flex w-80 flex-col" role="group" aria-label="What are we making?">
      {numberedChoices.map((option) => (
        <div
          key={option.value}
          className="flex w-full items-center gap-3 border-b border-border py-3 last:border-b-0"
        >
          <Checkbox
            className="min-w-0 flex-1"
            size="md"
            label={option.label}
            checked={values.includes(option.value)}
            onChange={(event) => toggle(option.value, event.target.checked)}
          />
          <Kbd className="shrink-0" aria-label={`Press ${option.number}`}>
            {option.number}
          </Kbd>
        </div>
      ))}
    </div>
  );
}

export const NumberedChoices: Story = {
  name: "Pattern — numbered choice keys",
  parameters: withStoryCopySource(
    {
      docs: {
        description: {
          story:
            "Trailing **Kbd** keycaps document the digit for each choice. **`useKbdChoiceKeys`** selects the same way a click does while focus is not in a text field. No new **Kbd** variant — the hook is the design-system select behavior.",
        },
      },
    },
    `
import { useState } from "react";
import { Checkbox, Kbd, useKbdChoiceKeys } from "@whatmatters/wmds";

const choices = [
  { value: "brand", label: "Brand identity", number: "1" },
  { value: "website", label: "Website", number: "2" },
  { value: "product", label: "Product design", number: "3" },
  { value: "system", label: "Design system", number: "4" },
];

function NumberedChoices() {
  const [values, setValues] = useState([]);

  function toggle(value, checked) {
    if (checked) {
      setValues((current) => [...current, value]);
      return;
    }
    setValues((current) => current.filter((item) => item !== value));
  }

  useKbdChoiceKeys({
    choices: Object.fromEntries(
      choices.map((option) => [
        option.number,
        () => toggle(option.value, !values.includes(option.value)),
      ]),
    ),
  });

  return (
    <div className="flex w-full flex-col" role="group" aria-label="What are we making?">
      {choices.map((option) => (
        <div key={option.value} className="flex w-full items-center gap-3 border-b border-border py-3 last:border-b-0">
          <Checkbox
            className="min-w-0 flex-1"
            size="md"
            label={option.label}
            checked={values.includes(option.value)}
            onChange={(event) => toggle(option.value, event.target.checked)}
          />
          <Kbd className="shrink-0" aria-label={"Press " + option.number}>
            {option.number}
          </Kbd>
        </div>
      ))}
    </div>
  );
}
`,
  ),
  render: () => <NumberedChoicesDemo />,
};

export const Sizes: Story = {
  name: "Reference — sizes",
  render: () => (
    <div className="flex items-end gap-4">
      {kbdSizes.map((size) => (
        <div key={size} className="flex flex-col items-center gap-2">
          <Kbd size={size}>Esc</Kbd>
          <span className={cn(typographyClass("caption"), "text-muted")}>{size}</span>
        </div>
      ))}
    </div>
  ),
};
