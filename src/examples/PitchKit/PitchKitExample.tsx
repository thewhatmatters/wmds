import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { EyeOff, RefreshCw, Repeat2, Share2 } from "lucide-react";
import { Avatar } from "../../components/atoms/Avatar/Avatar";
import { Badge } from "../../components/atoms/Badge/Badge";
import { Button } from "../../components/atoms/Button/Button";
import { ButtonIcon } from "../../components/atoms/Button/ButtonIcon";
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
import { AlertDialog } from "../../components/organisms/Dialog/AlertDialog";
import { MoreMenu } from "../../components/organisms/MoreMenu/MoreMenu";
import { Tab } from "../../components/organisms/Tab/Tab";
import { Toaster, toast } from "../../components/organisms/Toast/Toast";
import { chartSeriesConfigFromKeys } from "../../lib/chartTheme";
import { GridOverlay } from "../../lib/GridOverlay";
import { ExampleGridControls } from "../ExampleGridControls/ExampleGridControls";
import {
  pitchKitAudience,
  pitchKitPosts,
  pitchKitReachData,
  type PitchKitPost,
} from "./pitchKitData";
import {
  pitchKitAudienceCardClasses,
  pitchKitAudienceSectionClasses,
  pitchKitAudienceWellClasses,
  pitchKitBrandClasses,
  pitchKitContentBandClasses,
  pitchKitContentClasses,
  pitchKitDashboardGridClasses,
  pitchKitEmptyBodyClasses,
  pitchKitEmptyCardClasses,
  pitchKitEmptyCopyClasses,
  pitchKitEmptyTitleClasses,
  pitchKitFormulaClasses,
  pitchKitHeaderSectionClasses,
  pitchKitHeaderCopyClasses,
  pitchKitMetricsStackClasses,
  pitchKitPageClasses,
  pitchKitPlaceholderBodyClasses,
  pitchKitPlaceholderClasses,
  pitchKitPlaceholderTitleClasses,
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
  pitchKitSectionEyebrowClasses,
  pitchKitStatClasses,
  pitchKitStatsBandClasses,
  pitchKitSupportingClasses,
  pitchKitTopbarBandClasses,
  pitchKitTopbarClasses,
  pitchKitTopbarEndClasses,
  pitchKitCardWellClasses,
} from "./pitchKitStyles";

export type PitchKitDataState = "resolved" | "unavailable";
type PitchKitView = "insights" | "pitchkit";
type PitchKitProofMetric = "reach" | "engagement" | "saves";

export interface PitchKitInsightsExampleProps {
  dataState?: PitchKitDataState;
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

function ReachCard() {
  return (
    <Card variant="outlined" shape="rounded" bodyTerminal className={pitchKitReachCardClasses}>
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
        <div className={pitchKitCardWellClasses}>
          <Chart.Cartesian
            data={pitchKitReachData}
            config={reachSeriesConfig}
            periodKind="month"
            minHeight={344}
            aria-label="Daily and typical Instagram reach over the last 30 days"
          />
          <Chart.Legend config={reachSeriesConfig} />
        </div>
      </Card.Body>
    </Card>
  );
}

function AudienceCard() {
  return (
    <Card variant="outlined" shape="rounded" bodyTerminal className={pitchKitAudienceCardClasses}>
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
          <AudienceSection title="Countries" items={[...pitchKitAudience.countries]} />
          <AudienceSection title="Cities" items={[...pitchKitAudience.cities]} />
          <AudienceSection title="Age" items={[...pitchKitAudience.ages]} />
          <AudienceSection title="Gender" items={[...pitchKitAudience.gender]} />
        </div>
      </Card.Body>
    </Card>
  );
}

function PostCard({
  post,
  displayRank,
  onAction,
}: {
  post: PitchKitPost;
  displayRank: number;
  onAction: (postId: string, actionId: string) => void;
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
        end={
          <MoreMenu
            aria-label={`Manage ranked post ${displayRank}`}
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
            onAction={(actionId) => onAction(post.id, actionId)}
          />
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

function ResolvedInsights() {
  const [visiblePosts, setVisiblePosts] = useState(pitchKitPosts);
  const [proofMetric, setProofMetric] =
    useState<PitchKitProofMetric>("reach");
  const [postNotice, setPostNotice] = useState<string | null>(null);
  const [pendingHidePostId, setPendingHidePostId] = useState<string | null>(
    null,
  );
  const rankedPosts = useMemo(
    () =>
      [...visiblePosts].sort(
        (a, b) =>
          proofMetricValue(b, proofMetric) -
          proofMetricValue(a, proofMetric),
      ),
    [proofMetric, visiblePosts],
  );

  function handlePostAction(postId: string, actionId: string) {
    if (actionId === "hide") {
      setPendingHidePostId(postId);
      return;
    }
    setPostNotice("Choose a replacement from your recent Instagram posts.");
  }

  function handleConfirmHide() {
    if (pendingHidePostId == null) return;
    const hiddenPost = visiblePosts.find(
      (post) => post.id === pendingHidePostId,
    );
    if (hiddenPost == null) {
      setPendingHidePostId(null);
      return;
    }

    setVisiblePosts((posts) =>
      posts.filter((post) => post.id !== pendingHidePostId),
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
          setVisiblePosts((posts) =>
            posts.some((post) => post.id === hiddenPost.id)
              ? posts
              : [...posts, hiddenPost],
          );
          setPostNotice("Post restored to the shareable kit preview.");
        },
      },
    });
  }

  function handleProofMetricChange(value: string) {
    setProofMetric(value as PitchKitProofMetric);
    setPostNotice(null);
  }

  return (
    <>
      <section className={pitchKitHeaderSectionClasses}>
        <PageHeader
          variant="page"
          title="Insights"
          end={
            <Button role="secondary" size="sm" icon={<Share2 />}>
              Share kit
            </Button>
          }
        />
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
          <ReachCard />
          <AudienceCard />
        </div>
      </div>

      <section className={pitchKitPostsSectionClasses}>
        <div className={pitchKitPostsHeaderClasses}>
          <div>
            <h2 className={cardTitleClasses}>Recent proof</h2>
            <p className={pitchKitSupportingClasses}>
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
              onAction={handlePostAction}
            />
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
        onConfirm={handleConfirmHide}
      />
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

function PitchKitPlaceholder() {
  return (
    <section className={pitchKitPlaceholderClasses}>
      <Badge variant="neutral" emphasis="muted">
        Coming soon
      </Badge>
      <h1 className={pitchKitPlaceholderTitleClasses}>Shareable PitchKit</h1>
      <p className={pitchKitPlaceholderBodyClasses}>
        The public creator profile will bring verified insights, selected posts,
        contact details, and past-brand proof into one brand-ready view.
      </p>
    </section>
  );
}

export function PitchKitInsightsExample({
  dataState = "resolved",
}: PitchKitInsightsExampleProps) {
  const [view, setView] = useState<PitchKitView>("insights");
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
            <Avatar name="Avery Morgan" size="sm" />
          </span>
        </header>
      </div>

      <div className={pitchKitContentBandClasses}>
        <div className={pitchKitContentClasses}>
          {view === "pitchkit" ? (
            <PitchKitPlaceholder />
          ) : dataState === "resolved" ? (
            <ResolvedInsights />
          ) : (
            <UnavailableInsights />
          )}
        </div>
      </div>

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
