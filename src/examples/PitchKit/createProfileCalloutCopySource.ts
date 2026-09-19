import {
  pitchKitBrandClasses,
  pitchKitCalloutActionsClasses,
  pitchKitCalloutBodyClasses,
  pitchKitCalloutCardClasses,
  pitchKitContentBandClasses,
  pitchKitContentClasses,
  pitchKitIdentityCopyClasses,
  pitchKitIdentityNameClasses,
  pitchKitIdentityRowClasses,
  pitchKitIdentitySectionClasses,
  pitchKitIdentityTitleRowClasses,
  pitchKitKitPostMetricsClasses,
  pitchKitKitStatClasses,
  pitchKitPageClasses,
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
  pitchKitTopbarBandClasses,
  pitchKitTopbarClasses,
} from "./pitchKitStyles";

export const createPitchKitProfileCalloutCopySource = `
import { UserPlus } from "lucide-react";
import {
  Avatar,
  Badge,
  Button,
  Card,
  Chip,
  Stat,
  cardTitleClasses,
} from "@whatmatters/wmds";

const compactNumber = new Intl.NumberFormat("en", {
  notation: "compact",
  maximumFractionDigits: 1,
});

function CreatePitchKitProfileCallout() {
  return (
    <Card
      variant="outlined"
      shape="rounded"
      bodyTerminal
      className="${pitchKitCalloutCardClasses}"
    >
      <Card.Header
        start={<h2 className={cardTitleClasses}>Create your PitchKit Profile</h2>}
      />
      <Card.Body>
        <div className="${pitchKitCalloutBodyClasses}">
          <p className="${pitchKitSupportingClasses}">
            Build a shareable kit from your Instagram so brands can review your work.
          </p>
          <div className="${pitchKitCalloutActionsClasses}">
            <Button role="primary" icon={<UserPlus />}>
              Get started
            </Button>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}

function TruncatedShareablePitchKit({ posts }) {
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
    </>
  );
}

export function CreatePitchKitProfileCalloutPage({ posts }) {
  return (
    <main className="${pitchKitPageClasses}">
      <div className="${pitchKitTopbarBandClasses}">
        <header className="${pitchKitTopbarClasses}">
          <span className="${pitchKitBrandClasses}">PitchKit</span>
        </header>
      </div>

      <div className="${pitchKitContentBandClasses}">
        <div className="${pitchKitContentClasses}">
          <TruncatedShareablePitchKit posts={posts} />
          <CreatePitchKitProfileCallout />
        </div>
      </div>
    </main>
  );
}
`;
