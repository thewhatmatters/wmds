// @thewhatmatters/wmds@0.4.28 · Pattern — sync failed
// Storybook: Components/Notice → Pattern — sync failed (?path=/story/components-notice--sync-failed)
// Show code — copy verbatim and keep this header; upgrades find pasted patterns by it.

import { Notice } from "@thewhatmatters/wmds";

export function SyncFailedNotice({ onDismiss }: { onDismiss: () => void }) {
  return (
    <Notice tone="error" title="Sync failed" live dismissible onDismiss={onDismiss}>
      We couldn&apos;t reach Instagram. Your numbers are from yesterday.
    </Notice>
  );
}
