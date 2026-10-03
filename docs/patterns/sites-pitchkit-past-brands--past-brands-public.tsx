// @whatmatters/wmds@0.2.0 · Pattern — past brands (public)
// Storybook: Sites/PitchKit/Past brands → Pattern — past brands (public) (?path=/story/sites-pitchkit-past-brands--past-brands-public)
// Show code — copy verbatim and keep this header; upgrades find pasted patterns by it.

import { useLayoutEffect, useRef, useState } from "react";
import { Avatar, Card, Chip, cardTitleClasses } from "@whatmatters/wmds";

const compactNumber = new Intl.NumberFormat("en", {
  notation: "compact",
  maximumFractionDigits: 1,
});


function CreatorIdentityStrip({ identity, nameAs = "h1", showProfessionalChip = false }) {
  const NameTag = nameAs;
  const avatarName = identity.displayName ?? identity.handle;
  const handleLabel = `@${identity.handle}`;
  const followerLabel =
    identity.followersCount == null
      ? null
      : `${compactNumber.format(identity.followersCount)} followers`;
  const meta = [handleLabel, followerLabel].filter(Boolean).join(" · ");
  const showTitleRow =
    identity.displayName != null ||
    (showProfessionalChip && identity.professionalAccount != null);

  return (
    <div className="flex flex-wrap items-center gap-4">
      <Avatar
        name={avatarName}
        src={identity.profilePictureUrl}
        size="lg"
      />
      <div className="flex min-w-0 flex-col gap-1">
        {showTitleRow ? (
          <div className="flex flex-wrap items-center gap-2">
            {identity.displayName != null ? (
              <NameTag className="type-heading-2 text-fg">
                {identity.displayName}
              </NameTag>
            ) : null}
            {showProfessionalChip && identity.professionalAccount != null ? (
              <Chip readOnly size="sm">
                {identity.professionalAccount}
              </Chip>
            ) : null}
          </div>
        ) : null}
        <p className="type-body text-fg text-muted">{meta}</p>
      </div>
    </div>
  );
}


const PITCHKIT_BRAND_RESULT_MAX = 24;
const PITCHKIT_BRAND_LOGO_LETTER = "letter";

const pitchKitBrandLogoKeys = [
  "nike", "adidas", "apple", "google", "meta", "amazon", "spotify", "netflix",
  "sephora", "glossier", "nordstrom", "target", "walmart", "starbucks",
  "coca-cola", "pepsi", "samsung", "microsoft", "adobe", "shopify",
  "uber", "airbnb", "disney", "lululemon", "reebok", "puma",
  "dior", "chanel", "bmw", "ford", "chase", "visa",
];

const pastBrandLogoKeySet = new Set(pitchKitBrandLogoKeys);

function resolvePastBrandLogoKey(logoKey) {
  if (logoKey == null || logoKey === "" || logoKey === PITCHKIT_BRAND_LOGO_LETTER) {
    return undefined;
  }
  return pastBrandLogoKeySet.has(logoKey) ? logoKey : undefined;
}

function pastBrandLogoMonogram(logoKey) {
  const parts = logoKey.split("-");
  if (parts.length > 1) {
    return parts.map((part) => part.charAt(0).toUpperCase()).join("").slice(0, 2);
  }
  return logoKey.slice(0, 1).toUpperCase();
}

function normalizePastBrandResult(value) {
  const trimmed = value?.trim() ?? "";
  if (trimmed.length === 0) return undefined;
  return trimmed.slice(0, PITCHKIT_BRAND_RESULT_MAX);
}

function BrandMark({ name, logoKey }) {
  const resolved = resolvePastBrandLogoKey(logoKey);
  if (resolved == null) {
    return <Avatar name={name} size="sm" />;
  }

  return (
    <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-fg type-supporting text-muted font-medium uppercase leading-none text-bg" role="img" aria-label={name}>
      <span aria-hidden>{pastBrandLogoMonogram(resolved)}</span>
    </span>
  );
}

function BrandResultChip({ label }) {
  const result = normalizePastBrandResult(label);
  if (result == null) return null;
  return <Chip readOnly size="sm">{result}</Chip>;
}

function BrandLockup({ brand }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <BrandMark name={brand.name} logoKey={brand.logo_key} />
      <h3 className="type-label text-fg">{brand.name}</h3>
      <BrandResultChip label={brand.result_label} />
    </div>
  );
}

