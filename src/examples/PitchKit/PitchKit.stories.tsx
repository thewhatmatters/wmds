import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  storyMetaDocsDefaults,
  withStoryCopySource,
} from "../../lib/storyCopySource";
import {
  PitchKitInsightsExample,
  PitchKitOwnerExample,
  type PitchKitDataState,
  type PitchKitLoadingPhase,
} from "./PitchKitExample";
import { ownerPitchKitBodyCopySource, ownerPitchKitPageCopySource } from "./ownerPitchKitCopySource";
import { PitchKitShareableExample } from "./PitchKitShareable";
/** Interpolated into Show code so the freeze stays locked to the live canvas styles. */
import {
  pitchKitAudienceCardClasses,
  pitchKitAudienceEmptyCopyClasses,
  pitchKitAudienceEmptyWellClasses,
  pitchKitAudienceSectionClasses,
  pitchKitAudienceWellClasses,
  pitchKitBrandBodyClasses,
  pitchKitBrandClasses,
  pitchKitCardWellClasses,
  pitchKitContactCardClasses,
  pitchKitContactRowClasses,
  pitchKitContactRowsClasses,
  pitchKitContentBandClasses,
  pitchKitContentClasses,
  pitchKitAudienceSkeletonBarsClasses,
  pitchKitAudienceSkeletonSectionClasses,
  pitchKitDashboardGridClasses,
  pitchKitEmptyBodyClasses,
  pitchKitEmptyTitleClasses,
  pitchKitFormulaClasses,
  pitchKitHeaderCopyClasses,
  pitchKitHeaderSectionClasses,
  pitchKitHeaderSkeletonCopyClasses,
  pitchKitHeaderSkeletonStackClasses,
  pitchKitIdentityCopyClasses,
  pitchKitIdentityNameClasses,
  pitchKitIdentityRowClasses,
  pitchKitIdentitySectionClasses,
  pitchKitIdentityTitleRowClasses,
  pitchKitKitPostMetricsClasses,
  pitchKitKitStatClasses,
  pitchKitMetricsStackClasses,
  pitchKitPageClasses,
  pitchKitPostCardClasses,
  pitchKitPostHeaderStartClasses,
  pitchKitPostImageClasses,
  pitchKitPostMetricClasses,
  pitchKitPostMetricLabelClasses,
  pitchKitPostMetricsClasses,
  pitchKitPostMetricValueClasses,
  pitchKitPostsHeaderClasses,
  pitchKitPostsPanelClasses,
  pitchKitPostsSectionClasses,
  pitchKitPostsTabsClasses,
  pitchKitReachCardClasses,
  pitchKitReachChartMinHeight,
  pitchKitReachEmptyCopyClasses,
  pitchKitReachEmptyWellClasses,
  pitchKitSectionEyebrowClasses,
  pitchKitSkeletonLegendRowClasses,
  pitchKitStatClasses,
  pitchKitStatsBandClasses,
  pitchKitSupportingClasses,
  pitchKitTopbarBandClasses,
  pitchKitTopbarClasses,
  pitchKitTopbarEndClasses,
} from "./pitchKitStyles";

const shareablePitchKitCopySource = `
function ShareablePitchKit({ posts, contact, brands }) {
  return (
    <>
      <section className="${pitchKitIdentitySectionClasses}">
        <div className="${pitchKitIdentityRowClasses}">
          <Avatar name="Avery Morgan" size="lg" />
          <div className="${pitchKitIdentityCopyClasses}">
            <div className="${pitchKitIdentityTitleRowClasses}">
              <h1 className="${pitchKitIdentityNameClasses}">Avery Morgan</h1>
              <Badge variant="success" emphasis="muted" size="sm">Verified</Badge>
              <Chip readOnly size="sm">Instagram</Chip>
            </div>
            <p className="${pitchKitSupportingClasses}">@averymorgan</p>
          </div>
        </div>
      </section>

      <div
        role="group"
        aria-label="Verified Instagram summary"
        className="${pitchKitStatsBandClasses}"
      >
        <Stat className="${pitchKitKitStatClasses}" label="Followers" value="84.2K" />
        <Stat className="${pitchKitKitStatClasses}" label="Engagement rate" value="5.8%" />
      </div>

      <section className="${pitchKitPostsSectionClasses}">
        <div className="${pitchKitPostsHeaderClasses}">
          <div>
            <h2 className={cardTitleClasses}>Selected posts</h2>
            <p className="${pitchKitSupportingClasses}">
              Proof from the current Instagram set.
            </p>
          </div>
        </div>
        <div className="${pitchKitPostsPanelClasses}">
          {posts.map((post) => (
            <Card key={post.id} variant="outlined" shape="rounded" className="${pitchKitPostCardClasses}">
              <Card.Body>
                <img
                  className="${pitchKitPostImageClasses}"
                  src={post.imageUrl}
                  alt={post.imageAlt}
                />
              </Card.Body>
              <Card.Footer>
                <div className="${pitchKitKitPostMetricsClasses}">
                  {[
                    ["Likes", post.likes],
                    ["Comments", post.comments],
                  ].map(([label, value]) => (
                    <span key={label} className="${pitchKitPostMetricClasses}">
                      <span className="${pitchKitPostMetricLabelClasses}">{label}</span>
                      <span className="${pitchKitPostMetricValueClasses}">
                        {compactNumber.format(value)}
                      </span>
                    </span>
                  ))}
                </div>
              </Card.Footer>
            </Card>
          ))}
        </div>
      </section>

      <section className="${pitchKitPostsSectionClasses}">
        <div className="${pitchKitPostsHeaderClasses}">
          <div>
            <h2 className={cardTitleClasses}>Contact</h2>
            <p className="${pitchKitSupportingClasses}">
              Creator-entered details for brand outreach.
            </p>
          </div>
        </div>
        <Card variant="outlined" padding="md" shape="rounded" className="${pitchKitContactCardClasses}">
          <div className="${pitchKitContactRowsClasses}">
            <div className="${pitchKitContactRowClasses}">
              <span className="${pitchKitSectionEyebrowClasses}">Email</span>
              <TextLink href={\`mailto:\${contact.email}\`}>{contact.email}</TextLink>
            </div>
            <div className="${pitchKitContactRowClasses}">
              <span className="${pitchKitSectionEyebrowClasses}">Website</span>
              <TextLink href={contact.websiteHref} external>{contact.websiteLabel}</TextLink>
            </div>
            <div className="${pitchKitContactRowClasses}">
              <span className="${pitchKitSectionEyebrowClasses}">Location</span>
              <span className="${pitchKitSupportingClasses}">{contact.location}</span>
            </div>
          </div>
        </Card>
      </section>

      <section className="${pitchKitPostsSectionClasses}">
        <div className="${pitchKitPostsHeaderClasses}">
          <div>
            <h2 className={cardTitleClasses}>Past brands</h2>
            <p className="${pitchKitSupportingClasses}">
              Campaigns already shipped with this creator.
            </p>
          </div>
        </div>
        <div className="${pitchKitPostsPanelClasses}">
          {brands.map((brand) => (
            <Card key={brand.id} variant="outlined" shape="rounded" className="${pitchKitPostCardClasses}">
              <Card.Header
                start={<h3 className={cardTitleClasses}>{brand.name}</h3>}
                end={<Badge variant="neutral" emphasis="muted" size="sm">{brand.year}</Badge>}
              />
              <Card.Body>
                <p className="${pitchKitBrandBodyClasses}">{brand.summary}</p>
              </Card.Body>
            </Card>
          ))}
        </div>
      </section>
    </>
  );
}
`;

const dataStates = [
  "resolved",
  "unavailable",
  "insufficientReach",
  "insufficientAudience",
  "insufficientReachAndAudience",
  "loading",
] as const satisfies readonly PitchKitDataState[];
const loadingPhases = [
  "skeleton",
  "retrieving",
] as const satisfies readonly PitchKitLoadingPhase[];

