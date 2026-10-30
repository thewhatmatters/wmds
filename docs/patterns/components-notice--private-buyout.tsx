// @thewhatmatters/wmds@0.4.42 · Pattern — private buyout
// Storybook: Components/Notice → Pattern — private buyout (?path=/story/components-notice--private-buyout)
// Show code — copy verbatim and keep this header; upgrades find pasted patterns by it.

import { Notice, TextLink } from "@thewhatmatters/wmds";

export function BuyoutNotice() {
  return (
    <Notice
      tone="warning"
      title="Private event Saturday night"
      action={<TextLink href="/events">Book your own event</TextLink>}
    >
      The dining room is booked from 6pm. The bar is open as usual.
    </Notice>
  );
}
