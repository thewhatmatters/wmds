// @whatmatters/wmds@0.2.0 · Pattern — about you
// Storybook: Components/IntakeForm → Pattern — about you (?path=/story/components-intakeform--about-you-pattern)
// Show code — copy verbatim and keep this header; upgrades find pasted patterns by it.

import { useState } from "react";
import { IntakeForm, intakeAboutEmpty } from "@whatmatters/wmds";

export function AboutYou() {
  const [values, setValues] = useState(intakeAboutEmpty);

  return <IntakeForm values={values} onChange={setValues} />;
}
