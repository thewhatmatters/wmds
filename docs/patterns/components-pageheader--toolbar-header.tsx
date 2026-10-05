// @thewhatmatters/wmds@0.4.4 · Pattern — toolbar header
// Storybook: Components/PageHeader → Pattern — toolbar header (?path=/story/components-pageheader--toolbar-header)
// Show code — copy verbatim and keep this header; upgrades find pasted patterns by it.

import { useState } from "react";
import { Filter } from "lucide-react";
import { Button, Chip, PageHeader } from "@thewhatmatters/wmds";

export function InsightsToolbar() {
  const [filter, setFilter] = useState<string[]>(["active"]);
  const toggle = (id: string) =>
    setFilter((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );

  return (
    <PageHeader
      variant="toolbar"
      aria-label="Insights filters"
      start={
        <>
          <Chip size="sm" selected={filter.includes("active")} onSelectedChange={() => toggle("active")}>
            Active
          </Chip>
          <Chip size="sm" selected={filter.includes("draft")} onSelectedChange={() => toggle("draft")}>
            Draft
          </Chip>
        </>
      }
      end={
        <Button role="ghost" size="sm" icon={<Filter strokeWidth={2} aria-hidden />}>
          Filters
        </Button>
      }
    />
  );
}
