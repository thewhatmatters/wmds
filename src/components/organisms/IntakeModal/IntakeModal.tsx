"use client";

import { useCallback, useEffect, useId, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { Button } from "../../atoms/Button/Button";
import { IconButton } from "../../atoms/IconButton/IconButton";
import { StepProgress } from "../../molecules/StepProgress/StepProgress";
import { cn } from "../../../lib/cn";
import { useOverlayLifecycle } from "../../../lib/dialogOverlay";
import { motionTransitionProp } from "../../../lib/motion";
import { typographyClass } from "../../../lib/typography";
import {
  intakeModalBodyClasses,
  intakeModalBrandClasses,
  intakeModalCenteredContentClasses,
  intakeModalContentClasses,
  intakeModalFooterClasses,
  intakeModalHeaderClasses,
  intakeModalMarkClasses,
  intakeModalProgressClasses,
  intakeModalRootClasses,
  intakeModalWordmarkClasses,
} from "./intakeModalStyles";

/** Layout-only — not for surface or color overrides. */
export type IntakeModalLayoutClassName = string;

export interface IntakeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Current step, 1-based. Shown when `showProgress` is set. */
  step?: number;
  /**
   * Segment count. Default 2: details, then the optional booking; the confirmation isn't counted
   * (Contact and booking forms T7: at most 3 steps, and only when a later step depends on earlier ones).
   */
  steps?: number;
  /** Accessible name. Default `Start a project`. */
  title?: string;
  /** Navy step bar under the wordmark. Default true. */
  showProgress?: boolean;
  /** Hide the Back / Continue footer. Confirmation screens pass true. */
  hideFooter?: boolean;
  /** Omit Continue. Step 4 passes true — confirm lives in the step, not the footer. */
  hideContinue?: boolean;
  onBack?: () => void;
  onContinue?: () => void;
  backDisabled?: boolean;
  /**
   * Avoid (Buttons U6): keep Continue enabled and show errors on press instead (IntakeForm `submitCount`).
   */
  continueDisabled?: boolean;
  continueLabel?: string;
  /**
   * Escape closes the modal. Set `false` when closing would lose answers the visitor has typed
   * (the Close button still closes). Default `true`.
   */
  dismissOnEscape?: boolean;
  /**
   * The visitor has typed answers. Close and Escape then ask "Discard your answers?" before closing
   * (Contact and booking forms T9). Keep the answers in the caller's state, so an accidental close
   * that's undone, or reopening, finds them still there.
   */
  hasAnswers?: boolean;
  children?: ReactNode;
  className?: IntakeModalLayoutClassName;
}

/**
 * Full-screen intake shell. Opens from a Start a project action.
 * Wordmark, close, step progress, and a pinned footer.
 * Focus trap, Escape, scroll lock, and `aria-modal`.
 */
export function IntakeModal({
  open,
  onOpenChange,
  step = 1,
  steps = 2,
  title = "Start a project",
  showProgress = true,
  hideFooter = false,
  hideContinue = false,
  onBack,
  onContinue,
  backDisabled = false,
  continueDisabled = false,
  continueLabel = "Continue",
  dismissOnEscape = true,
  hasAnswers = false,
  children,
  className,
}: IntakeModalProps) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);

  const confirmTitleId = useId();
  const keepEditingRef = useRef<HTMLButtonElement>(null);
  const [confirming, setConfirming] = useState(false);

  const close = useCallback(() => {
    setConfirming(false);
    onOpenChange(false);
  }, [onOpenChange]);

  // With typed answers, closing asks first.
  const requestClose = useCallback(() => {
    if (hasAnswers) setConfirming(true);
    else close();
  }, [hasAnswers, close]);

  useEffect(() => {
    if (confirming) keepEditingRef.current?.focus();
  }, [confirming]);

  useEffect(() => {
    if (!open) setConfirming(false);
  }, [open]);

  useOverlayLifecycle(panelRef, {
    open,
    onClose: requestClose,
    closeOnEscape: dismissOnEscape,
    initialFocus: '[aria-label="Close"]',
  });

  if (typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <AnimatePresence>
      {open ? (
        <motion.div
          ref={panelRef}
          className={cn(intakeModalRootClasses, className)}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          data-intake-modal=""
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={motionTransitionProp("medium")}
        >
          <h1 id={titleId} className="sr-only">
            {title}
          </h1>
          <header className={intakeModalHeaderClasses}>
            <div className={intakeModalBrandClasses}>
              <span className={intakeModalMarkClasses} aria-hidden>
                WM
              </span>
              <span className={intakeModalWordmarkClasses}>WhatMatters</span>
            </div>
            <IconButton
              icon={<X strokeWidth={2} />}
              aria-label="Close"
              role="ghost"
              size="md"
              onClick={requestClose}
            />
          </header>
          {showProgress ? (
            <div className={intakeModalProgressClasses}>
              <StepProgress step={step} steps={steps} />
            </div>
          ) : null}
          <div className={intakeModalBodyClasses}>
            <div
              className={
                hideFooter ? intakeModalCenteredContentClasses : intakeModalContentClasses
              }
            >
              {children}
            </div>
          </div>
          {confirming ? (
            <footer
              className={cn(intakeModalFooterClasses, "flex-wrap")}
              role="alertdialog"
              aria-labelledby={confirmTitleId}
              data-intake-discard=""
            >
              <p id={confirmTitleId} className={cn(typographyClass("ui-label"), "basis-full text-fg md:basis-auto")}>
                Discard your answers?
              </p>
              <Button ref={keepEditingRef} role="primary" type="button" onClick={() => setConfirming(false)}>
                Keep editing
              </Button>
              <Button role="ghost" type="button" onClick={close}>
                Discard
              </Button>
            </footer>
          ) : hideFooter ? null : (
            <footer className={intakeModalFooterClasses}>
              {/* Buttons U8: the primary comes first; Back is a quieter text button after it. */}
              {hideContinue ? null : (
                <Button
                  role="primary"
                  type="button"
                  disabled={continueDisabled}
                  onClick={onContinue}
                >
                  {continueLabel}
                </Button>
              )}
              {/* Step 1 has nowhere to go back to, so no Back there. */}
              {step > 1 ? (
                <Button
                  role="ghost"
                  type="button"
                  disabled={backDisabled}
                  onClick={onBack}
                >
                  Back
                </Button>
              ) : null}
            </footer>
          )}
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
