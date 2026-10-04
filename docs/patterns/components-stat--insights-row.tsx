// @thewhatmatters/wmds@0.4.1 · Pattern — insights row
// Storybook: Components/Stat → Pattern — insights row (?path=/story/components-stat--insights-row)
// Show code — copy verbatim and keep this header; upgrades find pasted patterns by it.

import { Button, PageHeader, Stat } from "@thewhatmatters/wmds";
import { Share2 } from "lucide-react";

export function InsightsOverview() {
  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        variant="page"
        title="Insights"
        end={
          <Button role="secondary" size="sm" icon={<Share2 strokeWidth={2} />}>
            Share
          </Button>
        }
      />
      <Stat.Group aria-label="Insights metrics" columns={4}>
        <Stat label="Followers" value="12,480" trend={{ value: "+2.1%", direction: "up" }} />
        <Stat label="ER" value="4.2%" />
        <Stat label="Reach" value="256K" />
        <Stat label="Saves" value="3,241" />
      </Stat.Group>
    </div>
  );
}
