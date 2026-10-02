import type { MouseEvent, ReactNode } from "react";
import { TextLink } from "../../atoms/TextLink/TextLink";
import { cn } from "../../../lib/cn";
import { typographyClass } from "../../../lib/typography";
import { calEmbedClasses, calEmbedFrameClasses } from "./calEmbedStyles";

/** Layout-only — width or margin. */
export type CalEmbedLayoutClassName = string;

export interface CalEmbedProps {
  /**
   * Embed slot. Mount Cal.com here. The frame keeps the theming note
   * so the placeholder stays readable before the embed script lands.
   */
  children?: ReactNode;
  /** Skip destination. Default `#email`. */
  skipHref?: string;
  /** Default `Skip, just email me`. */
  skipLabel?: string;
  /** In-flow skip. Prevents the href navigation when set. */
  onSkip?: () => void;
  className?: CalEmbedLayoutClassName;
}

/**
 * Placeholder for a Cal.com embed.
 * Theme the embed with `--color-brand`, `--color-background-body`, and
 * `--color-background-surface` (existing tokens). The skip action is **TextLink**.
 */
export function CalEmbed({
  children,
  skipHref = "#email",
  skipLabel = "Skip, just email me",
  onSkip,
  className,
}: CalEmbedProps) {
  function handleSkip(event: MouseEvent<HTMLAnchorElement>) {
    if (onSkip == null) {
      return;
    }
    event.preventDefault();
    onSkip();
  }

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
      <TextLink href={skipHref} onClick={handleSkip}>
        {skipLabel}
      </TextLink>
    </div>
  );
}
