import { cn } from "../../../lib/cn";

/**
 * Brand colors for the intake burst. `--color-brand` is #011272 in both themes.
 * Passed to the existing Confetti `colors` option — not a second palette token.
 */
export const intakeConfettiColors = [
  "var(--color-brand)",
  "var(--color-brand-soft)",
  "var(--color-primary)",
  "var(--color-info-muted)",
  "var(--color-accent)",
  "var(--color-chart-categorical-1)",
  "var(--color-chart-categorical-4)",
] as const;

export const intakeConfirmationVariants = ["booked", "emailed"] as const;

export type IntakeConfirmationVariant = (typeof intakeConfirmationVariants)[number];

export const intakeConfirmationCopy: Record<
  IntakeConfirmationVariant,
  { badge: string; title: string; body: string }
> = {
  booked: {
    badge: "Booked",
    title: "You're booked",
    body: "The time is on the calendar. We'll send a short note so you know what to bring.",
  },
  emailed: {
    badge: "Sent",
    title: "We'll be in touch",
    body: "No calendar needed. We'll reply by email with a few times that fit.",
  },
};

export const intakeConfirmationClasses = cn(
  "flex w-full max-w-3xl flex-col items-center gap-8 text-center",
);

/** Existing display-2 — the confirmation headline, larger than the step titles. */
export const intakeConfirmationTitleClasses = "type-display-2 text-balance text-fg";

/** Existing heading-2 — the confirmation sentence under the headline. */
export const intakeConfirmationBodyClasses = "type-heading-2 max-w-2xl text-balance text-fg";
