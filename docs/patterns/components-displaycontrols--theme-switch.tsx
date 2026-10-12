// @thewhatmatters/wmds@0.4.17 · Pattern — theme switch
// Storybook: Components/DisplayControls → Pattern — theme switch (?path=/story/components-displaycontrols--theme-switch)
// Show code — copy verbatim and keep this header; upgrades find pasted patterns by it.

import { useSyncExternalStore } from "react";
import {
  commitDisplayTheme,
  DisplayControls,
  displayThemeNoFlashScript,
  readDisplayTheme,
  subscribeDisplayTheme,
  type DisplayControlThemeMode,
} from "@thewhatmatters/wmds";

export { displayThemeNoFlashScript };

function themeServerSnapshot(): DisplayControlThemeMode {
  return "auto";
}

export function ThemeSwitch() {
  const theme = useSyncExternalStore(subscribeDisplayTheme, readDisplayTheme, themeServerSnapshot);

  return (
    <div className="flex w-full max-w-xs items-center justify-between gap-3 rounded-xl border border-border bg-surface p-3">
      <span className="type-label">Appearance</span>
      <DisplayControls
        controls="theme"
        aria-label="Appearance"
        theme={theme}
        onThemeChange={commitDisplayTheme}
      />
    </div>
  );
}
