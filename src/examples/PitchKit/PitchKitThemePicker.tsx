import { useState } from "react";
import { Button } from "../../components/atoms/Button/Button";
import { PageHeader } from "../../components/molecules/PageHeader/PageHeader";
import { SegmentedControl } from "../../components/molecules/SegmentedControl/SegmentedControl";
import { Toaster, toast } from "../../components/organisms/Toast/Toast";
import { PitchKitExampleShell } from "./PitchKitExampleShell";
import { OwnerAccountMenu } from "./PitchKitOwnerChrome";
import { ShareablePitchKit } from "./PitchKitShareable";
import {
  PITCHKIT_THEME_DEFAULT,
  pitchKitThemes,
  type PitchKitTheme,
} from "./pitchKitData";
import {
  pitchKitHeaderCopyClasses,
  pitchKitHeaderSectionClasses,
  pitchKitSupportingClasses,
  pitchKitThemeToolbarClasses,
  pitchKitTopbarEndClasses,
} from "./pitchKitStyles";

export function ThemePickerOwner({
  savedTheme: savedThemeProp = PITCHKIT_THEME_DEFAULT,
  onDraftThemeChange,
}: {
  savedTheme?: PitchKitTheme;
  onDraftThemeChange?: (theme: PitchKitTheme) => void;
}) {
  const [draftTheme, setDraftTheme] = useState<PitchKitTheme>(savedThemeProp);
  const [savedTheme, setSavedTheme] = useState<PitchKitTheme>(savedThemeProp);
  const dirty = draftTheme !== savedTheme;

  function updateDraftTheme(theme: PitchKitTheme) {
    setDraftTheme(theme);
    onDraftThemeChange?.(theme);
  }

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
          onValueChange={(value) => updateDraftTheme(value as PitchKitTheme)}
        >
          {pitchKitThemes.map((theme) => (
            <SegmentedControl.Item key={theme} value={theme}>
              {theme === "light" ? "Light" : theme === "dark" ? "Dark" : "Soft"}
            </SegmentedControl.Item>
          ))}
        </SegmentedControl>
      </div>

      <ShareablePitchKit showCreateBand={false} />
    </>
  );
}

export function PitchKitThemePickerOwnerExample() {
  const [pageTheme, setPageTheme] = useState<PitchKitTheme>(
    PITCHKIT_THEME_DEFAULT,
  );

  return (
    <PitchKitExampleShell
      dataTheme={pageTheme}
      topbarEnd={
        <>
          <span />
          <span className={pitchKitTopbarEndClasses}>
            <OwnerAccountMenu />
          </span>
        </>
      }
      overlay={<Toaster position="bottom-right" />}
    >
      <ThemePickerOwner onDraftThemeChange={setPageTheme} />
    </PitchKitExampleShell>
  );
}
