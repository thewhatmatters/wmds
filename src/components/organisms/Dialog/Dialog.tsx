import {
  useCallback,
  useEffect,
  useRef,
  type MouseEvent,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import {
  Card,
} from "../../molecules/Card/Card";
import { cn } from "../../../lib/cn";
import {
  focusInitialElement,
  lockBodyScroll,
  trapFocus,
} from "../../../lib/dialogOverlay";
import { motionTransitionProp } from "../../../lib/motion";
import { DialogProvider, useDialogContext, useDialogLabelIds } from "./DialogContext";
import { OverlayPanelHeader } from "./OverlayPanelHeader";
import {
  dialogBackdropClasses,
  dialogOverlayRootClasses,
  dialogPanelSizeClasses,
  dialogSizes,
  overlayPanelChromeClasses,
  overlayPanelDialogBodyScrollClasses,
  overlayPanelDialogFooterClasses,
  overlayPanelMaxHeightClasses,
  dialogPanelShellClasses,
  type DialogSize,
} from "./dialogStyles";

export type { DialogSize } from "./dialogStyles";
export { dialogSizes };

/** Layout-only — max-width lives on `size`; not for surface overrides. */
export type DialogLayoutClassName = string;

export interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Close when the scrim is clicked — default `true`. AlertDialog sets `false`. */
  dismissOnBackdrop?: boolean;
  /** Close on Escape — default `true`. */
  dismissOnEscape?: boolean;
  children: ReactNode;
}

export interface DialogContentProps {
  /** Title row copy — wired to `aria-labelledby`. */
  title?: ReactNode;
  /** Supporting copy under title — wired to `aria-describedby` when present. */
  description?: ReactNode;
  /** Leading header slot — icon, **Badge**, **Status** (**Card.Header** `start`). */
  headerStart?: ReactNode;
  /** Header dismiss — default `true` for generic dialogs. */
  showClose?: boolean;
  /** Footer action cluster — compose **Button** roles. */
  footer?: ReactNode;
  size?: DialogSize;
  className?: DialogLayoutClassName;
  children?: ReactNode;
}

export interface DialogPortalProps {
  role: "dialog" | "alertdialog";
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
  initialFocusSelector?: string;
  children: ReactNode;
}

/** Portal + scrim + focus trap — shared by **Dialog.Content** and **AlertDialog**. */
export function DialogPortal({
  role,
  "aria-labelledby": ariaLabelledBy,
  "aria-describedby": ariaDescribedBy,
  initialFocusSelector,
  children,
}: DialogPortalProps) {
  const {
    open,
    onOpenChange,
    dismissOnBackdrop,
    dismissOnEscape,
    triggerRef,
  } = useDialogContext("DialogPortal");

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
        focusInitialElement(panel, initialFocusSelector);
      });
    }

    return () => {
      releaseFocusTrap();
      unlockScroll();
      previousFocusRef.current?.focus?.();
    };
  }, [initialFocusSelector, open, triggerRef]);

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
          className={dialogOverlayRootClasses}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={motionTransitionProp("medium")}
          onMouseDown={handleBackdropClick}
        >
          <div className={dialogBackdropClasses} aria-hidden="true" />
          <motion.div
            ref={panelRef}
            className="relative z-[1] flex w-full justify-center"
            role={role}
            aria-modal="true"
            aria-labelledby={ariaLabelledBy}
            aria-describedby={ariaDescribedBy}
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 4 }}
            transition={motionTransitionProp("medium")}
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

function DialogRoot({
  open,
  onOpenChange,
  dismissOnBackdrop = true,
  dismissOnEscape = true,
  children,
}: DialogProps) {
  const { titleId, descriptionId } = useDialogLabelIds("dialog");
  const triggerRef = useRef<HTMLElement | null>(null);

  return (
    <DialogProvider
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
    </DialogProvider>
  );
}

function DialogTrigger({
  children,
  className,
}: {
  children: ReactNode;
  className?: DialogLayoutClassName;
}) {
  const { onOpenChange, triggerRef } = useDialogContext("Dialog.Trigger");

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

function DialogContent({
  title,
  description,
  headerStart,
  showClose = true,
  footer,
  size = "md",
  className,
  children,
}: DialogContentProps) {
  const { titleId, descriptionId, onOpenChange } = useDialogContext("Dialog.Content");
  const hasTitle = title != null;
  const hasDescription = description != null;
  const hasScrollBody = children != null || (!hasTitle && hasDescription);
  const hasFooter = footer != null;
  /** Flex body slot — pins footer to panel bottom (same rhythm as **AlertDialog**). */
  const showBodySlot = hasScrollBody || hasFooter;

  return (
    <DialogPortal
      role="dialog"
      aria-labelledby={hasTitle ? titleId : undefined}
      aria-describedby={hasDescription ? descriptionId : undefined}
    >
      <Card
        padding="none"
        bodyTerminal={footer == null}
        className={cn(
          dialogPanelSizeClasses[size],
          overlayPanelChromeClasses,
          overlayPanelMaxHeightClasses,
          dialogPanelShellClasses,
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
          closeLabel="Close dialog"
          onClose={() => onOpenChange(false)}
        />

        {showBodySlot ? (
          <div className={overlayPanelDialogBodyScrollClasses}>
            {!hasTitle && hasDescription ? (
              <p id={descriptionId} className="text-muted">
                {description}
              </p>
            ) : null}
            {children}
          </div>
        ) : null}

        {hasFooter ? (
          <footer className={overlayPanelDialogFooterClasses}>{footer}</footer>
        ) : null}
      </Card>
    </DialogPortal>
  );
}

/**
 * Modal overlay — portal scrim, focus trap, scroll lock; composes **Card** shell.
 * Composes **Card** shell + portal scrim; use **AlertDialog** for blocking confirms.
 */
export const Dialog = Object.assign(DialogRoot, {
  Trigger: DialogTrigger,
  Content: DialogContent,
});
