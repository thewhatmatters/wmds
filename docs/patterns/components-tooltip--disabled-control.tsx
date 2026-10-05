// @thewhatmatters/wmds@0.4.4 · Pattern — disabled control
// Storybook: Components/Tooltip → Pattern — disabled control (?path=/story/components-tooltip--disabled-control)
// Show code — copy verbatim and keep this header; upgrades find pasted patterns by it.

import { Button, Tooltip } from "@thewhatmatters/wmds";

<Tooltip>
  <Tooltip.Trigger
    render={
      <span
        className="inline-flex"
        tabIndex={0}
        aria-label="Export unavailable"
      >
        <Button disabled>Export</Button>
      </span>
    }
  />
  <Tooltip.Content>Choose a date range before exporting</Tooltip.Content>
</Tooltip>
