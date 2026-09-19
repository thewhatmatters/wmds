import { UserPlus } from "lucide-react";
import { Avatar } from "../../components/atoms/Avatar/Avatar";
import { Badge } from "../../components/atoms/Badge/Badge";
import { Button } from "../../components/atoms/Button/Button";
import {
  Card,
  cardTitleClasses,
} from "../../components/molecules/Card/Card";
import { Chip } from "../../components/molecules/Chip/Chip";
import { Stat } from "../../components/molecules/Stat/Stat";
import { PitchKitExampleShell } from "./PitchKitExampleShell";
import {
  pitchKitCreator,
  pitchKitSelectedPosts,
  pitchKitSummary,
  type PitchKitPost,
} from "./pitchKitData";
import {
  pitchKitCalloutActionsClasses,
  pitchKitCalloutBodyClasses,
  pitchKitCalloutCardClasses,
  pitchKitIdentityCopyClasses,
  pitchKitIdentityNameClasses,
  pitchKitIdentityRowClasses,
  pitchKitIdentitySectionClasses,
  pitchKitIdentityTitleRowClasses,
  pitchKitKitPostMetricsClasses,
  pitchKitKitStatClasses,
  pitchKitPostCardClasses,
  pitchKitPostImageClasses,
  pitchKitPostMetricClasses,
  pitchKitPostMetricLabelClasses,
  pitchKitPostMetricValueClasses,
  pitchKitPostsHeaderClasses,
  pitchKitPostsPanelClasses,
  pitchKitPostsSectionClasses,
  pitchKitStatsBandClasses,
  pitchKitSupportingClasses,
} from "./pitchKitStyles";

const compactNumber = new Intl.NumberFormat("en", {
  notation: "compact",
  maximumFractionDigits: 1,
});

const truncatedPosts = pitchKitSelectedPosts.slice(0, 2);

export function CreatePitchKitProfileCallout() {
  return (
    <Card
      variant="outlined"
      shape="rounded"
      bodyTerminal
      className={pitchKitCalloutCardClasses}
    >
      <Card.Header
        start={<h2 className={cardTitleClasses}>Create your PitchKit</h2>}
      />
      <Card.Body>
        <div className={pitchKitCalloutBodyClasses}>
          <p className={pitchKitSupportingClasses}>
            Build a shareable kit from your Instagram so brands can review your work.
          </p>
          <div className={pitchKitCalloutActionsClasses}>
            <Button role="primary" icon={<UserPlus />}>
              Create your PitchKit
            </Button>
            <Button role="secondary">Continue with Instagram</Button>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}

export function TruncatedShareablePitchKit({
  posts = truncatedPosts,
}: {
  posts?: readonly PitchKitPost[];
}) {
  return (
    <>
      <section className={pitchKitIdentitySectionClasses}>
        <div className={pitchKitIdentityRowClasses}>
          <Avatar name={pitchKitCreator.name} size="lg" />
          <div className={pitchKitIdentityCopyClasses}>
            <div className={pitchKitIdentityTitleRowClasses}>
              <h1 className={pitchKitIdentityNameClasses}>{pitchKitCreator.name}</h1>
              <Badge variant="success" emphasis="muted" size="sm">
                Verified
              </Badge>
              <Chip readOnly size="sm">
                {pitchKitCreator.platform}
              </Chip>
            </div>
            <p className={pitchKitSupportingClasses}>{pitchKitCreator.handle}</p>
          </div>
        </div>
      </section>

      <div
        role="group"
        aria-label="Verified Instagram summary"
        className={pitchKitStatsBandClasses}
      >
        <Stat
          className={pitchKitKitStatClasses}
          label="Followers"
          value={pitchKitSummary.followers}
        />
        <Stat
          className={pitchKitKitStatClasses}
          label="Engagement rate"
          value={pitchKitSummary.engagementRate}
        />
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
                      <span className={pitchKitPostMetricLabelClasses}>{label}</span>
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
    </>
  );
}

export function PitchKitCreateProfileCalloutExample() {
  return (
    <PitchKitExampleShell>
      <TruncatedShareablePitchKit />
      <CreatePitchKitProfileCallout />
    </PitchKitExampleShell>
  );
}
