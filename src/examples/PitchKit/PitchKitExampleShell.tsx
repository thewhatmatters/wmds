import { useEffect, useMemo, useState, type CSSProperties, type ReactNode } from "react";
import type { DisplayControlThemeMode } from "../../components/molecules/DisplayControls/DisplayControls";
import { GridOverlay } from "../../lib/GridOverlay";
import { ExampleGridControls } from "../ExampleGridControls/ExampleGridControls";
import {
  pitchKitBrandClasses,
  pitchKitContentBandClasses,
  pitchKitContentClasses,
  pitchKitPageClasses,
  pitchKitTopbarBandClasses,
  pitchKitTopbarClasses,
} from "./pitchKitStyles";

export function PitchKitExampleShell({
  topbarEnd,
  overlay,
  children,
}: {
  topbarEnd?: ReactNode;
  /** Portaled overlays — not wrapped in the content band. */
  overlay?: ReactNode;
  children?: ReactNode;
}) {
  const [gridVisible, setGridVisible] = useState(false);
  const [theme, setTheme] = useState<DisplayControlThemeMode>("auto");
  const [gridMax, setGridMax] = useState(1140);
  const [columnGap, setColumnGap] = useState(8);
  const pageStyle = useMemo(
    () =>
      ({
        "--grid-max": `${gridMax}px`,
        "--grid-column-gap": `${columnGap}px`,
      }) as CSSProperties,
    [columnGap, gridMax],
  );

  useEffect(() => {
    const root = document.documentElement;
    const previousTheme = root.getAttribute("data-theme");
    if (theme === "auto") {
      root.removeAttribute("data-theme");
    } else {
      root.setAttribute("data-theme", theme);
    }
    return () => {
      if (previousTheme == null) root.removeAttribute("data-theme");
      else root.setAttribute("data-theme", previousTheme);
    };
  }, [theme]);

  return (
    <main
      data-theme={theme === "auto" ? undefined : theme}
      className={pitchKitPageClasses}
      style={pageStyle}
    >
      <GridOverlay
        visible={gridVisible}
        onVisibleChange={setGridVisible}
        keyboardShortcut={false}
      />

      <div className={pitchKitTopbarBandClasses}>
        <header className={pitchKitTopbarClasses}>
          <span className={pitchKitBrandClasses}>PitchKit</span>
          {topbarEnd}
        </header>
      </div>

      {children != null ? (
        <div className={pitchKitContentBandClasses}>
          <div className={pitchKitContentClasses}>{children}</div>
        </div>
      ) : null}

      {overlay}

      <ExampleGridControls
        gridVisible={gridVisible}
        onGridVisibleChange={setGridVisible}
        theme={theme}
        onThemeChange={setTheme}
        maxWidth={gridMax}
        onMaxWidthChange={setGridMax}
        columnGap={columnGap}
        onColumnGapChange={setColumnGap}
        defaultMaxWidth={1140}
        defaultColumnGap={8}
      />
    </main>
  );
}
