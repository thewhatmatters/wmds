// @thewhatmatters/wmds@0.4.9 · Pattern — default
// Storybook: Components/Checkbox/CheckboxGroup → Pattern — default (?path=/story/components-checkbox-checkboxgroup--default)
// Show code — copy verbatim and keep this header; upgrades find pasted patterns by it.

import { useState } from "react";
import { CheckboxGroup } from "@thewhatmatters/wmds";

export function AlertPreferences() {
  const [values, setValues] = useState(["email"]);
  return (
    <CheckboxGroup
      label="Alert type"
      values={values}
      onValuesChange={setValues}
    >
      <CheckboxGroup.Item value="email" label="Email alerts" />
      <CheckboxGroup.Item value="push" label="Push notifications" />
      <CheckboxGroup.Item value="weekly" label="Weekly summary" />
    </CheckboxGroup>
  );
}
