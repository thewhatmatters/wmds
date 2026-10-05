// @thewhatmatters/wmds@0.4.6 · Pattern — with description
// Storybook: Components/Checkbox/Checkbox → Pattern — with description (?path=/story/components-checkbox-checkbox--with-description)
// Show code — copy verbatim and keep this header; upgrades find pasted patterns by it.

import { useState } from "react";
import { Checkbox } from "@thewhatmatters/wmds";

export function NewsletterCheckbox() {
  const [checked, setChecked] = useState(false);
  return (
    <Checkbox
      label="Subscribe to newsletter"
      description="Receive weekly updates about new features and announcements."
      checked={checked}
      onChange={(event) => setChecked(event.target.checked)}
    />
  );
}
