"use client";

import { useCallback, useEffect, useId, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { Button } from "../../atoms/Button/Button";
import { IconButton } from "../../atoms/IconButton/IconButton";
import { StepProgress } from "../../molecules/StepProgress/StepProgress";
import { cn } from "../../../lib/cn";
import { focusInitialElement, lockBodyScroll, trapFocus } from "../../../lib/dialogOverlay";
import { motionTransitionProp } from "../../../lib/motion";
import {
  intakeModalBodyClasses,
  intakeModalBrandClasses,
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
  /** Segment count. Default 4. */
  steps?: number;
  /** Accessible name. Default `Start a project`. */
  title?: string;
  /** Navy step bar under the wordmark. Default true. */
  showProgress?: boolean;
  /** Hide the Back / Continue footer. Confirmation screens pass true. */
  hideFooter?: boolean;
  onBack?: () => void;
  onContinue?: () => void;
  backDisabled?: boolean;
  continueDisabled?: boolean;
  continueLabel?: string;
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
  steps = 4,
  title = "Start a project",
  showProgress = true,
  hideFooter = false,
  onBack,
  onContinue,
  backDisabled = false,
  continueDisabled = false,
  continueLabel = "Continue",
  children,
  className,
}: IntakeModalProps) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const close = useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    previousFocusRef.current = document.activeElement as HTMLElement | null;
    const unlockScroll = lockBodyScroll();
    const panel = panelRef.current;
    let releaseFocusTrap: () => void = () => undefined;

    if (panel != null) {
      releaseFocusTrap = trapFocus(panel);
      window.requestAnimationFrame(() => {
        focusInitialElement(panel, '[aria-label="Close"]');
      });
    }

    return () => {
      releaseFocusTrap();
      unlockScroll();
      previousFocusRef.current?.focus?.();
    };
  }, [open]);

  useEffect(() => {
    if (!open) {
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
  }, [close, open]);

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
              onClick={close}
            />
          </header>
          {showProgress ? (
            <div className={intakeModalProgressClasses}>
              <StepProgress step={step} steps={steps} />
            </div>
          ) : null}
          <div className={intakeModalBodyClasses}>
            <div className={intakeModalContentClasses}>{children}</div>
          </div>
          {hideFooter ? null : (
            <footer className={intakeModalFooterClasses}>
              <Button
                role="secondary"
                type="button"
                disabled={backDisabled}
                onClick={onBack}
              >
                Back
              </Button>
              <Button
                role="primary"
                type="button"
                disabled={continueDisabled}
                onClick={onContinue}
              >
                {continueLabel}
              </Button>
            </footer>
          )}
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
