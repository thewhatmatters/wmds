import { creatorIdentityStripCopySource } from "./creatorIdentityCopySource";
import {
  pitchKitBrandCardClasses,
  pitchKitBrandClasses,
  pitchKitBrandListClasses,
  pitchKitBrandNameClasses,
  pitchKitBrandRowStartClasses,
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
  pitchKitIntroClasses,
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

export const shareablePitchKitBodyCopySource = `
${creatorIdentityStripCopySource}

function pitchKitIntroIsEmpty(intro) {
  return intro.trim().length === 0;
}

function PublicIntro({ intro }) {
  if (pitchKitIntroIsEmpty(intro)) return null;
  return <p className="${pitchKitIntroClasses}">{intro}</p>;
}

function PublicPastBrands({ brands }) {
  if (brands.length === 0) return null;

  return (
    <section className="${pitchKitPostsSectionClasses}">
      <div className="${pitchKitPostsHeaderClasses}">
        <h2 className={cardTitleClasses}>Past brands</h2>
      </div>
      <div className="${pitchKitBrandListClasses}">
        {brands.map((brand) => (
          <Card
            key={brand.id}
            variant="outlined"
            shape="rounded"
            className="${pitchKitBrandCardClasses}"
          >
            <Card.Header
              start={
                <div className="${pitchKitBrandRowStartClasses}">
                  <Avatar name={brand.name} size="sm" />
                  <h3 className="${pitchKitBrandNameClasses}">{brand.name}</h3>
                </div>
              }
            />
          </Card>
        ))}
      </div>
    </section>
  );
}

function PublicCreatePitchkitBand() {
  return (
    <Card
      variant="outlined"
      shape="rounded"
      bodyTerminal
      className="${pitchKitCalloutCardClasses}"
    >
      <Card.Header
        start={<h2 className={cardTitleClasses}>Create your Pitchkit</h2>}
      />
      <Card.Body>
        <div className="${pitchKitCalloutBodyClasses}">
          <p className="${pitchKitSupportingClasses}">
            Turn your Instagram into a shareable media kit.
          </p>
          <div className="${pitchKitCalloutActionsClasses}">
            <Button role="primary">Continue with Instagram</Button>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}

function PublicReachCard({ reachState, reachData }) {
  return (
    <Card
      variant="outlined"
      shape="rounded"
      bodyTerminal
      className="${pitchKitReachCardClasses}"
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
            className="${pitchKitReachEmptyWellClasses}"
            style={{ minHeight: ${pitchKitPublicReachChartMinHeight} }}
          >
            <div className="${pitchKitReachEmptyCopyClasses}">
              <Badge variant="neutral" emphasis="muted">No data</Badge>
              <h3 className="${pitchKitEmptyTitleClasses}">No reach data yet</h3>
              <p className="${pitchKitEmptyBodyClasses}">
                Connect more Instagram activity to plot the last 30 days.
              </p>
            </div>
          </div>
        ) : (
          <div className="${pitchKitCardWellClasses}">
            <Chart.Cartesian
              data={reachData}
              config={reachConfig}
              periodKind="month"
              minHeight={${pitchKitPublicReachChartMinHeight}}
              aria-label="Daily and typical Instagram reach over the last 30 days"
            />
            <Chart.Legend config={reachConfig} />
          </div>
        )}
      </Card.Body>
    </Card>
  );
}

function PublicCountries({ countries }) {
  const topCountries = countries.slice(0, 3);
  if (topCountries.length === 0) return null;

  return (
    <Card
      variant="outlined"
      shape="rounded"
      bodyTerminal
      className="${pitchKitCountriesCardClasses}"
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
        <div className="${pitchKitCardWellClasses}">
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
}) {
  const engagementRate = reachState === "resolved" ? "5.8%" : null;
  const typicalReach = reachState === "resolved" ? "9.3K" : "—";

  return (
    <>
      <section className="${pitchKitIdentityNameplateClasses}">
        <div className="${pitchKitIntroStackClasses}">
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
        className="${pitchKitStatsBandClasses}"
      >
        <Stat className="${pitchKitPublicStatClasses}" label="Followers" value="84.2K" />
        {engagementRate != null ? (
          <Stat className="${pitchKitPublicStatClasses}" label="Engagement rate" value={engagementRate} />
        ) : null}
        <Stat className="${pitchKitPublicStatClasses}" label="Typical reach" value={typicalReach} />
        <Stat className="${pitchKitPublicStatClasses}" label="Typical saves" value="6.1K" />
      </div>

      <div className="${pitchKitDashboardGridClasses}">
        <PublicReachCard reachState={reachState} reachData={reachData} />
        <PublicCountries countries={countries} />
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

      <PublicPastBrands brands={brands} />

      {showCreateBand ? <PublicCreatePitchkitBand /> : null}
    </>
  );
}
`;

export const shareablePitchKitPageCopySource = `
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
} from "@whatmatters/wmds";

const reachConfig = chartSeriesConfigFromKeys([
  { key: "typical", label: "Typical reach" },
  { key: "reach", label: "Daily reach" },
]);

const compactNumber = new Intl.NumberFormat("en", {
  notation: "compact",
  maximumFractionDigits: 1,
});

${shareablePitchKitBodyCopySource}

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
}) {
  return (
    <main className="${pitchKitPageClasses}">
      <div className="${pitchKitTopbarBandClasses}">
        <header className="${pitchKitTopbarClasses}">
          <span className="${pitchKitBrandClasses}">PitchKit</span>
        </header>
      </div>

      <div className="${pitchKitContentBandClasses}">
        <div className="${pitchKitContentClasses}">
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
`;
