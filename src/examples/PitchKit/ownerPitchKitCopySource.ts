import { creatorIdentityStripCopySource } from "./creatorIdentityCopySource";
import {
  pitchKitBrandBodyClasses,
  pitchKitBrandClasses,
  pitchKitContactCardClasses,
  pitchKitContactRowClasses,
  pitchKitContactRowsClasses,
  pitchKitContentBandClasses,
  pitchKitContentClasses,
  pitchKitIdentitySectionClasses,
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
  pitchKitSectionEyebrowClasses,
  pitchKitStatsBandClasses,
  pitchKitSupportingClasses,
  pitchKitTopbarBandClasses,
  pitchKitTopbarClasses,
  pitchKitTopbarEndClasses,
} from "./pitchKitStyles";

/** Authenticated kit body — same sections as the public kit, plus hide/restore. */
export const ownerPitchKitBodyCopySource = `
${creatorIdentityStripCopySource}

function OwnerPitchKit({ identity, posts, contact, brands }) {
  const [visiblePosts, setVisiblePosts] = useState(posts);
  const [postNotice, setPostNotice] = useState(null);
  const [pendingHidePostId, setPendingHidePostId] = useState(null);

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
      <section className="${pitchKitIdentitySectionClasses}">
        <CreatorIdentityStrip
          identity={identity}
          nameAs="h1"
          showProfessionalChip
        />
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

      <section className="${pitchKitPostsSectionClasses}">
        <div className="${pitchKitPostsHeaderClasses}">
          <div>
            <h2 className={cardTitleClasses}>Past brands</h2>
            <p className="${pitchKitSupportingClasses}">
              Campaigns already shipped with this creator.
            </p>
          </div>
        </div>
        <div className="${pitchKitPostsPanelClasses}">
          {brands.map((brand) => (
            <Card key={brand.id} variant="outlined" shape="rounded" className="${pitchKitPostCardClasses}">
              <Card.Header
                start={<h3 className={cardTitleClasses}>{brand.name}</h3>}
                end={<Badge variant="neutral" emphasis="muted" size="sm">{brand.year}</Badge>}
              />
              <Card.Body>
                <p className="${pitchKitBrandBodyClasses}">{brand.summary}</p>
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
`;

export const ownerPitchKitPageCopySource = `
import { useState } from "react";
import {
  AlertDialog,
  Avatar,
  Badge,
  ButtonIcon,
  Card,
  Chip,
  MoreMenu,
  SegmentedControl,
  Stat,
  TextLink,
  Toaster,
  cardTitleClasses,
  toast,
} from "@whatmatters/wmds";
import { EyeOff } from "lucide-react";

const compactNumber = new Intl.NumberFormat("en", {
  notation: "compact",
  maximumFractionDigits: 1,
});

${ownerPitchKitBodyCopySource}

export function OwnerPitchKitPage({ identity, posts, contact, brands }) {
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
            <Avatar name="Avery Morgan" size="sm" />
          </span>
        </header>
      </div>

      <div className="${pitchKitContentBandClasses}">
        <div className="${pitchKitContentClasses}">
          {view === "pitchkit" ? (
            <OwnerPitchKit
              identity={identity}
              posts={posts}
              contact={contact}
              brands={brands}
            />
          ) : null}
        </div>
      </div>
      <Toaster position="bottom-right" />
    </main>
  );
}
`;
