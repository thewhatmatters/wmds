import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "../../components/atoms/Button/Button";
import { Checkbox } from "../../components/atoms/Checkbox/Checkbox";
import { IconButton } from "../../components/atoms/IconButton/IconButton";
import { Kbd } from "../../components/atoms/Kbd/Kbd";
import { useKbdChoiceKeys } from "../../components/atoms/Kbd/useKbdChoiceKeys";
import { CalEmbed } from "../../components/molecules/CalEmbed/CalEmbed";
import {
  IntakeForm,
  intakeAboutEmpty,
  type IntakeAboutValues,
} from "../../components/molecules/IntakeForm/IntakeForm";
import { PillGroup } from "../../components/molecules/PillGroup/PillGroup";
import {
  Card,
  cardLayoutBodyOccupantInsetXClasses,
  cardLayoutBodyOccupantWellClasses,
  cardSubtitleClasses,
  cardTitleClasses,
} from "../../components/molecules/Card/Card";
import { IntakeConfirmation } from "../../components/organisms/IntakeConfirmation/IntakeConfirmation";
import { cn } from "../../lib/cn";
import {
  canContinueIntake,
  intakeBudgets,
  type IntakePhase,
  type IntakeStep,
} from "../Intake/IntakePattern";
import {
  promptChatStartGateOptionClasses,
  promptChatStartGateOptionNumberClasses,
  promptChatStartGateOptionsClasses,
  promptChatStartGateStepClasses,
} from "./promptChatStyles";

/**
 * Step 1 choices from the starter intake — not four identical
 * “Web experience” placeholders from the Paper file.
 */
export const promptChatStartOptions = [
  {
    value: "brand",
    label: "Brand identity",
    description: "Name, mark, and a system you can actually use.",
    number: 1,
  },
  {
    value: "website",
    label: "Website",
    description: "A site that explains the work and earns the next conversation.",
    number: 2,
  },
  {
    value: "product",
    label: "Product design",
    description: "Flows, screens, and the details in between.",
    number: 3,
  },
  {
    value: "system",
    label: "Design system",
    description: "Components, tokens, and the rules that keep them honest.",
    number: 4,
  },
] as const;

export const promptChatStartGateSteps = 4;

export const promptChatStartGateCopy: Record<
  IntakeStep,
  { title: string; subtitle: string }
> = {
  1: { title: "Name the work", subtitle: "What are we making?" },
  2: {
    title: "What's the budget?",
    subtitle: "A range is enough. We can tighten it after the first conversation.",
  },
  3: {
    title: "About you",
    subtitle: "A few sentences is enough. We'll reply to the email you leave here.",
  },
  4: {
    title: "Book a call",
    subtitle: "Pick a time, or skip this and we'll write to you instead.",
  },
};

/** Card.Header title for step 1 — kept for tests and Show code mirrors. */
export const promptChatStartGateTitle = promptChatStartGateCopy[1].title;

/** Card.Header subtitle for step 1. */
export const promptChatStartGateSubtitle = promptChatStartGateCopy[1].subtitle;

export { intakeAboutEmpty };

export type PromptChatStartGatePhase = IntakePhase;

/**
 * Gated starter form in the composer slot. Real WMDS **Card** with
 * **Card.Header** / **Card.Body** / **Card.Footer**. Step 1 trailing digits are
 * **Kbd** plus **`useKbdChoiceKeys`** (1–4 toggle while the gate is open and
 * focus is not in a text field). Steps 2–4 reuse the existing intake
 * **PillGroup**, **IntakeForm**, **CalEmbed**, and **IntakeConfirmation**.
 */
