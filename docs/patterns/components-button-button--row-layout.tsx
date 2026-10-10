// @thewhatmatters/wmds@0.4.9 · Pattern — row
// Storybook: Components/Button/Button → Pattern — row (?path=/story/components-button-button--row-layout)
// Show code — copy verbatim and keep this header; upgrades find pasted patterns by it.

import { Button } from "@thewhatmatters/wmds";

export function DueDateRow({ onOpenDatePicker }: { onOpenDatePicker: () => void }) {
  return (
    <Button role="ghost" layout="row" type="button" onClick={onOpenDatePicker}>
      <span>Due date</span>
      <span>Sep 12</span>
    </Button>
  );
}
