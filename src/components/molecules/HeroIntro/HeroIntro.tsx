import type { ReactNode } from "react";
import { cn } from "../../../lib/cn";
import {
  heroIntroCopyClasses,
  heroIntroDisplayCopyClasses,
  heroIntroDisplayLeadClasses,
  heroIntroLeadClasses,
  heroIntroPageClasses,
  heroIntroRestClasses,
} from "./heroIntroStyles";

/** Layout-only — width and margin. Not for re-theming or forcing a line break. */
export type HeroIntroLayoutClassName = string;

/** `large` is the default marketing intro. `display` matches the gallery statement. */
export const heroIntroSteps = ["large", "display"] as const;
export type HeroIntroStep = (typeof heroIntroSteps)[number];

export interface HeroIntroProps {
  /**
   * First sentence. On `large`, stays on one line from `md` and may wrap below `md`.
   * On `display`, wraps when the page-grid measure is short.
   * The rest of the intro always starts on the next line.
   */
  lead: ReactNode;
  /** Rest of the intro. Always starts on a new line, on the same type step and leading. */
  children: ReactNode;
  /**
   * `large` — `type-large`, columns 4–9 from `lg`.
   * `display` — `type-display-2` at normal weight, full width of the page grid.
   * Same computed size as **ScrollHorizontal.Intro**. The sequenced hero uses this.
   */
  step?: HeroIntroStep;
  /** Layout only — width and margin. */
  className?: HeroIntroLayoutClassName;
}

/**
 * Centered marketing intro under the hero headline.
 * `lead` is line 1. `children` is line 2. The component owns the break.
 */
export function HeroIntro({ lead, children, step = "large", className }: HeroIntroProps) {
  const display = step === "display";
  return (
    <div className={cn(heroIntroPageClasses, className)}>
      <p className={display ? heroIntroDisplayCopyClasses : heroIntroCopyClasses}>
        <span className={display ? heroIntroDisplayLeadClasses : heroIntroLeadClasses}>{lead}</span>
        <span className={heroIntroRestClasses}>{children}</span>
      </p>
    </div>
  );
}
