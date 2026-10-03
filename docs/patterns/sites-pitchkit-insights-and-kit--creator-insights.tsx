// @thewhatmatters/wmds@0.2.0 · Pattern — creator Insights
// Storybook: Sites/PitchKit/Insights and kit → Pattern — creator Insights (?path=/story/sites-pitchkit-insights-and-kit--creator-insights)
// Show code — copy verbatim and keep this header; upgrades find pasted patterns by it.

import { useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import {
  AlertDialog,
  Avatar,
  Badge,
  Button,
  ButtonIcon,
  Card,
  Chart,
  Chip,
  Dialog,
  Dropdown,
  MoreMenu,
  PageHeader,
  SegmentedControl,
  Stat,
  Tab,
  TextLink,
  Toaster,
  cardSubtitleClasses,
  cardTitleClasses,
  chartSeriesConfigFromKeys,
  toast,
  type ChartCartesianPoint,
  type ChartRankedBarItem,
} from "@thewhatmatters/wmds";
import { EyeOff } from "lucide-react";

const reachConfig = chartSeriesConfigFromKeys([
  { key: "typical", label: "Typical reach" },
  { key: "reach", label: "Daily reach" },
]);

const compactNumber = new Intl.NumberFormat("en", {
  notation: "compact",
  maximumFractionDigits: 1,
});

type PitchKitProofMetric = "reach" | "engagement" | "saves";

const proofMetricNotices: Record<PitchKitProofMetric, string> = {
  reach: "Ranked by Instagram reach.",
  engagement: "Ranked by likes + comments.",
  saves: "Ranked by Instagram saves.",
};

function proofMetricValue(post: PitchKitPost, metric: PitchKitProofMetric) {
  if (metric === "engagement") return post.likes + post.comments;
  return post[metric];
}


export interface PitchKitAudience {
  countries: ChartRankedBarItem[];
  cities: ChartRankedBarItem[];
  ages: ChartRankedBarItem[];
  gender: ChartRankedBarItem[];
}

function AudienceSection({ title, items }: { title: string; items: ChartRankedBarItem[] }) {
  return (
    <section className="flex min-w-0 flex-col gap-3">
      <h3 className="type-supporting font-medium uppercase tracking-wider text-muted text-muted">{title}</h3>
      <Chart.RankedBars
        aria-label={`Audience by ${title.toLowerCase()}`}
        items={items}
        animate="initial"
      />
    </section>
  );
}


function copyShareKitUrl(handle: string) {
  const path = `/k/${handle}`;
  void navigator.clipboard.writeText(path);
  toast.add({
    title: "Kit URL copied",
    description: path,
    tone: "success",
  });
}

function AccountSettingsDialog({
  identity,
  open,
  onOpenChange,
}: {
  identity: PitchKitCreatorIdentity;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <Dialog.Content size="md" title="Account settings">
        <div className="flex w-full min-w-0 flex-col gap-4">
          <Card variant="outlined" shape="rounded" bodyTerminal className="col-span-full">
            <Card.Header
              start={<h2 className={cardTitleClasses}>Connected Instagram</h2>}
              end={
                identity.connected ? (
                  <Badge variant="success" emphasis="muted" size="sm">
                    Connected
                  </Badge>
                ) : null
              }
            />
            <Card.Body>
              <div className="flex min-w-0 flex-col gap-4 px-3.5 py-[16px]">
                <CreatorIdentityStrip
                  identity={identity}
                  nameAs="p"
                  showProfessionalChip
                />
                {identity.lastSyncedLabel != null ? (
                  <p className="type-supporting text-muted text-muted">
                    Last synced {identity.lastSyncedLabel}
                  </p>
                ) : null}
              </div>
            </Card.Body>
          </Card>
        </div>
      </Dialog.Content>
    </Dialog>
  );
}

function OwnerAccountMenu({ identity }: { identity: PitchKitCreatorIdentity }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  function handleAction(actionId: string) {
    setMenuOpen(false);
    if (actionId === "settings") {
      setSettingsOpen(true);
      return;
    }
    if (actionId === "share") {
      copyShareKitUrl(identity.handle);
      return;
    }
    if (actionId === "delete") {
      setDeleteOpen(true);
    }
  }

  return (
    <>
      <div className="relative">
        <Button
          type="button"
          role="ghost"
          size="sm"
          aria-label="My account"
          aria-haspopup="menu"
          aria-expanded={menuOpen}
          className="size-9 min-h-9 gap-0 px-0 py-0 focus-visible:ring-offset-0"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <Avatar
            name={identity.displayName ?? identity.handle}
            src={identity.profilePictureUrl}
            size="md"
          />
        </Button>
        {menuOpen ? (
          <Dropdown.Menu
            role="menu"
            aria-label="My account"
            className="absolute end-0 top-full mt-1 min-w-56"
          >
            <li role="presentation">
              <p className="type-supporting font-medium uppercase tracking-wider text-muted px-3.5 py-2">My account</p>
            </li>
            <li role="presentation">
              <Dropdown.Item role="menuitem" truncate={false} onClick={() => handleAction("settings")}>
                Account settings
              </Dropdown.Item>
            </li>
            <li role="presentation">
              <Dropdown.Item role="menuitem" truncate={false} onClick={() => handleAction("share")}>
                Share kit
              </Dropdown.Item>
            </li>
            <li role="separator" className="mx-1.5 my-0.5 border-0 border-t border-border" />
            <li role="presentation">
              <Dropdown.Item role="menuitem" truncate={false} onClick={() => handleAction("signout")}>
                Sign out
              </Dropdown.Item>
            </li>
            <li role="presentation">
              <Dropdown.Item role="menuitem" truncate={false} onClick={() => handleAction("disconnect")}>
                Disconnect
              </Dropdown.Item>
            </li>
            <li role="presentation">
              <Dropdown.Item role="menuitem" truncate={false} onClick={() => handleAction("delete")}>Delete</Dropdown.Item>
            </li>
          </Dropdown.Menu>
        ) : null}
      </div>
      <AccountSettingsDialog
        identity={identity}
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
      />
      <AlertDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete your Pitchkit account?"
        description="This permanently deletes your kit, stored media copies, and connection. Your Instagram account is not deleted. This cannot be undone."
        cancelLabel="Cancel"
        confirmLabel="Delete account"
        confirmRole="destructive"
        onConfirm={() => setDeleteOpen(false)}
      />
    </>
  );
}

function PitchKitPageFooter() {
  return (
    <div className="band pb-6 pt-10">
      <footer className="col-span-full flex items-center justify-center gap-4">
        <TextLink href="/privacy">Privacy</TextLink>
        <TextLink href="mailto:hello@whatmatters.com">Support</TextLink>
      </footer>
    </div>
  );
}



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


interface OwnerPitchKitProps extends PitchKitPageData {
  reachState?: PitchKitReachState;
}

function pitchKitIntroIsEmpty(intro: string) {
  return intro.trim().length === 0;
}

function PublicIntro({ intro }: { intro: string }) {
  if (pitchKitIntroIsEmpty(intro)) return null;
  return <p className="type-body text-fg text-fg">{intro}</p>;
}

function OwnerReachCard({
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
      className="col-span-full min-w-0"
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

function OwnerCountries({ countries }: { countries: ChartRankedBarItem[] }) {
  const topCountries = countries.slice(0, 3);
  if (topCountries.length === 0) return null;

  return (
    <Card
      variant="outlined"
      shape="rounded"
      bodyTerminal
      className="col-span-full min-w-0"
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

function OwnerPitchKit({
  identity,
  intro,
  posts,
  contact,
  brands,
  countries,
  reachData,
  reachState = "resolved",
}: OwnerPitchKitProps) {
  const [visiblePosts, setVisiblePosts] = useState(posts);
  const [postNotice, setPostNotice] = useState<string | null>(null);
  const [pendingHidePostId, setPendingHidePostId] = useState<string | null>(null);
  const engagementRate = reachState === "resolved" ? "5.8%" : null;
  const typicalReach = reachState === "resolved" ? "9.3K" : "—";

  function handlePostAction(postId: string, actionId: string) {
    if (actionId === "hide") {
      setPendingHidePostId(postId);
    }
  }

  function hidePendingPost() {
    const hiddenPost = visiblePosts.find((post) => post.id === pendingHidePostId);
    if (!hiddenPost) return;

    setVisiblePosts((current) =>
      current.filter((post) => post.id !== hiddenPost.id),
    );
    setPostNotice("Post hidden from the shareable kit.");
    setPendingHidePostId(null);
    toast.add({
      title: "Post hidden from kit",
      description: "It no longer appears in the shareable PitchKit.",
      duration: 6000,
      action: {
        label: "Undo",
        onClick: () => {
          setVisiblePosts((current) =>
            current.some((post) => post.id === hiddenPost.id)
              ? current
              : [...current, hiddenPost],
          );
          setPostNotice("Post restored to the shareable kit.");
        },
      },
    });
  }

  return (
    <>
      <section className="col-span-full">
        <PageHeader variant="page" title="Your Pitchkit" />
        <div className="flex max-w-2xl flex-col gap-1">
          <p className="type-body text-fg text-muted">Edit what brands see</p>
        </div>
      </section>

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
        <OwnerReachCard reachState={reachState} reachData={reachData} />
        <OwnerCountries countries={countries} />
      </div>

      <section className="band min-w-0 gap-y-4">
        <div className="col-span-full flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className={cardTitleClasses}>Selected posts</h2>
            <p className="type-body text-fg text-muted">
              {postNotice ?? "Proof from the current Instagram set."}
            </p>
          </div>
        </div>
        <div className="band col-span-full min-w-0 gap-y-4">
          {visiblePosts.map((post, index) => (
            <Card key={post.id} variant="outlined" shape="rounded" className="col-span-full min-w-0 md:col-span-4 lg:col-span-4">
              <Card.Header
                end={
                  <MoreMenu
                    aria-label={`Manage selected post ${index + 1}`}
                    size="xs"
                    items={[
                      {
                        id: "hide",
                        label: "Hide from kit",
                        start: (
                          <ButtonIcon size="sm">
                            <EyeOff />
                          </ButtonIcon>
                        ),
                      },
                    ]}
                    onAction={(actionId) => handlePostAction(post.id, actionId)}
                  />
                }
              />
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
      <AlertDialog
        open={pendingHidePostId != null}
        onOpenChange={(open) => {
          if (!open) setPendingHidePostId(null);
        }}
        title="Hide this post from PitchKit?"
        description="It will no longer appear in the shareable PitchKit. You can add it back later."
        cancelLabel="Keep post"
        confirmLabel="Hide from kit"
        onConfirm={hidePendingPost}
      />
    </>
  );
}


interface PitchKitInsightsPageProps extends PitchKitPageData {
  audience: PitchKitAudience;
  /** Selected posts on the PitchKit tab; `posts` is the Recent proof set. */
  kitPosts: PitchKitPost[];
}

export function PitchKitInsightsPage({
  reachData,
  audience,
  posts,
  contact,
  brands,
  identity,
  kitPosts,
  intro,
  countries,
}: PitchKitInsightsPageProps) {
  const [view, setView] = useState("insights");
  const [proofMetric, setProofMetric] = useState<PitchKitProofMetric>("reach");
  const rankedPosts = [...posts].sort(
    (a, b) =>
      proofMetricValue(b, proofMetric) - proofMetricValue(a, proofMetric),
  );

  function handleProofMetricChange(value: string) {
    setProofMetric(value as PitchKitProofMetric);
  }

  return (
    <main className="grid-page min-h-screen bg-body [--grid-column-gap:8px] [--grid-max:1140px] [padding-bottom:44px]">

      <div className="band pb-4">
        <header className="col-span-full grid grid-cols-[1fr_auto_1fr] items-center gap-3">
          <span className="type-heading-4 text-fg text-fg">PitchKit</span>
          <SegmentedControl
            aria-label="PitchKit primary navigation"
            size="sm"
            value={view}
            onValueChange={setView}
          >
            <SegmentedControl.Item value="insights">Insights</SegmentedControl.Item>
            <SegmentedControl.Item value="pitchkit">PitchKit</SegmentedControl.Item>
          </SegmentedControl>
          <span className="justify-self-end">
            <OwnerAccountMenu identity={identity} />
          </span>
        </header>
      </div>

      <div className="band pt-6 sm:pt-8">
        <div className="band min-w-0 gap-y-6 sm:gap-y-8">
          {view === "pitchkit" ? (
            <OwnerPitchKit identity={identity} intro={intro} posts={kitPosts} contact={contact} brands={brands} countries={countries} reachData={reachData} />
          ) : (
            <>


              <section className="col-span-full">
                <PageHeader variant="page" title="Insights" />
                <div className="flex max-w-2xl flex-col gap-1">
                  <p className="type-body text-fg text-muted">
                    Verified Instagram performance, refreshed Sep 7 at 12:42 PM.
                  </p>
                  <p className="type-supporting text-muted text-muted">
                    Engagement rate = (likes + comments) ÷ followers.
                  </p>
                </div>
              </section>

              <div className="band gap-y-2">

                <div
                  role="group"
                  aria-label="Instagram performance summary"
                  className="band gap-y-4"
                >
                  <Stat className="col-span-2 md:col-span-4 lg:col-span-3" label="Followers" value="84.2K" trend={{ value: "+2.4%", direction: "up" }} />
                  <Stat className="col-span-2 md:col-span-4 lg:col-span-3" label="Engagement rate" value="5.8%" />
                  <Stat className="col-span-2 md:col-span-4 lg:col-span-3" label="Typical reach" value="9.3K" />
                  <Stat className="col-span-2 md:col-span-4 lg:col-span-3" label="Saves" value="6.1K" trend={{ value: "+8.1%", direction: "up" }} />
                </div>

                <div className="band min-w-0 gap-y-6 [align-items:stretch]">
                  <Card variant="outlined" shape="rounded" bodyTerminal className="col-span-full min-w-0 lg:col-span-6">
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
                      <div className="flex min-w-0 flex-col gap-4 bg-body px-3.5 py-4 rounded-[var(--radius-card-body)]">
                        <Chart.Cartesian
                          data={reachData}
                          config={reachConfig}
                          periodKind="month"
                          minHeight={344}
                          aria-label="Daily and typical Instagram reach over the last 30 days"
                        />
                        <Chart.Legend config={reachConfig} />
                      </div>
                    </Card.Body>
                  </Card>

                  <Card variant="outlined" shape="rounded" bodyTerminal className="col-span-full min-w-0 lg:col-span-6">
                    <Card.Header
                      start={
                        <>
                          <h2 className={cardTitleClasses}>Audience fit</h2>
                          <p className={cardSubtitleClasses}>Ranked Instagram percentages.</p>
                        </>
                      }
                    />
                    <Card.Body>
                      <div className="grid min-w-0 gap-y-6 bg-body px-3.5 py-4 [column-gap:var(--grid-column-gap)] sm:grid-cols-2 rounded-[var(--radius-card-body)]">
                        <AudienceSection title="Countries" items={audience.countries} />
                        <AudienceSection title="Cities" items={audience.cities} />
                        <AudienceSection title="Age" items={audience.ages} />
                        <AudienceSection title="Gender" items={audience.gender} />
                      </div>
                    </Card.Body>
                  </Card>
                </div>
              </div>

              <section className="band min-w-0 gap-y-4">
                <div className="col-span-full flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <h2 className={cardTitleClasses}>Recent proof</h2>
                    <p className="type-body text-fg text-muted">
                      {proofMetricNotices[proofMetric]}
                    </p>
                  </div>
                  <Badge variant="neutral" emphasis="muted" size="sm">
                    {rankedPosts.length} shown
                  </Badge>
                </div>
                <Tab.Group
                  aria-label="Rank recent proof posts by"
                  value={proofMetric}
                  onValueChange={handleProofMetricChange}
                  className="col-span-full"
                >
                  <Tab value="reach" panelId="recent-proof-panel">Reach</Tab>
                  <Tab value="engagement" panelId="recent-proof-panel">Engagement</Tab>
                  <Tab value="saves" panelId="recent-proof-panel">Saves</Tab>
                </Tab.Group>
                <div
                  id="recent-proof-panel"
                  role="tabpanel"
                  className="band col-span-full min-w-0 gap-y-4"
                >
                  {rankedPosts.map((post, index) => (
                    <Card key={post.id} variant="outlined" shape="rounded" className="col-span-full min-w-0 md:col-span-4 lg:col-span-4">
                      <Card.Header
                        start={
                          <span className="flex items-center gap-2">
                            <Badge size="sm">#{index + 1}</Badge>
                            <span className={cardSubtitleClasses}>{post.publishedAt}</span>
                          </span>
                        }
                      />
                      <Card.Body>
                        <img
                          className="aspect-[4/3] w-full bg-body object-cover rounded-[var(--radius-card-body)]"
                          src={post.imageUrl}
                          alt={post.imageAlt}
                        />
                      </Card.Body>
                      <Card.Footer>
                        <div className="grid w-full grid-cols-3 gap-3">
                          {[
                            ["Saves", post.saves],
                            ["Reach", post.reach],
                            ["Likes", post.likes],
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


            </>
          )}
        </div>
      </div>
      <PitchKitPageFooter />
      <Toaster position="bottom-right" />
    </main>
  );
}
