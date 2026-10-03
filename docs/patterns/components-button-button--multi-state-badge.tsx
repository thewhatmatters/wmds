// @whatmatters/wmds@0.2.0 · Pattern — submit / async
// Storybook: Components/Button/Button → Pattern — submit / async (?path=/story/components-button-button--multi-state-badge)
// Show code — copy verbatim and keep this header; upgrades find pasted patterns by it.

import { useState } from "react";
import { Button, getNextButtonStatus, type ButtonStatus } from "@whatmatters/wmds";

function SubmitForm() {
  const [status, setStatus] = useState<ButtonStatus>("idle");

  return (
    <Button status={status} onClick={() => setStatus(getNextButtonStatus(status))}>
      Submit
    </Button>
  );
}
