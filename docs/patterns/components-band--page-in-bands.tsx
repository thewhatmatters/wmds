// @thewhatmatters/wmds@0.4.40 · Pattern — page in bands
// Storybook: Components/Band → Pattern — page in bands (?path=/story/components-band--page-in-bands)
// Show code — copy verbatim and keep this header; upgrades find pasted patterns by it.

import { Band, Button } from "@thewhatmatters/wmds";

export function PageInBandsExample() {
  return (
    <main className="grid-page !py-0">
      <Band tone="inverse" spacing="lg" aria-labelledby="hero-title">
        <div className="col-span-full flex flex-col gap-6 lg:col-span-10">
          <h1 id="hero-title" className="type-display-hero text-fg">
            Smoke and chili
          </h1>
          <p className="type-reading text-muted">Wood-fired tacos on East Cesar Chavez, open late.</p>
          <div className="flex flex-wrap gap-2">
            <Button role="primary">Book a table</Button>
            <Button role="secondary">See the menu</Button>
          </div>
        </div>
      </Band>
      <Band aria-labelledby="menu-title">
        <h2 id="menu-title" className="type-display-xl col-span-full text-fg">
          The menu
        </h2>
        <p className="type-reading col-span-full text-muted md:col-span-4">Six tacos, two salsas, one mezcal list.</p>
      </Band>
      <Band tone="field" aria-labelledby="catering-title">
        <h2 id="catering-title" className="type-display-1 col-span-full text-fg md:col-span-6">
          Catering for forty
        </h2>
        <div className="col-span-full flex flex-col items-start gap-4 md:col-span-2">
          <p className="type-body text-fg">From $1,500, staff included.</p>
          <Button role="outline">Ask for a date</Button>
        </div>
      </Band>
    </main>
  );
}
