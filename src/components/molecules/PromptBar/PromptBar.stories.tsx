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

const marketingComposerCopySource = `
import { useState } from "react";
import { PromptBar } from "@whatmatters/wmds";

/**
 * Marketing homepage composer, pinned to the bottom of the viewport on the page grid.
 * Sending hands off to the ask page: route to /ask?q=<prompt>, where the ask page passes
 * \`q\` to AskWhatMatters as \`initialPrompt\`.
 * Next.js: onHandOff={(prompt) => router.push(\`/ask?q=\${encodeURIComponent(prompt)}\`)}
 */
export function MarketingComposer({ onHandOff }: { onHandOff: (prompt: string) => void }) {
  const [draft, setDraft] = useState("");

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 pb-[max(1rem,env(safe-area-inset-bottom))]">
      <div className="grid-page [--grid-max:40rem]">
        <div className="band">
          <div className="pointer-events-auto col-span-full">
            <PromptBar
              value={draft}
              onValueChange={setDraft}
              onSend={(value) => {
                const prompt = value.trim();
                if (prompt.length === 0) return;
                setDraft("");
                onHandOff(prompt);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
`.trim();

function MarketingComposer({ onHandOff }: { onHandOff: (prompt: string) => void }) {
  const [draft, setDraft] = useState("");

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 pb-[max(1rem,env(safe-area-inset-bottom))]">
      <div className="grid-page [--grid-max:40rem]">
        <div className="band">
          <div className="pointer-events-auto col-span-full">
            <PromptBar
              value={draft}
              onValueChange={setDraft}
              onSend={(value) => {
                const prompt = value.trim();
                if (prompt.length === 0) return;
                setDraft("");
                onHandOff(prompt);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function MarketingComposerSpecimen() {
  const [handOff, setHandOff] = useState<string | null>(null);

  return (
    <div className="min-h-[200vh] bg-body">
      <main className="grid-page pt-24">
        <div className="band">
          <div className="col-span-full flex flex-col gap-4 lg:col-span-8">
            <h1 className="type-display-2 text-fg">We build what matters.</h1>
            <p className="type-large text-muted">
              Scroll the page: the composer stays pinned to the bottom of the viewport.
            </p>
            <p className="type-body text-muted" aria-live="polite" data-testid="handoff">
              {handOff ? `Hands off to /ask?q=${encodeURIComponent(handOff)}` : "Send a prompt to see the hand-off URL."}
            </p>
          </div>
        </div>
      </main>
      <MarketingComposer onHandOff={setHandOff} />
    </div>
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

Wide prompt pill for a line under a headline. One field, one send control. **Pattern — prompt bar** is the composer alone. On the marketing homepage, copy **Pattern — marketing composer**: the bar pinned to the bottom of the viewport, handing off to the ask page.

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

export const PatternMarketingComposer: Story = {
  name: "Pattern — marketing composer",
  parameters: withStoryCopySource(
    {
      wmdsLayout: "fullscreen",
      docs: {
        description: {
          story:
            "**PromptBar** on the marketing homepage, pinned to the bottom of the viewport on the page grid (`--grid-max: 40rem`, the ask page's column) above the safe area. Sending hands off to the ask page — route to `/ask?q=…` and pass `q` to **AskWhatMatters** as `initialPrompt` (**Sites/WhatMatters/Prompt chat → State — opened from the marketing composer**). The wrapper ignores pointer events so the page under its edges stays clickable; only the bar takes input. It sits under **SiteNav** (`z-50`).",
        },
      },
    },
    marketingComposerCopySource,
  ),
  render: () => <MarketingComposerSpecimen />,
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
