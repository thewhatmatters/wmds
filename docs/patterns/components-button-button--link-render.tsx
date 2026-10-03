// @thewhatmatters/wmds@0.2.0 · Pattern — link
// Storybook: Components/Button/Button → Pattern — link (?path=/story/components-button-button--link-render)
// Show code — copy verbatim and keep this header; upgrades find pasted patterns by it.

import { Button } from "@thewhatmatters/wmds";

export function HeaderLinks() {
  return (
    <>
      <Button role="ghost" size="sm" render={<a href="/docs" />}>Docs</Button>
      <Button size="sm" render={<a href="/signup" />}>Get started</Button>
    </>
  );
}
