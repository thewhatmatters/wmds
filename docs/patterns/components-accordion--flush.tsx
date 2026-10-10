// @thewhatmatters/wmds@0.4.8 · Pattern — flush
// Storybook: Components/Accordion → Pattern — flush (?path=/story/components-accordion--flush)
// Show code — copy verbatim and keep this header; upgrades find pasted patterns by it.

import { useState } from "react";
import { Accordion, CheckboxGroup, SectionCaption } from "@thewhatmatters/wmds";

export function TopicFilter() {
  const [topics, setTopics] = useState<string[]>([]);
  const [years, setYears] = useState<string[]>([]);
  return (
    <div className="flex w-64 flex-col">
      <SectionCaption>Filters</SectionCaption>
      <Accordion variant="plain" flush>
        <Accordion.Item label="Topic" defaultOpen>
          <CheckboxGroup label="Topic" labelHidden size="sm" values={topics} onValuesChange={setTopics}>
            <CheckboxGroup.Item value="guides" label="Guides" count={2} />
            <CheckboxGroup.Item value="notes" label="Notes" count={1} />
          </CheckboxGroup>
        </Accordion.Item>
        <Accordion.Item label="Year">
          <CheckboxGroup label="Year" labelHidden size="sm" values={years} onValuesChange={setYears}>
            <CheckboxGroup.Item value="2026" label="2026" count={3} />
          </CheckboxGroup>
        </Accordion.Item>
      </Accordion>
    </div>
  );
}
