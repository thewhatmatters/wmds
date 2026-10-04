// @thewhatmatters/wmds@0.4.1 · Pattern — selectable cards
// Storybook: Components/Card/SelectableCard → Pattern — selectable cards (?path=/story/components-card-selectablecard--selectable-cards-pattern)
// Show code — copy verbatim and keep this header; upgrades find pasted patterns by it.

import { useState } from "react";
import { SegmentedControl, SelectableCard } from "@thewhatmatters/wmds";

const options = [
  { value: "brand", title: "Brand identity", description: "Name, mark, and a system you can actually use." },
  { value: "website", title: "Website", description: "A site that explains the work and earns the next conversation." },
  { value: "product", title: "Product design", description: "Flows, screens, and the details in between." },
  { value: "marketing", title: "Marketing site", description: "A campaign page with one clear ask." },
  { value: "system", title: "Design system", description: "Components, tokens, and the rules that keep them honest." },
  { value: "other", title: "Other", description: "Something that does not fit the list yet." },
];

export function WhatYouNeed() {
  const [mode, setMode] = useState("fresh");
  const [values, setValues] = useState(["brand"]);

  return (
    <SelectableCard.Group
      label="What do you need?"
      values={values}
      onValuesChange={setValues}
      toggle={
        <SegmentedControl
          aria-label="Project starting point"
          layout="hug"
          value={mode}
          onValueChange={setMode}
        >
          <SegmentedControl.Item value="fresh">Starting fresh</SegmentedControl.Item>
          <SegmentedControl.Item value="refresh">Refreshing what I have</SegmentedControl.Item>
        </SegmentedControl>
      }
    >
      {options.map((option) => (
        <SelectableCard
          key={option.value}
          value={option.value}
          title={option.title}
          description={option.description}
        />
      ))}
    </SelectableCard.Group>
  );
}
