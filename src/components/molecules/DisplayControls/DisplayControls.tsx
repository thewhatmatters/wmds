import { useEffect } from "react";
import { Button } from "../../atoms/Button/Button";
import { Kbd } from "../../atoms/Kbd/Kbd";
import { cn } from "../../../lib/cn";
import {
  displayControlShortcutFromEvent,
  nextDisplayControlThemeMode,
  type DisplayControlThemeMode,
} from "./displayControlsState";
import {
  displayControlsButtonContentClasses,
  displayControlsLabelClasses,
  displayControlsRootClasses,
} from "./displayControlsStyles";

export {
  displayControlThemeModes,
  nextDisplayControlThemeMode,
  type DisplayControlThemeMode,
} from "./displayControlsState";

/** Layout-only — fixed/absolute placement and margin; not for re-theming. */
export type DisplayControlsLayoutClassName = string;

export interface DisplayControlsLabels {
  grid: string;
  showGrid: string;
  hideGrid: string;
  theme: string;
  auto: string;
  light: string;
  dark: string;
}

export interface DisplayControlsProps {
  gridVisible: boolean;
  onGridVisibleChange: (visible: boolean) => void;
  theme: DisplayControlThemeMode;
  onThemeChange: (theme: DisplayControlThemeMode) => void;
  /** Enables global `g` and `t` shortcuts. Default: true. */
  keyboardShortcuts?: boolean;
  labels?: Partial<DisplayControlsLabels>;
  "aria-label"?: string;
  /** Layout-only: fixed/absolute placement and margin. */
  className?: DisplayControlsLayoutClassName;
}

const defaultLabels: DisplayControlsLabels = {
  grid: "Grid",
  showGrid: "Show grid",
  hideGrid: "Hide grid",
  theme: "Theme",
  auto: "Auto",
  light: "Light",
  dark: "Dark",
};

export function DisplayControls({
  gridVisible,
  onGridVisibleChange,
  theme,
  onThemeChange,
  keyboardShortcuts = true,
  labels: labelsProp,
  "aria-label": ariaLabel = "Display controls",
  className,
}: DisplayControlsProps) {
  const labels = { ...defaultLabels, ...labelsProp };

  useEffect(() => {
    if (!keyboardShortcuts) return;

    const onKeyDown = (event: KeyboardEvent) => {
      const shortcut = displayControlShortcutFromEvent(event);
      if (shortcut == null) return;

      event.preventDefault();
      if (shortcut === "grid") {
        onGridVisibleChange(!gridVisible);
        return;
      }
      onThemeChange(nextDisplayControlThemeMode(theme));
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [
    gridVisible,
    keyboardShortcuts,
    onGridVisibleChange,
    onThemeChange,
    theme,
  ]);

  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className={cn(displayControlsRootClasses, className)}
      data-theme-mode={theme}
    >
      <Button
        role="secondary"
        size="sm"
        aria-label={gridVisible ? labels.hideGrid : labels.showGrid}
        aria-pressed={gridVisible}
        aria-keyshortcuts="G"
        onClick={() => onGridVisibleChange(!gridVisible)}
      >
        <span className={displayControlsButtonContentClasses}>
          <Kbd>G</Kbd>
          <span>{labels.grid}</span>
        </span>
      </Button>

      <Button
        role="secondary"
        size="sm"
        aria-label={`${labels.theme}: ${labels[theme]}`}
        aria-keyshortcuts="T"
        onClick={() => onThemeChange(nextDisplayControlThemeMode(theme))}
      >
        <span className={displayControlsButtonContentClasses}>
          <Kbd>T</Kbd>
          <span className={displayControlsLabelClasses}>{labels[theme]}</span>
        </span>
      </Button>
    </div>
  );
}
