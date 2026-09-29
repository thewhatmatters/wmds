import { useState } from "react";
import { Button } from "../../components/atoms/Button/Button";
import { CalEmbed } from "../../components/molecules/CalEmbed/CalEmbed";
import {
  IntakeForm,
  intakeAboutEmpty,
  intakeDetailsMax,
  isIntakeAboutValid,
  type IntakeAboutValues,
} from "../../components/molecules/IntakeForm/IntakeForm";
import { PillGroup } from "../../components/molecules/PillGroup/PillGroup";
import { SegmentedControl } from "../../components/molecules/SegmentedControl/SegmentedControl";
import { SelectableCard } from "../../components/molecules/SelectableCard/SelectableCard";
import { IntakeConfirmation } from "../../components/organisms/IntakeConfirmation/IntakeConfirmation";
import { ConfettiProvider } from "../../components/organisms/Confetti/Confetti";
import { IntakeModal } from "../../components/organisms/IntakeModal/IntakeModal";

export const intakeNeeds = [
  {
    value: "brand",
    title: "Brand identity",
    description: "Name, mark, and a system you can actually use.",
  },
  {
    value: "website",
    title: "Website",
    description: "A site that explains the work and earns the next conversation.",
  },
  {
    value: "product",
    title: "Product design",
    description: "Flows, screens, and the details in between.",
  },
  {
    value: "marketing",
    title: "Marketing site",
    description: "A campaign page with one clear ask.",
  },
  {
    value: "system",
    title: "Design system",
    description: "Components, tokens, and the rules that keep them honest.",
  },
  {
    value: "other",
    title: "Other",
    description: "Something that does not fit the list yet.",
  },
] as const;

export const intakeBudgets = [
  { value: "under-10", label: "<$10k", emphasis: "solid" },
  { value: "10-25", label: "$10–25k", emphasis: "solid" },
  { value: "25-50", label: "$25–50k", emphasis: "solid" },
  { value: "50-plus", label: "$50k+", emphasis: "solid" },
  { value: "unsure", label: "Not sure yet", emphasis: "muted" },
] as const;

export type IntakeStep = 1 | 2 | 3 | 4;

export type IntakePhase =
  | { kind: "step"; step: IntakeStep }
  | { kind: "done"; variant: "booked" | "emailed" };

export function canContinueIntake(input: {
  step: IntakeStep;
  needs: readonly string[];
  budget: string | null;
  about: IntakeAboutValues;
}): boolean {
  if (input.step === 1) {
    return input.needs.length > 0;
  }
  if (input.step === 2) {
    return input.budget != null;
  }
  if (input.step === 3) {
    return isIntakeAboutValid(input.about, intakeDetailsMax);
  }
  return false;
}

