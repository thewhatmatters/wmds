import type { ReactNode } from "react";
import { X } from "lucide-react";
import { IconButton } from "../../atoms/IconButton/IconButton";
import {
  Card,
  cardSubtitleClasses,
  cardTitleClasses,
} from "../../molecules/Card/Card";
import { cn } from "../../../lib/cn";
import {
  overlayPanelHeaderClasses,
  overlayPanelHeaderDelineatedInnerClasses,
  overlayPanelHeaderHairlineClasses,
  overlayPanelHeaderStartClusterClasses,
  overlayPanelHeaderStartSlotClasses,
} from "./dialogStyles";

export interface OverlayPanelHeaderProps {
  titleId: string;
  descriptionId: string;
  title?: ReactNode;
  description?: ReactNode;
  /** Title typography — default **Card** subheading (**AlertDialog** uses the same scale). */
  titleClassName?: string;
  /** Description typography — default caption under title. */
  descriptionClassName?: string;
  /** Leading slot — Lucide glyph, **Badge**, **Status**; same role as **Card.Header** `start`. */
  headerStart?: ReactNode;
  showClose?: boolean;
  closeLabel?: string;
  onClose?: () => void;
  /** Bottom hairline — under content chrome when a footer or scroll body follows. */
  delineated?: boolean;
  className?: string;
}

export function OverlayPanelHeader({
  titleId,
  descriptionId,
  title,
  description,
  titleClassName = cardTitleClasses,
  descriptionClassName = cardSubtitleClasses,
  headerStart,
  showClose = true,
  closeLabel = "Close",
  onClose,
  delineated = false,
  className,
}: OverlayPanelHeaderProps) {
  const hasTitle = title != null;
  const hasDescription = description != null;

  if (!hasTitle && !showClose && headerStart == null) {
    return null;
  }

  const header = (
    <Card.Header
      className={cn(
        overlayPanelHeaderClasses,
        delineated ? overlayPanelHeaderDelineatedInnerClasses : undefined,
        className,
      )}
      start={
        headerStart != null || hasTitle ? (
          <div className={overlayPanelHeaderStartClusterClasses}>
            {headerStart != null ? (
              <div className={overlayPanelHeaderStartSlotClasses}>{headerStart}</div>
            ) : null}
            {hasTitle ? (
              <div className="flex min-w-0 flex-col gap-0">
                <h2 id={titleId} className={titleClassName}>
                  {title}
                </h2>
                {hasDescription ? (
                  <p id={descriptionId} className={descriptionClassName}>
                    {description}
                  </p>
                ) : null}
              </div>
            ) : null}
          </div>
        ) : null
      }
      end={
        showClose ? (
          <IconButton
            size="sm"
            role="ghost"
            icon={<X strokeWidth={2} />}
            aria-label={closeLabel}
            onClick={() => onClose?.()}
          />
        ) : null
      }
    />
  );

  if (delineated) {
    return (
      <div className={cn(overlayPanelHeaderClasses, "w-full")}>
        {header}
        <hr className={overlayPanelHeaderHairlineClasses} aria-hidden="true" />
      </div>
    );
  }

  return header;
}
