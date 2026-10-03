// @thewhatmatters/wmds@0.3.0 · Pattern — controlled state
// Storybook: Components/Tooltip → Pattern — controlled state (?path=/story/components-tooltip--controlled)
// Show code — copy verbatim and keep this header; upgrades find pasted patterns by it.

import { useState } from "react";
import { IconButton, Tooltip } from "@thewhatmatters/wmds";
import { Info } from "lucide-react";

export function ControlledTooltip() {
  const [open, setOpen] = useState(false);

  return (
    <Tooltip open={open} onOpenChange={setOpen}>
      <Tooltip.Trigger
        render={<IconButton icon={<Info />} aria-label="About scoring" title="" />}
      />
      <Tooltip.Content>How recommendation scoring works</Tooltip.Content>
    </Tooltip>
  );
}