export function PromptChatStartGate({
  phase,
  needs,
  onNeedsChange,
  budget,
  onBudgetChange,
  about,
  onAboutChange,
  onCancel,
  onBack,
  onNext,
  onBooked,
  onEmailed,
  onDone,
}: {
  phase: PromptChatStartGatePhase;
  needs: readonly string[];
  onNeedsChange: (values: string[]) => void;
  budget: string | null;
  onBudgetChange: (value: string) => void;
  about: IntakeAboutValues;
  onAboutChange: (values: IntakeAboutValues) => void;
  onCancel: () => void;
  onBack: () => void;
  onNext: () => void;
  onBooked: () => void;
  onEmailed: () => void;
  onDone: () => void;
}) {
  const step: IntakeStep = phase.kind === "step" ? phase.step : 4;
  const copy = promptChatStartGateCopy[step];
  const atStart = phase.kind !== "step" || phase.step <= 1;
  const hideContinue = phase.kind === "done" || (phase.kind === "step" && phase.step === 4);
  const hideFooter = phase.kind === "done";
  const continueDisabled =
    phase.kind !== "step" ||
    !canContinueIntake({ step: phase.step, needs, budget, about });
  const stepOneOpen = phase.kind === "step" && phase.step === 1;

  function toggleNeed(value: string, checked: boolean) {
    if (checked) {
      onNeedsChange([...needs, value]);
      return;
    }
    onNeedsChange(needs.filter((item) => item !== value));
  }

  useKbdChoiceKeys({
    enabled: stepOneOpen,
    choices: Object.fromEntries(
      promptChatStartOptions.map((option) => [
        String(option.number),
        () => toggleNeed(option.value, !needs.includes(option.value)),
      ]),
    ),
  });

  return (
    <Card shape="rounded" padding="none" variant="surface" aria-label={copy.title}>
      <Card.Header
        start={
          phase.kind === "done" ? (
            <h2 className={cardTitleClasses}>Start a project</h2>
          ) : (
            <>
              <h2 className={cardTitleClasses}>{copy.title}</h2>
              <p className={cardSubtitleClasses}>{copy.subtitle}</p>
            </>
          )
        }
        end={
          <>
            {phase.kind === "step" ? (
              <>
                <IconButton
                  aria-label="Previous step"
                  size="sm"
                  icon={<ChevronLeft />}
                  disabled={atStart}
                  onClick={onBack}
                />
                <span className={promptChatStartGateStepClasses}>
                  {step} of {promptChatStartGateSteps}
                </span>
                <IconButton
                  aria-label="Next step"
                  size="sm"
                  icon={<ChevronRight />}
                  disabled={hideContinue || continueDisabled}
                  onClick={onNext}
                />
              </>
            ) : null}
            <IconButton aria-label="Close starter" size="sm" icon={<X />} onClick={onCancel} />
          </>
        }
      />
      <Card.Body>
        <div
          className={cn(
            cardLayoutBodyOccupantWellClasses,
            cardLayoutBodyOccupantInsetXClasses,
            "flex w-full flex-col gap-3 py-3",
          )}
        >
          {phase.kind === "done" ? (
            <IntakeConfirmation variant={phase.variant} onDone={onDone} />
          ) : null}
          {phase.kind === "step" && phase.step === 1 ? (
            <div
              className={promptChatStartGateOptionsClasses}
              role="group"
              aria-label={copy.subtitle}
            >
              {promptChatStartOptions.map((option) => (
                <div key={option.value} className={promptChatStartGateOptionClasses}>
                  <Checkbox
                    className="min-w-0 flex-1"
                    size="md"
                    label={option.label}
                    description={option.description}
                    checked={needs.includes(option.value)}
                    onChange={(event) => toggleNeed(option.value, event.target.checked)}
                  />
                  <Kbd
                    className={promptChatStartGateOptionNumberClasses}
                    aria-label={`Press ${option.number}`}
                  >
                    {option.number}
                  </Kbd>
                </div>
              ))}
            </div>
          ) : null}
          {phase.kind === "step" && phase.step === 2 ? (
            <PillGroup aria-label="Budget" value={budget} onValueChange={onBudgetChange}>
              {intakeBudgets.map((option) => (
                <PillGroup.Item key={option.value} value={option.value} emphasis={option.emphasis}>
                  {option.label}
                </PillGroup.Item>
              ))}
            </PillGroup>
          ) : null}
          {phase.kind === "step" && phase.step === 3 ? (
            <IntakeForm values={about} onChange={onAboutChange} />
          ) : null}
          {phase.kind === "step" && phase.step === 4 ? (
            <CalEmbed onSkip={onEmailed}>
              <Button role="primary" type="button" onClick={onBooked}>
                Confirm this time
              </Button>
            </CalEmbed>
          ) : null}
        </div>
      </Card.Body>
      {hideFooter ? null : (
        <Card.Footer>
          <div className="ml-auto flex items-center gap-2">
            <Button role="secondary" size="md" type="button" onClick={onCancel}>
              Cancel
            </Button>
            {hideContinue ? null : (
              <Button
                role="primary"
                size="md"
                type="button"
                disabled={continueDisabled}
                onClick={onNext}
              >
                Next
              </Button>
            )}
          </div>
        </Card.Footer>
      )}
    </Card>
  );
}
