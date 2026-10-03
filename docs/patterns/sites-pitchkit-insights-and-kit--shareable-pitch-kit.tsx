// @whatmatters/wmds@0.2.0 · Pattern — shareable PitchKit
// Storybook: Sites/PitchKit/Insights and kit → Pattern — shareable PitchKit (?path=/story/sites-pitchkit-insights-and-kit--shareable-pitch-kit)
// Show code — copy verbatim and keep this header; upgrades find pasted patterns by it.

import { useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import {
  Avatar,
  Badge,
  Button,
  Card,
  Chart,
  Chip,
  Stat,
  TextLink,
  cardSubtitleClasses,
  cardTitleClasses,
  chartSeriesConfigFromKeys,
  type ChartCartesianPoint,
  type ChartRankedBarItem,
} from "@whatmatters/wmds";

const reachConfig = chartSeriesConfigFromKeys([
  { key: "typical", label: "Typical reach" },
  { key: "reach", label: "Daily reach" },
]);

const compactNumber = new Intl.NumberFormat("en", {
  notation: "compact",
  maximumFractionDigits: 1,
});



export interface PitchKitCreatorIdentity {
  displayName?: string;
  /** Without the @ — shown as @handle, shared as /k/[handle]. */
  handle: string;
  profilePictureUrl?: string;
  followersCount?: number;
  professionalAccount?: "Business" | "Creator";
  connected?: boolean;
  lastSyncedLabel?: string;
}

function CreatorIdentityStrip({
  identity,
  nameAs = "h1",
  showProfessionalChip = false,
}: {
  identity: PitchKitCreatorIdentity;
  nameAs?: "h1" | "p";
  showProfessionalChip?: boolean;
}) {
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


export interface PitchKitPost {
  id: string;
  publishedAt: string;
  imageUrl: string;
  imageAlt: string;
  saves: number;
  reach: number;
  likes: number;
  comments: number;
}

export interface PitchKitContact {
  email: string;
  websiteHref: string;
  websiteLabel: string;
  location: string;
}

/** "insufficient" when the 30-day reach series cannot be plotted. */
export type PitchKitReachState = "resolved" | "insufficient";

export interface PitchKitPageData {
  identity: PitchKitCreatorIdentity;
  intro: string;
  posts: PitchKitPost[];
  contact: PitchKitContact;
  brands: PitchKitPastBrand[];
  countries: ChartRankedBarItem[];
  reachData: ChartCartesianPoint[];
}

interface ShareablePitchKitProps extends PitchKitPageData {
  reachState?: PitchKitReachState;
  /** Unsigned visitors who are not the kit owner only. */
  showCreateBand?: boolean;
}

function pitchKitIntroIsEmpty(intro: string) {
  return intro.trim().length === 0;
}

function PublicIntro({ intro }: { intro: string }) {
  if (pitchKitIntroIsEmpty(intro)) return null;
  return <p className="type-body text-fg text-fg">{intro}</p>;
}

export interface PitchKitPastBrand {
  id: string;
  name: string;
  /** Curated mark key — missing or unknown keys use a letter Avatar. */
  logo_key?: string;
  result_label?: string;
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

function resolvePastBrandLogoKey(logoKey: string | null | undefined) {
  if (logoKey == null || logoKey === "" || logoKey === PITCHKIT_BRAND_LOGO_LETTER) {
    return undefined;
  }
  return pastBrandLogoKeySet.has(logoKey) ? logoKey : undefined;
}

function pastBrandLogoMonogram(logoKey: string) {
  const parts = logoKey.split("-");
  if (parts.length > 1) {
    return parts.map((part) => part.charAt(0).toUpperCase()).join("").slice(0, 2);
  }
  return logoKey.slice(0, 1).toUpperCase();
}

function normalizePastBrandResult(value: string | null | undefined) {
  const trimmed = value?.trim() ?? "";
  if (trimmed.length === 0) return undefined;
  return trimmed.slice(0, PITCHKIT_BRAND_RESULT_MAX);
}

function BrandMark({ name, logoKey }: { name: string; logoKey?: string }) {
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

function BrandResultChip({ label }: { label?: string }) {
  const result = normalizePastBrandResult(label);
  if (result == null) return null;
  return <Chip readOnly size="sm">{result}</Chip>;
}

function BrandLockup({ brand }: { brand: PitchKitPastBrand }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <BrandMark name={brand.name} logoKey={brand.logo_key} />
      <h3 className="type-label text-fg">{brand.name}</h3>
      <BrandResultChip label={brand.result_label} />
    </div>
  );
}

function PastBrandCard({ brand, className }: { brand: PitchKitPastBrand; className: string }) {
  return (
    <Card variant="outlined" shape="rounded" className={className}>
      <Card.Header start={<BrandLockup brand={brand} />} />
    </Card>
  );
}

function PastBrandsRail({ brands }: { brands: readonly PitchKitPastBrand[] }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLUListElement>(null);
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
              style={{ "--marquee-duration": `${duration}s` } as CSSProperties}
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

export function PublicPastBrands({ brands }: { brands: readonly PitchKitPastBrand[] }) {
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


function PublicCreatePitchkitBand() {
  return (
    <Card
      variant="outlined"
      shape="rounded"
      bodyTerminal
      className="col-span-full"
    >
      <Card.Header
        start={<h2 className={cardTitleClasses}>Create your Pitchkit</h2>}
      />
      <Card.Body>
        <div className="flex min-w-0 flex-col gap-4 px-3.5 py-[16px]">
          <p className="type-body text-fg text-muted">
            Turn your Instagram into a shareable media kit.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Button role="primary">Continue with Instagram</Button>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}

function PublicReachCard({
  reachState,
  reachData,
}: {
  reachState: PitchKitReachState;
  reachData: ChartCartesianPoint[];
}) {
  return (
    <Card
      variant="outlined"
      shape="rounded"
      bodyTerminal
      className="col-span-full min-w-0 lg:col-span-6"
    >
      <Card.Header
        start={
          <>
            <h2 className={cardTitleClasses}>Reach over 30 days</h2>
            <p className={cardSubtitleClasses}>
              Typical performance with unusual spikes left visible.
            </p>
          </>
        }
        end={
          <Badge variant="neutral" emphasis="muted" size="sm">
            Graph data
          </Badge>
        }
      />
      <Card.Body>
        {reachState === "insufficient" ? (
          <div
            className="flex min-w-0 flex-col gap-4 bg-body px-3.5 py-4 rounded-[var(--radius-card-body)] items-center justify-center text-center"
            style={{ minHeight: 220 }}
          >
            <div className="flex max-w-lg flex-col gap-2 items-center text-center">
              <Badge variant="neutral" emphasis="muted">No data</Badge>
              <h3 className="type-heading-2 text-fg">No reach data yet</h3>
              <p className="type-body text-fg text-muted">
                Connect more Instagram activity to plot the last 30 days.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex min-w-0 flex-col gap-4 bg-body px-3.5 py-4 rounded-[var(--radius-card-body)]">
            <Chart.Cartesian
              data={reachData}
              config={reachConfig}
              periodKind="month"
              minHeight={220}
              aria-label="Daily and typical Instagram reach over the last 30 days"
            />
            <Chart.Legend config={reachConfig} />
          </div>
        )}
      </Card.Body>
    </Card>
  );
}

function PublicCountries({ countries }: { countries: ChartRankedBarItem[] }) {
  const topCountries = countries.slice(0, 3);
  if (topCountries.length === 0) return null;

  return (
    <Card
      variant="outlined"
      shape="rounded"
      bodyTerminal
      className="col-span-full min-w-0 lg:col-span-6"
    >
      <Card.Header
        start={
          <>
            <h2 className={cardTitleClasses}>Top countries</h2>
            <p className={cardSubtitleClasses}>
              Top 3 from Instagram Insights.
            </p>
          </>
        }
      />
      <Card.Body>
        <div className="flex min-w-0 flex-col gap-4 bg-body px-3.5 py-4 rounded-[var(--radius-card-body)]">
          <Chart.RankedBars
            aria-label="Audience by country"
            items={topCountries}
            animate="initial"
          />
        </div>
      </Card.Body>
    </Card>
  );
}

function ShareablePitchKit({
  identity,
  intro,
  posts,
  contact,
  brands,
  countries,
  reachData,
  reachState = "resolved",
  showCreateBand = true,
}: ShareablePitchKitProps) {
  const engagementRate = reachState === "resolved" ? "5.8%" : null;
  const typicalReach = reachState === "resolved" ? "9.3K" : "—";

  return (
    <>
      <section className="col-span-full border-b border-border pb-6">
        <div className="flex min-w-0 flex-col gap-3">
          <CreatorIdentityStrip
            identity={identity}
            nameAs="h1"
            showProfessionalChip
          />
          <PublicIntro intro={intro} />
        </div>
      </section>

      <div
        role="group"
        aria-label="Instagram performance summary"
        className="band gap-y-4"
      >
        <Stat className="col-span-2 md:col-span-4 lg:col-span-3" label="Followers" value="84.2K" />
        {engagementRate != null ? (
          <Stat className="col-span-2 md:col-span-4 lg:col-span-3" label="Engagement rate" value={engagementRate} />
        ) : null}
        <Stat className="col-span-2 md:col-span-4 lg:col-span-3" label="Typical reach" value={typicalReach} />
        <Stat className="col-span-2 md:col-span-4 lg:col-span-3" label="Typical saves" value="6.1K" />
      </div>

      <div className="band min-w-0 gap-y-6 [align-items:stretch]">
        <PublicReachCard reachState={reachState} reachData={reachData} />
        <PublicCountries countries={countries} />
      </div>

      <section className="band min-w-0 gap-y-4">
        <div className="col-span-full flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className={cardTitleClasses}>Selected posts</h2>
            <p className="type-body text-fg text-muted">
              Proof from the current Instagram set.
            </p>
          </div>
        </div>
        <div className="band col-span-full min-w-0 gap-y-4">
          {posts.map((post) => (
            <Card key={post.id} variant="outlined" shape="rounded" className="col-span-full min-w-0 md:col-span-4 lg:col-span-4">
              <Card.Body>
                <img
                  className="aspect-[4/3] w-full bg-body object-cover rounded-[var(--radius-card-body)]"
                  src={post.imageUrl}
                  alt={post.imageAlt}
                />
              </Card.Body>
              <Card.Footer>
                <div className="grid w-full grid-cols-2 gap-3">
                  {[
                    ["Likes", post.likes],
                    ["Comments", post.comments],
                  ].map(([label, value]) => (
                    <span key={label} className="flex min-w-0 flex-col gap-1">
                      <span className="type-supporting font-medium uppercase tracking-wider text-muted text-muted">{label}</span>
                      <span className="font-mono text-sm tabular-nums text-fg">
                        {compactNumber.format(value as number)}
                      </span>
                    </span>
                  ))}
                </div>
              </Card.Footer>
            </Card>
          ))}
        </div>
      </section>

      <section className="band min-w-0 gap-y-4">
        <div className="col-span-full flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className={cardTitleClasses}>Contact</h2>
            <p className="type-body text-fg text-muted">
              Creator-entered details for brand outreach.
            </p>
          </div>
        </div>
        <Card variant="outlined" padding="md" shape="rounded" className="col-span-full">
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
              <span className="type-supporting font-medium uppercase tracking-wider text-muted text-muted">Email</span>
              <TextLink href={`mailto:${contact.email}`}>{contact.email}</TextLink>
            </div>
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
              <span className="type-supporting font-medium uppercase tracking-wider text-muted text-muted">Website</span>
              <TextLink href={contact.websiteHref} external>{contact.websiteLabel}</TextLink>
            </div>
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
              <span className="type-supporting font-medium uppercase tracking-wider text-muted text-muted">Location</span>
              <span className="type-body text-fg text-muted">{contact.location}</span>
            </div>
          </div>
        </Card>
      </section>

      <PublicPastBrands brands={brands} />

      {showCreateBand ? <PublicCreatePitchkitBand /> : null}
    </>
  );
}


export function ShareablePitchKitPage({
  identity,
  intro,
  posts,
  contact,
  brands,
  countries,
  reachData,
  reachState = "resolved",
  showCreateBand = true,
}: ShareablePitchKitProps) {
  return (
    <main className="grid-page min-h-screen bg-body [--grid-column-gap:8px] [--grid-max:1140px] [padding-bottom:44px]">
      <div className="band pb-4">
        <header className="col-span-full grid grid-cols-[1fr_auto_1fr] items-center gap-3">
          <span className="type-heading-4 text-fg text-fg">PitchKit</span>
        </header>
      </div>

      <div className="band pt-6 sm:pt-8">
        <div className="band min-w-0 gap-y-6 sm:gap-y-8">
          <ShareablePitchKit
            identity={identity}
            intro={intro}
            posts={posts}
            contact={contact}
            brands={brands}
            countries={countries}
            reachData={reachData}
            reachState={reachState}
            showCreateBand={showCreateBand}
          />
        </div>
      </div>
    </main>
  );
}
