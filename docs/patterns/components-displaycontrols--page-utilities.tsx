// @thewhatmatters/wmds@0.4.4 · Pattern — page display controls
// Storybook: Components/DisplayControls → Pattern — page display controls (?path=/story/components-displaycontrols--page-utilities)
// Show code — copy verbatim and keep this header; upgrades find pasted patterns by it.

import { useState } from "react";
import {
  DisplayControls,
  GridOverlay,
  type DisplayControlThemeMode,
} from "@thewhatmatters/wmds";

export function Page() {
  const [gridVisible, setGridVisible] = useState(false);
  const [theme, setTheme] = useState<DisplayControlThemeMode>("auto");

  return (
    <div data-theme={theme === "auto" ? undefined : theme} className="relative">
      <main className="grid-page">
        <GridOverlay
          visible={gridVisible}
          onVisibleChange={setGridVisible}
          keyboardShortcut={false}
        />
        <div className="band">{/* page content */}</div>
      </main>

      <DisplayControls
        className="fixed bottom-4 right-4"
        gridVisible={gridVisible}
        onGridVisibleChange={setGridVisible}
        theme={theme}
        onThemeChange={setTheme}
      />
    </div>
  );
}
