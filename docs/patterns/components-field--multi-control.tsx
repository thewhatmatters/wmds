// @thewhatmatters/wmds@0.4.1 · Pattern — multi-control
// Storybook: Components/Field → Pattern — multi-control (?path=/story/components-field--multi-control)
// Show code — copy verbatim and keep this header; upgrades find pasted patterns by it.

import { Field, Input, Search } from "@thewhatmatters/wmds";

<Field label="Location" description="City or ZIP — search updates the map.">
  <Search placeholder="ZIP or city" aria-label="Location" actionLabel="GO" />
  <Input placeholder="Unit / suite (optional)" aria-label="Unit or suite" />
</Field>
