import {
  useCallback,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "../../../lib/cn";
import {
  overlayPanelBodyScrollClasses,
  overlayPanelChromeClasses,
  overlayPanelFooterClasses,
  overlayPanelSectionStackClasses,
} from "../Dialog/dialogStyles";
import { OverlayPanelHeader } from "../Dialog/OverlayPanelHeader";
import { PanelProvider, usePanelContext, usePanelLabelIds } from "./PanelContext";
import {
  panelFooterClasses,
  panelMotionTransition,
  panelMotionVariants,
  panelPlacementClasses,
  panelRootClasses,
  panelShellClasses,
  panelSides,
  panelSizeClasses,
  panelSizes,
  type PanelSide,
  type PanelSize,
} from "./panelStyles";

export type { PanelSide, PanelSize } from "./panelStyles";
export { panelSides, panelSizes };

/** Layout-only — placement and size own dimensions. */
export type PanelLayoutClassName = string;

export interface PanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Close on Escape — default `true`. */
  dismissOnEscape?: boolean;
  children: ReactNode;
}

export interface PanelContentProps {
  /** Edge attachment — default `end`. Side rails only (no `bottom` — use **Sheet**). */
  side?: PanelSide;
  size?: PanelSize;
  title?: ReactNode;
  description?: ReactNode;
  headerStart?: ReactNode;
  showClose?: boolean;
  footer?: ReactNode;
  className?: PanelLayoutClassName;
  children?: ReactNode;
}

function PanelPortal({
  side,
  size,
  "aria-labelledby": ariaLabelledBy,
  "aria-describedby": ariaDescribedBy,
  children,
}: {
  side: PanelSide;
  size: PanelSize;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
  children: ReactNode;
}) {
  const { open, onOpenChange, dismissOnEscape, triggerRef } = usePanelContext("PanelPortal");

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

    return () => {
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

  if (typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <AnimatePresence>
      {open ? (
        <motion.div
          className={panelRootClasses[side]}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={panelMotionTransition(side)}
        >
          <motion.div
            ref={panelRef}
            className={cn(
              panelShellClasses,
              panelPlacementClasses[side],
              panelSizeClasses(side, size),
              overlayPanelChromeClasses,
            )}
            role="dialog"
            aria-modal="false"
            aria-labelledby={ariaLabelledBy}
            aria-describedby={ariaDescribedBy}
            variants={panelMotionVariants(side)}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={panelMotionTransition(side)}
          >
            {children}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}

function PanelRoot({
  open,
  onOpenChange,
  dismissOnEscape = true,
  children,
}: PanelProps) {
  const { titleId, descriptionId } = usePanelLabelIds("panel");
  const triggerRef = useRef<HTMLElement | null>(null);

  return (
    <PanelProvider
      value={{
        open,
        onOpenChange,
        titleId,
        descriptionId,
        dismissOnEscape,
        triggerRef,
      }}
    >
      {children}
    </PanelProvider>
  );
}

function PanelTrigger({
  children,
  className,
}: {
  children: ReactNode;
  className?: PanelLayoutClassName;
}) {
  const { onOpenChange, triggerRef } = usePanelContext("Panel.Trigger");

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

function PanelContent({
  side = "end",
  size = "md",
  title,
  description,
  headerStart,
  showClose = true,
  footer,
  className,
  children,
}: PanelContentProps) {
  const { titleId, descriptionId, onOpenChange } = usePanelContext("Panel.Content");
  const hasTitle = title != null;
  const hasDescription = description != null;
  const hasScrollBody = children != null || (!hasTitle && hasDescription);
  const hasFooter = footer != null;

  return (
    <PanelPortal
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
          closeLabel="Close panel"
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
              hasScrollBody ? panelFooterClasses : overlayPanelFooterClasses,
              "pb-4",
            )}
          >
            {footer}
          </footer>
        ) : null}
      </div>
    </PanelPortal>
  );
}

/**
 * Persistent edge flyover — no scrim, no scroll lock, no focus trap.
 * Page stays interactive; use **Sheet** when the flow should block the canvas.
 */
export const Panel = Object.assign(PanelRoot, {
  Trigger: PanelTrigger,
  Content: PanelContent,
});
