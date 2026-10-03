import { ownerAccountChromeCopySource } from "./ownerChromeCopySource";
import { ownerPitchKitBodyCopySource } from "./ownerPitchKitCopySource";
import {
  pitchKitAudienceCardClasses,
  pitchKitAudienceEmptyCopyClasses,
  pitchKitAudienceEmptyWellClasses,
  pitchKitAudienceSectionClasses,
  pitchKitAudienceSkeletonBarsClasses,
  pitchKitAudienceSkeletonSectionClasses,
  pitchKitAudienceWellClasses,
  pitchKitBrandClasses,
  pitchKitCardWellClasses,
  pitchKitContentBandClasses,
  pitchKitContentClasses,
  pitchKitDashboardGridClasses,
  pitchKitEmptyBodyClasses,
  pitchKitEmptyTitleClasses,
  pitchKitFormulaClasses,
  pitchKitHeaderCopyClasses,
  pitchKitHeaderSectionClasses,
  pitchKitHeaderSkeletonCopyClasses,
  pitchKitHeaderSkeletonStackClasses,
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

const insightsPageImports = `
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
} from "@whatmatters/wmds";
import { EyeOff } from "lucide-react";

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
`;

const insightsPageChrome = `
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
            <OwnerAccountMenu identity={identity} />
          </span>
        </header>
      </div>
`;

const insightsHeader = `
              <section className="${pitchKitHeaderSectionClasses}">
                <PageHeader variant="page" title="Insights" />
                <div className="${pitchKitHeaderCopyClasses}">
                  <p className="${pitchKitSupportingClasses}">
                    Verified Instagram performance, refreshed Sep 7 at 12:42 PM.
                  </p>
                  <p className="${pitchKitFormulaClasses}">
                    Engagement rate = (likes + comments) ÷ followers.
                  </p>
                </div>
              </section>
`;

const insightsStats = `
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
`;

const insightsRecentProof = `
              <section className="${pitchKitPostsSectionClasses}">
                <div className="${pitchKitPostsHeaderClasses}">
                  <div>
                    <h2 className={cardTitleClasses}>Recent proof</h2>
                    <p className="${pitchKitSupportingClasses}">
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
`;

function insightsPageState({
  exportName,
  extraHelpers = "",
  insightsBody,
}: {
  exportName: string;
  extraHelpers?: string;
  insightsBody: string;
}) {
  return `
${insightsPageImports}
${extraHelpers}
${ownerAccountChromeCopySource}
${ownerPitchKitBodyCopySource}

export function ${exportName}({ reachData, audience, posts, contact, brands, identity, kitPosts, intro, countries }) {
  const [view, setView] = useState("insights");
  const [proofMetric, setProofMetric] = useState("reach");
  const rankedPosts = [...posts].sort(
    (a, b) =>
      proofMetricValue(b, proofMetric) - proofMetricValue(a, proofMetric),
  );

  function handleProofMetricChange(value) {
    setProofMetric(value);
  }

  return (
    <main className="${pitchKitPageClasses}">
${insightsPageChrome}
      <div className="${pitchKitContentBandClasses}">
        <div className="${pitchKitContentClasses}">
          {view === "pitchkit" ? (
            <OwnerPitchKit identity={identity} intro={intro} posts={kitPosts} contact={contact} brands={brands} countries={countries} reachData={reachData} />
          ) : (
            <>
${insightsBody}
            </>
          )}
        </div>
      </div>
      <PitchKitPageFooter />
      <Toaster position="bottom-right" />
    </main>
  );
}
`;
}

const audienceSectionHelper = `
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
`;

export const creatorInsightsPageCopySource = insightsPageState({
  exportName: "PitchKitInsightsPage",
  extraHelpers: audienceSectionHelper,
  insightsBody: `
${insightsHeader}
              <div className="${pitchKitMetricsStackClasses}">
${insightsStats}
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
${insightsRecentProof}
`,
});

export const insufficientReachPageCopySource = insightsPageState({
  exportName: "PitchKitInsightsInsufficientReachPage",
  extraHelpers: audienceSectionHelper,
  insightsBody: `
${insightsHeader}
              <div className="${pitchKitMetricsStackClasses}">
${insightsStats}
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
${insightsRecentProof}
`,
});

export const insufficientAudiencePageCopySource = insightsPageState({
  exportName: "PitchKitInsightsInsufficientAudiencePage",
  insightsBody: `
${insightsHeader}
              <div className="${pitchKitMetricsStackClasses}">
${insightsStats}
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
${insightsRecentProof}
`,
});

export const insufficientReachAndAudiencePageCopySource = insightsPageState({
  exportName: "PitchKitInsightsInsufficientReachAndAudiencePage",
  insightsBody: `
${insightsHeader}
              <div className="${pitchKitMetricsStackClasses}">
${insightsStats}
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
${insightsRecentProof}
`,
});

export const creatorInsightsLoadingPageCopySource = `
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
  Dialog,
  Dropdown,
  MoreMenu,
  PageHeader,
  SegmentedControl,
  Skeleton,
  Stat,
  TextLink,
  Toaster,
  cardSubtitleClasses,
  cardTitleClasses,
  chartSeriesConfigFromKeys,
  toast,
} from "@whatmatters/wmds";
import { EyeOff } from "lucide-react";

const reachConfig = chartSeriesConfigFromKeys([
  { key: "typical", label: "Typical reach" },
  { key: "reach", label: "Daily reach" },
]);

const compactNumber = new Intl.NumberFormat("en", {
  notation: "compact",
  maximumFractionDigits: 1,
});

const proofSkeletonCount = 6;
const audienceSkeletonSections = [
  { titleWidth: 72, bars: [100, 82, 64] },
  { titleWidth: 56, bars: [92, 74, 58] },
  { titleWidth: 40, bars: [88, 70, 52] },
  { titleWidth: 60, bars: [96, 68, 44] },
];

${ownerAccountChromeCopySource}
${ownerPitchKitBodyCopySource}

export function PitchKitInsightsLoadingPage({ posts, contact, brands, identity, kitPosts, intro, countries, reachData }) {
  const [view, setView] = useState("insights");

  return (
    <main className="${pitchKitPageClasses}">
${insightsPageChrome}
      <div className="${pitchKitContentBandClasses}">
        <div className="${pitchKitContentClasses}">
          {view === "pitchkit" ? (
            <OwnerPitchKit identity={identity} intro={intro} posts={kitPosts} contact={contact} brands={brands} countries={countries} reachData={reachData} />
          ) : (
            <>
              <section className="${pitchKitHeaderSectionClasses}">
                <PageHeader variant="page" title="Insights" />
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
      <PitchKitPageFooter />
      <Toaster position="bottom-right" />
    </main>
  );
}
`;
