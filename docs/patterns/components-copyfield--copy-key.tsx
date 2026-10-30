// @thewhatmatters/wmds@0.4.42 · Pattern — copy key
// Storybook: Components/CopyField → Pattern — copy key (?path=/story/components-copyfield--copy-key)
// Show code — copy verbatim and keep this header; upgrades find pasted patterns by it.

import { CopyField } from "@thewhatmatters/wmds";

export function UnlockKey({ apiKey }: { apiKey: string }) {
  return <CopyField label="API key" value={apiKey} />;
}
