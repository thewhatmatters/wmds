// @whatmatters/wmds@0.2.0 · Pattern — intro (owner)
// Storybook: Sites/PitchKit/Intro → Pattern — intro (owner) (?path=/story/sites-pitchkit-intro--intro-owner)
// Show code — copy verbatim and keep this header; upgrades find pasted patterns by it.

import { useState } from "react";
import { Avatar, Button, Chip, TextArea } from "@whatmatters/wmds";

const compactNumber = new Intl.NumberFormat("en", {
  notation: "compact",
  maximumFractionDigits: 1,
});

const PITCHKIT_INTRO_SOFT_LIMIT = 160;
const PITCHKIT_INTRO_HARD_LIMIT = 280;

function pitchKitIntroIsEmpty(intro: string) {
  return intro.trim().length === 0;
}

function pitchKitIntroStatus(intro: string): "warning" | "error" | undefined {
  const length = intro.length;
  if (length >= PITCHKIT_INTRO_HARD_LIMIT) return "error";
  if (length >= PITCHKIT_INTRO_SOFT_LIMIT) return "warning";
  return undefined;
}


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


function OwnerIntroEditor({
  intro,
  onIntroChange,
}: {
  intro: string;
  onIntroChange: (intro: string) => void;
}) {
  const [editing, setEditing] = useState(!pitchKitIntroIsEmpty(intro));

  if (pitchKitIntroIsEmpty(intro) && !editing) {
    return (
      <Button role="ghost" onClick={() => setEditing(true)}>
        Add an intro
      </Button>
    );
  }

  return (
    <TextArea
      label="Intro"
      description="Shown on your Pitchkit. This is not your Instagram bio."
      placeholder="What you create and who you create it for"
      value={intro}
      maxLength={PITCHKIT_INTRO_HARD_LIMIT}
      status={pitchKitIntroStatus(intro)}
      rows={4}
      onChange={(event) => onIntroChange(event.target.value)}
    />
  );
}

export function IntroOwnerPage({
  identity,
  intro,
  onIntroChange,
}: {
  identity: PitchKitCreatorIdentity;
  intro: string;
  onIntroChange: (intro: string) => void;
}) {
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
          <section className="col-span-full border-b border-border pb-6">
            <div className="flex min-w-0 flex-col gap-3">
              <CreatorIdentityStrip
                identity={identity}
                nameAs="h1"
                showProfessionalChip
              />
              <OwnerIntroEditor intro={intro} onIntroChange={onIntroChange} />
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
