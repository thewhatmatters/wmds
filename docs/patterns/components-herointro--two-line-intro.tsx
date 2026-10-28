// @thewhatmatters/wmds@0.4.30 · Pattern — two-line intro
// Storybook: Components/HeroIntro → Pattern — two-line intro (?path=/story/components-herointro--two-line-intro)
// Show code — copy verbatim and keep this header; upgrades find pasted patterns by it.

import { Badge, HeroIntro } from "@thewhatmatters/wmds";

export function MarketingHeroIntro() {
  return (
    <HeroIntro firstLine="A design studio in Austin, Texas.">
      We help brands stand out{" "}
      <Badge variant="info" size="md" emphasis="muted" className="align-middle" avatar={{ src: "/hero-badges/globe.svg", alt: "" }}>online</Badge>
      .
    </HeroIntro>
  );
}
