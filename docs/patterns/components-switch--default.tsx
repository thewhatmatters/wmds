// @thewhatmatters/wmds@0.4.6 · Pattern — default
// Storybook: Components/Switch → Pattern — default (?path=/story/components-switch--default)
// Show code — copy verbatim and keep this header; upgrades find pasted patterns by it.

import { useState } from "react";
import { Switch } from "@thewhatmatters/wmds";

export function NotificationsSwitch() {
  const [checked, setChecked] = useState(false);
  return (
    <Switch
      label="Enable notifications"
      checked={checked}
      onChange={(event) => setChecked(event.target.checked)}
    />
  );
}
