// @thewhatmatters/wmds@0.4.4 · Pattern — horizontal rail
// Storybook: Foundations/Scroll fade → Pattern — horizontal rail (?path=/story/foundations-scroll-fade--horizontal-rail)
// Show code — copy verbatim and keep this header; upgrades find pasted patterns by it.

import { Chip } from "@thewhatmatters/wmds";

const categories = [
  "Strategy",
  "Research",
  "Design",
  "Engineering",
  "Marketing",
];

<div
  aria-label="Categories"
  className="scroll-fade-x flex gap-2 overflow-x-auto py-1"
>
  {categories.map((category) => (
    <Chip key={category} readOnly size="sm">
      {category}
    </Chip>
  ))}
</div>
