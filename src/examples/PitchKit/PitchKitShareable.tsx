import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { Badge } from "../../components/atoms/Badge/Badge";
import { Button } from "../../components/atoms/Button/Button";
import { TextLink } from "../../components/atoms/TextLink/TextLink";
import {
  Card,
  cardSubtitleClasses,
  cardTitleClasses,
} from "../../components/molecules/Card/Card";
import type { DisplayControlThemeMode } from "../../components/molecules/DisplayControls/DisplayControls";
import { Stat } from "../../components/molecules/Stat/Stat";
import { Chart } from "../../components/organisms/Chart/Chart";
import type { ChartRankedBarItem } from "../../components/organisms/Chart/ChartRankedBars";
import { chartSeriesConfigFromKeys } from "../../lib/chartTheme";
import { GridOverlay } from "../../lib/GridOverlay";
import { ExampleGridControls } from "../ExampleGridControls/ExampleGridControls";
import { CreatorIdentityStrip } from "./PitchKitCreatorIdentity";
import { PublicIntro } from "./PitchKitIntro";
import { PublicPastBrands } from "./PitchKitPastBrands";
import {
  pitchKitContact,
  pitchKitCreatorIdentity,
  pitchKitIntroFilled,
  pitchKitPastBrands,
  pitchKitPublicCountries,
  pitchKitReachData,
  pitchKitSelectedPosts,
  pitchKitSummary,
  publicCountries,
  publicEngagementRate,
  publicTypicalReach,
  type PitchKitCreatorIdentity,
  type PitchKitPastBrand,
  type PitchKitPost,
  type PitchKitPublicReachState,
} from "./pitchKitData";
import {
  pitchKitBrandClasses,
  pitchKitCalloutActionsClasses,
  pitchKitCalloutBodyClasses,
  pitchKitCalloutCardClasses,
  pitchKitCardWellClasses,
  pitchKitContactCardClasses,
  pitchKitContactRowClasses,
  pitchKitContactRowsClasses,
  pitchKitContentBandClasses,
  pitchKitContentClasses,
  pitchKitCountriesCardClasses,
  pitchKitDashboardGridClasses,
  pitchKitEmptyBodyClasses,
  pitchKitEmptyTitleClasses,
  pitchKitIdentityNameplateClasses,
  pitchKitIntroStackClasses,
  pitchKitKitPostMetricsClasses,
  pitchKitPageClasses,
  pitchKitPostCardClasses,
  pitchKitPostImageClasses,
  pitchKitPostMetricClasses,
  pitchKitPostMetricLabelClasses,
  pitchKitPostMetricValueClasses,
  pitchKitPostsHeaderClasses,
  pitchKitPostsPanelClasses,
  pitchKitPostsSectionClasses,
  pitchKitPublicReachChartMinHeight,
  pitchKitPublicStatClasses,
  pitchKitReachCardClasses,
  pitchKitReachEmptyCopyClasses,
  pitchKitReachEmptyWellClasses,
  pitchKitSectionEyebrowClasses,
  pitchKitStatsBandClasses,
  pitchKitSupportingClasses,
  pitchKitTopbarBandClasses,
  pitchKitTopbarClasses,
} from "./pitchKitStyles";

const compactNumber = new Intl.NumberFormat("en", {
  notation: "compact",
  maximumFractionDigits: 1,
});

const publicReachConfig = chartSeriesConfigFromKeys([
  { key: "typical", label: "Typical reach" },
  { key: "reach", label: "Daily reach" },
]);

export interface ShareablePitchKitProps {
  identity?: PitchKitCreatorIdentity;
  intro?: string;
  posts?: readonly PitchKitPost[];
  contact?: typeof pitchKitContact;
  brands?: readonly PitchKitPastBrand[];
  countries?: readonly ChartRankedBarItem[];
  reachState?: PitchKitPublicReachState;
  /**
   * Unsigned visitor who is not the kit owner.
   * Omit for the kit owner and for signed-in viewers of someone else's kit.
   */
  showCreateBand?: boolean;
}

export function PublicCreatePitchkitBand() {
  return (
    <Card
      variant="outlined"
      shape="rounded"
      bodyTerminal
      className={pitchKitCalloutCardClasses}
    >
      <Card.Header
        start={<h2 className={cardTitleClasses}>Create your Pitchkit</h2>}
      />
      <Card.Body>
        <div className={pitchKitCalloutBodyClasses}>
          <p className={pitchKitSupportingClasses}>
            Turn your Instagram into a shareable media kit.
          </p>
          <div className={pitchKitCalloutActionsClasses}>
            <Button role="primary">Continue with Instagram</Button>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}

function PublicReachCard({
  reachState,
}: {
  reachState: PitchKitPublicReachState;
}) {
  return (
    <Card
      variant="outlined"
      shape="rounded"
      bodyTerminal
      className={pitchKitReachCardClasses}
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
            className={pitchKitReachEmptyWellClasses}
            style={{ minHeight: pitchKitPublicReachChartMinHeight }}
          >
            <div className={pitchKitReachEmptyCopyClasses}>
              <Badge variant="neutral" emphasis="muted">
                No data
              </Badge>
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
              config={publicReachConfig}
              periodKind="month"
              minHeight={pitchKitPublicReachChartMinHeight}
              aria-label="Daily and typical Instagram reach over the last 30 days"
            />
            <Chart.Legend config={publicReachConfig} />
          </div>
        )}
      </Card.Body>
    </Card>
  );
}

