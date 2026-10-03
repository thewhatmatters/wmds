// @whatmatters/wmds@0.2.0 · Pattern — intake modal
// Storybook: Components/IntakeModal → Pattern — intake modal (?path=/story/components-intakemodal--intake-modal-pattern)
// Show code — copy verbatim and keep this header; upgrades find pasted patterns by it.

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
