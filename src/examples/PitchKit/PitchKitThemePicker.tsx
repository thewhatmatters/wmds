import { useState } from "react";
import { Avatar } from "../../components/atoms/Avatar/Avatar";
import { Button } from "../../components/atoms/Button/Button";
import { PageHeader } from "../../components/molecules/PageHeader/PageHeader";
import { SegmentedControl } from "../../components/molecules/SegmentedControl/SegmentedControl";
import { Toaster, toast } from "../../components/organisms/Toast/Toast";
import { PitchKitExampleShell } from "./PitchKitExampleShell";
import { ShareablePitchKit } from "./PitchKitShareable";
import {
  PITCHKIT_THEME_DEFAULT,
  pitchKitCreatorIdentity,
  pitchKitThemes,
  type PitchKitTheme,
} from "./pitchKitData";
import {
  pitchKitBrandClasses,
  pitchKitContentBandClasses,
  pitchKitContentClasses,
  pitchKitHeaderCopyClasses,
  pitchKitHeaderSectionClasses,
  pitchKitSupportingClasses,
  pitchKitThemePreviewClasses,
  pitchKitThemePreviewLabelClasses,
  pitchKitThemePreviewPageClasses,
  pitchKitThemeToolbarClasses,
  pitchKitTopbarBandClasses,
  pitchKitTopbarClasses,
  pitchKitTopbarEndClasses,
} from "./pitchKitStyles";

export function ThemePickerOwner({
  savedTheme: savedThemeProp = PITCHKIT_THEME_DEFAULT,
}: {
  savedTheme?: PitchKitTheme;
}) {
  const [draftTheme, setDraftTheme] = useState<PitchKitTheme>(savedThemeProp);
  const [savedTheme, setSavedTheme] = useState<PitchKitTheme>(savedThemeProp);
  const dirty = draftTheme !== savedTheme;

  function saveTheme() {
    if (!dirty) return;
    setSavedTheme(draftTheme);
    toast.add({
      title: "Theme saved",
      description: `Public kit appearance is ${draftTheme}.`,
      tone: "success",
    });
  }

  return (
    <>
      <section className={pitchKitHeaderSectionClasses}>
        <PageHeader
          variant="page"
          title="Theme"
          end={
            <Button
              role="primary"
              size="sm"
              disabled={!dirty}
              onClick={saveTheme}
            >
              Save theme
            </Button>
          }
        />
        <div className={pitchKitHeaderCopyClasses}>
          <p className={pitchKitSupportingClasses}>
            Choose a look for your public Pitchkit. Changes apply when you save.
          </p>
        </div>
      </section>

      <div className={pitchKitThemeToolbarClasses}>
        <SegmentedControl
          aria-label="Kit theme"
          size="sm"
          value={draftTheme}
          onValueChange={(value) => setDraftTheme(value as PitchKitTheme)}
        >
          {pitchKitThemes.map((theme) => (
            <SegmentedControl.Item key={theme} value={theme}>
              {theme === "light" ? "Light" : theme === "dark" ? "Dark" : "Soft"}
            </SegmentedControl.Item>
          ))}
        </SegmentedControl>
      </div>

      <div className={pitchKitHeaderSectionClasses}>
        <p className={pitchKitThemePreviewLabelClasses}>Public kit preview</p>
      </div>

      <div
        data-theme={draftTheme}
        className={pitchKitThemePreviewClasses}
        aria-label="Public kit preview"
      >
        <div className={pitchKitThemePreviewPageClasses}>
          <div className={pitchKitTopbarBandClasses}>
            <header className={pitchKitTopbarClasses}>
              <span className={pitchKitBrandClasses}>PitchKit</span>
            </header>
          </div>
          <div className={pitchKitContentBandClasses}>
            <div className={pitchKitContentClasses}>
              <ShareablePitchKit showCreateBand={false} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export function PitchKitThemePickerOwnerExample() {
  const topbarName =
    pitchKitCreatorIdentity.displayName ?? pitchKitCreatorIdentity.handle;

  return (
    <PitchKitExampleShell
      topbarEnd={
        <>
          <SegmentedControl
            aria-label="PitchKit primary navigation"
            size="sm"
            value="pitchkit"
            onValueChange={() => undefined}
          >
            <SegmentedControl.Item value="insights">Insights</SegmentedControl.Item>
            <SegmentedControl.Item value="pitchkit">PitchKit</SegmentedControl.Item>
          </SegmentedControl>
          <span className={pitchKitTopbarEndClasses}>
            <Avatar
              name={topbarName}
              src={pitchKitCreatorIdentity.profilePictureUrl}
              size="sm"
            />
          </span>
        </>
      }
      overlay={<Toaster position="bottom-right" />}
    >
      <ThemePickerOwner />
    </PitchKitExampleShell>
  );
}
