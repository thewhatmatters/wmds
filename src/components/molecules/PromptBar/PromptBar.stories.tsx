import { useState, type ReactNode } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { storyMetaDocsDefaults, withStoryCopySource } from "../../../lib/storyCopySource";
import { storybookViewports } from "../../../lib/viewports";
import { Avatar } from "../../atoms/Avatar/Avatar";
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
import { PromptBar } from "@thewhatmatters/wmds";

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

Wide prompt pill for a line under a headline. One field, one send control. **Pattern — prompt bar** is the composer alone. The site assistant pinned to the bottom of the page is **ChatDock**, which composes this bar — copy **Components/ChatDock → Pattern — chat dock**.

Voice and attachments are not part of this version.

| Piece | Composition |
|-------|-------------|
| **Field** | \`TextArea inline\` — one line when empty, grows through 3 lines, then scrolls |
| **Send** | \`IconButton\` \`sm\` — Lucide **ArrowRight**, inset with even padding. Muted while empty |
| **Fill** | \`--color-brand\` / \`--color-on-brand\` (\`#011272\`) when there is text |
| **\`start\`** | Optional leading slot — a brand mark, **Avatar** \`size="md"\` (2.25rem, the send circle's size) |
| **\`end\`** | Optional slot before send for another inset **IconButton** \`sm\`. The caller owns its handler and name |
| **\`variant\`** | \`surface\` (default) is the solid pill. \`glass\` is a frosted pane for a bar over a picture, a video or a canvas: **Card**'s glass, with the same \`--card-glass-tint\` and \`--card-glass-blur\` knobs, under a hairline edge instead of the control border |

Enter sends. Shift+Enter inserts a newline. Placeholder is **Ask anything…**.

## Anatomy

\`\`\`
PromptBar — pill shell, bg-surface, one border
├── start (optional) — mark, 2.25rem
├── TextArea inline — 1 line empty, max 3, then scroll
├── end (optional) — extra inset controls
└── IconButton sm — ArrowRight, even inset
    muted until the draft has text
    brand navy when it can send
    no second focus ring
\`\`\`

## Best practices

- **Do** copy **Pattern — prompt bar**. \`className\` is width and margin only.
- **Do** keep the send control disabled until the draft has non-whitespace text.
- **Do** use \`variant="glass"\` only where something sits behind the bar. Keep the default tint over a backdrop you don't control; lower \`--card-glass-tint\` only over one you know, and check the placeholder against its brightest spot.
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

export const WithMark: Story = {
  name: "With mark",
  globals: {
    viewport: { value: "review1440", isRotated: false },
  },
  parameters: {
    docs: {
      description: {
        story:
          "`start` holds the brand mark — **Avatar** `size=\"md\"`, the send circle's size, with the same inset. **ChatDock** uses this bar at rest.",
      },
    },
  },
  render: () => (
    <PromptBarFrame>
      <PromptBar start={<Avatar name="WhatMatters" size="md" />} placeholder="Ask anything about WhatMatters" />
    </PromptBarFrame>
  ),
};

// A stand-in picture with light and dark areas (the same one Card's glass story uses).
const glassBackdropStyle = {
  backgroundImage: [
    "radial-gradient(circle at 18% 28%, rgb(255 214 153) 0 14%, transparent 15%)",
    "radial-gradient(circle at 78% 70%, rgb(22 60 94) 0 22%, transparent 23%)",
    "repeating-linear-gradient(115deg, rgb(120 170 190) 0 28px, rgb(214 232 236) 28px 56px)",
  ].join(", "),
};

export const Glass: Story = {
  name: "Glass over a picture",
  globals: {
    viewport: { value: "review1440", isRotated: false },
  },
  parameters: {
    docs: {
      description: {
        story:
          "`variant=\"glass\"` frosts the pill: the surface colour at part strength over a blur of what's behind (**Card**'s glass and its knobs), under Card's hairline edge: the bar is told apart by its fill, its placeholder and the send button, not by a ring. The placeholder steps up to the text colour at 80%, so a bright backdrop can't swallow it. Solid where the browser has no backdrop filter, and when the visitor asks for less transparency. **ChatDock** takes it as `variant=\"glass\"`.",
      },
    },
  },
  render: () => (
    <div className="flex h-full min-h-full w-full flex-1 items-center justify-center px-4" style={glassBackdropStyle}>
      <div className="w-full max-w-3xl">
        <PromptBar variant="glass" placeholder="Ask about our work" />
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const shell = canvasElement.querySelector<HTMLElement>("[data-variant='glass']")!;
    const style = getComputedStyle(shell);
    // The surface colour at the theme's default strength: the picture shows through, blurred.
    const tint = Number.parseFloat(style.getPropertyValue("--card-glass-tint-default")) / 100;
    await expect([0.7, 0.88]).toContain(tint);
    await expect(style.backgroundColor).toMatch(new RegExp(`[/,] ?${tint}\\)$`));
    await expect(style.backdropFilter).toContain("blur(12px)");
    // A hairline edge, lighter than the solid bar's control border.
    await expect(style.borderTopWidth).toBe("1px");
    await expect(style.boxShadow).toBe("none");
  },
};
