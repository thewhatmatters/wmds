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

/** `large` is the default marketing intro. `display` is the full-width sequenced hero. Both are `type-display-2`. */
export const heroIntroSteps = ["large", "display"] as const;
export type HeroIntroStep = (typeof heroIntroSteps)[number];

export interface HeroIntroProps {
  /**
   * First sentence. Wraps when the measure is shorter than the line, including from `md`.
   * The rest of the intro always starts on the next line.
   */
  lead: ReactNode;
  /** Rest of the intro. Always starts on a new line, on the same type step and leading. */
  children: ReactNode;
  /**
   * `large` — `type-display-2` at normal weight, columns 4–9 from `lg`. The default hero.
   * `display` — the same size, full width of the page grid. The sequenced hero.
   * Both match the computed font-size of **ScrollHorizontal.Intro**.
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
