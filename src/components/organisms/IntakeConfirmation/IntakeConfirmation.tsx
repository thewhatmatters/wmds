"use client";

import type { ReactNode } from "react";

import { Badge } from "../../atoms/Badge/Badge";
import { Button } from "../../atoms/Button/Button";
import { TextLink } from "../../atoms/TextLink/TextLink";
import { cn } from "../../../lib/cn";
import { useConfettiOnMount } from "../Confetti/Confetti";
import {
  intakeConfirmationActionsClasses,
  intakeConfirmationBodyClasses,
  intakeConfirmationClasses,
  intakeConfirmationCopy,
  intakeConfirmationMetaClasses,
  intakeConfirmationReplyTime,
  intakeConfirmationTitleClasses,
  intakeConfettiColors,
  type IntakeConfirmationVariant,
} from "./intakeConfirmationStyles";

export {
  intakeConfirmationCopy,
  intakeConfirmationReplyTime,
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
  /** Booked time label — shown when set (typically with `variant="booked"`). */
  bookingTime?: string;
  /** Join-video URL — rendered as **TextLink**. */
  videoHref?: string;
  /** Label for the video link. Default `Join video call`. */
  videoLabel?: string;
  /** Google Calendar URL — rendered as **TextLink**. */
  googleCalendarHref?: string;
  /** Label for the Google Calendar link. Default `Add to Google Calendar`. */
  googleCalendarLabel?: string;
  /** `.ics` download URL — rendered as **Button** `render={<a/>}`. */
  icsHref?: string;
  /** Label for the `.ics` action. Default `Download .ics`. */
  icsLabel?: string;
  /**
   * When we'll reply (Contact and booking forms T3). Default "We reply within one business day." on
   * `emailed`; pass `null` to leave it out. Never promise what you don't keep.
   */
  replyTime?: string | null;
  /** What we got: a short recap of their request (e.g. "A new site before spring"). */
  summary?: ReactNode;
  /** How to reach us meanwhile: phone, email, hours (T1, T3). */
  contact?: ReactNode;
  className?: IntakeConfirmationLayoutClassName;
}

/**
 * Confirmation surface. Fires one Confetti burst when it mounts.
 * Reduced motion leaves the static copy and skips the burst.
 * Optional booking actions reuse **TextLink** and **Button** — no new confirmation style.
 * Mount **ConfettiProvider** above this component.
 */
export function IntakeConfirmation({
  variant,
  onDone,
  bookingTime,
  videoHref,
  videoLabel = "Join video call",
  googleCalendarHref,
  googleCalendarLabel = "Add to Google Calendar",
  icsHref,
  icsLabel = "Download .ics",
  replyTime,
  summary,
  contact,
  className,
}: IntakeConfirmationProps) {
  const copy = intakeConfirmationCopy[variant];
  const reply = replyTime === undefined ? (variant === "emailed" ? intakeConfirmationReplyTime : null) : replyTime;
  const hasActions =
    bookingTime != null ||
    videoHref != null ||
    googleCalendarHref != null ||
    icsHref != null;

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
      {summary != null ? <p className={intakeConfirmationMetaClasses}>{summary}</p> : null}
      {reply != null ? <p className={intakeConfirmationBodyClasses}>{reply}</p> : null}
      {hasActions ? (
        <div className={intakeConfirmationActionsClasses}>
          {bookingTime != null ? (
            <p className={intakeConfirmationMetaClasses}>{bookingTime}</p>
          ) : null}
          {videoHref != null ? (
            <TextLink href={videoHref} external>
              {videoLabel}
            </TextLink>
          ) : null}
          {googleCalendarHref != null ? (
            <TextLink href={googleCalendarHref} external>
              {googleCalendarLabel}
            </TextLink>
          ) : null}
          {icsHref != null ? (
            <Button role="secondary" size="md" render={<a href={icsHref} download />}>
              {icsLabel}
            </Button>
          ) : null}
        </div>
      ) : null}
      {contact != null ? <div className={intakeConfirmationMetaClasses}>{contact}</div> : null}
      {onDone != null ? (
        <Button role="primary" type="button" onClick={onDone}>
          Done
        </Button>
      ) : null}
    </div>
  );
}
