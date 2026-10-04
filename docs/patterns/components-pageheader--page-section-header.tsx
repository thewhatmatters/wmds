// @thewhatmatters/wmds@0.4.0 · Pattern — page header
// Storybook: Components/PageHeader → Pattern — page header (?path=/story/components-pageheader--page-section-header)
// Show code — copy verbatim and keep this header; upgrades find pasted patterns by it.

import { Share2 } from "lucide-react";
import { Button, PageHeader } from "@thewhatmatters/wmds";

export function InsightsSectionHeader() {
  return (
    <PageHeader
      variant="page"
      title="Insights"
      end={
        <Button role="secondary" size="sm" icon={<Share2 strokeWidth={2} />}>
          Share
        </Button>
      }
    />
  );
}
