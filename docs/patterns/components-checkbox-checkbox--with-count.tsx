// @thewhatmatters/wmds@0.4.1 · Pattern — with count
// Storybook: Components/Checkbox/Checkbox → Pattern — with count (?path=/story/components-checkbox-checkbox--with-count)
// Show code — copy verbatim and keep this header; upgrades find pasted patterns by it.

import { useState } from "react";
import { Checkbox } from "@thewhatmatters/wmds";

export function GuidesFilter() {
  const [checked, setChecked] = useState(false);
  return (
    <Checkbox
      label="Guides"
      count={2}
      countLabel="2 posts"
      checked={checked}
      onChange={(event) => setChecked(event.target.checked)}
    />
  );
}
