// @thewhatmatters/wmds@0.4.9 · Pattern — option counts
// Storybook: Components/Checkbox/CheckboxGroup → Pattern — option counts (?path=/story/components-checkbox-checkboxgroup--option-counts)
// Show code — copy verbatim and keep this header; upgrades find pasted patterns by it.

import { useState } from "react";
import { CheckboxGroup } from "@thewhatmatters/wmds";

export function TopicFilter() {
  const [values, setValues] = useState<string[]>([]);
  return (
    <CheckboxGroup label="Topic" size="sm" values={values} onValuesChange={setValues}>
      <CheckboxGroup.Item value="guides" label="Guides" count={2} countLabel="2 posts" />
      <CheckboxGroup.Item value="notes" label="Notes" count={1} countLabel="1 post" />
      <CheckboxGroup.Item value="news" label="News" count={1} countLabel="1 post" />
    </CheckboxGroup>
  );
}