export function StartAProject({ initialOpen = true }: { initialOpen?: boolean }) {
  const [open, setOpen] = useState(initialOpen);
  const [phase, setPhase] = useState<IntakePhase>({ kind: "step", step: 1 });
  const [mode, setMode] = useState("fresh");
  const [needs, setNeeds] = useState<string[]>([]);
  const [budget, setBudget] = useState<string | null>(null);
  const [about, setAbout] = useState<IntakeAboutValues>(intakeAboutEmpty);

  function openIntake() {
    setPhase({ kind: "step", step: 1 });
    setMode("fresh");
    setNeeds([]);
    setBudget(null);
    setAbout(intakeAboutEmpty);
    setOpen(true);
  }

  const step = phase.kind === "step" ? phase.step : 4;
  const continueDisabled =
    phase.kind !== "step" ||
    !canContinueIntake({ step: phase.step, needs, budget, about });

  function goBack() {
    if (phase.kind !== "step" || phase.step === 1) {
      return;
    }
    const previous = (phase.step - 1) as IntakeStep;
    setPhase({ kind: "step", step: previous });
  }

  function goContinue() {
    if (phase.kind !== "step" || !canContinueIntake({ step: phase.step, needs, budget, about })) {
      return;
    }
    if (phase.step === 4) {
      return;
    }
    const next = (phase.step + 1) as IntakeStep;
    setPhase({ kind: "step", step: next });
  }

  return (
    <ConfettiProvider>
      <Button role="primary" type="button" onClick={openIntake}>
        Start a project
      </Button>
      <IntakeModal
        open={open}
        onOpenChange={setOpen}
        step={step}
        steps={4}
        showProgress={phase.kind === "step"}
        hideFooter={phase.kind === "done"}
        hideContinue={phase.kind === "step" && phase.step === 4}
        backDisabled={phase.kind !== "step" || phase.step === 1}
        continueDisabled={continueDisabled}
        onBack={goBack}
        onContinue={goContinue}
      >
        {phase.kind === "done" ? (
          <IntakeConfirmation variant={phase.variant} onDone={() => setOpen(false)} />
        ) : null}
        {phase.kind === "step" && phase.step === 1 ? (
          <>
            <div className="flex flex-col gap-3">
              <h2 className="type-heading-1 text-fg tracking-tight">What do you need?</h2>
              <p className="type-body text-fg">
                Pick everything that fits. We'll shape the work around it.
              </p>
            </div>
            <SelectableCard.Group
              label="What do you need?"
              values={needs}
              onValuesChange={setNeeds}
              toggle={
                <SegmentedControl
                  aria-label="Project starting point"
                  layout="hug"
                  value={mode}
                  onValueChange={setMode}
                >
                  <SegmentedControl.Item value="fresh">Starting fresh</SegmentedControl.Item>
                  <SegmentedControl.Item value="refresh">Refreshing what I have</SegmentedControl.Item>
                </SegmentedControl>
              }
            >
              {intakeNeeds.map((option) => (
                <SelectableCard
                  key={option.value}
                  value={option.value}
                  title={option.title}
                  description={option.description}
                />
              ))}
            </SelectableCard.Group>
          </>
        ) : null}
        {phase.kind === "step" && phase.step === 2 ? (
          <>
            <div className="flex flex-col gap-3">
              <h2 className="type-heading-1 text-fg tracking-tight">What's the budget?</h2>
              <p className="type-body text-fg">
                A range is enough. We can tighten it after the first conversation.
              </p>
            </div>
            <PillGroup aria-label="Budget" value={budget} onValueChange={setBudget}>
              {intakeBudgets.map((option) => (
                <PillGroup.Item key={option.value} value={option.value} emphasis={option.emphasis}>
                  {option.label}
                </PillGroup.Item>
              ))}
            </PillGroup>
          </>
        ) : null}
        {phase.kind === "step" && phase.step === 3 ? (
          <>
            <div className="flex flex-col gap-3">
              <h2 className="type-heading-1 text-fg tracking-tight">About you</h2>
              <p className="type-body text-fg">
                A few sentences is enough. We'll reply to the email you leave here.
              </p>
            </div>
            <IntakeForm values={about} onChange={setAbout} />
          </>
        ) : null}
        {phase.kind === "step" && phase.step === 4 ? (
          <>
            <div className="flex flex-col gap-3">
              <h2 className="type-heading-1 text-fg tracking-tight">Book a call</h2>
              <p className="type-body text-fg">
                Pick a time, or skip this and we'll write to you instead.
              </p>
            </div>
            <CalEmbed onSkip={() => setPhase({ kind: "done", variant: "emailed" })}>
              <Button
                role="primary"
                type="button"
                onClick={() => setPhase({ kind: "done", variant: "booked" })}
              >
                Confirm this time
              </Button>
            </CalEmbed>
          </>
        ) : null}
      </IntakeModal>
    </ConfettiProvider>
  );
}

