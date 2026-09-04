import { useId, useState } from "react";
import { AnimatePresence, motion, MotionConfig } from "motion/react";
import { Badge } from "../Badge/Badge";
import { Button } from "../Button/Button";
import { cn } from "../../../lib/cn";
import { motionTransitionProp } from "../../../lib/motion";
import { typographyClass } from "../../../lib/typography";
import { InputStatusBanner } from "./InputStatusBanner";
import {
  inputAttachedFieldClasses,
  inputAttachedInputClasses,
  inputCompoundShellClassesFor,
  inputCompoundShellFocusRingClasses,
  inputEndBadgeGapClasses,
  inputEndBadgeWrapperClasses,
  inputFieldStackClasses,
  inputShellClasses,
  inputShellTransitionClasses,
  inputSizeClasses,
  inputSoloFocusRingBaseClasses,
  inputSoloFocusRingColorClasses,
  inputSoloRadiusClasses,
  inputStatusShellClasses,
  inputTrailingInsetClasses,
  inputTrailingInsetPositionClasses,
} from "./inputShellStyles";

/** Medium-tier band reveal — structural spatial change (Astryx). */
export const inputValidationMorphTransition = motionTransitionProp("medium");

/**
 * Storybook specimen — clean pill field morphs into error + jointed status band.
 * Stable compound DOM so the band can animate in/out; not exported from the package.
 */
export function InputValidationMorphDemo() {
  const controlId = useId();
  const messageId = `${controlId}-message`;
  const [value, setValue] = useState("sarah@");
  const [showError, setShowError] = useState(false);

  const validate = () => {
    setShowError(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()));
  };

  return (
    <MotionConfig transition={inputValidationMorphTransition}>
      <div className="flex w-full max-w-md flex-col gap-4">
        <div className={inputFieldStackClasses}>
          <label htmlFor={controlId} className={typographyClass("ui-label")}>
            Email
          </label>
          <div className={inputCompoundShellClassesFor("md", "error")}>
            <div
              className={cn(
                "relative z-10 flex w-full items-center border bg-surface shadow-sm",
                inputSoloRadiusClasses.md,
                inputShellTransitionClasses,
                showError
                  ? cn(
                      inputStatusShellClasses.error,
                      inputCompoundShellFocusRingClasses.error,
                    )
                  : cn(
                      inputShellClasses.md,
                      inputSoloFocusRingBaseClasses,
                      inputSoloFocusRingColorClasses.default,
                    ),
              )}
            >
              <input
                id={controlId}
                type="email"
                value={value}
                aria-invalid={showError || undefined}
                aria-describedby={showError ? messageId : undefined}
                onChange={(event) => {
                  setValue(event.target.value);
                  if (showError) {
                    setShowError(false);
                  }
                }}
                onBlur={validate}
                className={cn(
                  inputAttachedFieldClasses,
                  inputSizeClasses.md,
                  inputEndBadgeGapClasses.md,
                  inputAttachedInputClasses,
                )}
              />
              <span
                className={cn(
                  inputTrailingInsetClasses,
                  inputTrailingInsetPositionClasses.md,
                )}
              >
                <span className={inputEndBadgeWrapperClasses}>
                  <Badge size="sm">Required</Badge>
                </span>
              </span>
            </div>
            <AnimatePresence initial={false}>
              {showError ? (
                <motion.div
                  key="input-status-banner"
                  initial={{ opacity: 0, y: -10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.98 }}
                  transition={motionTransitionProp("medium")}
                  className="w-full"
                >
                  <InputStatusBanner
                    status="error"
                    message="Please enter a valid email address."
                    messageId={messageId}
                    size="md"
                    messagePosition="bottom"
                  />
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button role="secondary" onClick={() => setShowError((current) => !current)}>
            {showError ? "Clear validation" : "Show error"}
          </Button>
          <Button role="ghost" onClick={validate}>
            Re-validate on blur
          </Button>
        </div>
        <p className={typographyClass("caption")}>
          Edit the email, blur the field, or use the buttons — status band springs in underneath the
          pill while the field keeps its full radius.
        </p>
      </div>
    </MotionConfig>
  );
}
