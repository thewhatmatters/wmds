// @thewhatmatters/wmds@0.4.0 · Pattern — with icon
// Storybook: Components/Button/Button → Pattern — with icon (?path=/story/components-button-button--with-icon)
// Show code — copy verbatim and keep this header; upgrades find pasted patterns by it.

import { Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@thewhatmatters/wmds";

export function ItemActions() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button role="primary" icon={<Plus strokeWidth={2} />}>
        New item
      </Button>
      <Button role="secondary" icon={<Pencil strokeWidth={2} />}>
        Edit
      </Button>
      <Button role="destructive" icon={<Trash2 strokeWidth={2} />}>
        Delete
      </Button>
    </div>
  );
}
