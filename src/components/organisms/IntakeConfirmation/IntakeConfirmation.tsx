"use client";

import { Badge } from "../../atoms/Badge/Badge";
import { Button } from "../../atoms/Button/Button";
import { cn } from "../../../lib/cn";
import { useConfettiOnMount } from "../Confetti/Confetti";
import {
  intakeConfirmationBodyClasses,
  intakeConfirmationClasses,
  intakeConfirmationCopy,
  intakeConfirmationTitleClasses,
  intakeConfettiColors,
  type IntakeConfirmationVariant,
} from "./intakeConfirmationStyles";

export {
  intakeConfirmationCopy,
  intakeConfirmationVariants,
  intakeConfettiColors,
  type IntakeConfirmationVariant,
} from "./intakeConfirmationStyles";

/** Layout-only — width or margin. */
export type IntakeConfirmationLayoutClassName = string;

export interface IntakeConfirmationProps {
  /** `booked` after a calendar confirm. `emailed` after the skip link. */
  variant: IntakeConfirmationVariant;
  /** Closes the intake. Omitted in a static specimen. */
  onDone?: () => void;
  className?: IntakeConfirmationLayoutClassName;
}

/**
 * Confirmation surface. Fires one Confetti burst when it mounts.
 * Reduced motion leaves the static copy and skips the burst.
 * Mount **ConfettiProvider** above this component.
 */
export function IntakeConfirmation({
  variant,
  onDone,
  className,
}: IntakeConfirmationProps) {
  const copy = intakeConfirmationCopy[variant];

  useConfettiOnMount({
    particleCount: 90,
    spread: 180,
    startVelocity: 28,
    colors: [...intakeConfettiColors],
    origin: {
      x: typeof window === "undefined" ? 0 : window.innerWidth / 2,
      y: 0,
    },
  });

  return (
    <div
      className={cn(intakeConfirmationClasses, className)}
      data-intake-confirmation={variant}
    >
      <Badge variant={variant === "booked" ? "neutral" : "info"} emphasis="muted">
        {copy.badge}
      </Badge>
      <h2 className={intakeConfirmationTitleClasses}>{copy.title}</h2>
      <p className={intakeConfirmationBodyClasses}>{copy.body}</p>
      {onDone != null ? (
        <Button role="primary" type="button" onClick={onDone}>
          Done
        </Button>
      ) : null}
    </div>
  );
}
