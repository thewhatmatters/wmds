import { useState } from "react";
import { EyeOff } from "lucide-react";
import { Badge } from "../../components/atoms/Badge/Badge";
import { ButtonIcon } from "../../components/atoms/Button/ButtonIcon";
import { TextLink } from "../../components/atoms/TextLink/TextLink";
import {
  Card,
  cardTitleClasses,
} from "../../components/molecules/Card/Card";
import { Stat } from "../../components/molecules/Stat/Stat";
import { AlertDialog } from "../../components/organisms/Dialog/AlertDialog";
import { MoreMenu } from "../../components/organisms/MoreMenu/MoreMenu";
import { toast } from "../../components/organisms/Toast/Toast";
import { CreatorIdentityStrip } from "./PitchKitCreatorIdentity";
import {
  pitchKitBrands,
  pitchKitContact,
  pitchKitCreatorIdentity,
  pitchKitSelectedPosts,
  pitchKitSummary,
  type PitchKitBrand,
  type PitchKitCreatorIdentity,
  type PitchKitPost,
} from "./pitchKitData";
import {
  pitchKitBrandBodyClasses,
  pitchKitContactCardClasses,
  pitchKitContactRowClasses,
  pitchKitContactRowsClasses,
  pitchKitIdentitySectionClasses,
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
  pitchKitSectionEyebrowClasses,
  pitchKitStatsBandClasses,
  pitchKitSupportingClasses,
} from "./pitchKitStyles";

const compactNumber = new Intl.NumberFormat("en", {
  notation: "compact",
  maximumFractionDigits: 1,
});

export interface OwnerPitchKitProps {
  identity?: PitchKitCreatorIdentity;
  posts?: readonly PitchKitPost[];
  contact?: typeof pitchKitContact;
  brands?: readonly PitchKitBrand[];
}

export function OwnerPitchKit({
  identity = pitchKitCreatorIdentity,
  posts = pitchKitSelectedPosts,
  contact = pitchKitContact,
  brands = pitchKitBrands,
}: OwnerPitchKitProps) {
  const [visiblePosts, setVisiblePosts] = useState(() => [...posts]);
  const [postNotice, setPostNotice] = useState<string | null>(null);
  const [pendingHidePostId, setPendingHidePostId] = useState<string | null>(
    null,
  );

  function handlePostAction(postId: string, actionId: string) {
    if (actionId === "hide") {
      setPendingHidePostId(postId);
    }
  }

  function hidePendingPost() {
    const hiddenPost = visiblePosts.find(
      (post) => post.id === pendingHidePostId,
    );
    if (hiddenPost == null) return;

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
      <section className={pitchKitIdentitySectionClasses}>
        <CreatorIdentityStrip
          identity={identity}
          nameAs="h1"
          showProfessionalChip
        />
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
              {postNotice ?? "Proof from the current Instagram set."}
            </p>
          </div>
        </div>
        <div className={pitchKitPostsPanelClasses}>
          {visiblePosts.map((post, index) => (
            <Card
              key={post.id}
              variant="outlined"
              shape="rounded"
              className={pitchKitPostCardClasses}
            >
              <Card.Header
                end={
                  <MoreMenu
                    aria-label={`Manage selected post ${index + 1}`}
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

      <section className={pitchKitPostsSectionClasses}>
        <div className={pitchKitPostsHeaderClasses}>
          <div>
            <h2 className={cardTitleClasses}>Past brands</h2>
            <p className={pitchKitSupportingClasses}>
              Campaigns already shipped with this creator.
            </p>
          </div>
        </div>
        <div className={pitchKitPostsPanelClasses}>
          {brands.map((brand) => (
            <Card
              key={brand.id}
              variant="outlined"
              shape="rounded"
              className={pitchKitPostCardClasses}
            >
              <Card.Header
                start={<h3 className={cardTitleClasses}>{brand.name}</h3>}
                end={
                  <Badge variant="neutral" emphasis="muted" size="sm">
                    {brand.year}
                  </Badge>
                }
              />
              <Card.Body>
                <p className={pitchKitBrandBodyClasses}>{brand.summary}</p>
              </Card.Body>
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
  );
}
