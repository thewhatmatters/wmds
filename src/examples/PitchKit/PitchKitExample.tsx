import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { RefreshCw } from "lucide-react";
import { Badge } from "../../components/atoms/Badge/Badge";
import { Button } from "../../components/atoms/Button/Button";
import { Skeleton } from "../../components/atoms/Skeleton/Skeleton";
import {
  Card,
  cardSubtitleClasses,
  cardTitleClasses,
} from "../../components/molecules/Card/Card";
import type { DisplayControlThemeMode } from "../../components/molecules/DisplayControls/DisplayControls";
import { PageHeader } from "../../components/molecules/PageHeader/PageHeader";
import { SegmentedControl } from "../../components/molecules/SegmentedControl/SegmentedControl";
import { Stat } from "../../components/molecules/Stat/Stat";
import { Chart } from "../../components/organisms/Chart/Chart";
import type { ChartRankedBarItem } from "../../components/organisms/Chart/ChartRankedBars";
import { Tab } from "../../components/organisms/Tab/Tab";
import { Toaster } from "../../components/organisms/Toast/Toast";
import { chartSeriesConfigFromKeys } from "../../lib/chartTheme";
import { GridOverlay } from "../../lib/GridOverlay";
import { ExampleGridControls } from "../ExampleGridControls/ExampleGridControls";
import {
  pitchKitAudience,
  pitchKitPosts,
  pitchKitReachData,
  type PitchKitPost,
} from "./pitchKitData";
import { OwnerAccountMenu, PitchKitPageFooter } from "./PitchKitOwnerChrome";
import { OwnerPitchKit } from "./PitchKitOwner";
import {
  pitchKitAudienceCardClasses,
  pitchKitAudienceEmptyCopyClasses,
  pitchKitAudienceEmptyWellClasses,
  pitchKitAudienceSectionClasses,
  pitchKitAudienceWellClasses,
  pitchKitBrandClasses,
  pitchKitContentBandClasses,
  pitchKitContentClasses,
  pitchKitAudienceSkeletonBarsClasses,
  pitchKitAudienceSkeletonSectionClasses,
  pitchKitDashboardGridClasses,
  pitchKitEmptyBodyClasses,
  pitchKitEmptyCardClasses,
  pitchKitEmptyCopyClasses,
  pitchKitEmptyTitleClasses,
  pitchKitFormulaClasses,
  pitchKitHeaderSectionClasses,
  pitchKitHeaderCopyClasses,
  pitchKitHeaderSkeletonCopyClasses,
  pitchKitHeaderSkeletonStackClasses,
  pitchKitMetricsStackClasses,
  pitchKitPageClasses,
  pitchKitPostCardClasses,
  pitchKitPostImageClasses,
  pitchKitPostHeaderStartClasses,
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
  pitchKitCardWellClasses,
} from "./pitchKitStyles";

export type PitchKitDataState =
  | "resolved"
  | "unavailable"
  | "insufficientReach"
  | "insufficientAudience"
  | "insufficientReachAndAudience"
  | "loading";
export type PitchKitLoadingPhase = "skeleton" | "retrieving";
type PitchKitView = "insights" | "pitchkit";
type PitchKitProofMetric = "reach" | "engagement" | "saves";

export interface PitchKitInsightsExampleProps {
  dataState?: PitchKitDataState;
  loadingPhase?: PitchKitLoadingPhase;
  initialView?: PitchKitView;
}

const reachSeriesConfig = chartSeriesConfigFromKeys([
  { key: "typical", label: "Typical reach" },
  { key: "reach", label: "Daily reach" },
]);

const compactNumber = new Intl.NumberFormat("en", {
  notation: "compact",
  maximumFractionDigits: 1,
});

const proofMetricNotices: Record<PitchKitProofMetric, string> = {
  reach: "Ranked by Instagram reach.",
  engagement: "Ranked by likes + comments.",
  saves: "Ranked by Instagram saves.",
};

