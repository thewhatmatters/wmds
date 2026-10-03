// @whatmatters/wmds@0.2.0 · Pattern — toolbar header
// Storybook: Components/PageHeader → Pattern — toolbar header (?path=/story/components-pageheader--toolbar-header)
// Show code — copy verbatim and keep this header; upgrades find pasted patterns by it.

import { useState } from "react";
import { Filter } from "lucide-react";
import { Button, Chip, PageHeader } from "@whatmatters/wmds";

export function InsightsToolbar() {
  const [filter, setFilter] = useState<string[]>(["active"]);

  return (
    <PageHeader
      variant="toolbar"
      aria-label="Insights filters"
      start={
        <Chip size="sm" selected={filter.includes("active")} onSelectedChange={() => /* toggle */}>
          Active
        </Chip>
      }
      end={
        <Button role="ghost" size="sm" icon={<Filter strokeWidth={2} aria-hidden />}>
          Filters
        </Button>
      }
    />
  );
}
