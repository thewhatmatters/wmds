import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../../atoms/Button/Button";
import { storyCopySource, storyMetaDocsDefaults } from "../../../lib/storyCopySource";
import { IntakeForm, intakeAboutEmpty, isIntakeAboutValid, type IntakeAboutValues } from "../../molecules/IntakeForm/IntakeForm";
import { IntakeModal } from "./IntakeModal";
import { SketchRequestFlow } from "../../../storybook/SketchRequest/SketchRequestFlow";

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
| **Progress** | **StepProgress** under the header. Two steps by default (**Step 1 of 2** details, **Step 2 of 2** the optional booking); the confirmation isn't counted. At most 3 steps, and only when a later step depends on earlier answers (Contact and booking forms T7). |
| **Close** with answers | \`hasAnswers\` makes Close and Escape ask "Discard your answers?" (Keep editing / Discard) (T9). |
| **URL** | **useIntakeUrlState**("sketch") keeps \`?sketch\` in the URL while it's open: shareable, survives a refresh, Back closes it. The same form also lives on its own page; the modal is a shortcut (T9). |
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
          steps={2}
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
        steps={2}
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
        steps={2}
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
  // Axe runs after play: let the modal finish fading in first, or it reads half-faded text as low contrast.
  play: async () => {
    await new Promise((resolve) => setTimeout(resolve, 800));
  },
};

export const SketchRequest: Story = {
  name: "Pattern — sketch request (details, optional booking, confirmation)",
  args: { open: false, onOpenChange: () => undefined },
  parameters: {
    docs: {
      description: {
        story: [
          "Contact and booking forms (T1–T9).",
          "- **Steps:** details on one step, then an optional booking (Step 2 of 2), then the confirmation. Back keeps every answer.",
          "- **Send:** the button says what happens (\"Send my request\") and the reply time sits under the form. The request is sent before the booking step, so skipping the calendar loses nothing.",
          "- **Booking:** \"Skip, just email me\" sits above the calendar, so it's visible at 390 without scrolling past the month.",
          "- **Confirmation:** what we got, when we reply, and how to reach us, on its own screen (never a toast alone).",
          "- **Spam:** **IntakeHoneypot** (hidden from everyone, bots fill it) plus server-side checks. No CAPTCHA.",
          "- **Page and modal:** the form also lives on its own page (\`/sketch\`); this modal is a shortcut from the nav and hero. **useIntakeUrlState** puts \`?sketch\` in the URL, so the link can be shared, a refresh reopens it and Back closes it. With typed answers, closing asks \"Discard your answers?\" (\`hasAnswers\`).",
        ].join("\n"),
      },
    },
  },
  render: () => <SketchRequestFlow />,
};

export const SendFailed: Story = {
  name: "Pattern — send failed",
  args: { open: false, onOpenChange: () => undefined },
  parameters: {
    docs: {
      description: {
        story:
          "A failed send keeps every answer, says what happened, and offers Try again (the same button) and another route (email) (T6). Press Send my request with the form filled to see it; the second press goes through.",
      },
    },
  },
  render: () => <SketchRequestFlow failFirstSend />,
};