function PastBrandCard({ brand, className }) {
  return (
    <Card variant="outlined" shape="rounded" className={className}>
      <Card.Header start={<BrandLockup brand={brand} />} />
    </Card>
  );
}

function PastBrandsRail({ brands }) {
  const hostRef = useRef(null);
  const measureRef = useRef(null);
  const [overflows, setOverflows] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useLayoutEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotion = () => setReduceMotion(media.matches);
    updateMotion();
    media.addEventListener("change", updateMotion);
    return () => media.removeEventListener("change", updateMotion);
  }, []);

  useLayoutEffect(() => {
    const host = hostRef.current;
    const measure = measureRef.current;
    if (host == null || measure == null) return;

    const update = () => {
      setOverflows(measure.scrollWidth > host.clientWidth + 1);
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(host);
    observer.observe(measure);
    return () => observer.disconnect();
  }, [brands]);

  const duration = Math.max(16, brands.length * 4);
  const showMarquee = overflows && !reduceMotion;

  return (
    <div
      ref={hostRef}
      className="relative col-span-full min-w-0"
      data-overflow={showMarquee ? "true" : "false"}
    >
      <ul ref={measureRef} className="pointer-events-none invisible absolute flex w-max items-center gap-3" aria-hidden>
        {brands.map((brand) => (
          <li key={`${brand.id}-measure`}>
            <PastBrandCard brand={brand} className="w-max max-w-full shrink-0" />
          </li>
        ))}
      </ul>
      {reduceMotion ? (
        <ul className="flex min-w-0 flex-wrap items-center gap-3" aria-label="Past brands">
          {brands.map((brand) => (
            <li key={brand.id}>
              <PastBrandCard brand={brand} className="w-max max-w-full shrink-0" />
            </li>
          ))}
        </ul>
      ) : showMarquee ? (
        <>
          <ul className="sr-only" aria-label="Past brands">
            {brands.map((brand) => {
              const result = normalizePastBrandResult(brand.result_label);
              return (
                <li key={brand.id}>
                  {result == null ? brand.name : `${brand.name}, ${result}`}
                </li>
              );
            })}
          </ul>
          <div className="group overflow-hidden" aria-hidden>
            <div
              className="marquee-track flex w-max items-center"
              style={{ "--marquee-duration": `${duration}s` }}
            >
              <ul className="flex min-w-0 items-center gap-3">
                {brands.map((brand) => (
                  <li key={`${brand.id}-loop-a`}>
                    <PastBrandCard brand={brand} className="w-max max-w-full shrink-0" />
                  </li>
                ))}
              </ul>
              <ul className="flex min-w-0 items-center gap-3">
                {brands.map((brand) => (
                  <li key={`${brand.id}-loop-b`}>
                    <PastBrandCard brand={brand} className="w-max max-w-full shrink-0" />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </>
      ) : (
        <ul className="flex min-w-0 items-center gap-3" aria-label="Past brands">
          {brands.map((brand) => (
            <li key={brand.id}>
              <PastBrandCard brand={brand} className="w-max max-w-full shrink-0" />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function PublicPastBrands({ brands }) {
  if (brands.length === 0) return null;

  return (
    <section className="band min-w-0 gap-y-4">
      <div className="col-span-full flex flex-wrap items-end justify-between gap-3">
        <h2 className={cardTitleClasses}>Past brands</h2>
      </div>
      <PastBrandsRail brands={brands} />
    </section>
  );
}


export function PastBrandsPublicPage({ identity, brands }) {
  return (
    <main className="grid-page min-h-screen bg-body [--grid-column-gap:8px] [--grid-max:1140px] [padding-bottom:44px]">
      <div className="band pb-4">
        <header className="col-span-full grid grid-cols-[1fr_auto_1fr] items-center gap-3">
          <span className="type-heading-4 text-fg text-fg">PitchKit</span>
        </header>
      </div>

      <div className="band pt-6 sm:pt-8">
        <div className="band min-w-0 gap-y-6 sm:gap-y-8">
          <section className="col-span-full border-b border-border pb-6">
            <div className="flex min-w-0 flex-col gap-3">
              <CreatorIdentityStrip
                identity={identity}
                nameAs="h1"
                showProfessionalChip
              />
            </div>
          </section>
          <PublicPastBrands brands={brands} />
        </div>
      </div>
    </main>
  );
}
