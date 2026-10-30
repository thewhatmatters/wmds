// @thewhatmatters/wmds@0.4.42 · Pattern — account not connected
// Storybook: Components/Notice → Pattern — account not connected (?path=/story/components-notice--account-not-connected)
// Show code — copy verbatim and keep this header; upgrades find pasted patterns by it.

import { Button, Notice } from "@thewhatmatters/wmds";

export function ConnectNotice({ onConnect }: { onConnect: () => void }) {
  return (
    <Notice
      tone="warning"
      title="Instagram isn't connected"
      action={
        <Button role="secondary" size="sm" onClick={onConnect}>
          Connect Instagram
        </Button>
      }
    >
      Connect your account to show reach and saves on your media kit.
    </Notice>
  );
}