const meta = {
  title: "Examples/PitchKit",
  component: PitchKitInsightsExample,
  tags: ["autodocs"],
  ...storyMetaDocsDefaults(),
  argTypes: {
    dataState: {
      control: "select",
      options: dataStates,
    },
    loadingPhase: {
      control: "select",
      options: loadingPhases,
      table: { disable: true },
    },
  },
  args: {
    dataState: "resolved",
    loadingPhase: "skeleton",
  },
  parameters: {
    wmdsLayout: "fullscreen",
    docs: {
      description: {
        component: `
## Usage

Authenticated PitchKit at a frozen 1140px grid maximum. The single top-level **SegmentedControl** switches between owner **Insights** and owner **PitchKit**.

Identity is one shared strip composed into two surrounding chromes — copy these before kit body or Insights:

1. **Pattern — creator identity (public)** — \`/k/[handle]\` brand nameplate (avatar, Graph name when present, frozen @handle, follower context, optional professional **Chip**).
2. **Pattern — creator identity (owner settings)** — Settings → **Connected Instagram** card (same strip + professional **Chip** + Share kit \`/k/[handle]\` + Copy + connected / last sync).
3. **Pattern — user settings (owner)** — topbar **Avatar** opens **Dialog** titled User settings (account display name + email from existing sample data). **Delete account** lives in this Dialog and confirms with **AlertDialog** \`confirmRole="destructive"\`. Not Connected Instagram and not an app footer.
4. **Pattern — create PitchKit profile callout** — unsigned visitors on \`/k/[handle]\`: **Card** titled Create your PitchKit Profile + primary Get started, composed below a truncated shareable kit.

Then copy **Pattern — creator Insights** for the authenticated owner dashboard, **Pattern — owner PitchKit** for the authenticated PitchKit tab (same kit sections as public, plus hide/restore on selected posts), and **Pattern — shareable PitchKit** for the public kit **body**. Do not lift kit Stats, charts, bio, website, rates, geo, or contact onto the identity Patterns.

**Show code** on each **Pattern** story is the product contract — a literal freeze of that canvas (layout, chrome, spacing, typography). Copy that source into PitchKit. Do not reconstruct the page from Storybook-only \`PitchKitExample\` / \`PitchKitOwner\` / \`PitchKitShareable\` / \`PitchKitCreatorIdentity\` / \`pitchKitStyles\`, and do not ship **ExampleGridControls**.

The Insights dashboard answers four questions in order:

1. **Scale and response** — **Stat** tiles on the page subgrid for followers, labeled engagement rate, typical reach, and saves.
2. **Consistency** — one 30-day **Chart.Cartesian** comparing typical and daily reach, including visible spikes.
3. **Audience fit** — **Chart.RankedBars** for Graph-supplied country, city, age, and gender percentages.
4. **Proof** — six recent **Card** items with secondary **Tab** ranking by reach, engagement (likes + comments), or saves, plus persistent **MoreMenu** hide/swap controls.

The public kit answers four questions in order:

1. **Who** — copy **Pattern — creator identity (public)** for the \`/k/[handle]\` nameplate. Unlocked Graph / derived fields only: **Avatar** (\`profile_picture_url\`), Graph \`name\` (hide if missing), frozen @handle, \`followers_count\` as supporting context (not a hero **Stat**), optional professional **Chip** (Business / Creator).
2. **Scale** — kit **Stat** tiles for followers and engagement rate live on **Pattern — shareable PitchKit**, not on the identity nameplate. Same figures as Insights; no owner trends or chart chrome.
3. **Selected posts** — the current Instagram proof set as **Card** images with likes and comments only.
4. **Outreach** — creator-entered **Contact** (**TextLink** for email and website) and **Past brands** proof cards.
5. **Unsigned conversion** — copy **Pattern — create PitchKit profile callout** below a truncated kit (identity + kit Stats + selected posts). No owner edit controls. Do not invent KPI metrics or a second Insights page.

The authenticated owner kit answers the same four questions, with Graph identity and hide/restore:

1. **Who** — **CreatorIdentityStrip** on **Pattern — owner PitchKit** (same Graph fields as the creator-identity Patterns). Not the public Verified + Instagram chips.
2. **Scale** — the same kit **Stat** tiles as the public kit.
3. **Selected posts** — the same proof cards, plus **MoreMenu** hide/restore (**AlertDialog** + Undo toast). No swap-post on this surface.
4. **Outreach** — the same display-only **Contact** and **Past brands**. Not editors.

## Data contract

- Engagement rate is exactly **(likes + comments) ÷ followers**.
- Missing values render as em dashes, never invented zero. Honest \`0\` only when Graph returned zero. Do not invent example percentages for missing demographics.
- **Unavailable** — Graph omitted optional chart, audience, and post regions. Copy **State — Graph data unavailable**: required **Stat** tiles stay empty (em dash); omit those optional bands. Do not invent a chart.
- **Insufficient reach** — The **reach series** cannot be plotted (missing, too thin, or all-zero — no usable reach to chart). Audience, Stats, and proof may still show. This is not whole-page Graph unavailable. Copy **State — insufficient reach data**: keep the Reach **Card** in the dashboard grid with the same header; **Card.Body** is the empty Pattern (muted **Badge** “No data” → title → body). Do not hide the band, do not draw zeros, and do not invent an empty chart.
- **In-series reach gaps** — some days in an otherwise plottable series are \`null\`. Copy **Components/Data display/Chart → Pattern — Cartesian no-data gaps** (ADR-0027). That hatch is not the Reach empty body and not **Chart.Loading**.
- **Insufficient audience** — Graph returned Insights, but demographic series are missing or empty (no country, city, age, or gender breakdown to rank). Reach, Stats, and proof may still show. Copy **State — insufficient audience data**: keep the Audience **Card** in the dashboard grid with the same header (“Audience fit” / supporting copy); **Card.Body** is the empty Pattern (same **Badge** stack). Do not hide the band, do not invent example %, and do not draw **Chart.RankedBars** from an empty series.
- **Insufficient reach and audience** — both series are unusable. Keep both Cards. Copy **State — insufficient reach and audience data** (or each empty Pattern). Never omit a chart/card band because Graph has no series.
- **Loading** — Graph connect/refresh is in flight. Copy **Pattern — creator Insights (loading)** for the initial skeleton screen (**Stat** \`loading\`, **Skeleton** wells that mirror resolved chrome, proof placeholders). If chrome is already up and a fetch is in flight, keep **Card.Header** mounted and swap the well for **Chart.Loading**. Do not use the unavailable Pattern, insufficient-data empties, or zeros as loading. Controls → **Loading phase** on that story previews skeleton vs retrieving; Show code freezes the skeleton page.
- Creator-entered contact and past-brand content belongs on the kit body (public and owner), not Insights and not the identity strip. Owner kit contact and past brands stay display-only.
- Identity fails closed: hide Graph \`name\` when missing; **Avatar** falls back when \`profile_picture_url\` is omitted; omit follower context when \`followers_count\` is omitted. Never invent a bio, website, or display name.
- Owner connection state (Connected / last sync) and Share kit Copy belong on **Pattern — creator identity (owner settings)** only.
- Account-level User settings (display name / email, Delete account) belong on **Pattern — user settings (owner)** — Avatar → **Dialog**, not the Connected Instagram page and not the app footer.
- The public kit has no owner edit toggle, **MoreMenu**, hide, or swap controls.
- Owner PitchKit edit affordance is hide/restore on selected posts only. Do not add bio, website, rates, geo, contact, or section-visibility editors.
- No rates, Stories, logo scraping, marquees, donuts, online heatmap, or second Instagram connection path.
- The authenticated PitchKit tab is **Pattern — owner PitchKit**, not a Coming soon placeholder.

## Component map

- Page layout — \`grid-page\`, \`band\`, \`--grid-max:1140px\`, \`--grid-column-gap:8px\`
- Creator identity — shared strip (**Avatar** \`lg\`, Graph name, @handle, follower context, optional **Chip**); public nameplate vs owner **Card** + **PageHeader** Settings
- Owner chrome — **SegmentedControl** + **Avatar** on Insights and owner PitchKit; Settings keeps the PitchKit wordmark + **Avatar**; the **Avatar** wraps in **Button** to open **Pattern — user settings (owner)**; public kit keeps the PitchKit wordmark only
- Page and card chrome — **PageHeader**, **Card**, **Badge**, **Avatar**, **Button**, **Chip**, **TextLink**
- Metrics and charts — **Stat**, **Chart.Cartesian**, **Chart.Legend**, **Chart.RankedBars**; loading uses **Stat** \`loading\`, **Skeleton**, and **Chart.Loading**
- Proof ranking — **Tab.Group** + **Tab**; one selected metric reorders the same supplied posts
- Post management — **MoreMenu** with **ButtonIcon**; **AlertDialog** confirms hiding a post (Insights Recent proof and owner PitchKit selected posts)
- Public outreach — **TextLink** contact rows; outlined **Card** past-brand proof; unsigned **Card** callout (**Pattern — create PitchKit profile callout**)
- Account settings — **Dialog** + **AlertDialog** \`confirmRole="destructive"\` for Delete account (**Pattern — user settings (owner)**)
- Outcome feedback — **Toaster** + **toast**; Undo restores the hidden post
- Storybook development only — **ExampleGridControls** + **GridOverlay**

## Best practices

- **Do** treat **Show code** as the implementation contract; re-copy it when the canvas changes.
- **Do** preserve the visual difference between typical performance and a spike.
- **Do** keep edit controls on owner Insights and owner PitchKit — never on the public kit.
- **Do** confirm post visibility changes with **AlertDialog** before mutating the ranked or selected set.
- **Do** pair the completed hide mutation with an actionable Undo toast.
- **Do** use **Tab** for proof ranking because the page already uses one primary **SegmentedControl**.
- **Do** freeze approved grid values into implementation code.
- **Do** copy **Pattern — creator identity (public)** for the \`/k/[handle]\` header and **Pattern — creator identity (owner settings)** for Settings → Connected Instagram.
- **Do** copy **Pattern — user settings (owner)** for Avatar → User settings **Dialog** and Delete account **AlertDialog**.
- **Do** copy **Pattern — create PitchKit profile callout** for unsigned visitors on the public kit — not a second Insights page.
- **Do** copy **Pattern — shareable PitchKit** for the public kit body, **Pattern — owner PitchKit** for the authenticated PitchKit tab, and **Pattern — creator Insights** for the owner Insights app.
- **Do** keep the Reach band when the reach series cannot be plotted — same shell and header, empty **Card.Body** (muted **Badge** “No data” → title → body). Audience, Stats, and proof may still show.
- **Do** keep the Audience band when demographics cannot be ranked — same shell and header, empty **Card.Body** (same **Badge** stack). Reach, Stats, and proof may still show.
- **Do** copy **Pattern — creator Insights (loading)** for in-flight Graph; use **Skeleton** for the first layout and **Chart.Loading** only after chrome is up.
- **Don't** copy **ExampleGridControls** into PitchKit production UI.
- **Don't** put bio, website, rates, geo, contact CTAs, heatmaps, example percentages, or kit **Stat** / chart tiles on the identity Patterns.
- **Don't** expose owner edit state or management controls on the public kit.
- **Don't** put Delete account in the app footer — it confirms from User settings.
- **Don't** invent bio, rates, website, or KPI metrics on User settings or the public callout.
- **Don't** hide the Reach card when the reach series cannot be plotted, and do not use **Skeleton** or **Chart.Loading** for that empty.
- **Don't** hide the Audience card when Graph has no demographic series, invent example percentages, or use **Skeleton** / **Chart.Loading** for that empty.
- **Don't** treat Graph-unavailable (omit optional regions), insufficient-data empties, or zeros as the loading page.
        `.trim(),
      },
    },
  },
} satisfies Meta<typeof PitchKitInsightsExample>;

