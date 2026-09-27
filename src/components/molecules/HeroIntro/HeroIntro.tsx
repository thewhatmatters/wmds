import type { ReactNode } from "react";
import { cn } from "../../../lib/cn";
import {
  heroIntroCopyClasses,
  heroIntroLeadClasses,
  heroIntroPageClasses,
  heroIntroRestClasses,
} from "./heroIntroStyles";

/** Layout-only — width and margin. Not for re-theming or forcing a line break. */
export type HeroIntroLayoutClassName = string;

export interface HeroIntroProps {
  /**
   * First sentence. Stays on one line from `md`. May wrap below `md`.
   * The rest of the intro always starts on the next line.
   */
  lead: ReactNode;
  /** Rest of the intro. Always starts on a new line, on the same type step and leading. */
  children: ReactNode;
  /** Layout only — width and margin. */
  className?: HeroIntroLayoutClassName;
}

/**
 * Centered marketing intro under the hero headline.
 * `lead` is line 1. `children` is line 2. The component owns the break.
 */
export function HeroIntro({ lead, children, className }: HeroIntroProps) {
  return (
    <div className={cn(heroIntroPageClasses, className)}>
      <p className={heroIntroCopyClasses}>
        <span className={heroIntroLeadClasses}>{lead}</span>
        <span className={heroIntroRestClasses}>{children}</span>
      </p>
    </div>
  );
}
