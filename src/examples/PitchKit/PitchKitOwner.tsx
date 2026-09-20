import { useState } from "react";
import { EyeOff } from "lucide-react";
import { ButtonIcon } from "../../components/atoms/Button/ButtonIcon";
import { TextLink } from "../../components/atoms/TextLink/TextLink";
import {
  Card,
  cardTitleClasses,
} from "../../components/molecules/Card/Card";
import { PageHeader } from "../../components/molecules/PageHeader/PageHeader";
import { Stat } from "../../components/molecules/Stat/Stat";
import { AlertDialog } from "../../components/organisms/Dialog/AlertDialog";
import { MoreMenu } from "../../components/organisms/MoreMenu/MoreMenu";
import { toast } from "../../components/organisms/Toast/Toast";
import { CreatorIdentityStrip } from "./PitchKitCreatorIdentity";
import { PublicIntro } from "./PitchKitIntro";
import { PublicPastBrands } from "./PitchKitPastBrands";
import { PublicCountries, PublicReachCard } from "./PitchKitShareable";
import {
  pitchKitContact,
  pitchKitCreatorIdentity,
  pitchKitIntroFilled,
  pitchKitPastBrands,
  pitchKitPublicCountries,
  pitchKitSelectedPosts,
  pitchKitSummary,
  publicEngagementRate,
  publicTypicalReach,
  type PitchKitCreatorIdentity,
  type PitchKitPastBrand,
  type PitchKitPost,
  type PitchKitPublicReachState,
} from "./pitchKitData";
import {
  pitchKitContactCardClasses,
  pitchKitContactRowClasses,
  pitchKitContactRowsClasses,
  pitchKitDashboardGridClasses,
  pitchKitHeaderCopyClasses,
  pitchKitHeaderSectionClasses,
  pitchKitIdentityNameplateClasses,
  pitchKitIntroStackClasses,
  pitchKitKitPostMetricsClasses,
  pitchKitOwnerCountriesCardClasses,
  pitchKitOwnerReachCardClasses,
  pitchKitPostCardClasses,
  pitchKitPostImageClasses,
  pitchKitPostMetricClasses,
  pitchKitPostMetricLabelClasses,
  pitchKitPostMetricValueClasses,
  pitchKitPostsHeaderClasses,
  pitchKitPostsPanelClasses,
  pitchKitPostsSectionClasses,
  pitchKitPublicStatClasses,
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
  intro?: string;
  posts?: readonly PitchKitPost[];
  contact?: typeof pitchKitContact;
  brands?: readonly PitchKitPastBrand[];
  countries?: typeof pitchKitPublicCountries;
  reachState?: PitchKitPublicReachState;
}

export function OwnerPitchKit({
  identity = pitchKitCreatorIdentity,
  intro = pitchKitIntroFilled,
  posts = pitchKitSelectedPosts,
  contact = pitchKitContact,
  brands = pitchKitPastBrands,
  countries = pitchKitPublicCountries,
  reachState = "resolved",
}: OwnerPitchKitProps) {
  const [visiblePosts, setVisiblePosts] = useState(() => [...posts]);
  const [postNotice, setPostNotice] = useState<string | null>(null);
  const [pendingHidePostId, setPendingHidePostId] = useState<string | null>(
    null,
  );
  const engagementRate = publicEngagementRate(reachState);
  const typicalReach = publicTypicalReach(reachState);

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
      <section className={pitchKitHeaderSectionClasses}>
        <PageHeader variant="page" title="Your Pitchkit" />
        <div className={pitchKitHeaderCopyClasses}>
          <p className={pitchKitSupportingClasses}>Edit what brands see</p>
        </div>
      </section>

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
        <PublicReachCard
          reachState={reachState}
          className={pitchKitOwnerReachCardClasses}
        />
        <PublicCountries
          countries={countries}
          className={pitchKitOwnerCountriesCardClasses}
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
