// @thewhatmatters/wmds@0.4.52 · Pattern — upload with a count
// Storybook: Components/Progress → Pattern — upload with a count (?path=/story/components-progress--upload-pattern)
// Show code — copy verbatim and keep this header; upgrades find pasted patterns by it.

import { Progress } from "@thewhatmatters/wmds";

export function PhotoUpload({ done, onCancel }: { done: number; onCancel: () => void }) {
  return <Progress label="Uploading photos" value={done} max={12} unit="files" timeLeft="About 2 minutes left" onCancel={onCancel} />;
}
