import { Avatar } from "../../components/atoms/Avatar/Avatar";
import { Badge } from "../../components/atoms/Badge/Badge";
import { TextLink } from "../../components/atoms/TextLink/TextLink";
import {
  Card,
  cardSubtitleClasses,
  cardTitleClasses,
} from "../../components/molecules/Card/Card";
import { PageHeader } from "../../components/molecules/PageHeader/PageHeader";
import { Stat } from "../../components/molecules/Stat/Stat";
import {
  pitchKitContact,
  pitchKitCreator,
  pitchKitPastBrands,
  pitchKitPosts,
  pitchKitVerifiedStats,
  type PitchKitDataState,
  type PitchKitPost,
} from "./pitchKitData";
import {
  pitchKitCardWellClasses,
  pitchKitDashboardGridClasses,
  pitchKitFormulaClasses,
  pitchKitHeaderCopyClasses,
  pitchKitHeaderSectionClasses,
  pitchKitPostCardClasses,
  pitchKitPostImageClasses,
  pitchKitPostMetricClasses,
  pitchKitPostMetricLabelClasses,
  pitchKitPostMetricValueClasses,
  pitchKitPostsHeaderClasses,
  pitchKitPostsPanelClasses,
  pitchKitPostsSectionClasses,
  pitchKitShareableAsideCardClasses,
  pitchKitShareableBrandItemClasses,
  pitchKitShareableBrandListClasses,
  pitchKitShareableBrandNameClasses,
  pitchKitShareableContactLineClasses,
  pitchKitShareablePostMetricsClasses,
  pitchKitShareableStackClasses,
  pitchKitShareableStatClasses,
  pitchKitStatsBandClasses,
  pitchKitSupportingClasses,
} from "./pitchKitStyles";

const compactNumber = new Intl.NumberFormat("en", {
  notation: "compact",
  maximumFractionDigits: 1,
});

function ShareablePostCard({ post }: { post: PitchKitPost }) {
  return (
    <Card variant="outlined" shape="rounded" className={pitchKitPostCardClasses}>
      <Card.Header
        start={<span className={cardSubtitleClasses}>{post.publishedAt}</span>}
      />
      <Card.Body>
        <img
          className={pitchKitPostImageClasses}
          src={post.imageUrl}
          alt={post.imageAlt}
        />
      </Card.Body>
      <Card.Footer>
        <div className={pitchKitShareablePostMetricsClasses}>
          {[
            ["Likes", post.likes],
            ["Comments", post.comments],
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

export function PitchKitShareableKit({
  dataState = "resolved",
  posts = pitchKitPosts,
}: {
  dataState?: PitchKitDataState;
  posts?: PitchKitPost[];
}) {
  const statsResolved = dataState === "resolved";
  const followers = statsResolved ? pitchKitVerifiedStats.followers : "—";
  const engagementRate = statsResolved
    ? pitchKitVerifiedStats.engagementRate
    : "—";

  return (
    <>
      <section className={pitchKitHeaderSectionClasses}>
        <PageHeader
          variant="page"
          start={<Avatar name={pitchKitCreator.name} size="lg" />}
          title={pitchKitCreator.name}
          end={
            <Badge variant="neutral" emphasis="muted" size="sm">
              {pitchKitCreator.platform}
            </Badge>
          }
        />
        <div className={pitchKitHeaderCopyClasses}>
          <p className={pitchKitSupportingClasses}>{pitchKitCreator.handle}</p>
          <p className={pitchKitFormulaClasses}>
            Verified Instagram summary plus creator-entered contact and past-brand
            proof.
          </p>
        </div>
      </section>

      <div
        role="group"
        aria-label="Verified Instagram summary"
        className={pitchKitStatsBandClasses}
      >
        <Stat
          className={pitchKitShareableStatClasses}
          label="Followers"
          value={followers}
        />
        <Stat
          className={pitchKitShareableStatClasses}
          label="Engagement rate"
          value={engagementRate}
        />
      </div>

      {statsResolved ? (
        <section className={pitchKitPostsSectionClasses}>
          <div className={pitchKitPostsHeaderClasses}>
            <div>
              <h2 className={cardTitleClasses}>Selected posts</h2>
              <p className={pitchKitSupportingClasses}>
                Posts chosen for this kit.
              </p>
            </div>
          </div>
          <div className={pitchKitPostsPanelClasses}>
            {posts.map((post) => (
              <ShareablePostCard key={post.id} post={post} />
            ))}
          </div>
        </section>
      ) : null}

      <div className={pitchKitDashboardGridClasses}>
        <Card
          variant="outlined"
          shape="rounded"
          bodyTerminal
          className={pitchKitShareableAsideCardClasses}
        >
          <Card.Header
            start={
              <>
                <h2 className={cardTitleClasses}>Contact</h2>
                <p className={cardSubtitleClasses}>Creator-entered.</p>
              </>
            }
          />
          <Card.Body>
            <div className={pitchKitCardWellClasses}>
              <div className={pitchKitShareableStackClasses}>
                <p className={pitchKitSupportingClasses}>
                  Brands use these details to get in touch.
                </p>
                <p className={pitchKitShareableContactLineClasses}>
                  Email{" "}
                  <TextLink href={pitchKitContact.emailHref}>
                    {pitchKitContact.email}
                  </TextLink>
                </p>
                <p className={pitchKitShareableContactLineClasses}>
                  Site{" "}
                  <TextLink href={pitchKitContact.websiteHref} external>
                    {pitchKitContact.websiteLabel}
                  </TextLink>
                </p>
              </div>
            </div>
          </Card.Body>
        </Card>

        <Card
          variant="outlined"
          shape="rounded"
          bodyTerminal
          className={pitchKitShareableAsideCardClasses}
        >
          <Card.Header
            start={
              <>
                <h2 className={cardTitleClasses}>Past-brand proof</h2>
                <p className={cardSubtitleClasses}>
                  Collaborations added to this kit.
                </p>
              </>
            }
          />
          <Card.Body>
            <div className={pitchKitCardWellClasses}>
              <ul className={pitchKitShareableBrandListClasses}>
                {pitchKitPastBrands.map((brand) => (
                  <li
                    key={brand.id}
                    className={pitchKitShareableBrandItemClasses}
                  >
                    <h3 className={pitchKitShareableBrandNameClasses}>
                      {brand.name}
                    </h3>
                    <p className={pitchKitSupportingClasses}>{brand.proof}</p>
                  </li>
                ))}
              </ul>
            </div>
          </Card.Body>
        </Card>
      </div>
    </>
  );
}
