import { useState, type ReactNode } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { storyMetaDocsDefaults, withStoryCopySource } from "../../../lib/storyCopySource";
import { storybookViewports } from "../../../lib/viewports";
import { PromptBar } from "./PromptBar";

const reviewViewports = {
  ...storybookViewports,
  review1440: {
    name: "Review 1440",
    styles: { width: "1440px", height: "900px" },
    type: "desktop" as const,
  },
  review390: {
    name: "Review 390",
    styles: { width: "390px", height: "844px" },
    type: "mobile" as const,
  },
};

const promptBarCopySource = `
import { useState } from "react";
import { PromptBar } from "@whatmatters/wmds";

export function AskPrompt() {
  const [draft, setDraft] = useState("");

  return (
    <PromptBar
      value={draft}
      onValueChange={setDraft}
      onSend={() => {
        setDraft("");
      }}
    />
  );
}
`.trim();

function AskPrompt() {
  const [draft, setDraft] = useState("");

  return (
    <PromptBar
      value={draft}
      onValueChange={setDraft}
      onSend={() => {
        setDraft("");
      }}
    />
  );
}

function PromptBarFrame({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-full min-h-full w-full flex-1 items-center justify-center bg-body px-4">
      <div className="w-full max-w-3xl">{children}</div>
    </div>
  );
}

const meta = {
  title: "Components/PromptBar",
  component: PromptBar,
  tags: ["autodocs"],
  ...storyMetaDocsDefaults(),
  parameters: {
    wmdsLayout: "fullscreen",
    viewport: {
      options: reviewViewports,
    },
    docs: {
      description: {
        component: `
## Usage

Wide prompt pill for a line under a headline. One field, one send control. This story is the composer alone — it is not mounted on the marketing page.

Voice and attachments are not part of this version.

| Piece | Composition |
|-------|-------------|
| **Field** | \`TextArea inline\` — one line when empty, grows through 3 lines, then scrolls |
| **Send** | \`IconButton\` \`sm\` — Lucide **ArrowRight**, inset with even padding. Muted while empty |
| **Fill** | \`--color-brand\` / \`--color-on-brand\` (\`#011272\`) when there is text |

Enter sends. Shift+Enter inserts a newline. Placeholder is **Ask anything…**.

## Anatomy

\`\`\`
PromptBar — pill shell, bg-surface, one border
├── TextArea inline — 1 line empty, max 3, then scroll
└── IconButton sm — ArrowRight, even inset
    muted until the draft has text
    brand navy when it can send
    no second focus ring
\`\`\`

## Best practices

- **Do** copy **Pattern — prompt bar**. \`className\` is width and margin only.
- **Do** keep the send control disabled until the draft has non-whitespace text.
- **Don't** add a new Button role or a new blue. The navy is the existing brand token.
- **Don't** add voice, dictation, attachments, a plus menu, sources, slash commands, or a model picker here. Those are not part of this version.
        `.trim(),
      },
    },
  },
} satisfies Meta<typeof PromptBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PatternPromptBar: Story = {
  name: "Pattern — prompt bar",
  globals: {
    viewport: { value: "review1440", isRotated: false },
  },
  parameters: withStoryCopySource(
    {
      docs: {
        description: {
          story:
            "Alone on the page background at 1440. Placeholder Ask anything…. The send control stays disabled until there is text, then uses brand navy (#011272). Enter sends. Voice and attachments are not part of this version.",
        },
      },
    },
    promptBarCopySource,
  ),
  render: () => (
    <PromptBarFrame>
      <AskPrompt />
    </PromptBarFrame>
  ),
};

export const At390: Story = {
  name: "At 390",
  globals: {
    viewport: { value: "review390", isRotated: false },
  },
  parameters: {
    docs: {
      description: {
        story:
          "The same composer at 390 on the page background. Voice and attachments are not part of this version.",
      },
    },
  },
  render: () => (
    <PromptBarFrame>
      <AskPrompt />
    </PromptBarFrame>
  ),
};

export const WithText: Story = {
  name: "With text",
  globals: {
    viewport: { value: "review1440", isRotated: false },
  },
  parameters: {
    docs: {
      description: {
        story:
          "Three lines of text. The pill stops there and the field scrolls. The send circle sits inside with even padding and uses brand navy (#011272). Voice and attachments are not part of this version.",
      },
    },
  },
  render: () => (
    <PromptBarFrame>
      <PromptBar defaultValue={"How should we name the work we are starting?\nWhat should the first screen say when someone arrives?\nKeep the third line inside the pill, then scroll."} />
    </PromptBarFrame>
  ),
};