export default meta;
type Story = StoryObj<typeof meta>;

export const CreatorInsights: Story = {
  name: "Pattern — creator Insights",
  render: (args) => <PitchKitInsightsExample {...args} />,
  parameters: withStoryCopySource(
    {
      docs: {
        description: {
          story:
            "Show code is the product contract — a literal freeze of this canvas (layout, chrome, spacing, typography). Copy that source into PitchKit. Do not reconstruct from PitchKitExample / pitchKitStyles, and do not ship ExampleGridControls.",
        },
      },
    },
    `
import { useState } from "react";
import {
  AlertDialog,
  Avatar,
  Badge,
  Button,
  ButtonIcon,
  Card,
  Chart,
  Chip,
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
} from "@whatmatters/wmds";
import { EyeOff, Repeat2, Share2 } from "lucide-react";

const reachConfig = chartSeriesConfigFromKeys([
  { key: "typical", label: "Typical reach" },
  { key: "reach", label: "Daily reach" },
]);

const compactNumber = new Intl.NumberFormat("en", {
  notation: "compact",
  maximumFractionDigits: 1,
});

const proofMetricNotices = {
  reach: "Ranked by Instagram reach.",
  engagement: "Ranked by likes + comments.",
  saves: "Ranked by Instagram saves.",
};

function proofMetricValue(post, metric) {
  if (metric === "engagement") return post.likes + post.comments;
  return post[metric];
}

function AudienceSection({ title, items }) {
  return (
    <section className="${pitchKitAudienceSectionClasses}">
      <h3 className="${pitchKitSectionEyebrowClasses}">{title}</h3>
      <Chart.RankedBars
        aria-label={\`Audience by \${title.toLowerCase()}\`}
        items={items}
        animate="initial"
      />
    </section>
  );
}

${ownerPitchKitBodyCopySource}

export function PitchKitInsightsPage({ reachData, audience, posts, contact, brands, identity, kitPosts }) {
  const [view, setView] = useState("insights");
  const [proofMetric, setProofMetric] = useState("reach");
  const [visiblePosts, setVisiblePosts] = useState(posts);
  const [postNotice, setPostNotice] = useState(null);
  const [pendingHidePostId, setPendingHidePostId] = useState(null);
  const rankedPosts = [...visiblePosts].sort(
    (a, b) =>
      proofMetricValue(b, proofMetric) - proofMetricValue(a, proofMetric),
  );

  function handlePostAction(postId, actionId) {
    if (actionId === "hide") {
      setPendingHidePostId(postId);
      return;
    }
    setPostNotice("Choose a replacement from your recent Instagram posts.");
  }

  function hidePendingPost() {
    const hiddenPost = visiblePosts.find((post) => post.id === pendingHidePostId);
    if (!hiddenPost) return;

    setVisiblePosts((current) =>
      current.filter((post) => post.id !== hiddenPost.id),
    );
    setPostNotice("Post hidden from the shareable kit preview.");
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
          setPostNotice("Post restored to the shareable kit preview.");
        },
      },
    });
  }

  function handleProofMetricChange(value) {
    setProofMetric(value);
    setPostNotice(null);
  }

  return (
    <main className="${pitchKitPageClasses}">
      <div className="${pitchKitTopbarBandClasses}">
        <header className="${pitchKitTopbarClasses}">
          <span className="${pitchKitBrandClasses}">PitchKit</span>
          <SegmentedControl
            aria-label="PitchKit primary navigation"
            size="sm"
            value={view}
            onValueChange={setView}
          >
            <SegmentedControl.Item value="insights">Insights</SegmentedControl.Item>
            <SegmentedControl.Item value="pitchkit">PitchKit</SegmentedControl.Item>
          </SegmentedControl>
          <span className="${pitchKitTopbarEndClasses}">
            <Avatar name="Avery Morgan" size="sm" />
          </span>
        </header>
      </div>

      <div className="${pitchKitContentBandClasses}">
        <div className="${pitchKitContentClasses}">
          {view === "pitchkit" ? (
            <OwnerPitchKit identity={identity} posts={kitPosts} contact={contact} brands={brands} />
          ) : (
            <>
              <section className="${pitchKitHeaderSectionClasses}">
                <PageHeader
                  variant="page"
                  title="Insights"
                  end={
                    <Button role="secondary" size="sm" icon={<Share2 />}>
                      Share kit
                    </Button>
                  }
                />
                <div className="${pitchKitHeaderCopyClasses}">
                  <p className="${pitchKitSupportingClasses}">
                    Verified Instagram performance, refreshed Sep 7 at 12:42 PM.
                  </p>
                  <p className="${pitchKitFormulaClasses}">
                    Engagement rate = (likes + comments) ÷ followers.
                  </p>
                </div>
              </section>

              <div className="${pitchKitMetricsStackClasses}">
                <div
                  role="group"
                  aria-label="Instagram performance summary"
                  className="${pitchKitStatsBandClasses}"
                >
                  <Stat className="${pitchKitStatClasses}" label="Followers" value="84.2K" trend={{ value: "+2.4%", direction: "up" }} />
                  <Stat className="${pitchKitStatClasses}" label="Engagement rate" value="5.8%" />
                  <Stat className="${pitchKitStatClasses}" label="Typical reach" value="9.3K" />
                  <Stat className="${pitchKitStatClasses}" label="Saves" value="6.1K" trend={{ value: "+8.1%", direction: "up" }} />
                </div>

                <div className="${pitchKitDashboardGridClasses}">
                  <Card variant="outlined" shape="rounded" bodyTerminal className="${pitchKitReachCardClasses}">
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
                      <div className="${pitchKitCardWellClasses}">
                        <Chart.Cartesian
                          data={reachData}
                          config={reachConfig}
                          periodKind="month"
                          minHeight={${pitchKitReachChartMinHeight}}
                          aria-label="Daily and typical Instagram reach over the last 30 days"
                        />
                        <Chart.Legend config={reachConfig} />
                      </div>
                    </Card.Body>
                  </Card>

                  <Card variant="outlined" shape="rounded" bodyTerminal className="${pitchKitAudienceCardClasses}">
                    <Card.Header
                      start={
                        <>
                          <h2 className={cardTitleClasses}>Audience fit</h2>
                          <p className={cardSubtitleClasses}>Ranked Instagram percentages.</p>
                        </>
                      }
                    />
                    <Card.Body>
                      <div className="${pitchKitAudienceWellClasses}">
                        <AudienceSection title="Countries" items={audience.countries} />
                        <AudienceSection title="Cities" items={audience.cities} />
                        <AudienceSection title="Age" items={audience.ages} />
                        <AudienceSection title="Gender" items={audience.gender} />
                      </div>
                    </Card.Body>
                  </Card>
                </div>
              </div>

              <section className="${pitchKitPostsSectionClasses}">
                <div className="${pitchKitPostsHeaderClasses}">
                  <div>
                    <h2 className={cardTitleClasses}>Recent proof</h2>
                    <p className="${pitchKitSupportingClasses}">
                      {postNotice ?? proofMetricNotices[proofMetric]}
                    </p>
                  </div>
                  <Badge variant="neutral" emphasis="muted" size="sm">
                    {visiblePosts.length} shown
                  </Badge>
                </div>
                <Tab.Group
                  aria-label="Rank recent proof posts by"
                  value={proofMetric}
                  onValueChange={handleProofMetricChange}
                  className="${pitchKitPostsTabsClasses}"
                >
                  <Tab value="reach" panelId="recent-proof-panel">Reach</Tab>
                  <Tab value="engagement" panelId="recent-proof-panel">Engagement</Tab>
                  <Tab value="saves" panelId="recent-proof-panel">Saves</Tab>
                </Tab.Group>
                <div
                  id="recent-proof-panel"
                  role="tabpanel"
                  className="${pitchKitPostsPanelClasses}"
                >
                  {rankedPosts.map((post, index) => (
                    <Card key={post.id} variant="outlined" shape="rounded" className="${pitchKitPostCardClasses}">
                      <Card.Header
                        start={
                          <span className="${pitchKitPostHeaderStartClasses}">
                            <Badge size="sm">#{index + 1}</Badge>
                            <span className={cardSubtitleClasses}>{post.publishedAt}</span>
                          </span>
                        }
                        end={
                          <MoreMenu
                            aria-label={\`Manage ranked post \${index + 1}\`}
                            size="xs"
                            items={[
                              {
                                id: "swap",
                                label: "Swap post",
                                start: (
                                  <ButtonIcon size="sm">
                                    <Repeat2 />
                                  </ButtonIcon>
                                ),
                              },
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
                          className="${pitchKitPostImageClasses}"
                          src={post.imageUrl}
                          alt={post.imageAlt}
                        />
                      </Card.Body>
                      <Card.Footer>
                        <div className="${pitchKitPostMetricsClasses}">
                          {[
                            ["Saves", post.saves],
                            ["Reach", post.reach],
                            ["Likes", post.likes],
                          ].map(([label, value]) => (
                            <span key={label} className="${pitchKitPostMetricClasses}">
                              <span className="${pitchKitPostMetricLabelClasses}">{label}</span>
                              <span className="${pitchKitPostMetricValueClasses}">
                                {compactNumber.format(value)}
                              </span>
                            </span>
                          ))}
                        </div>
                      </Card.Footer>
                    </Card>
                  ))}
                </div>
              </section>
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
          )}
        </div>
      </div>
      <Toaster position="bottom-right" />
    </main>
  );
}
`,
  ),
};

