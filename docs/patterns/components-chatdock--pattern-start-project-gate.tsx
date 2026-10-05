// @thewhatmatters/wmds@0.4.6 · Pattern — start a project gate
// Storybook: Components/ChatDock → Pattern — start a project gate (?path=/story/components-chatdock--pattern-start-project-gate)
// Show code — copy verbatim and keep this header; upgrades find pasted patterns by it.

import { useId, useRef, useState, type ReactNode } from "react";
import {
  CalEmbed,
  ChatDock,
  Checkbox,
  IntakeForm,
  Kbd,
  Radio,
  intakeAboutEmpty,
  isIntakeAboutValid,
  useConfetti,
  useKbdChoiceKeys,
  type ChatQaPair,
  type IntakeAboutValues,
} from "@thewhatmatters/wmds";

const services = [
  { value: "brand", label: "Brand identity" },
  { value: "web", label: "Web experiences" },
  { value: "mobile", label: "Mobile apps" },
  { value: "social", label: "Social media" },
  { value: "content", label: "Content and copy" },
  { value: "ai", label: "AI assistants" },
  { value: "growth", label: "Launch, growth, and care" },
];

const budgets = [
  { value: "under-10", label: "Under $10k" },
  { value: "10-25", label: "$10–25k" },
  { value: "25-50", label: "$25–50k" },
  { value: "50-plus", label: "$50k+" },
  { value: "unsure", label: "Not sure yet" },
];

const steps = [
  { title: "Name the work", subtitle: "What are we making? Choose all that apply." },
  { title: "What's the budget?", subtitle: "A range is enough. We can tighten it after the first call." },
  { title: "About you", subtitle: "A few sentences is enough. We'll reply to the email you leave here." },
  { title: "Book a call", subtitle: "Pick a time, or skip this and we'll write to you instead." },
];

/** What the visitor told the gate — the app sends it. */
export interface StartProjectIntake {
  services: string[];
  budget: string | null;
  about: IntakeAboutValues;
  followUp: "call" | "email";
}

export interface StartProjectGateProps {
  /** What the assistant already picked up from the conversation, or `{}`. */
  request: { services?: string[]; budget?: string };
  /** Leaves the gate — its Cancel. Closing the window (its close or Escape) keeps the gate, with its progress. */
  close: () => void;
  /** Ends the gate; the conversation shows the answers and the confirmation. */
  complete: (answers: ChatQaPair[], confirmation: string) => void;
  /** Sends the intake. Resolve once it is sent; reject to keep the answers and offer Try again. */
  onSubmit: (intake: StartProjectIntake) => Promise<void>;
  /** The booking calendar. Call `booked` once the visitor confirms a time. Leave it out to show the empty state. */
  renderCalendar?: (booked: () => void) => ReactNode;
}