function proofMetricValue(
  post: PitchKitPost,
  metric: PitchKitProofMetric,
): number {
  if (metric === "engagement") return post.likes + post.comments;
  return post[metric];
}

function AudienceSection({
  title,
  items,
}: {
  title: string;
  items: ChartRankedBarItem[];
}) {
  return (
    <section className={pitchKitAudienceSectionClasses}>
      <h3 className={pitchKitSectionEyebrowClasses}>{title}</h3>
      <Chart.RankedBars
        aria-label={`Audience by ${title.toLowerCase()}`}
        items={items}
        animate="initial"
      />
    </section>
  );
}

function ReachCardHeader() {
  return (
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
  );
}

function ReachCard({
  body = "chart",
}: {
  body?: "chart" | "empty";
}) {
  return (
    <Card variant="outlined" shape="rounded" bodyTerminal className={pitchKitReachCardClasses}>
      <ReachCardHeader />
      <Card.Body>
        {body === "empty" ? (
          <div
            className={pitchKitReachEmptyWellClasses}
            style={{ minHeight: pitchKitReachChartMinHeight }}
          >
            <div className={pitchKitReachEmptyCopyClasses}>
              <Badge variant="neutral" emphasis="muted">No data</Badge>
              <h3 className={pitchKitEmptyTitleClasses}>No reach data yet</h3>
              <p className={pitchKitEmptyBodyClasses}>
                Connect more Instagram activity to plot the last 30 days.
              </p>
            </div>
          </div>
        ) : (
          <div className={pitchKitCardWellClasses}>
            <Chart.Cartesian
              data={pitchKitReachData}
              config={reachSeriesConfig}
              periodKind="month"
              minHeight={pitchKitReachChartMinHeight}
              aria-label="Daily and typical Instagram reach over the last 30 days"
            />
            <Chart.Legend config={reachSeriesConfig} />
          </div>
        )}
      </Card.Body>
    </Card>
  );
}

function AudienceCardHeader() {
  return (
    <Card.Header
      start={
        <>
          <h2 className={cardTitleClasses}>Audience fit</h2>
          <p className={cardSubtitleClasses}>Ranked Instagram percentages.</p>
        </>
      }
    />
  );
}

function AudienceCard({
  body = "bars",
}: {
  body?: "bars" | "empty";
}) {
  return (
    <Card variant="outlined" shape="rounded" bodyTerminal className={pitchKitAudienceCardClasses}>
      <AudienceCardHeader />
      <Card.Body>
        {body === "empty" ? (
          <div
            className={pitchKitAudienceEmptyWellClasses}
            style={{ minHeight: pitchKitReachChartMinHeight }}
          >
            <div className={pitchKitAudienceEmptyCopyClasses}>
              <Badge variant="neutral" emphasis="muted">No data</Badge>
              <h3 className={pitchKitEmptyTitleClasses}>No audience data yet</h3>
              <p className={pitchKitEmptyBodyClasses}>
                Connect Instagram Insights demographics when available.
              </p>
            </div>
          </div>
        ) : (
          <div className={pitchKitAudienceWellClasses}>
            <AudienceSection title="Countries" items={[...pitchKitAudience.countries]} />
            <AudienceSection title="Cities" items={[...pitchKitAudience.cities]} />
            <AudienceSection title="Age" items={[...pitchKitAudience.ages]} />
            <AudienceSection title="Gender" items={[...pitchKitAudience.gender]} />
          </div>
        )}
      </Card.Body>
    </Card>
  );
}