export const GraphDataUnavailable: Story = {
  name: "State — Graph data unavailable",
  args: {
    dataState: "unavailable",
  },
  render: (args) => <PitchKitInsightsExample {...args} />,
  parameters: {
    docs: {
      description: {
        story:
          "Required metrics remain explicitly empty. Optional chart, audience, and post regions are absent because Graph did not return them. This is not insufficient reach or insufficient audience — those keep the Reach or Audience band with an empty body.",
      },
    },
  },
};

export const InsufficientReachData: Story = {
  name: "State — insufficient reach data",
  args: {
    dataState: "insufficientReach",
  },
  render: (args) => <PitchKitInsightsExample {...args} />,
  parameters: withStoryCopySource(
    {
      docs: {
        description: {
          story:
            "Show code is the product contract when the reach series cannot be plotted — missing, too thin, or all-zero (no usable reach to chart). Audience, Stats, and proof may still show. This is not whole-page Graph unavailable. Keep the Reach Card in the Insights dashboard grid with the same header; the well is the empty Pattern (muted Badge “No data” → title → body). Do not hide the band, do not use Skeleton or Chart.Loading, and do not invent an empty chart. Copy that source into PitchKit. Do not reconstruct from PitchKitExample / pitchKitStyles, and do not ship ExampleGridControls.",
        },
      },
    },
    `
import { useState } from "react";
import {
  AlertDialog,
  Avatar,
  Badge,
  Button,
  ButtonIcon,
  Card,
  Chart,
  Chip,
  MoreMenu,
  PageHeader,
  SegmentedControl,
  Stat,
  Tab,
  TextLink,
  Toaster,
  cardSubtitleClasses,
  cardTitleClasses,
  toast,
} from "@whatmatters/wmds";
import { EyeOff, Repeat2, Share2 } from "lucide-react";

const compactNumber = new Intl.NumberFormat("en", {
  notation: "compact",
  maximumFractionDigits: 1,
});

const proofMetricNotices = {
  reach: "Ranked by Instagram reach.",
  engagement: "Ranked by likes + comments.",
  saves: "Ranked by Instagram saves.",
};

function proofMetricValue(post, metric) {
  if (metric === "engagement") return post.likes + post.comments;
  return post[metric];
}

function AudienceSection({ title, items }) {
  return (
    <section className="${pitchKitAudienceSectionClasses}">
      <h3 className="${pitchKitSectionEyebrowClasses}">{title}</h3>
      <Chart.RankedBars
        aria-label={\`Audience by \${title.toLowerCase()}\`}
        items={items}
        animate="initial"
      />
    </section>
  );
}

${ownerPitchKitBodyCopySource}

export function PitchKitInsightsInsufficientReachPage({ audience, posts, contact, brands, identity, kitPosts }) {
  const [view, setView] = useState("insights");
  const [proofMetric, setProofMetric] = useState("reach");
  const [visiblePosts, setVisiblePosts] = useState(posts);
  const [postNotice, setPostNotice] = useState(null);
  const [pendingHidePostId, setPendingHidePostId] = useState(null);
  const rankedPosts = [...visiblePosts].sort(
    (a, b) =>
      proofMetricValue(b, proofMetric) - proofMetricValue(a, proofMetric),
  );

  function handlePostAction(postId, actionId) {
    if (actionId === "hide") {
      setPendingHidePostId(postId);
      return;
    }
    setPostNotice("Choose a replacement from your recent Instagram posts.");
  }

  function hidePendingPost() {
    const hiddenPost = visiblePosts.find((post) => post.id === pendingHidePostId);
    if (!hiddenPost) return;

    setVisiblePosts((current) =>
      current.filter((post) => post.id !== hiddenPost.id),
    );
    setPostNotice("Post hidden from the shareable kit preview.");
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
          setPostNotice("Post restored to the shareable kit preview.");
        },
      },
    });
  }

  function handleProofMetricChange(value) {
    setProofMetric(value);
    setPostNotice(null);
  }

  return (
    <main className="${pitchKitPageClasses}">
      <div className="${pitchKitTopbarBandClasses}">
        <header className="${pitchKitTopbarClasses}">
          <span className="${pitchKitBrandClasses}">PitchKit</span>
          <SegmentedControl
            aria-label="PitchKit primary navigation"
            size="sm"
            value={view}
            onValueChange={setView}
          >
            <SegmentedControl.Item value="insights">Insights</SegmentedControl.Item>
            <SegmentedControl.Item value="pitchkit">PitchKit</SegmentedControl.Item>
          </SegmentedControl>
          <span className="${pitchKitTopbarEndClasses}">
            <Avatar name="Avery Morgan" size="sm" />
          </span>
        </header>
      </div>

      <div className="${pitchKitContentBandClasses}">
        <div className="${pitchKitContentClasses}">
          {view === "pitchkit" ? (
            <OwnerPitchKit identity={identity} posts={kitPosts} contact={contact} brands={brands} />
          ) : (
            <>
              <section className="${pitchKitHeaderSectionClasses}">
                <PageHeader
                  variant="page"
                  title="Insights"
                  end={
                    <Button role="secondary" size="sm" icon={<Share2 />}>
                      Share kit
                    </Button>
                  }
                />
                <div className="${pitchKitHeaderCopyClasses}">
                  <p className="${pitchKitSupportingClasses}">
                    Verified Instagram performance, refreshed Sep 7 at 12:42 PM.
                  </p>
                  <p className="${pitchKitFormulaClasses}">
                    Engagement rate = (likes + comments) ÷ followers.
                  </p>
                </div>
              </section>

              <div className="${pitchKitMetricsStackClasses}">
                <div
                  role="group"
                  aria-label="Instagram performance summary"
                  className="${pitchKitStatsBandClasses}"
                >
                  <Stat className="${pitchKitStatClasses}" label="Followers" value="84.2K" trend={{ value: "+2.4%", direction: "up" }} />
                  <Stat className="${pitchKitStatClasses}" label="Engagement rate" value="5.8%" />
                  <Stat className="${pitchKitStatClasses}" label="Typical reach" value="9.3K" />
                  <Stat className="${pitchKitStatClasses}" label="Saves" value="6.1K" trend={{ value: "+8.1%", direction: "up" }} />
                </div>

                <div className="${pitchKitDashboardGridClasses}">
                  <Card variant="outlined" shape="rounded" bodyTerminal className="${pitchKitReachCardClasses}">
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
                      <div
                        className="${pitchKitReachEmptyWellClasses}"
                        style={{ minHeight: ${pitchKitReachChartMinHeight} }}
                      >
                        <div className="${pitchKitReachEmptyCopyClasses}">
                          <Badge variant="neutral" emphasis="muted">No data</Badge>
                          <h3 className="${pitchKitEmptyTitleClasses}">No reach data yet</h3>
                          <p className="${pitchKitEmptyBodyClasses}">
                            Connect more Instagram activity to plot the last 30 days.
                          </p>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>

                  <Card variant="outlined" shape="rounded" bodyTerminal className="${pitchKitAudienceCardClasses}">
                    <Card.Header
                      start={
                        <>
                          <h2 className={cardTitleClasses}>Audience fit</h2>
                          <p className={cardSubtitleClasses}>Ranked Instagram percentages.</p>
                        </>
                      }
                    />
                    <Card.Body>
                      <div className="${pitchKitAudienceWellClasses}">
                        <AudienceSection title="Countries" items={audience.countries} />
                        <AudienceSection title="Cities" items={audience.cities} />
                        <AudienceSection title="Age" items={audience.ages} />
                        <AudienceSection title="Gender" items={audience.gender} />
                      </div>
                    </Card.Body>
                  </Card>
                </div>
              </div>

              <section className="${pitchKitPostsSectionClasses}">
                <div className="${pitchKitPostsHeaderClasses}">
                  <div>
                    <h2 className={cardTitleClasses}>Recent proof</h2>
                    <p className="${pitchKitSupportingClasses}">
                      {postNotice ?? proofMetricNotices[proofMetric]}
                    </p>
                  </div>
                  <Badge variant="neutral" emphasis="muted" size="sm">
                    {visiblePosts.length} shown
                  </Badge>
                </div>
                <Tab.Group
                  aria-label="Rank recent proof posts by"
                  value={proofMetric}
                  onValueChange={handleProofMetricChange}
                  className="${pitchKitPostsTabsClasses}"
                >
                  <Tab value="reach" panelId="recent-proof-panel">Reach</Tab>
                  <Tab value="engagement" panelId="recent-proof-panel">Engagement</Tab>
                  <Tab value="saves" panelId="recent-proof-panel">Saves</Tab>
                </Tab.Group>
                <div
                  id="recent-proof-panel"
                  role="tabpanel"
                  className="${pitchKitPostsPanelClasses}"
                >
                  {rankedPosts.map((post, index) => (
                    <Card key={post.id} variant="outlined" shape="rounded" className="${pitchKitPostCardClasses}">
                      <Card.Header
                        start={
                          <span className="${pitchKitPostHeaderStartClasses}">
                            <Badge size="sm">#{index + 1}</Badge>
                            <span className={cardSubtitleClasses}>{post.publishedAt}</span>
                          </span>
                        }
                        end={
                          <MoreMenu
                            aria-label={\`Manage ranked post \${index + 1}\`}
                            size="xs"
                            items={[
                              {
                                id: "swap",
                                label: "Swap post",
                                start: (
                                  <ButtonIcon size="sm">
                                    <Repeat2 />
                                  </ButtonIcon>
                                ),
                              },
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
                          className="${pitchKitPostImageClasses}"
                          src={post.imageUrl}
                          alt={post.imageAlt}
                        />
                      </Card.Body>
                      <Card.Footer>
                        <div className="${pitchKitPostMetricsClasses}">
                          {[
                            ["Saves", post.saves],
                            ["Reach", post.reach],
                            ["Likes", post.likes],
                          ].map(([label, value]) => (
                            <span key={label} className="${pitchKitPostMetricClasses}">
                              <span className="${pitchKitPostMetricLabelClasses}">{label}</span>
                              <span className="${pitchKitPostMetricValueClasses}">
                                {compactNumber.format(value)}
                              </span>
                            </span>
                          ))}
                        </div>
                      </Card.Footer>
                    </Card>
                  ))}
                </div>
              </section>
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
          )}
        </div>
      </div>
      <Toaster position="bottom-right" />
    </main>
  );
}
`,
  ),
};

