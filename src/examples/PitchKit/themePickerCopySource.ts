import { ownerAccountChromeCopySource } from "./ownerChromeCopySource";
import { shareablePitchKitBodyCopySource } from "./shareablePitchKitCopySource";
import {
  pitchKitBrandClasses,
  pitchKitContentBandClasses,
  pitchKitContentClasses,
  pitchKitHeaderCopyClasses,
  pitchKitHeaderSectionClasses,
  pitchKitPageClasses,
  pitchKitSupportingClasses,
  pitchKitThemeToolbarClasses,
  pitchKitTopbarBandClasses,
  pitchKitTopbarClasses,
  pitchKitTopbarEndClasses,
} from "./pitchKitStyles";

export const themePickerOwnerCopySource = `
import { useLayoutEffect, useRef, useState } from "react";
import {
  AlertDialog,
  Avatar,
  Badge,
  Button,
  Card,
  Chart,
  Chip,
  Dialog,
  Dropdown,
  PageHeader,
  SegmentedControl,
  Stat,
  TextLink,
  Toaster,
  cardSubtitleClasses,
  cardTitleClasses,
  chartSeriesConfigFromKeys,
  toast,
} from "@whatmatters/wmds";

const reachConfig = chartSeriesConfigFromKeys([
  { key: "typical", label: "Typical reach" },
  { key: "reach", label: "Daily reach" },
]);

const compactNumber = new Intl.NumberFormat("en", {
  notation: "compact",
  maximumFractionDigits: 1,
});

const pitchKitThemes = ["light", "dark", "soft"];

${ownerAccountChromeCopySource}
${shareablePitchKitBodyCopySource}

export function ThemePickerOwnerPage({ identity, intro, posts, contact, brands, countries, reachData }) {
  const [draftTheme, setDraftTheme] = useState("light");
  const [savedTheme, setSavedTheme] = useState("light");
  const dirty = draftTheme !== savedTheme;

  function saveTheme() {
    if (!dirty) return;
    setSavedTheme(draftTheme);
    toast.add({
      title: "Theme saved",
      description: \`Public kit appearance is \${draftTheme}.\`,
      tone: "success",
    });
  }

  return (
    <main data-theme={draftTheme} className="${pitchKitPageClasses}">
      <div className="${pitchKitTopbarBandClasses}">
        <header className="${pitchKitTopbarClasses}">
          <span className="${pitchKitBrandClasses}">PitchKit</span>
          <span />
          <span className="${pitchKitTopbarEndClasses}">
            <OwnerAccountMenu identity={identity} />
          </span>
        </header>
      </div>

      <div className="${pitchKitContentBandClasses}">
        <div className="${pitchKitContentClasses}">
          <section className="${pitchKitHeaderSectionClasses}">
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
            <div className="${pitchKitHeaderCopyClasses}">
              <p className="${pitchKitSupportingClasses}">
                Choose a look for your public Pitchkit. Changes apply when you save.
              </p>
            </div>
          </section>

          <div className="${pitchKitThemeToolbarClasses}">
            <SegmentedControl
              aria-label="Kit theme"
              size="sm"
              value={draftTheme}
              onValueChange={setDraftTheme}
            >
              {pitchKitThemes.map((theme) => (
                <SegmentedControl.Item key={theme} value={theme}>
                  {theme === "light" ? "Light" : theme === "dark" ? "Dark" : "Soft"}
                </SegmentedControl.Item>
              ))}
            </SegmentedControl>
          </div>

          <ShareablePitchKit
            identity={identity}
            intro={intro}
            posts={posts}
            contact={contact}
            brands={brands}
            countries={countries}
            reachData={reachData}
            showCreateBand={false}
          />
        </div>
      </div>
      <PitchKitPageFooter />
      <Toaster position="bottom-right" />
    </main>
  );
}
`;
