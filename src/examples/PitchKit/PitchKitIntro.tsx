import { useState } from "react";
import { Avatar } from "../../components/atoms/Avatar/Avatar";
import { Button } from "../../components/atoms/Button/Button";
import { TextArea } from "../../components/atoms/TextArea/TextArea";
import {
  IdentityExampleShell,
  CreatorIdentityStrip,
} from "./PitchKitCreatorIdentity";
import {
  PITCHKIT_INTRO_HARD_LIMIT,
  identityFromState,
  introFromState,
  pitchKitCreatorIdentity,
  pitchKitIntroIsEmpty,
  pitchKitIntroStatus,
  type PitchKitCreatorIdentityState,
  type PitchKitIntroState,
} from "./pitchKitData";
import {
  pitchKitIdentityNameplateClasses,
  pitchKitIntroClasses,
  pitchKitIntroStackClasses,
  pitchKitTopbarEndClasses,
} from "./pitchKitStyles";

export interface PitchKitIntroExampleProps {
  identityState?: PitchKitCreatorIdentityState;
  introState?: PitchKitIntroState;
  chrome?: "public" | "owner";
}

function PublicIntro({ intro }: { intro: string }) {
  if (pitchKitIntroIsEmpty(intro)) return null;

  return <p className={pitchKitIntroClasses}>{intro}</p>;
}

function OwnerIntroEditor({
  intro,
  onIntroChange,
}: {
  intro: string;
  onIntroChange: (value: string) => void;
}) {
  const [editing, setEditing] = useState(() => !pitchKitIntroIsEmpty(intro));

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

function IntroNameplate({
  identityState,
  intro,
  chrome,
  onIntroChange,
}: {
  identityState: PitchKitCreatorIdentityState;
  intro: string;
  chrome: "public" | "owner";
  onIntroChange: (value: string) => void;
}) {
  const identity = identityFromState(identityState);
  if (identity == null) return null;

  return (
    <section className={pitchKitIdentityNameplateClasses}>
      <div className={pitchKitIntroStackClasses}>
        <CreatorIdentityStrip
          identity={identity}
          nameAs="h1"
          showProfessionalChip
        />
        {chrome === "owner" ? (
          <OwnerIntroEditor intro={intro} onIntroChange={onIntroChange} />
        ) : (
          <PublicIntro intro={intro} />
        )}
      </div>
    </section>
  );
}

function PitchKitIntroCanvas({
  identityState = "resolved",
  introState = "filled",
  chrome = "public",
}: PitchKitIntroExampleProps) {
  const [intro, setIntro] = useState(() => introFromState(introState));
  const identity = identityFromState(identityState);
  const topbarName =
    identity?.displayName ?? pitchKitCreatorIdentity.handle;

  return (
    <IdentityExampleShell
      topbarEnd={
        chrome === "owner" ? (
          <>
            <span />
            <span className={pitchKitTopbarEndClasses}>
              <Avatar
                name={topbarName}
                src={identity?.profilePictureUrl}
                size="sm"
              />
            </span>
          </>
        ) : undefined
      }
    >
      <IntroNameplate
        identityState={identityState}
        intro={intro}
        chrome={chrome}
        onIntroChange={setIntro}
      />
    </IdentityExampleShell>
  );
}

export function PitchKitIntroExample(props: PitchKitIntroExampleProps) {
  return (
    <PitchKitIntroCanvas
      key={`${props.chrome ?? "public"}-${props.introState ?? "filled"}-${props.identityState ?? "resolved"}`}
      {...props}
    />
  );
}

export function PitchKitIntroOwnerExample(
  props: Omit<PitchKitIntroExampleProps, "chrome">,
) {
  return <PitchKitIntroExample {...props} chrome="owner" />;
}

export function PitchKitIntroPublicExample(
  props: Omit<PitchKitIntroExampleProps, "chrome">,
) {
  return <PitchKitIntroExample {...props} chrome="public" />;
}
