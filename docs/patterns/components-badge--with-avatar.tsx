// @thewhatmatters/wmds@0.4.9 · Pattern — with avatar
// Storybook: Components/Badge → Pattern — with avatar (?path=/story/components-badge--with-avatar)
// Show code — copy verbatim and keep this header; upgrades find pasted patterns by it.

import { Badge } from "@thewhatmatters/wmds";

export function BadgeWithAvatar() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Badge
        variant="info"
        size="sm"
        emphasis="muted"
        avatar={{ src: "/hero-badges/globe.svg", alt: "Illustrated globe" }}
      >
        online
      </Badge>
      <Badge
        variant="info"
        size="md"
        emphasis="muted"
        avatar={{ src: "/hero-badges/eye.svg", alt: "Illustrated eye" }}
      >
        impossible to ignore
      </Badge>
    </div>
  );
}
