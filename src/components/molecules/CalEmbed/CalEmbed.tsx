import type { MouseEvent, ReactNode } from "react";
import { TextLink } from "../../atoms/TextLink/TextLink";
import { cn } from "../../../lib/cn";
import { typographyClass } from "../../../lib/typography";
import { calEmbedClasses, calEmbedFrameClasses } from "./calEmbedStyles";

/** Layout-only — width or margin. */
export type CalEmbedLayoutClassName = string;

export const calEmbedSkipHref = "#email";
export const calEmbedSkipLabel = "Skip, just email me";

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
   * Embed slot. Mount Cal.com here. The frame keeps the theming note
   * so the placeholder stays readable before the embed script lands.
   */
  children?: ReactNode;
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
 * Placeholder for a Cal.com embed.
 * Theme the embed with `--color-brand`, `--color-background-body`, and
 * `--color-background-surface` (existing tokens). The skip action is **TextLink**.
 */
function CalEmbedRoot({
  children,
  skip,
  skipHref = calEmbedSkipHref,
  skipLabel = calEmbedSkipLabel,
  onSkip,
  className,
}: CalEmbedProps) {
  return (
    <div className={cn(calEmbedClasses, className)} data-cal-embed="">
      <div className={calEmbedFrameClasses}>
        <div className="flex flex-col gap-2">
          <p className={typographyClass("subheading")}>Calendar</p>
          <p className={typographyClass("caption")}>
            Cal.com mounts in this frame. Theme it with --color-brand,
            --color-background-body, and --color-background-surface.
          </p>
        </div>
        {children}
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
