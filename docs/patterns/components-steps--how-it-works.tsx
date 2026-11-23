// @thewhatmatters/wmds@0.4.55 · Pattern — how it works
// Storybook: Components/Steps → Pattern — how it works (?path=/story/components-steps--how-it-works)
// Show code — copy verbatim and keep this header; upgrades find pasted patterns by it.

import { Steps } from "@thewhatmatters/wmds";

export interface HowItWorksStep {
  /** What happens, in a few words. */
  title: string;
  /** One line more. */
  text?: string;
}

export interface HowItWorksProps {
  /** Three to five steps, in order. */
  steps: readonly HowItWorksStep[];
  /** Names the list for screen readers when no heading sits above it. */
  label?: string;
}

export function HowItWorks({ steps, label = "How it works" }: HowItWorksProps) {
  return (
    <Steps aria-label={label}>
      {steps.map((step) => (
        <Steps.Item key={step.title} title={step.title}>
          {step.text}
        </Steps.Item>
      ))}
    </Steps>
  );
}
