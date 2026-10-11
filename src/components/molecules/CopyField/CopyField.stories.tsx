import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../../atoms/Button/Button";
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

Read-only value the visitor copies — an API key on an unlock page. The pill is **PromptBar**'s shell. **Input** (\`inline\`, \`mono\`, \`readOnly\`) is the value; **Button** \`role="secondary"\` \`size="sm"\` sits at the trailing end, the way PromptBar seats send. A long value truncates in the track. It does not run under the button.

| Pattern | Props |
|---------|--------|
| **Copy key** | \`label\` + \`value\`. The button reads "Copy key" |
| **Copied** | After a successful Clipboard API write, the button reads "Copied" for 2s (\`buttonStatusHoldMs\`), then returns |
| **Clipboard blocked** | The value is selected, \`execCommand('copy')\` is tried, and the hint reads "Press Cmd/Ctrl+C to copy." |

\`state\` pins "copied" or "fallback" for a specimen. Omit it in the app.

## Anatomy

\`\`\`
CopyField
├── label — type-label, color inherited (a \`text-on-brand\` parent paints it)
├── PromptBar shell
│   ├── Input (inline, mono, readOnly) — type-code value, truncates
│   └── Button (secondary, sm) — Copy icon, then the status check; polite live region
└── hint — polite status, only when the clipboard is blocked
\`\`\`

The button is a real button, so Enter and Space copy. The value is selected on focus, so Cmd/Ctrl+C copies it from the field too.

## Best practices

- **Do** pass the key as \`value\` and leave \`state\` unset.
- **Do** give \`label\` or \`aria-label\`.
- **Don't** log the value. The field never writes it to the console.
- **Don't** restyle the shell with \`className\` — it is layout only.
- **Don't** add a button color. The action inside the pill is **Button** \`role="secondary"\`.
- **Do** on a navy field wrap the section in \`bg-brand text-on-brand\`. The label and hint inherit. Actions beside the field are **Button** \`role="inverse"\` and \`role="inverse-outline"\`. Paste **Pattern — on a navy field**. Don't put \`data-theme="dark"\` on that section.
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
            "A read-only key with Copy key seated inside the pill. A click copies the value. A long key truncates and stays clear of the button. The button is in the tab order.",
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

export const OnNavy: Story = {
  name: "Pattern — on a navy field",
  parameters: withStoryCopySource(
    {
      docs: {
        description: {
          story:
            "The unlock page sits on brand navy. The section is `bg-brand text-on-brand`, so the label and hint inherit white. The pill stays a surface, and the key stays dark on it. Continue is **Button** `role=\"inverse\"`. Back is `role=\"inverse-outline\"` (on-brand hairline). Do not set `data-theme=\"dark\"` here — the dark surface is about 1:1 on this navy, so the pill and a secondary button disappear.",
        },
      },
    },
    `
import { Button, CopyField } from "@thewhatmatters/wmds";

export function UnlockOnBrand({
  apiKey,
  onContinue,
  onSecondary,
}: {
  apiKey: string;
  onContinue: () => void;
  onSecondary: () => void;
}) {
  return (
    <section className="flex w-full flex-col gap-4 bg-brand px-6 py-8 text-on-brand">
      <CopyField label="API key" value={apiKey} />
      <div className="flex flex-wrap gap-2">
        <Button role="inverse" type="button" onClick={onContinue}>
          Continue
        </Button>
        <Button role="inverse-outline" type="button" onClick={onSecondary}>
          Back
        </Button>
      </div>
    </section>
  );
}
`,
  ),
  render: function OnNavyRender() {
    return (
      <section className="flex w-full flex-col gap-4 bg-brand px-6 py-8 text-on-brand">
        <CopyField label="API key" value={sampleKey} />
        <div className="flex flex-wrap gap-2">
          <Button role="inverse" type="button" onClick={() => undefined}>
            Continue
          </Button>
          <Button role="inverse-outline" type="button" onClick={() => undefined}>
            Back
          </Button>
        </div>
      </section>
    );
  },
};