function PublicCountries({
  countries,
}: {
  countries: readonly ChartRankedBarItem[];
}) {
  const topCountries = publicCountries(countries);
  if (topCountries.length === 0) return null;

  return (
    <Card
      variant="outlined"
      shape="rounded"
      bodyTerminal
      className={pitchKitCountriesCardClasses}
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
        <div className={pitchKitCardWellClasses}>
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

export function ShareablePitchKit({
  identity = pitchKitCreatorIdentity,
  intro = pitchKitIntroFilled,
  posts = pitchKitSelectedPosts,
  contact = pitchKitContact,
  brands = pitchKitPastBrands,
  countries = pitchKitPublicCountries,
  reachState = "resolved",
  showCreateBand = true,
}: ShareablePitchKitProps) {
  const engagementRate = publicEngagementRate(reachState);
  const typicalReach = publicTypicalReach(reachState);

  return (
    <>
      <section className={pitchKitIdentityNameplateClasses}>
        <div className={pitchKitIntroStackClasses}>
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
        className={pitchKitStatsBandClasses}
      >
        <Stat
          className={pitchKitPublicStatClasses}
          label="Followers"
          value={pitchKitSummary.followers}
        />
        {engagementRate != null ? (
          <Stat
            className={pitchKitPublicStatClasses}
            label="Engagement rate"
            value={engagementRate}
          />
        ) : null}
        <Stat
          className={pitchKitPublicStatClasses}
          label="Typical reach"
          value={typicalReach}
        />
        <Stat
          className={pitchKitPublicStatClasses}
          label="Typical saves"
          value={pitchKitSummary.typicalSaves}
        />
      </div>

      <div className={pitchKitDashboardGridClasses}>
        <PublicReachCard reachState={reachState} />
        <PublicCountries countries={countries} />
      </div>

      <section className={pitchKitPostsSectionClasses}>
        <div className={pitchKitPostsHeaderClasses}>
          <div>
            <h2 className={cardTitleClasses}>Selected posts</h2>
            <p className={pitchKitSupportingClasses}>
              Proof from the current Instagram set.
            </p>
          </div>
        </div>
        <div className={pitchKitPostsPanelClasses}>
          {posts.map((post) => (
            <Card
              key={post.id}
              variant="outlined"
              shape="rounded"
              className={pitchKitPostCardClasses}
            >
              <Card.Body>
                <img
                  className={pitchKitPostImageClasses}
                  src={post.imageUrl}
                  alt={post.imageAlt}
                />
              </Card.Body>
              <Card.Footer>
                <div className={pitchKitKitPostMetricsClasses}>
                  {[
                    ["Likes", post.likes],
                    ["Comments", post.comments],
                  ].map(([label, value]) => (
                    <span key={label} className={pitchKitPostMetricClasses}>
                      <span className={pitchKitPostMetricLabelClasses}>
                        {label}
                      </span>
                      <span className={pitchKitPostMetricValueClasses}>
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

      <section className={pitchKitPostsSectionClasses}>
        <div className={pitchKitPostsHeaderClasses}>
          <div>
            <h2 className={cardTitleClasses}>Contact</h2>
            <p className={pitchKitSupportingClasses}>
              Creator-entered details for brand outreach.
            </p>
          </div>
        </div>
        <Card
          variant="outlined"
          padding="md"
          shape="rounded"
          className={pitchKitContactCardClasses}
        >
          <div className={pitchKitContactRowsClasses}>
            <div className={pitchKitContactRowClasses}>
              <span className={pitchKitSectionEyebrowClasses}>Email</span>
              <TextLink href={`mailto:${contact.email}`}>{contact.email}</TextLink>
            </div>
            <div className={pitchKitContactRowClasses}>
              <span className={pitchKitSectionEyebrowClasses}>Website</span>
              <TextLink href={contact.websiteHref} external>
                {contact.websiteLabel}
              </TextLink>
            </div>
            <div className={pitchKitContactRowClasses}>
              <span className={pitchKitSectionEyebrowClasses}>Location</span>
              <span className={pitchKitSupportingClasses}>{contact.location}</span>
            </div>
          </div>
        </Card>
      </section>

      <PublicPastBrands brands={brands} />

      {showCreateBand ? <PublicCreatePitchkitBand /> : null}
    </>
  );
}

export function PitchKitShareableExample({
  reachState = "resolved",
  showCreateBand = true,
}: {
  reachState?: PitchKitPublicReachState;
  showCreateBand?: boolean;
}) {
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
        </header>
      </div>

      <div className={pitchKitContentBandClasses}>
        <div className={pitchKitContentClasses}>
          <ShareablePitchKit
            reachState={reachState}
            showCreateBand={showCreateBand}
          />
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
    </main>
  );
}