function PostCard({
  post,
  displayRank,
}: {
  post: PitchKitPost;
  displayRank: number;
}) {
  return (
    <Card variant="outlined" shape="rounded" className={pitchKitPostCardClasses}>
      <Card.Header
        start={
          <span className={pitchKitPostHeaderStartClasses}>
            <Badge size="sm">#{displayRank}</Badge>
            <span className={cardSubtitleClasses}>{post.publishedAt}</span>
          </span>
        }
      />
      <Card.Body>
        <img
          className={pitchKitPostImageClasses}
          src={post.imageUrl}
          alt={post.imageAlt}
        />
      </Card.Body>
      <Card.Footer>
        <div className={pitchKitPostMetricsClasses}>
          {[
            ["Saves", post.saves],
            ["Reach", post.reach],
            ["Likes", post.likes],
          ].map(([label, value]) => (
            <span key={label} className={pitchKitPostMetricClasses}>
              <span className={pitchKitPostMetricLabelClasses}>{label}</span>
              <span className={pitchKitPostMetricValueClasses}>
                {compactNumber.format(value as number)}
              </span>
            </span>
          ))}
        </div>
      </Card.Footer>
    </Card>
  );
}

function ResolvedInsights({
  reachBody = "chart",
  audienceBody = "bars",
}: {
  reachBody?: "chart" | "empty";
  audienceBody?: "bars" | "empty";
}) {
  const [proofMetric, setProofMetric] =
    useState<PitchKitProofMetric>("reach");
  const rankedPosts = useMemo(
    () =>
      [...pitchKitPosts].sort(
        (a, b) =>
          proofMetricValue(b, proofMetric) -
          proofMetricValue(a, proofMetric),
      ),
    [proofMetric],
  );

  function handleProofMetricChange(value: string) {
    setProofMetric(value as PitchKitProofMetric);
  }

  return (
    <>
      <section className={pitchKitHeaderSectionClasses}>
        <PageHeader variant="page" title="Insights" />
        <div className={pitchKitHeaderCopyClasses}>
          <p className={pitchKitSupportingClasses}>
            Verified Instagram performance, refreshed Sep 7 at 12:42 PM.
          </p>
          <p className={pitchKitFormulaClasses}>
            Engagement rate = (likes + comments) ÷ followers.
          </p>
        </div>
      </section>

      <div className={pitchKitMetricsStackClasses}>
        <div
          role="group"
          aria-label="Instagram performance summary"
          className={pitchKitStatsBandClasses}
        >
          <Stat className={pitchKitStatClasses} label="Followers" value="84.2K" trend={{ value: "+2.4%", direction: "up" }} />
          <Stat className={pitchKitStatClasses} label="Engagement rate" value="5.8%" />
          <Stat className={pitchKitStatClasses} label="Typical reach" value="9.3K" />
          <Stat className={pitchKitStatClasses} label="Saves" value="6.1K" trend={{ value: "+8.1%", direction: "up" }} />
        </div>

        <div className={pitchKitDashboardGridClasses}>
          <ReachCard body={reachBody} />
          <AudienceCard body={audienceBody} />
        </div>
      </div>

      <section className={pitchKitPostsSectionClasses}>
        <div className={pitchKitPostsHeaderClasses}>
          <div>
            <h2 className={cardTitleClasses}>Recent proof</h2>
            <p className={pitchKitSupportingClasses}>
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
          className={pitchKitPostsTabsClasses}
        >
          <Tab value="reach" panelId="recent-proof-panel">Reach</Tab>
          <Tab value="engagement" panelId="recent-proof-panel">Engagement</Tab>
          <Tab value="saves" panelId="recent-proof-panel">Saves</Tab>
        </Tab.Group>
        <div
          id="recent-proof-panel"
          role="tabpanel"
          className={pitchKitPostsPanelClasses}
        >
          {rankedPosts.map((post, index) => (
            <PostCard
              key={post.id}
              post={post}
              displayRank={index + 1}
            />
          ))}
        </div>
      </section>
    </>
  );
}

const proofSkeletonCount = 6;
const audienceSkeletonSections = [
  { titleWidth: 72, bars: [100, 82, 64] },
  { titleWidth: 56, bars: [92, 74, 58] },
  { titleWidth: 40, bars: [88, 70, 52] },
  { titleWidth: 60, bars: [96, 68, 44] },
] as const;

