// @thewhatmatters/wmds@0.4.50 · Pattern — glass over a picture
// Storybook: Components/Card/Card → Pattern — glass over a picture (?path=/story/components-card-card--glass)
// Show code — copy verbatim and keep this header; upgrades find pasted patterns by it.

import { Card, Stat, cardBodyTextClasses, cardTitleClasses } from "@thewhatmatters/wmds";

export function QuarterOverPicture({ src }: { src: string }) {
  return (
    <section className="relative isolate overflow-hidden p-6 md:p-10">
      <img src={src} alt="" className="absolute inset-0 -z-10 size-full object-cover" />
      <Card variant="glass" padding="lg" as="article" className="max-w-md gap-5">
        <div className="flex flex-col gap-1">
          <h2 className={cardTitleClasses}>This quarter</h2>
          <p className={cardBodyTextClasses}>The picture shows through, blurred. The words stay readable.</p>
        </div>
        <Stat.Group columns={2}>
          <Stat variant="plain" size="md" label="Bookings" value="1,284" />
          <Stat variant="plain" size="md" label="Return rate" value="72%" />
        </Stat.Group>
      </Card>
    </section>
  );
}
