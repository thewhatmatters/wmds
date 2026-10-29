// @thewhatmatters/wmds@0.4.35 · Pattern — emailed
// Storybook: Components/IntakeConfirmation → Pattern — emailed (?path=/story/components-intakeconfirmation--emailed-pattern)
// Show code — copy verbatim and keep this header; upgrades find pasted patterns by it.

import { ConfettiProvider, IntakeConfirmation } from "@thewhatmatters/wmds";

export function Emailed() {
  return (
    <ConfettiProvider>
      <IntakeConfirmation
        variant="emailed"
        email="maria@cinderandsotol.com"
        summary="A new site before spring."
        contact="Prefer to talk? (512) 555-0148 · Mon–Fri, 9–5"
        onDone={() => undefined}
      />
    </ConfettiProvider>
  );
}
