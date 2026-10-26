// @thewhatmatters/wmds@0.4.28 · Pattern — holiday closure
// Storybook: Components/Notice → Pattern — holiday closure (?path=/story/components-notice--holiday-closure)
// Show code — copy verbatim and keep this header; upgrades find pasted patterns by it.

import { Notice } from "@thewhatmatters/wmds";

export function HolidayNotice() {
  return (
    <Notice
      tone="info"
      title="Closed Thanksgiving Day"
      dismissible
      dismissKey="thanksgiving-2026"
    >
      We reopen Friday, November 27 at 11am.
    </Notice>
  );
}
