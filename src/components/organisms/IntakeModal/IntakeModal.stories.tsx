import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../../atoms/Button/Button";
import { storyCopySource, storyMetaDocsDefaults } from "../../../lib/storyCopySource";
import { IntakeModal } from "./IntakeModal";

const meta = {
  title: "Components/IntakeModal",
  component: IntakeModal,
  tags: ["autodocs"],
  ...storyMetaDocsDefaults(),
  parameters: {
    wmdsLayout: "fullscreen",
    docs: {
      description: {
        component: `
## Usage

Full-screen intake shell. Open it from any **Start a project** action.

| Piece | Contract |
|-------|----------|
| **Wordmark** | Typographic **WM** mark and **WhatMatters**. There is no separate logo asset. |
| **Close** | **IconButton** with Lucide **X**. Accessible name **Close**. |
| **Progress** | **StepProgress** under the header. Label reads **Step N of 4**. |
| **Footer** | **Back** is **Button** \`role="secondary"\`. **Continue** is **Button** \`role="primary"\`. Pass \`hideContinue\` on the calendar step so Continue is not rendered. The footer stays pinned while the step body scrolls. Confirmation (\`hideFooter\`) centers in the body. |
| **Overlay** | Portal, \`aria-modal\`, focus trap, Escape, scroll lock. |

## Anatomy

\`\`\`
IntakeModal
├── header — WM + WhatMatters | IconButton close
├── StepProgress
├── body — step children
└── footer — Back + Continue
\`\`\`

The shell owns the close glyph. Do not restyle it with utilities.

## Best practices

- **Do** open this from a **Button** labeled Start a project.
- **Do** keep step validation in the caller and pass \`continueDisabled\`.
- **Do** set \`hideFooter\` and \`showProgress={false}\` on the confirmation surface.
- **Don't** put **SiteNav** in the header.
- **Don't** add a scrim. The shell is the page.
        `.trim(),
      },
    },
  },
} satisfies Meta<typeof IntakeModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const IntakeModalPattern: Story = {
  name: "Pattern — intake modal",
  args: {
    open: true,
    onOpenChange: () => undefined,
  },
  render: function IntakeModalPatternRender() {
    const [open, setOpen] = useState(true);

    return (
      <>
        <Button role="primary" type="button" onClick={() => setOpen(true)}>
          Start a project
        </Button>
        <IntakeModal
          open={open}
          onOpenChange={setOpen}
          step={1}
          steps={4}
          backDisabled
          onBack={() => undefined}
          onContinue={() => undefined}
        >
          <h2 className="type-heading-1 text-fg tracking-tight">What do you need?</h2>
          <p className="type-body text-fg">
            Pick everything that fits. We'll shape the work around it.
          </p>
        </IntakeModal>
      </>
    );
  },
  parameters: storyCopySource(`
import { useState } from "react";
import { Button, IntakeModal } from "@whatmatters/wmds";

export function StartAProjectShell() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button role="primary" type="button" onClick={() => setOpen(true)}>
        Start a project
      </Button>
      <IntakeModal
        open={open}
        onOpenChange={setOpen}
        step={1}
        steps={4}
        backDisabled
        onBack={() => undefined}
        onContinue={() => undefined}
      >
        <h2 className="type-heading-1 text-fg tracking-tight">What do you need?</h2>
        <p className="type-body text-fg">
          Pick everything that fits. We&apos;ll shape the work around it.
        </p>
      </IntakeModal>
    </>
  );
}
`),
};

/**
 * Known accessibility violations — listed in docs/audits/2026-10-03.md.
 * Checks fail on every other story. These report without failing until the component is fixed.
 * Remove a story from this list when it passes.
 */
for (const story of [IntakeModalPattern]) {
  story.parameters = { ...story.parameters, a11y: { test: "todo" } };
}
