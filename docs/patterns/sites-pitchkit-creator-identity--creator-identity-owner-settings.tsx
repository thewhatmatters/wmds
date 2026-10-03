// @whatmatters/wmds@0.2.0 · Pattern — creator identity (owner settings)
// Storybook: Sites/PitchKit/Creator identity → Pattern — creator identity (owner settings) (?path=/story/sites-pitchkit-creator-identity--creator-identity-owner-settings)
// Show code — copy verbatim and keep this header; upgrades find pasted patterns by it.

import { Avatar, Badge, Button, Card, Chip, PageHeader, TextLink, Toaster, cardTitleClasses, toast } from "@whatmatters/wmds";
import { Copy } from "lucide-react";

const compactNumber = new Intl.NumberFormat("en", {
  notation: "compact",
  maximumFractionDigits: 1,
});


export interface PitchKitCreatorIdentity {
  displayName?: string;
  /** Without the @ — shown as @handle, shared as /k/[handle]. */
  handle: string;
  profilePictureUrl?: string;
  followersCount?: number;
  professionalAccount?: "Business" | "Creator";
  connected?: boolean;
  lastSyncedLabel?: string;
}

function CreatorIdentityStrip({
  identity,
  nameAs = "h1",
  showProfessionalChip = false,
}: {
  identity: PitchKitCreatorIdentity;
  nameAs?: "h1" | "p";
  showProfessionalChip?: boolean;
}) {
  const NameTag = nameAs;
  const avatarName = identity.displayName ?? identity.handle;
  const handleLabel = `@${identity.handle}`;
  const followerLabel =
    identity.followersCount == null
      ? null
      : `${compactNumber.format(identity.followersCount)} followers`;
  const meta = [handleLabel, followerLabel].filter(Boolean).join(" · ");
  const showTitleRow =
    identity.displayName != null ||
    (showProfessionalChip && identity.professionalAccount != null);

  return (
    <div className="flex flex-wrap items-center gap-4">
      <Avatar
        name={avatarName}
        src={identity.profilePictureUrl}
        size="lg"
      />
      <div className="flex min-w-0 flex-col gap-1">
        {showTitleRow ? (
          <div className="flex flex-wrap items-center gap-2">
            {identity.displayName != null ? (
              <NameTag className="type-heading-2 text-fg">
                {identity.displayName}
              </NameTag>
            ) : null}
            {showProfessionalChip && identity.professionalAccount != null ? (
              <Chip readOnly size="sm">
                {identity.professionalAccount}
              </Chip>
            ) : null}
          </div>
        ) : null}
        <p className="type-body text-fg text-muted">{meta}</p>
      </div>
    </div>
  );
}


export function CreatorIdentityOwnerSettingsPage({ identity }: { identity: PitchKitCreatorIdentity }) {
  const sharePath = `/k/${identity.handle}`;

  function copyShareKitUrl() {
    void navigator.clipboard.writeText(sharePath);
    toast.add({
      title: "Kit URL copied",
      description: sharePath,
      tone: "success",
    });
  }

  return (
    <main className="grid-page min-h-screen bg-body [--grid-column-gap:8px] [--grid-max:1140px] [padding-bottom:44px]">
      <div className="band pb-4">
        <header className="col-span-full grid grid-cols-[1fr_auto_1fr] items-center gap-3">
          <span className="type-heading-4 text-fg text-fg">PitchKit</span>
          <span />
          <span className="justify-self-end">
            <Avatar
              name={identity.displayName ?? identity.handle}
              src={identity.profilePictureUrl}
              size="md"
            />
          </span>
        </header>
      </div>

      <div className="band pt-6 sm:pt-8">
        <div className="band min-w-0 gap-y-6 sm:gap-y-8">
          <section className="col-span-full">
            <PageHeader variant="page" title="Settings" />
            <div className="flex max-w-2xl flex-col gap-1">
              <p className="type-body text-fg text-muted">
                Instagram connection for this PitchKit.
              </p>
            </div>
          </section>

          <Card variant="outlined" shape="rounded" bodyTerminal className="col-span-full">
            <Card.Header
              start={<h2 className={cardTitleClasses}>Connected Instagram</h2>}
              end={
                identity.connected ? (
                  <Badge variant="success" emphasis="muted" size="sm">
                    Connected
                  </Badge>
                ) : null
              }
            />
            <Card.Body>
              <div className="flex min-w-0 flex-col gap-4 px-3.5 py-[16px]">
                <CreatorIdentityStrip
                  identity={identity}
                  nameAs="p"
                  showProfessionalChip
                />
                <div className="flex min-w-0 flex-col gap-2">
                  <span className="type-supporting font-medium uppercase tracking-wider text-muted text-muted">Share kit</span>
                  <div className="flex min-w-0 flex-wrap items-center gap-3">
                    <TextLink href={sharePath}>{sharePath}</TextLink>
                    <Button role="secondary" size="sm" icon={<Copy />} onClick={copyShareKitUrl}>
                      Copy
                    </Button>
                  </div>
                </div>
                {identity.lastSyncedLabel != null ? (
                  <p className="type-supporting text-muted text-muted">
                    Last synced {identity.lastSyncedLabel}
                  </p>
                ) : null}
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
      <Toaster position="bottom-right" />
    </main>
  );
}
