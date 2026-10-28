// @thewhatmatters/wmds@0.4.30 · Pattern — hero stat
// Storybook: Components/Stat → Pattern — hero stat (?path=/story/components-stat--hero-stat)
// Show code — copy verbatim and keep this header; upgrades find pasted patterns by it.

import { Button, Stat } from "@thewhatmatters/wmds";
import { BarChart3, Receipt, Unplug, Wallet } from "lucide-react";

export function HeroStats() {
  return (
    <Stat.Group aria-label="Performance" columns={2}>
      <Stat
        size="lg"
        icon={<Receipt strokeWidth={2} />}
        label="Attributed revenue"
        value="$18,420"
        trend={{ value: "+24.1%", direction: "up" }}
        context="vs $14,850"
        action={
          <Button role="secondary" size="sm">
            View details
          </Button>
        }
      />
      <Stat
        size="lg"
        icon={<BarChart3 strokeWidth={2} />}
        label="Return on spend"
        value="2.7×"
        trend={{ value: "−0.4", direction: "down" }}
        context="vs 3.1×"
      />
      <Stat
        size="lg"
        icon={<Wallet strokeWidth={2} />}
        label="Available to spend"
        value="$14.00"
        trend={{ value: "0.0%", direction: "flat" }}
        context="of $1M goal"
      />
      <Stat
        size="lg"
        icon={<Unplug strokeWidth={2} />}
        label="Content awaiting approval"
        value=""
        unavailable={{ reason: "Google Analytics is not linked" }}
        action={
          <Button role="secondary" size="sm">
            Connect
          </Button>
        }
      />
    </Stat.Group>
  );
}
