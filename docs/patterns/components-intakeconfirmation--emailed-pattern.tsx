// @whatmatters/wmds@0.2.0 · Pattern — emailed
// Storybook: Components/IntakeConfirmation → Pattern — emailed (?path=/story/components-intakeconfirmation--emailed-pattern)
// Show code — copy verbatim and keep this header; upgrades find pasted patterns by it.

import { ConfettiProvider, IntakeConfirmation } from "@whatmatters/wmds";

export function Emailed() {
  return (
    <ConfettiProvider>
      <IntakeConfirmation variant="emailed" onDone={() => undefined} />
    </ConfettiProvider>
  );
}