export const InsufficientAudienceData: Story = {
  name: "State — insufficient audience data",
  args: {
    dataState: "insufficientAudience",
  },
  render: (args) => <PitchKitInsightsExample {...args} />,
  parameters: withStoryCopySource(
    {
      docs: {
        description: {
          story:
            "Show code is the product contract when Graph returned Insights but demographic series are missing or empty — no country, city, age, or gender breakdown to rank. Reach, Stats, and proof may still show. This is not whole-page Graph unavailable. Keep the Audience Card in the Insights dashboard grid with the same header; the well is the empty Pattern (muted Badge “No data” → title → body). Do not hide the band, do not invent example percentages, do not use Skeleton or Chart.Loading, and do not draw RankedBars from an empty series. Honest 0 only when Graph returned zero. Copy that source into PitchKit. Do not reconstruct from PitchKitExample / pitchKitStyles, and do not ship ExampleGridControls.",
        },
      },
    },
    `
import { useState } from "react";
import {
  AlertDialog,
  Avatar,
  Badge,
  Button,
  ButtonIcon,
  Card,
  Chart,
  Chip,
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
} from "@whatmatters/wmds";
import { EyeOff, Repeat2, Share2 } from "lucide-react";

const reachConfig = chartSeriesConfigFromKeys([
  { key: "typical", label: "Typical reach" },
  { key: "reach", label: "Daily reach" },
]);

const compactNumber = new Intl.NumberFormat("en", {
  notation: "compact",
  maximumFractionDigits: 1,
});

const proofMetricNotices = {
  reach: "Ranked by Instagram reach.",
  engagement: "Ranked by likes + comments.",
  saves: "Ranked by Instagram saves.",
};

function proofMetricValue(post, metric) {
  if (metric === "engagement") return post.likes + post.comments;
  return post[metric];
}

${ownerPitchKitBodyCopySource}

export function PitchKitInsightsInsufficientAudiencePage({ reachData, posts, contact, brands, identity, kitPosts }) {
  const [view, setView] = useState("insights");
  const [proofMetric, setProofMetric] = useState("reach");
  const [visiblePosts, setVisiblePosts] = useState(posts);
  const [postNotice, setPostNotice] = useState(null);
  const [pendingHidePostId, setPendingHidePostId] = useState(null);
  const rankedPosts = [...visiblePosts].sort(
    (a, b) =>
      proofMetricValue(b, proofMetric) - proofMetricValue(a, proofMetric),
  );

  function handlePostAction(postId, actionId) {
    if (actionId === "hide") {
      setPendingHidePostId(postId);
      return;
    }
    setPostNotice("Choose a replacement from your recent Instagram posts.");
  }

  function hidePendingPost() {
    const hiddenPost = visiblePosts.find((post) => post.id === pendingHidePostId);
    if (!hiddenPost) return;

    setVisiblePosts((current) =>
      current.filter((post) => post.id !== hiddenPost.id),
    );
    setPostNotice("Post hidden from the shareable kit preview.");
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
          setPostNotice("Post restored to the shareable kit preview.");
        },
      },
    });
  }

  function handleProofMetricChange(value) {
    setProofMetric(value);
    setPostNotice(null);
  }

  return (
    <main className="${pitchKitPageClasses}">
      <div className="${pitchKitTopbarBandClasses}">
        <header className="${pitchKitTopbarClasses}">
          <span className="${pitchKitBrandClasses}">PitchKit</span>
          <SegmentedControl
            aria-label="PitchKit primary navigation"
            size="sm"
            value={view}
            onValueChange={setView}
          >
            <SegmentedControl.Item value="insights">Insights</SegmentedControl.Item>
            <SegmentedControl.Item value="pitchkit">PitchKit</SegmentedControl.Item>
          </SegmentedControl>
          <span className="${pitchKitTopbarEndClasses}">
            <Avatar name="Avery Morgan" size="sm" />
          </span>
        </header>
      </div>

      <div className="${pitchKitContentBandClasses}">
        <div className="${pitchKitContentClasses}">
          {view === "pitchkit" ? (
            <OwnerPitchKit identity={identity} posts={kitPosts} contact={contact} brands={brands} />
          ) : (
            <>
              <section className="${pitchKitHeaderSectionClasses}">
                <PageHeader
                  variant="page"
                  title="Insights"
                  end={
                    <Button role="secondary" size="sm" icon={<Share2 />}>
                      Share kit
                    </Button>
                  }
                />
                <div className="${pitchKitHeaderCopyClasses}">
                  <p className="${pitchKitSupportingClasses}">
                    Verified Instagram performance, refreshed Sep 7 at 12:42 PM.
                  </p>
                  <p className="${pitchKitFormulaClasses}">
                    Engagement rate = (likes + comments) ÷ followers.
                  </p>
                </div>
              </section>

              <div className="${pitchKitMetricsStackClasses}">
                <div
                  role="group"
                  aria-label="Instagram performance summary"
                  className="${pitchKitStatsBandClasses}"
                >
                  <Stat className="${pitchKitStatClasses}" label="Followers" value="84.2K" trend={{ value: "+2.4%", direction: "up" }} />
                  <Stat className="${pitchKitStatClasses}" label="Engagement rate" value="5.8%" />
                  <Stat className="${pitchKitStatClasses}" label="Typical reach" value="9.3K" />
                  <Stat className="${pitchKitStatClasses}" label="Saves" value="6.1K" trend={{ value: "+8.1%", direction: "up" }} />
                </div>

                <div className="${pitchKitDashboardGridClasses}">
                  <Card variant="outlined" shape="rounded" bodyTerminal className="${pitchKitReachCardClasses}">
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
                      <div className="${pitchKitCardWellClasses}">
                        <Chart.Cartesian
                          data={reachData}
                          config={reachConfig}
                          periodKind="month"
                          minHeight={${pitchKitReachChartMinHeight}}
                          aria-label="Daily and typical Instagram reach over the last 30 days"
                        />
                        <Chart.Legend config={reachConfig} />
                      </div>
                    </Card.Body>
                  </Card>

                  <Card variant="outlined" shape="rounded" bodyTerminal className="${pitchKitAudienceCardClasses}">
                    <Card.Header
                      start={
                        <>
                          <h2 className={cardTitleClasses}>Audience fit</h2>
                          <p className={cardSubtitleClasses}>Ranked Instagram percentages.</p>
                        </>
                      }
                    />
                    <Card.Body>
                      <div
                        className="${pitchKitAudienceEmptyWellClasses}"
                        style={{ minHeight: ${pitchKitReachChartMinHeight} }}
                      >
                        <div className="${pitchKitAudienceEmptyCopyClasses}">
                          <Badge variant="neutral" emphasis="muted">No data</Badge>
                          <h3 className="${pitchKitEmptyTitleClasses}">No audience data yet</h3>
                          <p className="${pitchKitEmptyBodyClasses}">
                            Connect Instagram Insights demographics when available.
                          </p>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </div>
              </div>

              <section className="${pitchKitPostsSectionClasses}">
                <div className="${pitchKitPostsHeaderClasses}">
                  <div>
                    <h2 className={cardTitleClasses}>Recent proof</h2>
                    <p className="${pitchKitSupportingClasses}">
                      {postNotice ?? proofMetricNotices[proofMetric]}
                    </p>
                  </div>
                  <Badge variant="neutral" emphasis="muted" size="sm">
                    {visiblePosts.length} shown
                  </Badge>
                </div>
                <Tab.Group
                  aria-label="Rank recent proof posts by"
                  value={proofMetric}
                  onValueChange={handleProofMetricChange}
                  className="${pitchKitPostsTabsClasses}"
                >
                  <Tab value="reach" panelId="recent-proof-panel">Reach</Tab>
                  <Tab value="engagement" panelId="recent-proof-panel">Engagement</Tab>
                  <Tab value="saves" panelId="recent-proof-panel">Saves</Tab>
                </Tab.Group>
                <div
                  id="recent-proof-panel"
                  role="tabpanel"
                  className="${pitchKitPostsPanelClasses}"
                >
                  {rankedPosts.map((post, index) => (
                    <Card key={post.id} variant="outlined" shape="rounded" className="${pitchKitPostCardClasses}">
                      <Card.Header
                        start={
                          <span className="${pitchKitPostHeaderStartClasses}">
                            <Badge size="sm">#{index + 1}</Badge>
                            <span className={cardSubtitleClasses}>{post.publishedAt}</span>
                          </span>
                        }
                        end={
                          <MoreMenu
                            aria-label={\`Manage ranked post \${index + 1}\`}
                            size="xs"
                            items={[
                              {
                                id: "swap",
                                label: "Swap post",
                                start: (
                                  <ButtonIcon size="sm">
                                    <Repeat2 />
                                  </ButtonIcon>
                                ),
                              },
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
                          className="${pitchKitPostImageClasses}"
                          src={post.imageUrl}
                          alt={post.imageAlt}
                        />
                      </Card.Body>
                      <Card.Footer>
                        <div className="${pitchKitPostMetricsClasses}">
                          {[
                            ["Saves", post.saves],
                            ["Reach", post.reach],
                            ["Likes", post.likes],
                          ].map(([label, value]) => (
                            <span key={label} className="${pitchKitPostMetricClasses}">
                              <span className="${pitchKitPostMetricLabelClasses}">{label}</span>
                              <span className="${pitchKitPostMetricValueClasses}">
                                {compactNumber.format(value)}
                              </span>
                            </span>
                          ))}
                        </div>
                      </Card.Footer>
                    </Card>
                  ))}
                </div>
              </section>
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
          )}
        </div>
      </div>
      <Toaster position="bottom-right" />
    </main>
  );
}
`,
  ),
};

