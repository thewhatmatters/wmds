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
   * When `children` is passed, the rest of the intro starts on the next line.
   */
  lead: ReactNode;
  /**
   * Rest of the intro. When present, starts on a new line, on the same type step and leading.
   * Omit it when the heading is only the lead, as on the sequenced hero.
   */
  children?: ReactNode;
  /**
   * `large` — `type-display-2` at normal weight, columns 4–9 from `lg`. The default hero.
   * `display` — the same size, full width of the page grid. The sequenced hero.
   * Both match the computed font-size and line-height of **ScrollHorizontal.Intro**.
   */
  step?: HeroIntroStep;
  /** Layout only — width and margin. */
  className?: HeroIntroLayoutClassName;
}

/**
 * Marketing hero heading. `lead` is the first line. `children`, when passed, is the next line.
 * The component owns the break. This is the page `h1`.
 */
export function HeroIntro({ lead, children, step = "large", className }: HeroIntroProps) {
  const display = step === "display";
  const rest = children != null && children !== false;
  return (
    <div className={cn(heroIntroPageClasses, className)}>
      <h1 className={display ? heroIntroDisplayCopyClasses : heroIntroCopyClasses}>
        <span className={display ? heroIntroDisplayLeadClasses : heroIntroLeadClasses}>{lead}</span>
        {rest ? <span className={heroIntroRestClasses}>{children}</span> : null}
      </h1>
    </div>
  );
}
