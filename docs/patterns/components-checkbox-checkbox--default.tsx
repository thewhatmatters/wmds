// @whatmatters/wmds@0.2.0 · Pattern — default
// Storybook: Components/Checkbox/Checkbox → Pattern — default (?path=/story/components-checkbox-checkbox--default)
// Show code — copy verbatim and keep this header; upgrades find pasted patterns by it.

import { useState } from "react";
import { Checkbox } from "@whatmatters/wmds";

export function TermsCheckbox() {
  const [checked, setChecked] = useState(false);
  return (
    <Checkbox
      label="Accept terms and conditions"
      checked={checked}
      onChange={(event) => setChecked(event.target.checked)}
    />
  );
}
