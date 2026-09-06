import { useRef, type ReactNode } from "react";
import { Button } from "../../atoms/Button/Button";
import { Card } from "../../molecules/Card/Card";
import { cn } from "../../../lib/cn";
import { DialogPortal } from "./Dialog";
import { DialogProvider, useDialogLabelIds } from "./DialogContext";
import {
  alertDialogTitleClasses,
  dialogPanelSizeClasses,
  dialogPanelShellClasses,
  dialogBodyMutedClasses,
  overlayPanelChromeClasses,
  overlayPanelDialogBodyScrollClasses,
  overlayPanelDialogFooterClasses,
  overlayPanelMaxHeightClasses,
} from "./dialogStyles";
import { OverlayPanelHeader } from "./OverlayPanelHeader";

export const alertDialogConfirmRoles = ["primary", "destructive"] as const;

export type AlertDialogConfirmRole = (typeof alertDialogConfirmRoles)[number];

/** Layout-only — not for surface overrides. */
export type AlertDialogLayoutClassName = string;

export interface AlertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: ReactNode;
  description?: ReactNode;
  cancelLabel?: string;
  confirmLabel: string;
  /** Confirm button role — default `primary`; use `destructive` for irreversible actions. */
  confirmRole?: AlertDialogConfirmRole;
  onConfirm: () => void;
  onCancel?: () => void;
  confirmStatus?: "loading";
  confirmDisabled?: boolean;
  cancelDisabled?: boolean;
  /** Scrim click — default `false` (blocking). */
  dismissOnBackdrop?: boolean;
  /** Escape — default `true`. */
  dismissOnEscape?: boolean;
  className?: AlertDialogLayoutClassName;
}

/**
 * Blocking confirm dialog — [Astryx AlertDialog](https://astryx.atmeta.com/components/AlertDialog).
 * Opinionated title + description + cancel/confirm footer on the shared overlay primitive.
 */
export function AlertDialog({
  open,
  onOpenChange,
  title,
  description,
  cancelLabel = "Cancel",
  confirmLabel,
  confirmRole = "primary",
  onConfirm,
  onCancel,
  confirmStatus,
  confirmDisabled = false,
  cancelDisabled = false,
  dismissOnBackdrop = false,
  dismissOnEscape = true,
  className,
}: AlertDialogProps) {
  const { titleId, descriptionId } = useDialogLabelIds("alert-dialog");
  const triggerRef = useRef<HTMLElement | null>(null);

  function handleCancel() {
    onCancel?.();
    onOpenChange(false);
  }

  function handleConfirm() {
    onConfirm();
  }

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
      <DialogPortal
        role="alertdialog"
        aria-labelledby={titleId}
        aria-describedby={description != null ? descriptionId : undefined}
        initialFocusSelector='[data-alert-dialog-cancel="true"]'
      >
        <Card
          padding="none"
          bodyTerminal={false}
          className={cn(
            dialogPanelSizeClasses.sm,
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
            titleClassName={alertDialogTitleClasses}
            showClose={false}
          />

          <div className={overlayPanelDialogBodyScrollClasses}>
            {description != null ? (
              <p id={descriptionId} className={dialogBodyMutedClasses}>
                {description}
              </p>
            ) : null}
          </div>

          <footer className={overlayPanelDialogFooterClasses}>
            <Button
              size="sm"
              role="ghost"
              disabled={cancelDisabled || confirmStatus === "loading"}
              data-alert-dialog-cancel="true"
              onClick={handleCancel}
            >
              {cancelLabel}
            </Button>
            <Button
              size="sm"
              role={confirmRole}
              status={confirmStatus}
              disabled={confirmDisabled}
              onClick={handleConfirm}
            >
              {confirmLabel}
            </Button>
          </footer>
        </Card>
      </DialogPortal>
    </DialogProvider>
  );
}
