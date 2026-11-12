// @thewhatmatters/wmds@0.4.51 · Pattern — ruled figures
// Storybook: Components/Stat → Pattern — ruled figures (?path=/story/components-stat--ruled-figures)
// Show code — copy verbatim and keep this header; upgrades find pasted patterns by it.

import { Stat } from "@thewhatmatters/wmds";

export function StudioInNumbers() {
  return (
    <Stat.Group aria-label="The studio in numbers" columns={4}>
      <Stat variant="ruled" size="lg" label="Projects shipped" value="148" context="since 2016" />
      <Stat variant="ruled" size="lg" label="Clients who return" value="72%" context="of all clients" />
      <Stat variant="ruled" size="lg" label="Weeks to launch" value="6" context="median" />
      <Stat variant="ruled" size="lg" label="People" value="14" context="in two cities" />
    </Stat.Group>
  );
}
