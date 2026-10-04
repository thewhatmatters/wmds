// @thewhatmatters/wmds@0.4.0 · Reduced motion
// Storybook: Components/TextSequence → Reduced motion (?path=/story/components-textsequence--reduced-motion)
// Show code — copy verbatim and keep this header; upgrades find pasted patterns by it.

import { TextSequence } from "@thewhatmatters/wmds";

export function HeroLine() {
  return (
    <p className="type-display-2 text-center text-fg">
      <TextSequence stagger={0.07} trigger="mount" idle>
        We design <TextSequence.Shape variant="asterisk" /> brands people{" "}
        <TextSequence.Shape variant="pill" tone="brand-soft" /> cannot ignore
      </TextSequence>
    </p>
  );
}
