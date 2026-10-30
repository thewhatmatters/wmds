"use client";

import { useState } from "react";
import { Button } from "../../components/atoms/Button/Button";
import { TextLink } from "../../components/atoms/TextLink/TextLink";
import { CalEmbed } from "../../components/molecules/CalEmbed/CalEmbed";
import {
  IntakeForm,
  intakeAboutEmpty,
  isIntakeAboutValid,
  type IntakeAboutValues,
} from "../../components/molecules/IntakeForm/IntakeForm";
import { IntakeHoneypot } from "../../components/molecules/IntakeForm/IntakeHoneypot";
import { ConfettiProvider } from "../../components/organisms/Confetti/Confetti";
import { IntakeConfirmation, intakeConfirmationReplyWithin } from "../../components/organisms/IntakeConfirmation/IntakeConfirmation";
import { IntakeModal } from "../../components/organisms/IntakeModal/IntakeModal";
import { useIntakeUrlState } from "../../components/organisms/IntakeModal/useIntakeUrlState";

/**
 * Story-only composition of the sketch request (Contact and booking forms T1–T9): details, then the
 * optional booking, then the confirmation. Not exported from the package; copy it from the story.
 */
export function SketchRequestFlow({ failFirstSend = false }: { failFirstSend?: boolean }) {
  const [open, setOpen] = useIntakeUrlState("sketch");
  const [step, setStep] = useState<"details" | "booking" | "done">("details");
  const [values, setValues] = useState<IntakeAboutValues>(intakeAboutEmpty);
  const [honeypot, setHoneypot] = useState("");
  const [submitCount, setSubmitCount] = useState(0);
  const [sendFailed, setSendFailed] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const hasAnswers =
    step !== "done" && Object.values(values).some((value) => value.trim().length > 0);

  function send() {
    if (!isIntakeAboutValid(values)) {
      setSubmitCount((count) => count + 1);
      return;
    }
    // A real app posts here (and drops it server-side when the honeypot is filled).
    setAttempts((count) => count + 1);
    if (failFirstSend && attempts === 0) {
      setSendFailed(true);
      return;
    }
    setSendFailed(false);
    setStep("booking");
  }

  return (
    <ConfettiProvider>
      <Button role="primary" type="button" onClick={() => setOpen(true)}>
        Get a free sketch
      </Button>
      <IntakeModal
        open={open}
        onOpenChange={(next) => {
          setOpen(next);
          if (!next && step === "done") {
            setStep("details");
            setValues(intakeAboutEmpty);
          }
        }}
        title="Get a free sketch"
        step={step === "details" ? 1 : 2}
        steps={2}
        showProgress={step !== "done"}
        hideFooter={step === "done"}
        hideContinue={step === "booking"}
        continueLabel="Send my request"
        backDisabled={step === "details"}
        onBack={() => setStep("details")}
        onContinue={send}
        hasAnswers={hasAnswers}
      >
        {step === "details" ? (
          <>
            <h2 className="type-heading-1 tracking-tight text-fg">Tell us about your project</h2>
            {/* No WMDS inline alert yet (gap #51): a plain role="alert" block for the story. */}
            {sendFailed ? (
              <div role="alert" className="flex flex-col gap-2 rounded-[var(--radius-card-shell)] bg-error-muted p-4 text-error">
                <p className="type-label">We couldn’t send your request.</p>
                <p className="type-body">
                  Your answers are still here. Press Send my request to try again, or email{" "}
                  <TextLink href="mailto:hello@whatmatters.studio">hello@whatmatters.studio</TextLink>.
                </p>
              </div>
            ) : null}
            <IntakeForm values={values} onChange={setValues} submitCount={submitCount} />
            <IntakeHoneypot value={honeypot} onChange={setHoneypot} />
            <p className="type-caption text-muted">We reply {intakeConfirmationReplyWithin}.</p>
          </>
        ) : step === "booking" ? (
          <>
            <h2 className="type-heading-1 tracking-tight text-fg">Pick a time (optional)</h2>
            <p className="type-body text-fg">We have your request. Book a call now, or we’ll email you.</p>
            <CalEmbed onSkip={() => setStep("done")} />
          </>
        ) : (
          <IntakeConfirmation
            variant="emailed"
            email={values.email}
            summary={values.details}
            contact={
              <>
                Prefer to talk? (512) 555-0148 · Mon–Fri, 9–5 ·{" "}
                <TextLink href="mailto:hello@whatmatters.studio">hello@whatmatters.studio</TextLink>
              </>
            }
            onDone={() => setOpen(false)}
          />
        )}
      </IntakeModal>
    </ConfettiProvider>
  );
}
