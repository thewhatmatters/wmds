// @thewhatmatters/wmds@0.4.8 · Pattern — pill group
// Storybook: Components/PillGroup → Pattern — pill group (?path=/story/components-pillgroup--pill-group-pattern)
// Show code — copy verbatim and keep this header; upgrades find pasted patterns by it.

import { useState } from "react";
import { PillGroup } from "@thewhatmatters/wmds";

export function BudgetPills() {
  const [value, setValue] = useState<string | null>(null);

  return (
    <PillGroup aria-label="Budget" value={value} onValueChange={setValue}>
      <PillGroup.Item value="under-10">{"<$10k"}</PillGroup.Item>
      <PillGroup.Item value="10-25">$10–25k</PillGroup.Item>
      <PillGroup.Item value="25-50">$25–50k</PillGroup.Item>
      <PillGroup.Item value="50-plus">$50k+</PillGroup.Item>
      <PillGroup.Item value="unsure" emphasis="muted">
        Not sure yet
      </PillGroup.Item>
    </PillGroup>
  );
}
