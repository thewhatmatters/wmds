// @thewhatmatters/wmds@0.4.55 · Pattern — visit us
// Storybook: Components/MapLink → Pattern — visit us (?path=/story/components-maplink--visit)
// Show code — copy verbatim and keep this header; upgrades find pasted patterns by it.

import { Button, MapLink } from "@thewhatmatters/wmds";

export interface VisitProps {
  /** The business's name: with the address, it drops the pin on the business. */
  name: string;
  /** The street address. A line break stays a line break. */
  address: string;
  /** The phone number as people read it, and as a tel: link dials it. */
  phone?: { label: string; href: string };
}

export function Visit({ name, address, phone }: VisitProps) {
  return (
    <MapLink
      address={address}
      place={name + ", " + address}
      actions={
        phone ? (
          <Button role="outline" render={<a href={phone.href} />}>
            Call {phone.label}
          </Button>
        ) : undefined
      }
    />
  );
}