function LoadingReachCard({ phase }: { phase: PitchKitLoadingPhase }) {
  if (phase === "retrieving") {
    return (
      <Card
        variant="outlined"
        shape="rounded"
        bodyTerminal
        className={pitchKitReachCardClasses}
        aria-busy="true"
        aria-label="Retrieving reach over 30 days"
      >
        <ReachCardHeader />
        <Card.Body>
          <div className={pitchKitCardWellClasses}>
            <Chart.Loading minHeight={pitchKitReachChartMinHeight} />
          </div>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card
      variant="outlined"
      shape="rounded"
      bodyTerminal
      className={pitchKitReachCardClasses}
      aria-busy="true"
      aria-label="Loading reach over 30 days"
    >
      <Card.Header
        start={
          <div className={pitchKitHeaderSkeletonStackClasses}>
            <Skeleton width={168} height={18} radius="inner" index={0} />
            <Skeleton width={240} height={14} radius="inner" index={1} />
          </div>
        }
        end={<Skeleton width={88} height={28} radius="full" index={2} />}
      />
      <Card.Body>
        <div className={pitchKitCardWellClasses}>
          <Skeleton
            width="100%"
            height={pitchKitReachChartMinHeight}
            radius="element"
            index={3}
          />
          <div className={pitchKitSkeletonLegendRowClasses}>
            <Skeleton width={112} height={12} radius="inner" index={4} />
            <Skeleton width={96} height={12} radius="inner" index={5} />
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}

function LoadingAudienceCard({ phase }: { phase: PitchKitLoadingPhase }) {
  if (phase === "retrieving") {
    return (
      <Card
        variant="outlined"
        shape="rounded"
        bodyTerminal
        className={pitchKitAudienceCardClasses}
        aria-busy="true"
        aria-label="Retrieving audience fit"
      >
        <Card.Header
          start={
            <>
              <h2 className={cardTitleClasses}>Audience fit</h2>
              <p className={cardSubtitleClasses}>Ranked Instagram percentages.</p>
            </>
          }
        />
        <Card.Body>
          <div className={pitchKitAudienceWellClasses}>
            <Chart.Loading minHeight={pitchKitReachChartMinHeight} />
          </div>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card
      variant="outlined"
      shape="rounded"
      bodyTerminal
      className={pitchKitAudienceCardClasses}
      aria-busy="true"
      aria-label="Loading audience fit"
    >
      <Card.Header
        start={
          <div className={pitchKitHeaderSkeletonStackClasses}>
            <Skeleton width={120} height={18} radius="inner" index={6} />
            <Skeleton width={188} height={14} radius="inner" index={7} />
          </div>
        }
      />
      <Card.Body>
        <div className={pitchKitAudienceWellClasses}>
          {audienceSkeletonSections.map((section, sectionIndex) => (
            <section
              key={section.titleWidth}
              className={pitchKitAudienceSkeletonSectionClasses}
            >
              <Skeleton
                width={section.titleWidth}
                height={12}
                radius="inner"
                index={8 + sectionIndex}
              />
              <div className={pitchKitAudienceSkeletonBarsClasses}>
                {section.bars.map((width, barIndex) => (
                  <Skeleton
                    key={`${section.titleWidth}-${width}`}
                    width={`${width}%`}
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
  );
}

function ProofSkeletonCard({ index }: { index: number }) {
  const base = 24 + index * 8;

  return (
    <Card
      variant="outlined"
      shape="rounded"
      className={pitchKitPostCardClasses}
      aria-hidden
    >
      <Card.Header
        start={
          <span className={pitchKitPostHeaderStartClasses}>
            <Skeleton width={28} height={20} radius="full" index={base} />
            <Skeleton width={48} height={14} radius="inner" index={base + 1} />
          </span>
        }
      />
      <Card.Body>
        <div className={pitchKitPostImageClasses}>
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
        <div className={pitchKitPostMetricsClasses}>
          {[0, 1, 2].map((metric) => (
            <span key={metric} className={pitchKitPostMetricClasses}>
              <Skeleton width={40} height={10} radius="inner" index={base + 3 + metric} />
              <Skeleton width={56} height={16} radius="inner" index={base + 6 + metric} />
            </span>
          ))}
        </div>
      </Card.Footer>
    </Card>
  );
}

function LoadingInsights({ phase }: { phase: PitchKitLoadingPhase }) {
  return (
    <>
      <section className={pitchKitHeaderSectionClasses}>
        <PageHeader variant="page" title="Insights" />
        {phase === "retrieving" ? (
          <div className={pitchKitHeaderCopyClasses}>
            <p className={pitchKitSupportingClasses}>
              Connecting to Instagram Graph for the latest verified performance.
            </p>
            <p className={pitchKitFormulaClasses}>
              Engagement rate = (likes + comments) ÷ followers.
            </p>
          </div>
        ) : (
          <div className={pitchKitHeaderSkeletonCopyClasses}>
            <Skeleton width={280} height={16} radius="inner" index={20} />
            <Skeleton width={220} height={12} radius="inner" index={21} />
          </div>
        )}
      </section>

      <div className={pitchKitMetricsStackClasses}>
        <div
          role="group"
          aria-label="Loading Instagram performance summary"
          className={pitchKitStatsBandClasses}
        >
          <Stat className={pitchKitStatClasses} label="Followers" value="" loading />
          <Stat className={pitchKitStatClasses} label="Engagement rate" value="" loading />
          <Stat className={pitchKitStatClasses} label="Typical reach" value="" loading />
          <Stat className={pitchKitStatClasses} label="Saves" value="" loading />
        </div>

        <div className={pitchKitDashboardGridClasses}>
          <LoadingReachCard phase={phase} />
          <LoadingAudienceCard phase={phase} />
        </div>
      </div>

      <section
        className={pitchKitPostsSectionClasses}
        aria-busy="true"
        aria-label="Loading recent proof"
      >
        <div className={pitchKitPostsHeaderClasses}>
          {phase === "retrieving" ? (
            <div>
              <h2 className={cardTitleClasses}>Recent proof</h2>
              <p className={pitchKitSupportingClasses}>
                Ranking recent Instagram posts once Graph returns them.
              </p>
            </div>
          ) : (
            <div className={pitchKitHeaderSkeletonCopyClasses}>
              <Skeleton width={132} height={18} radius="inner" index={22} />
              <Skeleton width={196} height={14} radius="inner" index={23} />
            </div>
          )}
        </div>
        <div className={pitchKitPostsPanelClasses}>
          {Array.from({ length: proofSkeletonCount }, (_, index) => (
            <ProofSkeletonCard key={index} index={index} />
          ))}
        </div>
      </section>
    </>
  );
}

function UnavailableInsights() {
  return (
    <>
      <section className={pitchKitHeaderSectionClasses}>
        <PageHeader variant="page" title="Insights" />
        <div className={pitchKitHeaderCopyClasses}>
          <p className={pitchKitSupportingClasses}>
            Instagram returned account identity, but no current insight metrics.
          </p>
          <p className={pitchKitFormulaClasses}>
            Missing Graph values stay empty; PitchKit never substitutes zero.
          </p>
        </div>
      </section>

      <div
        role="group"
        aria-label="Unavailable Instagram performance summary"
        className={pitchKitStatsBandClasses}
      >
        <Stat className={pitchKitStatClasses} label="Followers" value="—" />
        <Stat className={pitchKitStatClasses} label="Engagement rate" value="—" />
        <Stat className={pitchKitStatClasses} label="Typical reach" value="—" />
        <Stat className={pitchKitStatClasses} label="Saves" value="—" />
      </div>

      <Card variant="outlined" padding="md" shape="rounded" className={pitchKitEmptyCardClasses}>
        <div className={pitchKitEmptyCopyClasses}>
          <h2 className={pitchKitEmptyTitleClasses}>Insights are unavailable</h2>
          <p className={pitchKitEmptyBodyClasses}>
            The reach chart, audience breakdown, and ranked posts are hidden because
            Instagram did not return those fields. Your free shareable kit can still
            show profile details you entered.
          </p>
        </div>
        <Button role="secondary" size="sm" icon={<RefreshCw />}>
          Refresh Instagram
        </Button>
      </Card>
    </>
  );
}

function insightsContent(
  dataState: PitchKitDataState,
  loadingPhase: PitchKitLoadingPhase,
) {
  switch (dataState) {
    case "unavailable":
      return <UnavailableInsights />;
    case "insufficientReach":
      return <ResolvedInsights reachBody="empty" />;
    case "insufficientAudience":
      return <ResolvedInsights audienceBody="empty" />;
    case "insufficientReachAndAudience":
      return <ResolvedInsights reachBody="empty" audienceBody="empty" />;
    case "loading":
      return <LoadingInsights phase={loadingPhase} />;
    default:
      return <ResolvedInsights />;
  }
}

export function PitchKitOwnerExample({
  dataState,
  loadingPhase,
}: Omit<PitchKitInsightsExampleProps, "initialView">) {
  return (
    <PitchKitInsightsExample
      dataState={dataState}
      loadingPhase={loadingPhase}
      initialView="pitchkit"
    />
  );
}

export function PitchKitInsightsExample({
  dataState = "resolved",
  loadingPhase = "skeleton",
  initialView = "insights",
}: PitchKitInsightsExampleProps) {
  const [view, setView] = useState<PitchKitView>(initialView);
  const [gridVisible, setGridVisible] = useState(false);
  const [theme, setTheme] = useState<DisplayControlThemeMode>("auto");
  const [gridMax, setGridMax] = useState(1140);
  const [columnGap, setColumnGap] = useState(8);
  const pageStyle = useMemo(
    () =>
      ({
        "--grid-max": `${gridMax}px`,
        "--grid-column-gap": `${columnGap}px`,
      }) as CSSProperties,
    [columnGap, gridMax],
  );

  useEffect(() => {
    const root = document.documentElement;
    const previousTheme = root.getAttribute("data-theme");
    if (theme === "auto") {
      root.removeAttribute("data-theme");
    } else {
      root.setAttribute("data-theme", theme);
    }
    return () => {
      if (previousTheme == null) root.removeAttribute("data-theme");
      else root.setAttribute("data-theme", previousTheme);
    };
  }, [theme]);

  return (
    <main
      data-theme={theme === "auto" ? undefined : theme}
      className={pitchKitPageClasses}
      style={pageStyle}
    >
      <GridOverlay
        visible={gridVisible}
        onVisibleChange={setGridVisible}
        keyboardShortcut={false}
      />

      <div className={pitchKitTopbarBandClasses}>
        <header className={pitchKitTopbarClasses}>
          <span className={pitchKitBrandClasses}>PitchKit</span>
          <SegmentedControl
            aria-label="PitchKit primary navigation"
            size="sm"
            value={view}
            onValueChange={(value) => setView(value as PitchKitView)}
          >
            <SegmentedControl.Item value="insights">Insights</SegmentedControl.Item>
            <SegmentedControl.Item value="pitchkit">PitchKit</SegmentedControl.Item>
          </SegmentedControl>
          <span className={pitchKitTopbarEndClasses}>
            <OwnerAccountMenu />
          </span>
        </header>
      </div>

      <div className={pitchKitContentBandClasses}>
        <div className={pitchKitContentClasses}>
          {view === "pitchkit" ? (
            <OwnerPitchKit />
          ) : (
            insightsContent(dataState, loadingPhase)
          )}
        </div>
      </div>

      <PitchKitPageFooter />

      <ExampleGridControls
        gridVisible={gridVisible}
        onGridVisibleChange={setGridVisible}
        theme={theme}
        onThemeChange={setTheme}
        maxWidth={gridMax}
        onMaxWidthChange={setGridMax}
        columnGap={columnGap}
        onColumnGapChange={setColumnGap}
        defaultMaxWidth={1140}
        defaultColumnGap={8}
      />
      <Toaster position="bottom-right" />
    </main>
  );
}
