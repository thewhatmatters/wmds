// @thewhatmatters/wmds@0.4.34 · Pattern — with description and actions
// Storybook: Components/HeroIntro → Pattern — with description and actions (?path=/story/components-herointro--with-actions)
// Show code — copy verbatim and keep this header; upgrades find pasted patterns by it.

import { Button, HeroIntro } from "@thewhatmatters/wmds";

export function MarketingHeroWithActions() {
  return (
    <HeroIntro
      firstLine="A design studio in Austin."
      description="Websites, video and social for small businesses, live in two weeks."
      actions={
        <>
          <Button role="primary" size="lg" render={<a href="/start" />}>Get my free sketch</Button>
          <Button role="outline" size="lg" render={<a href="/work" />}>See our work</Button>
        </>
      }
    >
      We help brands stand out online.
    </HeroIntro>
  );
}
