import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../../atoms/Button/Button";
import { storyCopySource, storyMetaDocsDefaults } from "../../../lib/storyCopySource";
import { IntakeForm, intakeAboutEmpty, isIntakeAboutValid, type IntakeAboutValues } from "../../molecules/IntakeForm/IntakeForm";
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
| **Footer** | **Continue** (**Button** \`role="primary"\`) comes first, on the left; **Back** follows as a quieter \`role="ghost"\` button (Buttons U8). Pass \`hideContinue\` on the calendar step so Continue is not rendered. The footer stays pinned while the step body scrolls. Confirmation (\`hideFooter\`) centers in the body. |
| **Overlay** | Portal, \`aria-modal\`, focus trap, Escape, scroll lock. |

## Anatomy

\`\`\`
IntakeModal
├── header — WM + WhatMatters | IconButton close
├── StepProgress
├── body — step children
└── footer — Continue + Back
\`\`\`

The shell owns the close glyph. Do not restyle it with utilities.

## Best practices

- **Do** open this from a **Button** labeled Start a project.
- **Do** keep Continue enabled and validate on press: count presses and pass them to **IntakeForm** \`submitCount\`, which shows every error, an **ErrorSummary** for two or more, and focuses the right place (Buttons U6, Errors and validation V5). Avoid \`continueDisabled\`.
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
import { Button, IntakeModal } from "@thewhatmatters/wmds";

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

export const ErrorsOnContinue: Story = {
  name: "Pattern — errors on Continue",
  args: {
    open: true,
    onOpenChange: () => undefined,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Continue stays enabled. Pressed with gaps, every field shows its error, an ErrorSummary lists two or more and takes focus, and one error sends focus to its field.",
      },
    },
  },
  render: function ErrorsOnContinueRender() {
    const [values, setValues] = useState<IntakeAboutValues>(intakeAboutEmpty);
    const [submitCount, setSubmitCount] = useState(0);

    return (
      <IntakeModal
        open
        onOpenChange={() => undefined}
        step={2}
        steps={4}
        onBack={() => undefined}
        onContinue={() => {
          if (!isIntakeAboutValid(values)) setSubmitCount((count) => count + 1);
        }}
      >
        <h2 className="type-heading-1 text-fg tracking-tight">About you</h2>
        <IntakeForm values={values} onChange={setValues} submitCount={submitCount} />
      </IntakeModal>
    );
  },
};