export const intakePatternCopySource = `
import { useState } from "react";
import {
  Button,
  CalEmbed,
  ConfettiProvider,
  IntakeConfirmation,
  IntakeForm,
  IntakeModal,
  PillGroup,
  SegmentedControl,
  SelectableCard,
  intakeAboutEmpty,
  intakeDetailsMax,
  isIntakeAboutValid,
  type IntakeAboutValues,
} from "@whatmatters/wmds";

export const intakeNeeds = [
  {
    value: "brand",
    title: "Brand identity",
    description: "Name, mark, and a system you can actually use.",
  },
  {
    value: "website",
    title: "Website",
    description: "A site that explains the work and earns the next conversation.",
  },
  {
    value: "product",
    title: "Product design",
    description: "Flows, screens, and the details in between.",
  },
  {
    value: "marketing",
    title: "Marketing site",
    description: "A campaign page with one clear ask.",
  },
  {
    value: "system",
    title: "Design system",
    description: "Components, tokens, and the rules that keep them honest.",
  },
  {
    value: "other",
    title: "Other",
    description: "Something that does not fit the list yet.",
  },
] as const;

export const intakeBudgets = [
  { value: "under-10", label: "<$10k", emphasis: "solid" },
  { value: "10-25", label: "$10–25k", emphasis: "solid" },
  { value: "25-50", label: "$25–50k", emphasis: "solid" },
  { value: "50-plus", label: "$50k+", emphasis: "solid" },
  { value: "unsure", label: "Not sure yet", emphasis: "muted" },
] as const;

export type IntakeStep = 1 | 2 | 3 | 4;

export type IntakePhase =
  | { kind: "step"; step: IntakeStep }
  | { kind: "done"; variant: "booked" | "emailed" };

export function canContinueIntake(input: {
  step: IntakeStep;
  needs: readonly string[];
  budget: string | null;
  about: IntakeAboutValues;
}): boolean {
  if (input.step === 1) {
    return input.needs.length > 0;
  }
  if (input.step === 2) {
    return input.budget != null;
  }
  if (input.step === 3) {
    return isIntakeAboutValid(input.about, intakeDetailsMax);
  }
  return false;
}

export function StartAProject({ initialOpen = true }: { initialOpen?: boolean }) {
  const [open, setOpen] = useState(initialOpen);
  const [phase, setPhase] = useState<IntakePhase>({ kind: "step", step: 1 });
  const [mode, setMode] = useState("fresh");
  const [needs, setNeeds] = useState<string[]>([]);
  const [budget, setBudget] = useState<string | null>(null);
  const [about, setAbout] = useState<IntakeAboutValues>(intakeAboutEmpty);

  function openIntake() {
    setPhase({ kind: "step", step: 1 });
    setMode("fresh");
    setNeeds([]);
    setBudget(null);
    setAbout(intakeAboutEmpty);
    setOpen(true);
  }

  const step = phase.kind === "step" ? phase.step : 4;
  const continueDisabled =
    phase.kind !== "step" ||
    !canContinueIntake({ step: phase.step, needs, budget, about });

  function goBack() {
    if (phase.kind !== "step" || phase.step === 1) {
      return;
    }
    const previous = (phase.step - 1) as IntakeStep;
    setPhase({ kind: "step", step: previous });
  }

  function goContinue() {
    if (phase.kind !== "step" || !canContinueIntake({ step: phase.step, needs, budget, about })) {
      return;
    }
    if (phase.step === 4) {
      return;
    }
    const next = (phase.step + 1) as IntakeStep;
    setPhase({ kind: "step", step: next });
  }

  return (
    <ConfettiProvider>
      <Button role="primary" type="button" onClick={openIntake}>
        Start a project
      </Button>
      <IntakeModal
        open={open}
        onOpenChange={setOpen}
        step={step}
        steps={4}
        showProgress={phase.kind === "step"}
        hideFooter={phase.kind === "done"}
        hideContinue={phase.kind === "step" && phase.step === 4}
        backDisabled={phase.kind !== "step" || phase.step === 1}
        continueDisabled={continueDisabled}
        onBack={goBack}
        onContinue={goContinue}
      >
        {phase.kind === "done" ? (
          <IntakeConfirmation variant={phase.variant} onDone={() => setOpen(false)} />
        ) : null}
        {phase.kind === "step" && phase.step === 1 ? (
          <>
            <div className="flex flex-col gap-3">
              <h2 className="type-heading-1 text-fg tracking-tight">What do you need?</h2>
              <p className="type-body text-fg">
                Pick everything that fits. We'll shape the work around it.
              </p>
            </div>
            <SelectableCard.Group
              label="What do you need?"
              values={needs}
              onValuesChange={setNeeds}
              toggle={
                <SegmentedControl
                  aria-label="Project starting point"
                  layout="hug"
                  value={mode}
                  onValueChange={setMode}
                >
                  <SegmentedControl.Item value="fresh">Starting fresh</SegmentedControl.Item>
                  <SegmentedControl.Item value="refresh">Refreshing what I have</SegmentedControl.Item>
                </SegmentedControl>
              }
            >
              {intakeNeeds.map((option) => (
                <SelectableCard
                  key={option.value}
                  value={option.value}
                  title={option.title}
                  description={option.description}
                />
              ))}
            </SelectableCard.Group>
          </>
        ) : null}
        {phase.kind === "step" && phase.step === 2 ? (
          <>
            <div className="flex flex-col gap-3">
              <h2 className="type-heading-1 text-fg tracking-tight">What's the budget?</h2>
              <p className="type-body text-fg">
                A range is enough. We can tighten it after the first conversation.
              </p>
            </div>
            <PillGroup aria-label="Budget" value={budget} onValueChange={setBudget}>
              {intakeBudgets.map((option) => (
                <PillGroup.Item key={option.value} value={option.value} emphasis={option.emphasis}>
                  {option.label}
                </PillGroup.Item>
              ))}
            </PillGroup>
          </>
        ) : null}
        {phase.kind === "step" && phase.step === 3 ? (
          <>
            <div className="flex flex-col gap-3">
              <h2 className="type-heading-1 text-fg tracking-tight">About you</h2>
              <p className="type-body text-fg">
                A few sentences is enough. We'll reply to the email you leave here.
              </p>
            </div>
            <IntakeForm values={about} onChange={setAbout} />
          </>
        ) : null}
        {phase.kind === "step" && phase.step === 4 ? (
          <>
            <div className="flex flex-col gap-3">
              <h2 className="type-heading-1 text-fg tracking-tight">Book a call</h2>
              <p className="type-body text-fg">
                Pick a time, or skip this and we'll write to you instead.
              </p>
            </div>
            <CalEmbed onSkip={() => setPhase({ kind: "done", variant: "emailed" })}>
              <Button
                role="primary"
                type="button"
                onClick={() => setPhase({ kind: "done", variant: "booked" })}
              >
                Confirm this time
              </Button>
            </CalEmbed>
          </>
        ) : null}
      </IntakeModal>
    </ConfettiProvider>
  );
}
`;
