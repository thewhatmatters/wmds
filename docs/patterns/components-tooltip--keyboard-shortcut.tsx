// @thewhatmatters/wmds@0.4.9 · Pattern — keyboard shortcut
// Storybook: Components/Tooltip → Pattern — keyboard shortcut (?path=/story/components-tooltip--keyboard-shortcut)
// Show code — copy verbatim and keep this header; upgrades find pasted patterns by it.

import { IconButton, Kbd, Tooltip } from "@thewhatmatters/wmds";
import { Info } from "lucide-react";

<Tooltip>
  <Tooltip.Trigger
    render={<IconButton icon={<Info />} aria-label="Show details" title="" />}
  />
  <Tooltip.Content>
    <span className="inline-flex items-center gap-2">
      Show details <Kbd>D</Kbd>
    </span>
  </Tooltip.Content>
</Tooltip>
