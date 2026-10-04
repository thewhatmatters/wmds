// @thewhatmatters/wmds@0.4.0 · Pattern — numbered choice keys
// Storybook: Components/Kbd → Pattern — numbered choice keys (?path=/story/components-kbd--numbered-choices)
// Show code — copy verbatim and keep this header; upgrades find pasted patterns by it.

import { useState } from "react";
import { Checkbox, Kbd, useKbdChoiceKeys } from "@thewhatmatters/wmds";

const choices = [
  { value: "brand", label: "Brand identity", number: "1" },
  { value: "website", label: "Website", number: "2" },
  { value: "product", label: "Product design", number: "3" },
  { value: "system", label: "Design system", number: "4" },
];

export function NumberedChoices() {
  const [values, setValues] = useState<string[]>([]);

  function toggle(value: string, checked: boolean) {
    if (checked) {
      setValues((current) => [...current, value]);
      return;
    }
    setValues((current) => current.filter((item) => item !== value));
  }

  useKbdChoiceKeys({
    choices: Object.fromEntries(
      choices.map((option) => [
        option.number,
        () => toggle(option.value, !values.includes(option.value)),
      ]),
    ),
  });

  return (
    <div className="flex w-full flex-col" role="group" aria-label="What are we making?">
      {choices.map((option) => (
        <div key={option.value} className="flex w-full items-center gap-3 border-b border-border py-3 last:border-b-0">
          <Checkbox
            className="min-w-0 flex-1"
            size="md"
            label={option.label}
            checked={values.includes(option.value)}
            onChange={(event) => toggle(option.value, event.target.checked)}
          />
          <Kbd className="shrink-0" aria-label={"Press " + option.number}>
            {option.number}
          </Kbd>
        </div>
      ))}
    </div>
  );
}
