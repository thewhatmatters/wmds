// @thewhatmatters/wmds@0.4.3 · Pattern — suggestion pills
// Storybook: Components/Button/Button → Pattern — suggestion pills (?path=/story/components-button-button--suggestion-pills)
// Show code — copy verbatim and keep this header; upgrades find pasted patterns by it.

import { Button } from "@thewhatmatters/wmds";

export function FollowUps({ items, onPick }: { items: string[]; onPick: (item: string) => void }) {
  return (
    <div className="flex flex-col gap-2">
      {items.map((item) => (
        <Button key={item} role="outline" emphasis="quiet" align="start" size="md" type="button" className="w-full" onClick={() => onPick(item)}>
          {item}
        </Button>
      ))}
    </div>
  );
}
