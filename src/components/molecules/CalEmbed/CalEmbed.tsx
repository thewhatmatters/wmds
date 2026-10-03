import type { MouseEvent, ReactNode } from "react";
import { TextLink } from "../../atoms/TextLink/TextLink";
import { cn } from "../../../lib/cn";
import { typographyClass } from "../../../lib/typography";
import {
  calEmbedClasses,
  calEmbedEmptyClasses,
  calEmbedFrameClasses,
} from "./calEmbedStyles";

/** Layout-only — width or margin. */
export type CalEmbedLayoutClassName = string;

export const calEmbedSkipHref = "#email";
export const calEmbedSkipLabel = "Skip, just email me";
export const calEmbedEmptyTitle = "Booking isn’t available right now";
export const calEmbedEmptyDescription = "Skip this step and we’ll follow up by email.";

export interface CalEmbedSkipProps {
  /** Skip destination. Default `#email`. */
  skipHref?: string;
  /** Default `Skip, just email me`. */
  skipLabel?: string;
  /** In-flow skip. Prevents the href navigation when set. */
  onSkip?: () => void;
  className?: CalEmbedLayoutClassName;
}

export interface CalEmbedProps {
  /**
   * Embed slot. Mount the Cal.com embed here and theme it with `--color-brand`,
   * `--color-background-body`, and `--color-background-surface`. With no children the
   * frame shows the empty state, so visitors never see a blank or developer-facing frame.
   */
  children?: ReactNode;
  /** Empty-state heading when no embed is mounted. Default `Booking isn’t available right now`. */
  emptyTitle?: string;
  /** Empty-state supporting line. Default points visitors at the skip. */
  emptyDescription?: ReactNode;
  /**
   * Skip slot. Omit to render the default **TextLink** after the frame.
   * Pass `false` or **CalEmbed.Skip** when you place the skip yourself
   * (typically **Card.Footer**). CalEmbed does not render an in-body skip
   * when this slot is used.
   */
  skip?: ReactNode | false;
  /** Skip destination when the in-body skip is shown. Default `#email`. */
  skipHref?: string;
  /** Default `Skip, just email me` when the in-body skip is shown. */
  skipLabel?: string;
  /** In-flow skip when the in-body skip is shown. */
  onSkip?: () => void;
  className?: CalEmbedLayoutClassName;
}

function hasEmbed(children: ReactNode): boolean {
  return children !== undefined && children !== null && children !== false && children !== "";
}

function handleSkipClick(onSkip: (() => void) | undefined, event: MouseEvent<HTMLAnchorElement>) {
  if (onSkip == null) {
    return;
  }
  event.preventDefault();
  onSkip();
}

/**
 * Same **TextLink** CalEmbed uses after the frame. Place it in **Card.Footer**
 * and pass `skip={false}` (or `skip={<CalEmbed.Skip />}`) so the in-body link is omitted.
 */
export function CalEmbedSkip({
  skipHref = calEmbedSkipHref,
  skipLabel = calEmbedSkipLabel,
  onSkip,
  className,
}: CalEmbedSkipProps) {
  return (
    <TextLink
      href={skipHref}
      className={className}
      data-cal-embed-skip=""
      onClick={(event) => handleSkipClick(onSkip, event)}
    >
      {skipLabel}
    </TextLink>
  );
}

/**
 * Frame for a Cal.com embed, with an empty state when nothing is mounted.
 * Theme the embed with `--color-brand`, `--color-background-body`, and
 * `--color-background-surface` (existing tokens). The skip action is **TextLink**.
 */
function CalEmbedRoot({
  children,
  emptyTitle = calEmbedEmptyTitle,
  emptyDescription = calEmbedEmptyDescription,
  skip,
  skipHref = calEmbedSkipHref,
  skipLabel = calEmbedSkipLabel,
  onSkip,
  className,
}: CalEmbedProps) {
  return (
    <div className={cn(calEmbedClasses, className)} data-cal-embed="">
      <div className={calEmbedFrameClasses}>
        {hasEmbed(children) ? (
          children
        ) : (
          <div className={calEmbedEmptyClasses} data-cal-embed-empty="">
            <p className={typographyClass("subheading")}>{emptyTitle}</p>
            <p className={cn(typographyClass("caption"), "text-muted")}>{emptyDescription}</p>
          </div>
        )}
      </div>
      {skip === undefined ? (
        <CalEmbedSkip skipHref={skipHref} skipLabel={skipLabel} onSkip={onSkip} />
      ) : null}
    </div>
  );
}

export const CalEmbed = Object.assign(CalEmbedRoot, {
  Skip: CalEmbedSkip,
});
