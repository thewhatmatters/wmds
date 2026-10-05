// @thewhatmatters/wmds@0.4.6 · Pattern — settings row
// Storybook: Components/Switch → Pattern — settings row (?path=/story/components-switch--settings-row)
// Show code — copy verbatim and keep this header; upgrades find pasted patterns by it.

import { useState } from "react";
import { Switch } from "@thewhatmatters/wmds";

export function WeeklyDigestSwitch() {
  const [checked, setChecked] = useState(true);
  return (
    <Switch
      layout="settings"
      label="Weekly digest"
      description="A personalized summary sent every Monday morning."
      checked={checked}
      onChange={(event) => setChecked(event.target.checked)}
    />
  );
}
