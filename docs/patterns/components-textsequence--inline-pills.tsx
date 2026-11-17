// @thewhatmatters/wmds@0.4.53 · With inline pills
// Storybook: Components/TextSequence → With inline pills (?path=/story/components-textsequence--inline-pills)
// Show code — copy verbatim and keep this header; upgrades find pasted patterns by it.

import { InlinePill, TextSequence } from "@thewhatmatters/wmds";

export function PillStatement() {
  return (
    <h2 className="type-display-2 font-normal text-fg leading-[1.35]">
      <TextSequence trigger="mount" emphasis="none">
        Every <InlinePill media={<img src="/screen.png" alt="" />}>screen</InlinePill> is a{" "}
        <InlinePill media={<img src="/first.png" alt="" />}>first impression</InlinePill>
      </TextSequence>
    </h2>
  );
}
