import type { Meta, StoryObj } from "@storybook/react-vite";
import { storyMetaDocsDefaults, withStoryCopySource } from "../../../lib/storyCopySource";
import { CopyField, copyFieldStates } from "./CopyField";

const sampleKey = "wm_test_4f8c2a91e0b7";

const meta = {
  title: "Components/CopyField",
  component: CopyField,
  tags: ["autodocs"],
  ...storyMetaDocsDefaults(),
  decorators: [
    (Story) => (
      <div className="mx-auto w-full max-w-md px-8 py-6">
        <Story />
      </div>
    ),
  ],
  argTypes: {
    state: { control: "select", options: [undefined, ...copyFieldStates] },
    label: { control: "text" },
    value: { control: "text" },
    copyLabel: { control: "text" },
    copiedLabel: { control: "text" },
    fallbackHint: { control: "text" },
  },
  args: {
    label: "API key",
    value: sampleKey,
    state: undefined,
  },
  parameters: {
    docs: {
      description: {
        component: `
## Usage

Read-only value the visitor copies — an API key on an unlock page. Composes **Input** (\`mono\`, \`readOnly\`) and **Button**.

| Pattern | Props |
|---------|--------|
| **Copy key** | \`label\` + \`value\`. The button reads "Copy key" |
| **Copied** | After a successful Clipboard API write, the button reads "Copied" for 2s (\`buttonStatusHoldMs\`), then returns |
| **Clipboard blocked** | The value is selected, \`execCommand('copy')\` is tried, and the hint reads "Press Cmd/Ctrl+C to copy." |

\`state\` pins "copied" or "fallback" for a specimen. Omit it in the app.

## Anatomy

\`\`\`
CopyField
├── Input (mono, readOnly) — type-code value, label
├── Button (secondary) — Copy icon, then the status check; polite live region
└── hint — polite status, only when the clipboard is blocked
\`\`\`

The button is a real button, so Enter and Space copy. The value is selected on focus, so Cmd/Ctrl+C copies it from the field too.

## Best practices

- **Do** pass the key as \`value\` and leave \`state\` unset.
- **Do** give \`label\` or \`aria-label\`.
- **Don't** log the value. The field never writes it to the console.
- **Don't** restyle the shell with \`className\` — it is layout only.
- **Don't** add a button color. The action is **Button** \`role="secondary"\`.
        `.trim(),
      },
    },
  },
} satisfies Meta<typeof CopyField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const CopyKey: Story = {
  name: "Pattern — copy key",
  args: {
    label: "API key",
    value: sampleKey,
  },
  parameters: withStoryCopySource(
    {
      docs: {
        description: {
          story:
            "A read-only key and a Copy key button. A click copies the value. The button is in the tab order.",
        },
      },
    },
    `
import { CopyField } from "@thewhatmatters/wmds";

export function UnlockKey({ apiKey }: { apiKey: string }) {
  return <CopyField label="API key" value={apiKey} />;
}
`,
  ),
};

export const Copied: Story = {
  name: "Pattern — copied",
  args: {
    label: "API key",
    value: sampleKey,
    state: "copied",
  },
  parameters: withStoryCopySource(
    {
      docs: {
        description: {
          story:
            "The confirmation. The button's polite live region announces Copied. It holds for 2s, then the label returns to Copy key. `state=\"copied\"` pins that appearance.",
        },
      },
    },
    `
import { CopyField } from "@thewhatmatters/wmds";

export function UnlockKeyCopied({ apiKey }: { apiKey: string }) {
  return <CopyField label="API key" value={apiKey} state="copied" />;
}
`,
  ),
};

export const ClipboardBlocked: Story = {
  name: "Pattern — clipboard blocked",
  args: {
    label: "API key",
    value: sampleKey,
    state: "fallback",
  },
  parameters: withStoryCopySource(
    {
      docs: {
        description: {
          story:
            "The Clipboard API was missing or blocked. The value is selected, execCommand('copy') was tried, and a polite hint tells the visitor to press Cmd/Ctrl+C. `state=\"fallback\"` pins that appearance.",
        },
      },
    },
    `
import { CopyField } from "@thewhatmatters/wmds";

export function UnlockKeyBlocked({ apiKey }: { apiKey: string }) {
  return <CopyField label="API key" value={apiKey} state="fallback" />;
}
`,
  ),
};
