import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  storyMetaDocsDefaults,
  withStoryCopySource,
} from "../../lib/storyCopySource";
import {
  PitchKitInsightsExample,
  type PitchKitDataState,
} from "./PitchKitExample";
import { PitchKitShareableExample } from "./PitchKitShareable";
/** Interpolated into Show code so the freeze stays locked to the live canvas styles. */
import {
  pitchKitAudienceCardClasses,
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
  pitchKitDashboardGridClasses,
  pitchKitFormulaClasses,
  pitchKitHeaderCopyClasses,
  pitchKitHeaderSectionClasses,
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
  pitchKitSectionEyebrowClasses,
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

const dataStates = ["resolved", "unavailable"] as const satisfies readonly PitchKitDataState[];

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
  },
  args: {
    dataState: "resolved",
  },
  parameters: {
    wmdsLayout: "fullscreen",
    docs: {
      description: {
        component: `
## Usage

Authenticated PitchKit at a frozen 1140px grid maximum. The single top-level **SegmentedControl** switches between owner **Insights** and a preview of the public **PitchKit**. Copy **Pattern — creator Insights** for the authenticated owner page and **Pattern — shareable PitchKit** for the public kit.

**Show code** on each **Pattern** story is the product contract — a literal freeze of that canvas (layout, chrome, spacing, typography). Copy that source into PitchKit. Do not reconstruct the page from Storybook-only \`PitchKitExample\` / \`PitchKitShareable\` / \`pitchKitStyles\`, and do not ship **ExampleGridControls**.

The Insights dashboard answers four questions in order:

1. **Scale and response** — **Stat** tiles on the page subgrid for followers, labeled engagement rate, typical reach, and saves.
2. **Consistency** — one 30-day **Chart.Cartesian** comparing typical and daily reach, including visible spikes.
3. **Audience fit** — **Chart.RankedBars** for Graph-supplied country, city, age, and gender percentages.
4. **Proof** — six recent **Card** items with secondary **Tab** ranking by reach, engagement (likes + comments), or saves, plus persistent **MoreMenu** hide/swap controls.

The public kit answers four questions in order:

1. **Who** — **Avatar**, creator name, handle, muted **Verified** **Badge**, and a read-only Instagram **Chip**.
2. **Scale** — verified **Stat** summary for followers and engagement rate. Same figures as Insights; no owner trends or chart chrome.
3. **Selected posts** — the current Instagram proof set as **Card** images with likes and comments only.
4. **Outreach** — creator-entered **Contact** (**TextLink** for email and website) and **Past brands** proof cards.

## Data contract

- Engagement rate is exactly **(likes + comments) ÷ followers**.
- Missing values render as em dashes, never zero.
- Optional chart, audience, and post sections are omitted when Graph did not provide them.
- Creator-entered contact and past-brand content belongs on the public PitchKit, not Insights.
- The public kit has no owner edit toggle, **MoreMenu**, hide, or swap controls.
- No rates, Stories, logo scraping, marquees, donuts, or second Instagram connection path.

## Component map

- Page layout — \`grid-page\`, \`band\`, \`--grid-max:1140px\`, \`--grid-column-gap:8px\`
- Owner chrome — **SegmentedControl** + **Avatar**; public kit keeps the PitchKit wordmark only
- Page and card chrome — **PageHeader**, **Card**, **Badge**, **Avatar**, **Button**, **Chip**
- Metrics and charts — **Stat**, **Chart.Cartesian**, **Chart.Legend**, **Chart.RankedBars**
- Proof ranking — **Tab.Group** + **Tab**; one selected metric reorders the same supplied posts
- Post management — **MoreMenu** with **ButtonIcon**; **AlertDialog** confirms hiding a post (Insights only)
- Public outreach — **TextLink** contact rows; outlined **Card** past-brand proof
- Outcome feedback — **Toaster** + **toast**; Undo restores the hidden post
- Storybook development only — **ExampleGridControls** + **GridOverlay**

## Best practices

- **Do** treat **Show code** as the implementation contract; re-copy it when the canvas changes.
- **Do** preserve the visual difference between typical performance and a spike.
- **Do** keep all edit controls in owner-only Insights.
- **Do** confirm post visibility changes with **AlertDialog** before mutating the ranked set.
- **Do** pair the completed hide mutation with an actionable Undo toast.
- **Do** use **Tab** for proof ranking because the page already uses one primary **SegmentedControl**.
- **Do** freeze approved grid values into implementation code.
- **Do** copy **Pattern — shareable PitchKit** for the public route and **Pattern — creator Insights** for the owner app.
- **Don't** copy **ExampleGridControls** into PitchKit production UI.
- **Don't** expose owner edit state or management controls on the public kit.
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

${shareablePitchKitCopySource}

export function PitchKitInsightsPage({ reachData, audience, posts, contact, brands }) {
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
            <ShareablePitchKit posts={posts} contact={contact} brands={brands} />
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
                          minHeight={344}
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
          "Required metrics remain explicitly empty. Optional chart, audience, and post regions are absent because Graph did not return them.",
      },
    },
  },
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
