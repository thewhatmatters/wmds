// @thewhatmatters/wmds@0.4.49 · Pattern — FAQ (reading, long questions)
// Storybook: Components/Accordion → Pattern — FAQ (reading, long questions) (?path=/story/components-accordion--faq-reading)
// Show code — copy verbatim and keep this header; upgrades find pasted patterns by it.

import { Accordion } from "@thewhatmatters/wmds";

/** A question wraps and is read in full; its number and chevron stay beside the first line. */
export function Faq() {
  return (
    <Accordion variant="plain" flush size="reading" className="max-w-sm">
      <Accordion.Item leading={<span className="font-mono text-xs tabular-nums text-muted">01</span>} label="How long does a project take?" defaultOpen>
        Most sites take six weeks from the first call to launch.
      </Accordion.Item>
      <Accordion.Item
        leading={<span className="font-mono text-xs tabular-nums text-muted">02</span>}
        label="Do you build the menu page from our PDF, or do we have to type it all out again?"
      >
        We build it from your PDF, and you check it once before launch.
      </Accordion.Item>
      <Accordion.Item leading={<span className="font-mono text-xs tabular-nums text-muted">03</span>} label="Who owns the site?">
        You do: the design, the code, the words and the domain.
      </Accordion.Item>
    </Accordion>
  );
}