export const InsufficientReachAndAudienceData: Story = {
  name: "State — insufficient reach and audience data",
  args: {
    dataState: "insufficientReachAndAudience",
  },
  render: (args) => <PitchKitInsightsExample {...args} />,
  parameters: withStoryCopySource(
    {
      docs: {
        description: {
          story:
            "Show code is the product contract when both the reach series and demographic series are unusable. Keep both Cards in the Insights dashboard grid with the same headers; each well is that band’s empty Pattern (muted Badge “No data” → title → body). Do not omit either band, do not invent a chart or example percentages, and do not use Skeleton or Chart.Loading for these empties. Copy that source into PitchKit. Do not reconstruct from PitchKitExample / pitchKitStyles, and do not ship ExampleGridControls.",
        },
      },
    },
    `
import { useState } from "react";
import {
  AlertDialog,
  Avatar,
  Badge,
  Button,
  ButtonIcon,
  Card,
  Chip,
  MoreMenu,
  PageHeader,
  SegmentedControl,
  Stat,
  Tab,
  TextLink,
  Toaster,
  cardSubtitleClasses,
  cardTitleClasses,
  toast,
} from "@whatmatters/wmds";
import { EyeOff, Repeat2, Share2 } from "lucide-react";

const compactNumber = new Intl.NumberFormat("en", {
  notation: "compact",
  maximumFractionDigits: 1,
});

const proofMetricNotices = {
  reach: "Ranked by Instagram reach.",
  engagement: "Ranked by likes + comments.",
  saves: "Ranked by Instagram saves.",
};

function proofMetricValue(post, metric) {
  if (metric === "engagement") return post.likes + post.comments;
  return post[metric];
}

${ownerPitchKitBodyCopySource}

export function PitchKitInsightsInsufficientReachAndAudiencePage({ posts, contact, brands, identity, kitPosts }) {
  const [view, setView] = useState("insights");
  const [proofMetric, setProofMetric] = useState("reach");
  const [visiblePosts, setVisiblePosts] = useState(posts);
  const [postNotice, setPostNotice] = useState(null);
  const [pendingHidePostId, setPendingHidePostId] = useState(null);
  const rankedPosts = [...visiblePosts].sort(
    (a, b) =>
      proofMetricValue(b, proofMetric) - proofMetricValue(a, proofMetric),
  );

  function handlePostAction(postId, actionId) {
    if (actionId === "hide") {
      setPendingHidePostId(postId);
      return;
    }
    setPostNotice("Choose a replacement from your recent Instagram posts.");
  }

  function hidePendingPost() {
    const hiddenPost = visiblePosts.find((post) => post.id === pendingHidePostId);
    if (!hiddenPost) return;

    setVisiblePosts((current) =>
      current.filter((post) => post.id !== hiddenPost.id),
    );
    setPostNotice("Post hidden from the shareable kit preview.");
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
          setPostNotice("Post restored to the shareable kit preview.");
        },
      },
    });
  }

  function handleProofMetricChange(value) {
    setProofMetric(value);
    setPostNotice(null);
  }

  return (
    <main className="${pitchKitPageClasses}">
      <div className="${pitchKitTopbarBandClasses}">
        <header className="${pitchKitTopbarClasses}">
          <span className="${pitchKitBrandClasses}">PitchKit</span>
          <SegmentedControl
            aria-label="PitchKit primary navigation"
            size="sm"
            value={view}
            onValueChange={setView}
          >
            <SegmentedControl.Item value="insights">Insights</SegmentedControl.Item>
            <SegmentedControl.Item value="pitchkit">PitchKit</SegmentedControl.Item>
          </SegmentedControl>
          <span className="${pitchKitTopbarEndClasses}">
            <Avatar name="Avery Morgan" size="sm" />
          </span>
        </header>
      </div>

      <div className="${pitchKitContentBandClasses}">
        <div className="${pitchKitContentClasses}">
          {view === "pitchkit" ? (
            <OwnerPitchKit identity={identity} posts={kitPosts} contact={contact} brands={brands} />
          ) : (
            <>
              <section className="${pitchKitHeaderSectionClasses}">
                <PageHeader
                  variant="page"
                  title="Insights"
                  end={
                    <Button role="secondary" size="sm" icon={<Share2 />}>
                      Share kit
                    </Button>
                  }
                />
                <div className="${pitchKitHeaderCopyClasses}">
                  <p className="${pitchKitSupportingClasses}">
                    Verified Instagram performance, refreshed Sep 7 at 12:42 PM.
                  </p>
                  <p className="${pitchKitFormulaClasses}">
                    Engagement rate = (likes + comments) ÷ followers.
                  </p>
                </div>
              </section>

              <div className="${pitchKitMetricsStackClasses}">
                <div
                  role="group"
                  aria-label="Instagram performance summary"
                  className="${pitchKitStatsBandClasses}"
                >
                  <Stat className="${pitchKitStatClasses}" label="Followers" value="84.2K" trend={{ value: "+2.4%", direction: "up" }} />
                  <Stat className="${pitchKitStatClasses}" label="Engagement rate" value="5.8%" />
                  <Stat className="${pitchKitStatClasses}" label="Typical reach" value="9.3K" />
                  <Stat className="${pitchKitStatClasses}" label="Saves" value="6.1K" trend={{ value: "+8.1%", direction: "up" }} />
                </div>

                <div className="${pitchKitDashboardGridClasses}">
                  <Card variant="outlined" shape="rounded" bodyTerminal className="${pitchKitReachCardClasses}">
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
                      <div
                        className="${pitchKitReachEmptyWellClasses}"
                        style={{ minHeight: ${pitchKitReachChartMinHeight} }}
                      >
                        <div className="${pitchKitReachEmptyCopyClasses}">
                          <Badge variant="neutral" emphasis="muted">No data</Badge>
                          <h3 className="${pitchKitEmptyTitleClasses}">No reach data yet</h3>
                          <p className="${pitchKitEmptyBodyClasses}">
                            Connect more Instagram activity to plot the last 30 days.
                          </p>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>

                  <Card variant="outlined" shape="rounded" bodyTerminal className="${pitchKitAudienceCardClasses}">
                    <Card.Header
                      start={
                        <>
                          <h2 className={cardTitleClasses}>Audience fit</h2>
                          <p className={cardSubtitleClasses}>Ranked Instagram percentages.</p>
                        </>
                      }
                    />
                    <Card.Body>
                      <div
                        className="${pitchKitAudienceEmptyWellClasses}"
                        style={{ minHeight: ${pitchKitReachChartMinHeight} }}
                      >
                        <div className="${pitchKitAudienceEmptyCopyClasses}">
                          <Badge variant="neutral" emphasis="muted">No data</Badge>
                          <h3 className="${pitchKitEmptyTitleClasses}">No audience data yet</h3>
                          <p className="${pitchKitEmptyBodyClasses}">
                            Connect Instagram Insights demographics when available.
                          </p>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </div>
              </div>

              <section className="${pitchKitPostsSectionClasses}">
                <div className="${pitchKitPostsHeaderClasses}">
                  <div>
                    <h2 className={cardTitleClasses}>Recent proof</h2>
                    <p className="${pitchKitSupportingClasses}">
                      {postNotice ?? proofMetricNotices[proofMetric]}
                    </p>
                  </div>
                  <Badge variant="neutral" emphasis="muted" size="sm">
                    {visiblePosts.length} shown
                  </Badge>
                </div>
                <Tab.Group
                  aria-label="Rank recent proof posts by"
                  value={proofMetric}
                  onValueChange={handleProofMetricChange}
                  className="${pitchKitPostsTabsClasses}"
                >
                  <Tab value="reach" panelId="recent-proof-panel">Reach</Tab>
                  <Tab value="engagement" panelId="recent-proof-panel">Engagement</Tab>
                  <Tab value="saves" panelId="recent-proof-panel">Saves</Tab>
                </Tab.Group>
                <div
                  id="recent-proof-panel"
                  role="tabpanel"
                  className="${pitchKitPostsPanelClasses}"
                >
                  {rankedPosts.map((post, index) => (
                    <Card key={post.id} variant="outlined" shape="rounded" className="${pitchKitPostCardClasses}">
                      <Card.Header
                        start={
                          <span className="${pitchKitPostHeaderStartClasses}">
                            <Badge size="sm">#{index + 1}</Badge>
                            <span className={cardSubtitleClasses}>{post.publishedAt}</span>
                          </span>
                        }
                        end={
                          <MoreMenu
                            aria-label={\`Manage ranked post \${index + 1}\`}
                            size="xs"
                            items={[
                              {
                                id: "swap",
                                label: "Swap post",
                                start: (
                                  <ButtonIcon size="sm">
                                    <Repeat2 />
                                  </ButtonIcon>
                                ),
                              },
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
                          className="${pitchKitPostImageClasses}"
                          src={post.imageUrl}
                          alt={post.imageAlt}
                        />
                      </Card.Body>
                      <Card.Footer>
                        <div className="${pitchKitPostMetricsClasses}">
                          {[
                            ["Saves", post.saves],
                            ["Reach", post.reach],
                            ["Likes", post.likes],
                          ].map(([label, value]) => (
                            <span key={label} className="${pitchKitPostMetricClasses}">
                              <span className="${pitchKitPostMetricLabelClasses}">{label}</span>
                              <span className="${pitchKitPostMetricValueClasses}">
                                {compactNumber.format(value)}
                              </span>
                            </span>
                          ))}
                        </div>
                      </Card.Footer>
                    </Card>
                  ))}
                </div>
              </section>
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
          )}
        </div>
      </div>
      <Toaster position="bottom-right" />
    </main>
  );
}
`,
  ),
};

