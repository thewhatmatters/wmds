// @whatmatters/wmds@0.2.0 · Pattern — overflowing list
// Storybook: Foundations/Scroll fade → Pattern — overflowing list (?path=/story/foundations-scroll-fade--overflowing-list)
// Show code — copy verbatim and keep this header; upgrades find pasted patterns by it.

const items = [
  "Align quarterly priorities",
  "Review audience fit",
  "Confirm launch narrative",
  "Prepare sales enablement",
  "Publish customer proof",
  "Schedule partner briefing",
];

<div className="overflow-hidden rounded-lg border border-border bg-card">
  <ul
    aria-label="Launch checklist"
    className="scroll-fade-y h-56 overflow-y-auto"
  >
    {items.map((item) => (
      <li className="border-b border-border px-4 py-3 last:border-b-0" key={item}>
        {item}
      </li>
    ))}
  </ul>
</div>
