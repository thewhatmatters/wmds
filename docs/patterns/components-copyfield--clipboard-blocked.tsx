// @thewhatmatters/wmds@0.4.27 · Pattern — clipboard blocked
// Storybook: Components/CopyField → Pattern — clipboard blocked (?path=/story/components-copyfield--clipboard-blocked)
// Show code — copy verbatim and keep this header; upgrades find pasted patterns by it.

import { CopyField } from "@thewhatmatters/wmds";

export function UnlockKeyBlocked({ apiKey }: { apiKey: string }) {
  return <CopyField label="API key" value={apiKey} state="fallback" />;
}
