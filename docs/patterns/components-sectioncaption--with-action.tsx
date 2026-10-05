// @thewhatmatters/wmds@0.4.2 · Pattern — caption with an action
// Storybook: Components/SectionCaption → Pattern — caption with an action (?path=/story/components-sectioncaption--with-action)
// Show code — copy verbatim and keep this header; upgrades find pasted patterns by it.

import { Button, SectionCaption } from "@thewhatmatters/wmds";

export function FiltersCaption({ activeCount, onClear }: { activeCount: number; onClear: () => void }) {
  return (
    <SectionCaption
      end={
        <Button role="ghost" size="xs" disabled={activeCount === 0} onClick={onClear}>
          Clear all
        </Button>
      }
    >
      Filters
    </SectionCaption>
  );
}
