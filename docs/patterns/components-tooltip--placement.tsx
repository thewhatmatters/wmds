// @whatmatters/wmds@0.2.0 · Pattern — placement
// Storybook: Components/Tooltip → Pattern — placement (?path=/story/components-tooltip--placement)
// Show code — copy verbatim and keep this header; upgrades find pasted patterns by it.

import { Button, Tooltip } from "@whatmatters/wmds";

<Tooltip>
  <Tooltip.Trigger render={<Button role="secondary">Details</Button>} />
  <Tooltip.Content side="inline-end" align="center">
    View market details
  </Tooltip.Content>
</Tooltip>
