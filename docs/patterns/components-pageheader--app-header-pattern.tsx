// @thewhatmatters/wmds@0.4.9 · Pattern — app header
// Storybook: Components/PageHeader → Pattern — app header (?path=/story/components-pageheader--app-header-pattern)
// Show code — copy verbatim and keep this header; upgrades find pasted patterns by it.

import { useState } from "react";
import { Share2 } from "lucide-react";
import {
  Avatar,
  avatarSizeForCluster,
  Button,
  buttonSizeForCluster,
  PageHeader,
  SegmentedControl,
} from "@thewhatmatters/wmds";

const tier = "sm";

export function InsightsAppHeader() {
  const [period, setPeriod] = useState("30d");

  return (
    <PageHeader
      variant="app"
      title="Insights"
      end={
        <>
          <SegmentedControl aria-label="Reporting period" size={tier} value={period} onValueChange={setPeriod}>
            <SegmentedControl.Item value="7d">7d</SegmentedControl.Item>
            <SegmentedControl.Item value="30d">30d</SegmentedControl.Item>
            <SegmentedControl.Item value="90d">90d</SegmentedControl.Item>
          </SegmentedControl>
          <Button role="secondary" size={buttonSizeForCluster(tier)} icon={<Share2 strokeWidth={2} />}>
            Share
          </Button>
          <Avatar name="Alex Rivera" size={avatarSizeForCluster(tier)} />
        </>
      }
    />
  );
}