export const CreatorInsightsLoading: Story = {
  name: "Pattern — creator Insights (loading)",
  args: {
    dataState: "loading",
    loadingPhase: "skeleton",
  },
  argTypes: {
    loadingPhase: {
      control: "select",
      options: loadingPhases,
      table: { disable: false },
    },
  },
  render: (args) => <PitchKitInsightsExample {...args} />,
  parameters: withStoryCopySource(
    {
      docs: {
        description: {
          story:
            "Show code is the product contract for owner Insights while Graph connect/refresh is in flight — a literal freeze of the initial skeleton canvas (layout, chrome, spacing, typography). Stat tiles use loading. Reach and Audience Cards keep the dashboard grid with Skeleton wells that mirror the resolved bands. Recent proof uses six Skeleton cards. Controls → Loading phase can preview retrieving (Card.Header mounted + Chart.Loading); do not paste that as the first-layout freeze. Copy this source into PitchKit. Do not reconstruct from PitchKitExample / pitchKitStyles, do not ship ExampleGridControls, and do not use Graph-unavailable or zeros as loading.",
        },
      },
    },
    `
import { useState } from "react";
import {
  AlertDialog,
  Avatar,
  Badge,
  Button,
  ButtonIcon,
  Card,
  Chip,
  MoreMenu,
  PageHeader,
  SegmentedControl,
  Skeleton,
  Stat,
  TextLink,
  Toaster,
  cardTitleClasses,
  toast,
} from "@whatmatters/wmds";
import { EyeOff, Share2 } from "lucide-react";

const proofSkeletonCount = 6;
const audienceSkeletonSections = [
  { titleWidth: 72, bars: [100, 82, 64] },
  { titleWidth: 56, bars: [92, 74, 58] },
  { titleWidth: 40, bars: [88, 70, 52] },
  { titleWidth: 60, bars: [96, 68, 44] },
];

${ownerPitchKitBodyCopySource}

export function PitchKitInsightsLoadingPage({ posts, contact, brands, identity, kitPosts }) {
  const [view, setView] = useState("insights");

  return (
    <main className="${pitchKitPageClasses}">
      <div className="${pitchKitTopbarBandClasses}">
        <header className="${pitchKitTopbarClasses}">
          <span className="${pitchKitBrandClasses}">PitchKit</span>
          <SegmentedControl
            aria-label="PitchKit primary navigation"
            size="sm"
            value={view}
            onValueChange={setView}
          >
            <SegmentedControl.Item value="insights">Insights</SegmentedControl.Item>
            <SegmentedControl.Item value="pitchkit">PitchKit</SegmentedControl.Item>
          </SegmentedControl>
          <span className="${pitchKitTopbarEndClasses}">
            <Avatar name="Avery Morgan" size="sm" />
          </span>
        </header>
      </div>

      <div className="${pitchKitContentBandClasses}">
        <div className="${pitchKitContentClasses}">
          {view === "pitchkit" ? (
            <OwnerPitchKit identity={identity} posts={kitPosts} contact={contact} brands={brands} />
          ) : (
            <>
              <section className="${pitchKitHeaderSectionClasses}">
                <PageHeader
                  variant="page"
                  title="Insights"
                  end={
                    <Button role="secondary" size="sm" icon={<Share2 />}>
                      Share kit
                    </Button>
                  }
                />
                <div className="${pitchKitHeaderSkeletonCopyClasses}">
                  <Skeleton width={280} height={16} radius="inner" index={20} />
                  <Skeleton width={220} height={12} radius="inner" index={21} />
                </div>
              </section>

              <div className="${pitchKitMetricsStackClasses}">
                <div
                  role="group"
                  aria-label="Loading Instagram performance summary"
                  className="${pitchKitStatsBandClasses}"
                >
                  <Stat className="${pitchKitStatClasses}" label="Followers" value="" loading />
                  <Stat className="${pitchKitStatClasses}" label="Engagement rate" value="" loading />
                  <Stat className="${pitchKitStatClasses}" label="Typical reach" value="" loading />
                  <Stat className="${pitchKitStatClasses}" label="Saves" value="" loading />
                </div>

                <div className="${pitchKitDashboardGridClasses}">
                  <Card
                    variant="outlined"
                    shape="rounded"
                    bodyTerminal
                    className="${pitchKitReachCardClasses}"
                    aria-busy="true"
                    aria-label="Loading reach over 30 days"
                  >
                    <Card.Header
                      start={
                        <div className="${pitchKitHeaderSkeletonStackClasses}">
                          <Skeleton width={168} height={18} radius="inner" index={0} />
                          <Skeleton width={240} height={14} radius="inner" index={1} />
                        </div>
                      }
                      end={<Skeleton width={88} height={28} radius="full" index={2} />}
                    />
                    <Card.Body>
                      <div className="${pitchKitCardWellClasses}">
                        <Skeleton
                          width="100%"
                          height={${pitchKitReachChartMinHeight}}
                          radius="element"
                          index={3}
                        />
                        <div className="${pitchKitSkeletonLegendRowClasses}">
                          <Skeleton width={112} height={12} radius="inner" index={4} />
                          <Skeleton width={96} height={12} radius="inner" index={5} />
                        </div>
                      </div>
                    </Card.Body>
                  </Card>

                  <Card
                    variant="outlined"
                    shape="rounded"
                    bodyTerminal
                    className="${pitchKitAudienceCardClasses}"
                    aria-busy="true"
                    aria-label="Loading audience fit"
                  >
                    <Card.Header
                      start={
                        <div className="${pitchKitHeaderSkeletonStackClasses}">
                          <Skeleton width={120} height={18} radius="inner" index={6} />
                          <Skeleton width={188} height={14} radius="inner" index={7} />
                        </div>
                      }
                    />
                    <Card.Body>
                      <div className="${pitchKitAudienceWellClasses}">
                        {audienceSkeletonSections.map((section, sectionIndex) => (
                          <section
                            key={section.titleWidth}
                            className="${pitchKitAudienceSkeletonSectionClasses}"
                          >
                            <Skeleton
                              width={section.titleWidth}
                              height={12}
                              radius="inner"
                              index={8 + sectionIndex}
                            />
                            <div className="${pitchKitAudienceSkeletonBarsClasses}">
                              {section.bars.map((width, barIndex) => (
                                <Skeleton
                                  key={\`\${section.titleWidth}-\${width}\`}
                                  width={\`\${width}%\`}
                                  height={16}
                                  radius="inner"
                                  index={12 + sectionIndex * 3 + barIndex}
                                />
                              ))}
                            </div>
                          </section>
                        ))}
                      </div>
                    </Card.Body>
                  </Card>
                </div>
              </div>

              <section
                className="${pitchKitPostsSectionClasses}"
                aria-busy="true"
                aria-label="Loading recent proof"
              >
                <div className="${pitchKitPostsHeaderClasses}">
                  <div className="${pitchKitHeaderSkeletonCopyClasses}">
                    <Skeleton width={132} height={18} radius="inner" index={22} />
                    <Skeleton width={196} height={14} radius="inner" index={23} />
                  </div>
                </div>
                <div className="${pitchKitPostsPanelClasses}">
                  {Array.from({ length: proofSkeletonCount }, (_, index) => {
                    const base = 24 + index * 8;
                    return (
                      <Card
                        key={index}
                        variant="outlined"
                        shape="rounded"
                        className="${pitchKitPostCardClasses}"
                        aria-hidden
                      >
                        <Card.Header
                          start={
                            <span className="${pitchKitPostHeaderStartClasses}">
                              <Skeleton width={28} height={20} radius="full" index={base} />
                              <Skeleton width={48} height={14} radius="inner" index={base + 1} />
                            </span>
                          }
                        />
                        <Card.Body>
                          <div className="${pitchKitPostImageClasses}">
                            <Skeleton
                              width="100%"
                              height="100%"
                              radius="element"
                              className="h-full w-full"
                              index={base + 2}
                            />
                          </div>
                        </Card.Body>
                        <Card.Footer>
                          <div className="${pitchKitPostMetricsClasses}">
                            {[0, 1, 2].map((metric) => (
                              <span key={metric} className="${pitchKitPostMetricClasses}">
                                <Skeleton width={40} height={10} radius="inner" index={base + 3 + metric} />
                                <Skeleton width={56} height={16} radius="inner" index={base + 6 + metric} />
                              </span>
                            ))}
                          </div>
                        </Card.Footer>
                      </Card>
                    );
                  })}
                </div>
              </section>
            </>
          )}
        </div>
      </div>
      <Toaster position="bottom-right" />
    </main>
  );
}
`,
  ),
};

