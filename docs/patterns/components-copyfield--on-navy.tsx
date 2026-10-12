// @thewhatmatters/wmds@0.4.11 · Pattern — on a navy field
// Storybook: Components/CopyField → Pattern — on a navy field (?path=/story/components-copyfield--on-navy)
// Show code — copy verbatim and keep this header; upgrades find pasted patterns by it.

import { Button, CopyField } from "@thewhatmatters/wmds";

export function UnlockOnBrand({
  apiKey,
  onContinue,
  onSecondary,
}: {
  apiKey: string;
  onContinue: () => void;
  onSecondary: () => void;
}) {
  return (
    <section className="flex w-full flex-col gap-4 bg-brand px-6 py-8 text-on-brand">
      <CopyField label="API key" value={apiKey} />
      <div className="flex flex-wrap gap-2">
        <Button role="inverse" type="button" onClick={onContinue}>
          Continue
        </Button>
        <Button role="inverse-outline" type="button" onClick={onSecondary}>
          Back
        </Button>
      </div>
    </section>
  );
}
