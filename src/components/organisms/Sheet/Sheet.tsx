import {
  useCallback,
  useEffect,
  useRef,
  type MouseEvent,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "../../../lib/cn";
import {
  focusInitialElement,
  lockBodyScroll,
  trapFocus,
} from "../../../lib/dialogOverlay";
import { motionTransitionProp } from "../../../lib/motion";
import {
  overlayPanelBodyScrollClasses,
  overlayPanelChromeClasses,
  overlayPanelFooterClasses,
  overlayPanelSectionStackClasses,
} from "../Dialog/dialogStyles";
import { OverlayPanelHeader } from "../Dialog/OverlayPanelHeader";
import { SheetProvider, useSheetContext, useSheetLabelIds } from "./SheetContext";
import {
  sheetBackdropClasses,
  sheetOverlayRootClasses,
  sheetPanelBaseClasses,
  sheetPanelFooterClasses,
  sheetPanelMotionTransition,
  sheetPanelMotionVariants,
  sheetPanelPlacementClasses,
  sheetPanelSizeClasses,
  sheetSides,
  sheetSizes,
  type SheetSide,
  type SheetSize,
} from "./sheetStyles";

export type { SheetSide, SheetSize } from "./sheetStyles";
export { sheetSides, sheetSizes };

/** Layout-only — placement and size own dimensions. */
export type SheetLayoutClassName = string;

export interface SheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Close when the scrim is clicked — default `true`. */
  dismissOnBackdrop?: boolean;
  /** Close on Escape — default `true`. */
  dismissOnEscape?: boolean;
  children: ReactNode;
}

export interface SheetContentProps {
  /** Edge attachment — default `bottom`. Side sheets are full viewport height. */
  side?: SheetSide;
  /** Cross-axis size — width (`end` / `start`) or max-height (`bottom`). */
  size?: SheetSize;
  title?: ReactNode;
  description?: ReactNode;
  /** Leading header slot — icon, **Badge**, **Status** (**Card.Header** `start`). */
  headerStart?: ReactNode;
  showClose?: boolean;
  footer?: ReactNode;
  className?: SheetLayoutClassName;
  children?: ReactNode;
}

function SheetPortal({
  side,
  size,
  "aria-labelledby": ariaLabelledBy,
  "aria-describedby": ariaDescribedBy,
  children,
}: {
  side: SheetSide;
  size: SheetSize;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
  children: ReactNode;
}) {
  const {
    open,
    onOpenChange,
    dismissOnBackdrop,
    dismissOnEscape,
    triggerRef,
  } = useSheetContext("SheetPortal");

  const panelRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const close = useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    previousFocusRef.current =
      triggerRef.current ?? (document.activeElement as HTMLElement | null);

    const unlockScroll = lockBodyScroll();
    const panel = panelRef.current;

    let releaseFocusTrap: () => void = () => {};
    if (panel != null) {
      releaseFocusTrap = trapFocus(panel);
      window.requestAnimationFrame(() => {
        focusInitialElement(panel);
      });
    }

    return () => {
      releaseFocusTrap();
      unlockScroll();
      previousFocusRef.current?.focus?.();
    };
  }, [open, triggerRef]);

  useEffect(() => {
    if (!open || !dismissOnEscape) {
      return undefined;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [close, dismissOnEscape, open]);

  function handleBackdropClick(event: MouseEvent<HTMLDivElement>) {
    if (!dismissOnBackdrop) {
      return;
    }
    const target = event.target as Node;
    if (panelRef.current?.contains(target)) {
      return;
    }
    close();
  }

  if (typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <AnimatePresence>
      {open ? (
        <motion.div
          className={sheetOverlayRootClasses[side]}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={motionTransitionProp("medium")}
          onMouseDown={handleBackdropClick}
        >
          <div className={sheetBackdropClasses} aria-hidden="true" />
          <motion.div
            ref={panelRef}
            className={cn(
              sheetPanelBaseClasses,
              sheetPanelPlacementClasses[side],
              sheetPanelSizeClasses[side][size],
              overlayPanelChromeClasses,
              "relative z-[1]",
            )}
            role="dialog"
            aria-modal="true"
            aria-labelledby={ariaLabelledBy}
            aria-describedby={ariaDescribedBy}
            variants={sheetPanelMotionVariants(side)}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={sheetPanelMotionTransition(side)}
            onMouseDown={(event) => {
              event.stopPropagation();
            }}
          >
            {children}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}

function SheetRoot({
  open,
  onOpenChange,
  dismissOnBackdrop = true,
  dismissOnEscape = true,
  children,
}: SheetProps) {
  const { titleId, descriptionId } = useSheetLabelIds("sheet");
  const triggerRef = useRef<HTMLElement | null>(null);

  return (
    <SheetProvider
      value={{
        open,
        onOpenChange,
        titleId,
        descriptionId,
        dismissOnBackdrop,
        dismissOnEscape,
        triggerRef,
      }}
    >
      {children}
    </SheetProvider>
  );
}

function SheetTrigger({
  children,
  className,
}: {
  children: ReactNode;
  className?: SheetLayoutClassName;
}) {
  const { onOpenChange, triggerRef } = useSheetContext("Sheet.Trigger");

  return (
    <span
      ref={triggerRef}
      className={className}
      onClick={(event) => {
        const target = event.target as HTMLElement;
        const focusTarget = target.closest("button, a[href]");
        if (focusTarget instanceof HTMLElement) {
          triggerRef.current = focusTarget;
        }
        onOpenChange(true);
      }}
    >
      {children}
    </span>
  );
}

function SheetContent({
  side = "bottom",
  size = "md",
  title,
  description,
  headerStart,
  showClose = true,
  footer,
  className,
  children,
}: SheetContentProps) {
  const { titleId, descriptionId, onOpenChange } = useSheetContext("Sheet.Content");
  const hasTitle = title != null;
  const hasDescription = description != null;
  const hasScrollBody = children != null || (!hasTitle && hasDescription);
  const hasFooter = footer != null;

  return (
    <SheetPortal
      side={side}
      size={size}
      aria-labelledby={hasTitle ? titleId : undefined}
      aria-describedby={hasDescription ? descriptionId : undefined}
    >
      <div
        className={cn(
          overlayPanelSectionStackClasses,
          footer == null ? "pb-4" : undefined,
          className,
        )}
      >
        <OverlayPanelHeader
          titleId={titleId}
          descriptionId={descriptionId}
          title={title}
          description={description}
          headerStart={headerStart}
          showClose={showClose}
          closeLabel="Close sheet"
          onClose={() => onOpenChange(false)}
          delineated={hasScrollBody || hasFooter}
        />

        {hasScrollBody ? (
          <div className={overlayPanelBodyScrollClasses}>
            {!hasTitle && hasDescription ? (
              <p id={descriptionId} className="text-muted">
                {description}
              </p>
            ) : null}
            {children}
          </div>
        ) : null}

        {hasFooter ? (
          <footer
            className={cn(
              hasScrollBody ? sheetPanelFooterClasses : overlayPanelFooterClasses,
              "pb-4",
            )}
          >
            {footer}
          </footer>
        ) : null}
      </div>
    </SheetPortal>
  );
}

/**
 * Edge-attached dismissible overlay — bottom drawer or side sheet.
 * Shares scrim/focus/scroll lock with **Dialog**; reserve **Panel** for a future persistent flyover pattern.
 */
export const Sheet = Object.assign(SheetRoot, {
  Trigger: SheetTrigger,
  Content: SheetContent,
});