export function StartProjectGate({ request, close, complete, onSubmit, renderCalendar }: StartProjectGateProps) {
  const gateRef = useRef<HTMLDivElement>(null);
  const budgetName = useId();
  const { fire } = useConfetti();
  const [step, setStep] = useState(1);
  const [chosen, setChosen] = useState<string[]>(request.services ?? []);
  const [budget, setBudget] = useState<string | null>(request.budget ?? null);
  const [about, setAbout] = useState<IntakeAboutValues>(intakeAboutEmpty);
  const [sending, setSending] = useState(false);
  /** How the visitor chose to follow up when the send failed — Try again sends that again. */
  const [failed, setFailed] = useState<"call" | "email" | null>(null);

  function toggleService(value: string) {
    setChosen((current) =>
      current.includes(value) ? current.filter((item) => item !== value) : [...current, value],
    );
  }

  // Number keys pick the numbered options while focus is in the gate.
  useKbdChoiceKeys({
    enabled: step === 1,
    scope: gateRef,
    choices: Object.fromEntries(services.map((service, index) => [String(index + 1), () => toggleService(service.value)])),
  });
  useKbdChoiceKeys({
    enabled: step === 2,
    scope: gateRef,
    choices: Object.fromEntries(budgets.map((option, index) => [String(index + 1), () => setBudget(option.value)])),
  });

  const canContinue =
    step === 1 ? chosen.length > 0 : step === 2 ? budget != null : step === 3 ? isIntakeAboutValid(about) : true;

  async function finish(followUp: "call" | "email") {
    if (sending) return;
    // The burst starts at the control the visitor used — the booking, the skip, or Try again.
    const used = document.activeElement;
    setSending(true);
    setFailed(null);
    try {
      await onSubmit({ services: chosen, budget, about, followUp });
    } catch {
      // Every answer stays; the gate shows the error and Try again.
      setFailed(followUp);
      return;
    } finally {
      setSending(false);
    }
    fire(used instanceof HTMLElement ? { origin: used } : undefined);
    const firstName = about.name.trim().split(" ")[0];
    const email = about.email.trim();
    complete(
      [
        {
          question: "What are we making?",
          answer: services
            .filter((service) => chosen.includes(service.value))
            .map((service) => service.label)
            .join(", "),
        },
        { question: "What's the budget?", answer: budgets.find((option) => option.value === budget)?.label ?? "" },
        { question: "About you", answer: [about.name.trim(), about.company.trim()].filter(Boolean).join(", ") },
        { question: "How should we follow up?", answer: followUp === "call" ? "Booked a call" : "Email me" },
      ],
      followUp === "call"
        ? "Thanks, " + firstName + ". Your call is booked; the invite is on its way to " + email + "."
        : "Thanks, " + firstName + ". We'll write to " + email + " within a day.",
    );
  }

  const copy = steps[step - 1];
  const lastStep = step === steps.length;

  return (
    <ChatDock.Gate
      ref={gateRef}
      title={copy.title}
      subtitle={copy.subtitle}
      step={step}
      stepCount={steps.length}
      onPrevious={() => {
        setFailed(null);
        setStep((current) => Math.max(1, current - 1));
      }}
      onNext={
        !lastStep
          ? () => setStep((current) => current + 1)
          : failed != null
            ? () => {
                void finish(failed);
              }
            : undefined
      }
      continueLabel={lastStep && failed != null ? "Try again" : undefined}
      canContinue={canContinue}
      pending={sending}
      error={lastStep && failed != null ? "We couldn't send your answers. Check your connection and try again." : undefined}
      onClose={close}
      footerStart={
        lastStep ? (
          <CalEmbed.Skip
            onSkip={() => {
              void finish("email");
            }}
          />
        ) : undefined
      }
    >
      {step === 1 ? (
        <div className="flex w-full flex-col" role="group" aria-label="Services">
          {services.map((service, index) => (
            <div key={service.value} className="flex w-full items-center gap-3 border-b border-border py-3 last:border-b-0">
              <Checkbox
                className="min-w-0 flex-1"
                size="md"
                label={service.label}
                checked={chosen.includes(service.value)}
                onChange={() => toggleService(service.value)}
              />
              <Kbd className="shrink-0" aria-label={"Press " + (index + 1)}>
                {index + 1}
              </Kbd>
            </div>
          ))}
        </div>
      ) : null}
      {step === 2 ? (
        <div className="flex w-full flex-col" role="radiogroup" aria-label="Budget">
          {budgets.map((option, index) => (
            <div key={option.value} className="flex w-full items-center gap-3 border-b border-border py-3 last:border-b-0">
              <Radio
                className="min-w-0 flex-1"
                size="md"
                name={budgetName}
                value={option.value}
                label={option.label}
                checked={budget === option.value}
                onChange={() => setBudget(option.value)}
              />
              <Kbd className="shrink-0" aria-label={"Press " + (index + 1)}>
                {index + 1}
              </Kbd>
            </div>
          ))}
        </div>
      ) : null}
      {/* The short form: in the chat, a company or a link goes in the project details. */}
      {step === 3 ? <IntakeForm values={about} onChange={setAbout} company={false} link={false} /> : null}
      {lastStep ? (
        <CalEmbed skip={false}>
          {renderCalendar?.(() => {
            void finish("call");
          })}
        </CalEmbed>
      ) : null}
    </ChatDock.Gate>
  );
}
