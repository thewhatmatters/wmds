// @thewhatmatters/wmds@0.4.2 · Pattern — horizontal textarea
// Storybook: Components/Field → Pattern — horizontal textarea (?path=/story/components-field--horizontal-text-area)
// Show code — copy verbatim and keep this header; upgrades find pasted patterns by it.

import { Field, TextArea } from "@thewhatmatters/wmds";

<Field label="Notes" description="Visible to admins only." orientation="horizontal">
  <TextArea placeholder="Add context…" aria-label="Notes" rows={3} />
</Field>
