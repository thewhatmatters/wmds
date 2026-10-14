// @thewhatmatters/wmds@0.4.27 · Pattern — copied
// Storybook: Components/CopyField → Pattern — copied (?path=/story/components-copyfield--copied)
// Show code — copy verbatim and keep this header; upgrades find pasted patterns by it.

import { CopyField } from "@thewhatmatters/wmds";

export function UnlockKeyCopied({ apiKey }: { apiKey: string }) {
  return <CopyField label="API key" value={apiKey} state="copied" />;
}
