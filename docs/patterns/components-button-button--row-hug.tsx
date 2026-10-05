// @thewhatmatters/wmds@0.4.2 · Pattern — row (hug)
// Storybook: Components/Button/Button → Pattern — row (hug) (?path=/story/components-button-button--row-hug)
// Show code — copy verbatim and keep this header; upgrades find pasted patterns by it.

import { ChevronDown } from "lucide-react";
import { Button } from "@thewhatmatters/wmds";

export function ThoughtToggle({ open, onToggle }: { open: boolean; onToggle: () => void }) {
  return (
    <Button role="ghost" layout="row" width="hug" type="button" aria-expanded={open} onClick={onToggle}>
      <span>Thought for 4s</span>
      <ChevronDown className="size-4 stroke-current" strokeWidth={2} aria-hidden />
    </Button>
  );
}
