import {
  useCallback,
  useEffect,
  useRef,
  type MouseEvent,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { cn } from "../../../lib/cn";
import {
  focusInitialElement,
  focusMainContent,
  inertPageBehind,
  lockBodyScroll,
  trapFocus,
} from "../../../lib/dialogOverlay";
import { motionTransitionProp } from "../../../lib/motion";
import {
  overlayPanelBodyScrollClasses,
  overlayPanelChromeClasses,
  overlayPanelFooterClasses,
  overlayPanelFooterDelineatedInnerClasses,
  overlayPanelFooterDelineatedShellClasses,
  overlayPanelFooterHairlineClasses,
  overlayPanelSectionStackClasses,
} from "../Dialog/dialogStyles";
import { OverlayPanelHeader } from "../Dialog/OverlayPanelHeader";
import { SheetProvider, useSheetContext, useSheetLabelIds } from "./SheetContext";
import {
  sheetBackdropClasses,
  sheetEndBackdropClasses,
  sheetOverlayRootClasses,
  sheetPanelBaseClasses,
  sheetPanelMotionTransition,
  sheetPanelMotionVariants,
  sheetPanelPlacementClasses,
  sheetPanelReducedMotionVariants,
  sheetPanelSizeClasses,
  sheetSafeAreaBottomClasses,
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
  /** Actions before the close — **IconButton** `size="sm"` or **Button** `size="xs"` (share, open in full, previous / next). */
  headerActions?: ReactNode;
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

  const reduceMotion = useReducedMotion();
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
    const restorePage = panel != null ? inertPageBehind(panel) : () => undefined;

    let releaseFocusTrap: () => void = () => {};
    let initialFocusFrame = 0;
    if (panel != null) {
      releaseFocusTrap = trapFocus(panel);
      initialFocusFrame = window.requestAnimationFrame(() => {
        focusInitialElement(panel);
      });
    }

    return () => {
      window.cancelAnimationFrame(initialFocusFrame);
      releaseFocusTrap();
      restorePage();
      unlockScroll();
      const previous = previousFocusRef.current;
      if (previous != null && previous.isConnected && previous !== document.body) {
        previous.focus();
      } else {
        // A deep link has no opener to return to. Move focus once the page is
        // un-inert and the close has committed, so it is not dropped to <body>.
        focusMainContent();
        window.requestAnimationFrame(() => {
          const active = document.activeElement;
          if (active == null || active === document.body || panel?.contains(active)) {
            focusMainContent();
          }
        });
      }
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
    // Keep the press from moving focus to the page after close() has returned it to the opener.
    event.preventDefault();
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
          <div
            className={side === "end" ? sheetEndBackdropClasses : sheetBackdropClasses}
            aria-hidden="true"
          />
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
            variants={
              reduceMotion === true
                ? sheetPanelReducedMotionVariants
                : sheetPanelMotionVariants(side)
            }
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
  headerActions,
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
  const safeArea = side === "end" ? sheetSafeAreaBottomClasses : undefined;

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
          footer == null ? safeArea : undefined,
          className,
        )}
      >
        <OverlayPanelHeader
          titleId={titleId}
          descriptionId={descriptionId}
          title={title}
          description={description}
          headerStart={headerStart}
          headerEnd={headerActions}
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
          hasScrollBody ? (
            <footer className={overlayPanelFooterDelineatedShellClasses}>
              <hr className={overlayPanelFooterHairlineClasses} aria-hidden="true" />
              <div className={cn(overlayPanelFooterDelineatedInnerClasses, safeArea)}>
                {footer}
              </div>
            </footer>
          ) : (
            <footer className={cn(overlayPanelFooterClasses, "pb-4", safeArea)}>{footer}</footer>
          )
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
