// @thewhatmatters/wmds@0.4.1 · Pattern — command row
// Storybook: Components/Kbd → Pattern — command row (?path=/story/components-kbd--command-row)
// Show code — copy verbatim and keep this header; upgrades find pasted patterns by it.

import { Kbd } from "@thewhatmatters/wmds";

<div className="flex items-center justify-between gap-6">
  <span>Open command menu</span>
  <span className="inline-flex items-center gap-1">
    <Kbd aria-label="Command">⌘</Kbd>
    <Kbd>K</Kbd>
  </span>
</div>
