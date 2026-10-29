// @thewhatmatters/wmds@0.4.33 · Pattern — side sheet header actions
// Storybook: Components/Sheet → Pattern — side sheet header actions (?path=/story/components-sheet--side-sheet-header-actions)
// Show code — copy verbatim and keep this header; upgrades find pasted patterns by it.

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button, IconButton, Sheet } from "@thewhatmatters/wmds";

export function StepThroughSheet() {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const names = ["Maya Chen", "Field notes: Q4 studio update", "Dev Patel"];

  return (
    <>
      <Button role="secondary" onClick={() => setOpen(true)}>
        Review queue
      </Button>
      <Sheet open={open} onOpenChange={setOpen}>
        <Sheet.Content
          side="end"
          title={names[index]}
          description={`${index + 1} of ${names.length}`}
          headerActions={
            <>
              <IconButton
                size="sm"
                role="ghost"
                icon={<ChevronUp strokeWidth={2} />}
                aria-label="Previous"
                disabled={index === 0}
                onClick={() => setIndex(index - 1)}
              />
              <IconButton
                size="sm"
                role="ghost"
                icon={<ChevronDown strokeWidth={2} />}
                aria-label="Next"
                disabled={index === names.length - 1}
                onClick={() => setIndex(index + 1)}
              />
            </>
          }
        >
          <p>Detail for {names[index]}.</p>
        </Sheet.Content>
      </Sheet>
    </>
  );
}
