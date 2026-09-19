import { creatorIdentityStripCopySource } from "./creatorIdentityCopySource";
import {
  pitchKitBrandClasses,
  pitchKitContentBandClasses,
  pitchKitContentClasses,
  pitchKitIdentityNameplateClasses,
  pitchKitIntroClasses,
  pitchKitIntroStackClasses,
  pitchKitPageClasses,
  pitchKitTopbarBandClasses,
  pitchKitTopbarClasses,
  pitchKitTopbarEndClasses,
} from "./pitchKitStyles";

export const introOwnerCopySource = `
import { useState } from "react";
import { Avatar, Button, Chip, TextArea } from "@whatmatters/wmds";

const compactNumber = new Intl.NumberFormat("en", {
  notation: "compact",
  maximumFractionDigits: 1,
});

const PITCHKIT_INTRO_SOFT_LIMIT = 160;
const PITCHKIT_INTRO_HARD_LIMIT = 280;

function pitchKitIntroIsEmpty(intro) {
  return intro.trim().length === 0;
}

function pitchKitIntroStatus(intro) {
  const length = intro.length;
  if (length >= PITCHKIT_INTRO_HARD_LIMIT) return "error";
  if (length >= PITCHKIT_INTRO_SOFT_LIMIT) return "warning";
  return undefined;
}

${creatorIdentityStripCopySource}

function OwnerIntroEditor({ intro, onIntroChange }) {
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

export function IntroOwnerPage({ identity, intro, onIntroChange }) {
  return (
    <main className="${pitchKitPageClasses}">
      <div className="${pitchKitTopbarBandClasses}">
        <header className="${pitchKitTopbarClasses}">
          <span className="${pitchKitBrandClasses}">PitchKit</span>
          <span />
          <span className="${pitchKitTopbarEndClasses}">
            <Avatar
              name={identity.displayName ?? identity.handle}
              src={identity.profilePictureUrl}
              size="sm"
            />
          </span>
        </header>
      </div>

      <div className="${pitchKitContentBandClasses}">
        <div className="${pitchKitContentClasses}">
          <section className="${pitchKitIdentityNameplateClasses}">
            <div className="${pitchKitIntroStackClasses}">
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
`;

export const introPublicCopySource = `
import { Avatar, Chip } from "@whatmatters/wmds";

const compactNumber = new Intl.NumberFormat("en", {
  notation: "compact",
  maximumFractionDigits: 1,
});

function pitchKitIntroIsEmpty(intro) {
  return intro.trim().length === 0;
}

${creatorIdentityStripCopySource}

export function IntroPublicPage({ identity, intro }) {
  return (
    <main className="${pitchKitPageClasses}">
      <div className="${pitchKitTopbarBandClasses}">
        <header className="${pitchKitTopbarClasses}">
          <span className="${pitchKitBrandClasses}">PitchKit</span>
        </header>
      </div>

      <div className="${pitchKitContentBandClasses}">
        <div className="${pitchKitContentClasses}">
          <section className="${pitchKitIdentityNameplateClasses}">
            <div className="${pitchKitIntroStackClasses}">
              <CreatorIdentityStrip
                identity={identity}
                nameAs="h1"
                showProfessionalChip
              />
              {pitchKitIntroIsEmpty(intro) ? null : (
                <p className="${pitchKitIntroClasses}">{intro}</p>
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
`;
