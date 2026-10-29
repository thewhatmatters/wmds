import type { ReactNode } from "react";
import { cn } from "../../../lib/cn";
import {
  heroIntroActionsClasses,
  heroIntroCopyClasses,
  heroIntroDescriptionClasses,
  heroIntroDisplayDescriptionClasses,
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
   * The heading's first line. Wraps when the measure is shorter than the line, including from `md`.
   * When `children` is passed, the rest of the heading starts on the next line.
   */
  firstLine?: ReactNode;
  /** @deprecated Renamed to `firstLine` in 0.4.30 (it's the heading's first line, not a lead paragraph). */
  lead?: ReactNode;
  /**
   * Rest of the heading. When present, starts on a new line, on the same type step and leading.
   * Omit it when the heading is only the first line, as on the sequenced hero.
   */
  children?: ReactNode;
  /**
   * Optional lead paragraph under the heading: `type-lead` in ink (Lead paragraph rule, L7/L8). One or two
   * sentences that summarise the page.
   */
  description?: ReactNode;
  /**
   * Optional CTA row under the heading (and the description): one primary **Button** and an optional
   * secondary, usually `role="outline"` (Hero rule R2). Left on phones, centred from `md`.
   */
  actions?: ReactNode;
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
 * Marketing hero heading. `firstLine` is the first line. `children`, when passed, is the next line.
 * `description`, when passed, is a lead paragraph under the heading, and `actions` the CTA row under that.
 * The component owns the break.
 * This is the page `h1`.
 */
export function HeroIntro({ firstLine, lead, children, description, actions, step = "large", className }: HeroIntroProps) {
  if (lead !== undefined && firstLine === undefined && typeof process !== "undefined" && process.env?.NODE_ENV !== "production") {
    console.warn("[WMDS HeroIntro] `lead` is renamed to `firstLine` (0.4.30); `lead` still works for now.");
  }
  const first = firstLine ?? lead;
  const display = step === "display";
  const rest = children != null && children !== false;
  return (
    <div className={cn(heroIntroPageClasses, className)}>
      <h1 className={display ? heroIntroDisplayCopyClasses : heroIntroCopyClasses}>
        <span className={display ? heroIntroDisplayLeadClasses : heroIntroLeadClasses}>{first}</span>
        {rest ? <span className={heroIntroRestClasses}>{children}</span> : null}
      </h1>
      {description != null ? <p className={display ? heroIntroDisplayDescriptionClasses : heroIntroDescriptionClasses}>{description}</p> : null}
      {actions != null ? (
        <div className={heroIntroActionsClasses} data-slot="actions">
          {actions}
        </div>
      ) : null}
    </div>
  );
}
