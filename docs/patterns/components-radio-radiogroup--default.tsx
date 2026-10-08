// @thewhatmatters/wmds@0.4.7 · Pattern — vertical
// Storybook: Components/Radio/RadioGroup → Pattern — vertical (?path=/story/components-radio-radiogroup--default)
// Show code — copy verbatim and keep this header; upgrades find pasted patterns by it.

import { useState } from "react";
import { RadioGroup } from "@thewhatmatters/wmds";

export function NotificationPreference() {
  const [value, setValue] = useState("email");
  return (
    <RadioGroup
      label="Notification preference"
      value={value}
      onValueChange={setValue}
    >
      <RadioGroup.Item value="email" label="Email" />
      <RadioGroup.Item value="push" label="Push notifications" />
      <RadioGroup.Item value="sms" label="SMS" />
    </RadioGroup>
  );
}
