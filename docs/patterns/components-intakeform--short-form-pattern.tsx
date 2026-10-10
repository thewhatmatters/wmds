// @thewhatmatters/wmds@0.4.9 · Pattern — short form
// Storybook: Components/IntakeForm → Pattern — short form (?path=/story/components-intakeform--short-form-pattern)
// Show code — copy verbatim and keep this header; upgrades find pasted patterns by it.

import { useState } from "react";
import { IntakeForm, intakeAboutEmpty } from "@thewhatmatters/wmds";

export function AboutYouShort() {
  const [values, setValues] = useState(intakeAboutEmpty);

  return <IntakeForm values={values} onChange={setValues} company={false} link={false} />;
}