export const ShareablePitchKit: Story = {
  name: "Pattern — shareable PitchKit",
  render: () => <PitchKitShareableExample />,
  parameters: withStoryCopySource(
    {
      docs: {
        description: {
          story:
            "Show code is the product contract for the public kit — a literal freeze of this canvas (layout, chrome, spacing, typography). Copy that source into PitchKit. Do not reconstruct from Storybook-only example files, do not ship the grid inspector, and do not add owner management controls.",
        },
      },
    },
    `
import {
  Avatar,
  Badge,
  Card,
  Chip,
  Stat,
  TextLink,
  cardTitleClasses,
} from "@whatmatters/wmds";

const compactNumber = new Intl.NumberFormat("en", {
  notation: "compact",
  maximumFractionDigits: 1,
});

${shareablePitchKitCopySource}

export function ShareablePitchKitPage({ posts, contact, brands }) {
  return (
    <main className="${pitchKitPageClasses}">
      <div className="${pitchKitTopbarBandClasses}">
        <header className="${pitchKitTopbarClasses}">
          <span className="${pitchKitBrandClasses}">PitchKit</span>
        </header>
      </div>

      <div className="${pitchKitContentBandClasses}">
        <div className="${pitchKitContentClasses}">
          <ShareablePitchKit posts={posts} contact={contact} brands={brands} />
        </div>
      </div>
    </main>
  );
}
`,
  ),
};

export const OwnerPitchKit: Story = {
  name: "Pattern — owner PitchKit",
  render: (args) => <PitchKitOwnerExample {...args} />,
  parameters: withStoryCopySource(
    {
      docs: {
        description: {
          story:
            "Show code is the product contract for the authenticated PitchKit tab — a literal freeze of this canvas (layout, chrome, spacing, typography). Same kit sections as Pattern — shareable PitchKit, with CreatorIdentityStrip and MoreMenu hide/restore on selected posts. Contact and past brands stay display-only. Copy that source into PitchKit. Do not reconstruct from Storybook-only example files, do not ship the grid inspector, and do not add bio, website, rates, geo, or contact editors.",
        },
      },
    },
    ownerPitchKitPageCopySource,
  ),
};
