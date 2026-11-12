// @thewhatmatters/wmds@0.4.50 · Pattern — named levels
// Storybook: Components/Meter → Pattern — named levels (?path=/story/components-meter--named-levels)
// Show code — copy verbatim and keep this header; upgrades find pasted patterns by it.

import { Meter } from "@thewhatmatters/wmds";

const levels = [
  { id: "level-seats", name: "Seats", value: 9, max: 12, text: "9 of 12 seats" },
  { id: "level-storage", name: "Storage", value: 31, max: 50, text: "31 of 50 GB" },
  { id: "level-builds", name: "Build minutes", value: 120, max: 400, text: "120 of 400 minutes" },
];

export function PlanUsage() {
  return (
    <ul className="flex flex-col gap-4">
      {levels.map((level) => (
        <li key={level.id} className="flex flex-col gap-2">
          <span className="flex items-baseline justify-between gap-3">
            <span id={level.id} className="type-label text-fg">
              {level.name}
            </span>
            <span className="type-supporting tabular-nums text-muted" aria-hidden>
              {level.text}
            </span>
          </span>
          <Meter value={level.value} max={level.max} aria-labelledby={level.id} valueText={level.text} />
        </li>
      ))}
    </ul>
  );
}
