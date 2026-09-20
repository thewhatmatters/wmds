import { creatorIdentityStripCopySource } from "./creatorIdentityCopySource";
import { ownerAccountChromeCopySource } from "./ownerChromeCopySource";
import {
  pitchKitBrandCardClasses,
  pitchKitBrandClasses,
  pitchKitBrandListClasses,
  pitchKitBrandNameClasses,
  pitchKitBrandRowStartClasses,
  pitchKitCardWellClasses,
  pitchKitContactCardClasses,
  pitchKitContactRowClasses,
  pitchKitContactRowsClasses,
  pitchKitContentBandClasses,
  pitchKitContentClasses,
  pitchKitDashboardGridClasses,
  pitchKitEmptyBodyClasses,
  pitchKitEmptyTitleClasses,
  pitchKitHeaderCopyClasses,
  pitchKitHeaderSectionClasses,
  pitchKitIdentityNameplateClasses,
  pitchKitIntroClasses,
  pitchKitIntroStackClasses,
  pitchKitKitPostMetricsClasses,
  pitchKitOwnerCountriesCardClasses,
  pitchKitOwnerReachCardClasses,
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
  pitchKitReachEmptyCopyClasses,
  pitchKitReachEmptyWellClasses,
  pitchKitSectionEyebrowClasses,
  pitchKitStatsBandClasses,
  pitchKitSupportingClasses,
  pitchKitTopbarBandClasses,
  pitchKitTopbarClasses,
  pitchKitTopbarEndClasses,
} from "./pitchKitStyles";

/** Authenticated kit body — Graph KPIs + hide/restore on selected posts. */
export const ownerPitchKitBodyCopySource = `
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

function OwnerReachCard({ reachState, reachData }) {
  return (
    <Card
      variant="outlined"
      shape="rounded"
      bodyTerminal
      className="${pitchKitOwnerReachCardClasses}"
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

function OwnerCountries({ countries }) {
  const topCountries = countries.slice(0, 3);
  if (topCountries.length === 0) return null;

  return (
    <Card
      variant="outlined"
      shape="rounded"
      bodyTerminal
      className="${pitchKitOwnerCountriesCardClasses}"
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

function OwnerPitchKit({ identity, intro, posts, contact, brands, countries, reachData, reachState = "resolved" }) {
  const [visiblePosts, setVisiblePosts] = useState(posts);
  const [postNotice, setPostNotice] = useState(null);
  const [pendingHidePostId, setPendingHidePostId] = useState(null);
  const engagementRate = reachState === "resolved" ? "5.8%" : null;
  const typicalReach = reachState === "resolved" ? "9.3K" : "—";

  function handlePostAction(postId, actionId) {
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
      <section className="${pitchKitHeaderSectionClasses}">
        <PageHeader variant="page" title="Your Pitchkit" />
        <div className="${pitchKitHeaderCopyClasses}">
          <p className="${pitchKitSupportingClasses}">Edit what brands see</p>
        </div>
      </section>

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
        <OwnerReachCard reachState={reachState} reachData={reachData} />
        <OwnerCountries countries={countries} />
      </div>

      <section className="${pitchKitPostsSectionClasses}">
        <div className="${pitchKitPostsHeaderClasses}">
          <div>
            <h2 className={cardTitleClasses}>Selected posts</h2>
            <p className="${pitchKitSupportingClasses}">
              {postNotice ?? "Proof from the current Instagram set."}
            </p>
          </div>
        </div>
        <div className="${pitchKitPostsPanelClasses}">
          {visiblePosts.map((post, index) => (
            <Card key={post.id} variant="outlined" shape="rounded" className="${pitchKitPostCardClasses}">
              <Card.Header
                end={
                  <MoreMenu
                    aria-label={\`Manage selected post \${index + 1}\`}
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
`;

export const ownerPitchKitPageCopySource = `
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

${ownerAccountChromeCopySource}
${ownerPitchKitBodyCopySource}

export function OwnerPitchKitPage({ identity, intro, posts, contact, brands, countries, reachData }) {
  const [view, setView] = useState("pitchkit");

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
            <OwnerAccountMenu identity={identity} />
          </span>
        </header>
      </div>

      <div className="${pitchKitContentBandClasses}">
        <div className="${pitchKitContentClasses}">
          {view === "pitchkit" ? (
            <OwnerPitchKit
              identity={identity}
              intro={intro}
              posts={posts}
              contact={contact}
              brands={brands}
              countries={countries}
              reachData={reachData}
            />
          ) : null}
        </div>
      </div>
      <PitchKitPageFooter />
      <Toaster position="bottom-right" />
    </main>
  );
}
`;
