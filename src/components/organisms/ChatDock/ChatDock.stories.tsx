import { useId, useRef, useState, type ReactNode } from "react";
import { MotionConfig } from "motion/react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { waitFor } from "storybook/test";
import { ArrowRight, CalendarClock, DollarSign } from "lucide-react";
import { storyMetaDocsDefaults, withStoryCopySource } from "../../../lib/storyCopySource";
import { storybookViewports } from "../../../lib/viewports";
import { Avatar } from "../../atoms/Avatar/Avatar";
import { Button } from "../../atoms/Button/Button";
import { Checkbox } from "../../atoms/Checkbox/Checkbox";
import { Kbd } from "../../atoms/Kbd/Kbd";
import { useKbdChoiceKeys } from "../../atoms/Kbd/useKbdChoiceKeys";
import { Radio } from "../../atoms/Radio/Radio";
import { CalEmbed } from "../../molecules/CalEmbed/CalEmbed";
import { ChatQa, type ChatQaPair } from "../../molecules/ChatQa/ChatQa";
import {
  IntakeForm,
  intakeAboutEmpty,
  isIntakeAboutValid,
  type IntakeAboutValues,
} from "../../molecules/IntakeForm/IntakeForm";
import { ConfettiProvider, useConfetti } from "../Confetti/Confetti";
import {
  ChatDock,
  type ChatDockFeedback,
  type ChatDockMessage,
  type ChatDockMessageMeta,
  type ChatDockSuggestion,
} from "./ChatDock";

const reviewViewports = {
  ...storybookViewports,
  review1280: {
    name: "Review 1280",
    styles: { width: "1280px", height: "800px" },
    type: "desktop" as const,
  },
  review1440: {
    name: "Review 1440",
    styles: { width: "1440px", height: "900px" },
    type: "desktop" as const,
  },
  review390: {
    name: "Review 390",
    styles: { width: "390px", height: "844px" },
    type: "mobile" as const,
  },
};

const chatDockCopySource = `
import { useState, type ReactNode } from "react";
import { ArrowRight, CalendarClock, DollarSign } from "lucide-react";
import {
  Avatar,
  ChatDock,
  ChatQa,
  type ChatDockFeedback,
  type ChatDockMessage,
  type ChatDockMessageMeta,
  type ChatDockSuggestion,
  type ChatQaPair,
} from "@thewhatmatters/wmds";

const suggestions: ChatDockSuggestion[] = [
  {
    id: "cost",
    label: "How much does a project cost?",
    prompt: "How much does a project cost?",
    icon: <DollarSign />,
  },
  {
    id: "timeline",
    label: "How long does a project take?",
    prompt: "How long does a project take?",
    icon: <CalendarClock />,
  },
  { id: "start", label: "Start a project", icon: <ArrowRight /> },
];

/** What the assistant knows when it opens Start a project — services and budget, or nothing yet. */
export interface StartProjectRequest {
  services?: string[];
  budget?: string;
}

/**
 * What \`ask\` resolves with: the reply, or the reply with its follow-ups, its score, the text Copy
 * copies, and a Start a project request when the assistant opens the gate.
 */
export type AskWhatMattersResult =
  | string
  | {
      reply: string;
      followUps?: ChatDockSuggestion[];
      meta?: ChatDockMessageMeta;
      copyText?: string;
      startProject?: StartProjectRequest;
    };

/** What the Start a project gate gets: the request, and how to close or complete it. */
export interface StartProjectGateSlot {
  request: StartProjectRequest;
  close: () => void;
  complete: (answers: ChatQaPair[], confirmation: string) => void;
}

export interface AskWhatMattersProps {
  /** The app's assistant request. Resolves with the reply, and with its follow-ups, score, copy text, or a Start a project request. */
  ask: (prompt: string, history: ChatDockMessage[]) => Promise<AskWhatMattersResult>;
  /** The visitor voted on a reply, or cleared their vote (\`null\`). */
  onFeedback: (reply: ChatDockMessage, value: ChatDockFeedback) => void;
  /** Start a project is open while this is set: what the assistant already knows, or \`{}\`. A site button can set it too. */
  startProject: StartProjectRequest | null;
  onStartProjectChange: (request: StartProjectRequest | null) => void;
  /** The gate — return **Pattern — start a project gate** with the slot spread onto it. It sits in the conversation, under the latest message. */
  renderStartProject: (slot: StartProjectGateSlot) => ReactNode;
}

export function AskWhatMatters({
  ask,
  onFeedback,
  startProject,
  onStartProjectChange,
  renderStartProject,
}: AskWhatMattersProps) {
  const [messages, setMessages] = useState<ChatDockMessage[]>([]);
  const [thinking, setThinking] = useState(false);
  const [followUps, setFollowUps] = useState<ChatDockSuggestion[]>([]);

  async function handleSend(prompt: string) {
    const question: ChatDockMessage = { id: crypto.randomUUID(), role: "user", content: prompt };
    const history = [...messages, question];
    setMessages(history);
    setFollowUps([]);
    setThinking(true);
    try {
      const result = await ask(prompt, history);
      const answer: Exclude<AskWhatMattersResult, string> = typeof result === "string" ? { reply: result } : result;
      setMessages((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: answer.reply,
          copyText: answer.copyText ?? answer.reply,
          meta: answer.meta,
          feedback: null,
        },
      ]);
      setFollowUps(answer.followUps ?? []);
      if (answer.startProject != null) onStartProjectChange(answer.startProject);
    } finally {
      setThinking(false);
    }
  }

  function handleFeedback(reply: ChatDockMessage, value: ChatDockFeedback) {
    setMessages((current) =>
      current.map((message) => (message.id === reply.id ? { ...message, feedback: value } : message)),
    );
    onFeedback(reply, value);
  }

  function completeStartProject(answers: ChatQaPair[], confirmation: string) {
    setMessages((current) => [
      ...current,
      { id: crypto.randomUUID(), role: "assistant", content: <ChatQa pairs={answers} aria-label="Your project" /> },
      { id: crypto.randomUUID(), role: "assistant", content: confirmation },
    ]);
    setFollowUps([]);
    onStartProjectChange(null);
  }

  return (
    <ChatDock
      title="WhatMatters"
      subtitle="Ask anything"
      gateSubtitle="Start a project"
      mark={<Avatar name="WhatMatters" size="md" />}
      greeting="Hi, I'm the WhatMatters assistant. Ask about our work, our process, pricing, or how to start a project."
      messages={messages}
      thinking={thinking}
      suggestions={suggestions}
      followUps={followUps}
      onSend={(prompt) => {
        void handleSend(prompt);
      }}
      onSuggestionSelect={(suggestion) => {
        if (suggestion.id === "start") onStartProjectChange({});
      }}
      onMessageFeedback={handleFeedback}
      gate={
        startProject == null
          ? undefined
          : renderStartProject({
              request: startProject,
              close: () => onStartProjectChange(null),
              complete: completeStartProject,
            })
      }
      placeholder="Ask anything about WhatMatters"
      disclaimer="Answers may be incomplete · AI assistant by WhatMatters"
    />
  );
}
`.trim();

const startProjectGateCopySource = `
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
  /** What the assistant already picked up from the conversation, or \`{}\`. */
  request: { services?: string[]; budget?: string };
  /** Leaves the gate — its Cancel. Closing the window (its close or Escape) keeps the gate, with its progress. */
  close: () => void;
  /** Ends the gate; the conversation shows the answers and the confirmation. */
  complete: (answers: ChatQaPair[], confirmation: string) => void;
  /** Sends the intake. Resolve once it is sent; reject to keep the answers and offer Try again. */
  onSubmit: (intake: StartProjectIntake) => Promise<void>;
  /** The booking calendar. Call \`booked\` once the visitor confirms a time. Leave it out to show the empty state. */
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
      {step === 3 ? <IntakeForm values={about} onChange={setAbout} /> : null}
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
`.trim();

const suggestions: ChatDockSuggestion[] = [
  {
    id: "cost",
    label: "How much does a project cost?",
    prompt: "How much does a project cost?",
    icon: <DollarSign />,
  },
  {
    id: "timeline",
    label: "How long does a project take?",
    prompt: "How long does a project take?",
    icon: <CalendarClock />,
  },
  { id: "start", label: "Start a project", icon: <ArrowRight /> },
];

/** What the assistant knows when it opens Start a project — services and budget, or nothing yet. */
interface StartProjectRequest {
  services?: string[];
  budget?: string;
}

/**
 * What `ask` resolves with: the reply, or the reply with its follow-ups, its score, the text Copy
 * copies, and a Start a project request when the assistant opens the gate.
 */
type AskWhatMattersResult =
  | string
  | {
      reply: string;
      followUps?: ChatDockSuggestion[];
      meta?: ChatDockMessageMeta;
      copyText?: string;
      startProject?: StartProjectRequest;
    };

/** What the Start a project gate gets: the request, and how to close or complete it. */
interface StartProjectGateSlot {
  request: StartProjectRequest;
  close: () => void;
  complete: (answers: ChatQaPair[], confirmation: string) => void;
}

interface AskWhatMattersProps {
  /** The app's assistant request. Resolves with the reply, and with its follow-ups, score, copy text, or a Start a project request. */
  ask: (prompt: string, history: ChatDockMessage[]) => Promise<AskWhatMattersResult>;
  /** The visitor voted on a reply, or cleared their vote (`null`). */
  onFeedback: (reply: ChatDockMessage, value: ChatDockFeedback) => void;
  /** Start a project is open while this is set: what the assistant already knows, or `{}`. A site button can set it too. */
  startProject: StartProjectRequest | null;
  onStartProjectChange: (request: StartProjectRequest | null) => void;
  /** The gate — return **Pattern — start a project gate** with the slot spread onto it. It sits in the conversation, under the latest message. */
  renderStartProject: (slot: StartProjectGateSlot) => ReactNode;
}

function AskWhatMatters({
  ask,
  onFeedback,
  startProject,
  onStartProjectChange,
  renderStartProject,
}: AskWhatMattersProps) {
  const [messages, setMessages] = useState<ChatDockMessage[]>([]);
  const [thinking, setThinking] = useState(false);
  const [followUps, setFollowUps] = useState<ChatDockSuggestion[]>([]);

  async function handleSend(prompt: string) {
    const question: ChatDockMessage = { id: crypto.randomUUID(), role: "user", content: prompt };
    const history = [...messages, question];
    setMessages(history);
    setFollowUps([]);
    setThinking(true);
    try {
      const result = await ask(prompt, history);
      const answer: Exclude<AskWhatMattersResult, string> = typeof result === "string" ? { reply: result } : result;
      setMessages((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: answer.reply,
          copyText: answer.copyText ?? answer.reply,
          meta: answer.meta,
          feedback: null,
        },
      ]);
      setFollowUps(answer.followUps ?? []);
      if (answer.startProject != null) onStartProjectChange(answer.startProject);
    } finally {
      setThinking(false);
    }
  }

  function handleFeedback(reply: ChatDockMessage, value: ChatDockFeedback) {
    setMessages((current) =>
      current.map((message) => (message.id === reply.id ? { ...message, feedback: value } : message)),
    );
    onFeedback(reply, value);
  }

  function completeStartProject(answers: ChatQaPair[], confirmation: string) {
    setMessages((current) => [
      ...current,
      { id: crypto.randomUUID(), role: "assistant", content: <ChatQa pairs={answers} aria-label="Your project" /> },
      { id: crypto.randomUUID(), role: "assistant", content: confirmation },
    ]);
    setFollowUps([]);
    onStartProjectChange(null);
  }

  return (
    <ChatDock
      title="WhatMatters"
      subtitle="Ask anything"
      gateSubtitle="Start a project"
      mark={<Avatar name="WhatMatters" size="md" />}
      greeting="Hi, I'm the WhatMatters assistant. Ask about our work, our process, pricing, or how to start a project."
      messages={messages}
      thinking={thinking}
      suggestions={suggestions}
      followUps={followUps}
      onSend={(prompt) => {
        void handleSend(prompt);
      }}
      onSuggestionSelect={(suggestion) => {
        if (suggestion.id === "start") onStartProjectChange({});
      }}
      onMessageFeedback={handleFeedback}
      gate={
        startProject == null
          ? undefined
          : renderStartProject({
              request: startProject,
              close: () => onStartProjectChange(null),
              complete: completeStartProject,
            })
      }
      placeholder="Ask anything about WhatMatters"
      disclaimer="Answers may be incomplete · AI assistant by WhatMatters"
    />
  );
}

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
interface StartProjectIntake {
  services: string[];
  budget: string | null;
  about: IntakeAboutValues;
  followUp: "call" | "email";
}

interface StartProjectGateProps {
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
  /** Storybook-only: opens on a later step, for the step stories. Not in the Show code. */
  startAt?: number;
}

function StartProjectGate({ request, close, complete, onSubmit, renderCalendar, startAt }: StartProjectGateProps) {
  const gateRef = useRef<HTMLDivElement>(null);
  const budgetName = useId();
  const { fire } = useConfetti();
  const [step, setStep] = useState(startAt ?? 1);
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
      {step === 3 ? <IntakeForm values={about} onChange={setAbout} /> : null}
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

/** Follow-ups carry no icon: inline rows all lead with the same arrow, and pills above the composer are text only. */
const followUpCost: ChatDockSuggestion = {
  id: "cost",
  label: "How much does a project cost?",
  prompt: "How much does a project cost?",
};
const followUpProcess: ChatDockSuggestion = {
  id: "process",
  label: "How does a project work?",
  prompt: "How does a project work?",
};
const followUpStart: ChatDockSuggestion = { id: "start", label: "Start a project" };

const makeReply =
  "Brand identity, web experiences, mobile apps, social media, content and copy, and AI assistants. Then launch, growth, and care once it ships.";

/** The app's match score for a reply — WMDS shows the text the app passes. */
function matchScore(percent: number): ChatDockMessageMeta {
  return {
    label: `Match ${percent}%`,
    description: "How sure the assistant is that it matched your question.",
  };
}

/**
 * Storybook stand-in for the app's request: a short pause, then a canned reply. Some replies bring
 * follow-ups or a match score and some do not — the app decides.
 */
function demoAsk(prompt: string): Promise<AskWhatMattersResult> {
  const text = prompt.toLowerCase();
  const result: AskWhatMattersResult = text.includes("make")
    ? { reply: makeReply, followUps: [followUpCost, followUpProcess, followUpStart], meta: matchScore(99) }
    : text.includes("cost")
      ? {
          reply: "Most projects start at a fixed scope. Tell us what you need and we'll send a range within a day.",
          followUps: [followUpProcess, followUpStart],
          meta: matchScore(97),
        }
      : text.includes("work")
        ? {
            reply: "A short discovery call, a written plan, then weekly reviews until launch.",
            followUps: [followUpStart],
            meta: matchScore(94),
          }
        : text.includes("long")
          ? { reply: "A focused brand or product sprint takes four to six weeks. Larger builds run in phases.", meta: matchScore(91) }
          : text.includes("brand")
            ? {
                reply: "A new brand is a good place to start. Tell us a little more and we'll take it from there.",
                meta: matchScore(96),
                startProject: { services: ["brand"] },
              }
            : "Good question. Share a little about the project and we'll point you to the right next step.";
  return new Promise((resolve) => {
    window.setTimeout(() => resolve(result), 1200);
  });
}

/** Storybook stand-in for the site's booking calendar: one button that books. */
function demoCalendar(booked: () => void): ReactNode {
  return (
    <Button role="primary" type="button" onClick={booked}>
      Book Tuesday at 10:00
    </Button>
  );
}

/** Storybook stand-in for the app's intake request: a short pause, then it is sent. */
function demoSend(): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, 600);
  });
}

/** Storybook stand-in for an intake request that fails — the network is down. */
function demoSendFails(): Promise<void> {
  return new Promise((_resolve, reject) => {
    window.setTimeout(() => reject(new Error("Network error")), 600);
  });
}

/** Page behind the dock — Storybook-only, so the pinned composer has something to sit over. */
function ChatDockPage({ initialStartProject = null }: { initialStartProject?: StartProjectRequest | null }) {
  const [startProject, setStartProject] = useState<StartProjectRequest | null>(initialStartProject);
  const [lastVote, setLastVote] = useState<ChatDockFeedback | undefined>(undefined);
  const [sent, setSent] = useState<StartProjectIntake | null>(null);

  return (
    <ConfettiProvider>
      <div className="min-h-[150vh] bg-body">
        <main className="grid-page pt-24">
          <div className="band">
            <div className="col-span-full flex flex-col items-start gap-4 lg:col-span-8">
              <h1 className="type-display-2 text-fg">We build what matters.</h1>
              <p className="type-large text-muted">
                Hover the composer for suggested questions. Click into it to open the chat window. The page stays
                usable behind it. Ask &quot;I need a new brand&quot; and the assistant opens Start a project with the
                brand picked.
              </p>
              <Button role="primary" type="button" onClick={() => setStartProject({})}>
                Start a project
              </Button>
              <p className="type-body text-muted" aria-live="polite">
                {sent != null ? "The app got the intake (" + sent.followUp + "). " : ""}
                {lastVote === undefined
                  ? "Votes on a reply go to the app's handler."
                  : lastVote === null
                    ? "The app's handler got a cleared vote."
                    : "The app's handler got a " + (lastVote === "up" ? "helpful" : "not helpful") + " vote."}
              </p>
            </div>
          </div>
        </main>
        <AskWhatMatters
          ask={demoAsk}
          onFeedback={(_reply, value) => setLastVote(value)}
          startProject={startProject}
          onStartProjectChange={setStartProject}
          renderStartProject={(slot) => (
            <StartProjectGate
              {...slot}
              onSubmit={async (intake) => {
                await demoSend();
                setSent(intake);
              }}
              renderCalendar={demoCalendar}
            />
          )}
        />
      </div>
    </ConfettiProvider>
  );
}

const conversation: ChatDockMessage[] = [
  { id: "q1", role: "user", content: "How much does a project cost?" },
  {
    id: "a1",
    role: "assistant",
    content: "Most projects start at a fixed scope. Tell us what you need and we'll send a range within a day.",
  },
  { id: "q2", role: "user", content: "Do you work with early-stage teams?" },
];

const greeting =
  "Hi, I'm the WhatMatters assistant. Ask about our work, our process, pricing, or how to start a project.";

const mark = <Avatar name="WhatMatters" size="md" />;

const meta = {
  title: "Components/ChatDock",
  component: ChatDock,
  tags: ["autodocs"],
  ...storyMetaDocsDefaults(),
  parameters: {
    wmdsLayout: "fullscreen",
    viewport: { options: reviewViewports },
    docs: {
      description: {
        component: `
## Usage
The site's assistant, pinned to the bottom of the page. At rest it is a **PromptBar** with the brand mark. Hovering the bar shows suggested questions as pills above it. Clicking or typing into it opens the chat window around the same composer: the window grows up and out of the bar, the mark moves to the header, and the composer keeps its width, rising only by the disclaimer line under it. Escape or **Close chat** folds the window back into the bar. Either can interrupt the other midway.

The window is not modal: the page behind it stays usable. On phones it fills the screen, rising from the bottom edge, and stays in the part a keyboard leaves visible. With reduced motion the window crossfades in place. The app owns the conversation: it passes \`messages\`, sets \`thinking\` while a reply is on its way, and appends the reply. Copy **Pattern — chat dock**.

A \`gate\` puts a multi-step form — **ChatDock.Gate**, for Start a project — in the conversation, under the latest message, where a reply would go. The window keeps its header and its close; the composer stays in place but is off until the form finishes or is cancelled. The window grows to fit the form, up to the viewport, and past that the conversation scrolls. Copy **Pattern — start a project gate**.

| Prop | Contract |
|------|----------|
| \`title\`, \`subtitle\`, \`mark\` | Window header. \`mark\` is an **Avatar** \`size="md"\`; it also starts the resting bar. \`gateSubtitle\` replaces the subtitle while a gate is up (for example "Start a project"); without it the subtitle is hidden then |
| \`greeting\` | First assistant message, always at the top |
| \`messages\` | \`{ id, role: "user" \\| "assistant", content }[]\`, oldest first. \`content\` is text or Markdown the app already rendered. Replies can add \`copyText\` (shows **Copy**), \`meta\` (\`{ label, description? }\`, a muted note such as the match score), and \`feedback\` (\`"up" \\| "down" \\| null\`, the visitor's vote; \`null\` until they vote, left out on replies that take no vote) |
| \`thinking\` | Shows the thinking row after the last message |
| \`suggestions\` | \`{ id, label, icon?, prompt? }[]\`. With \`prompt\`: a pill at rest and a row in the window, and choosing it sends the prompt. Without: a row only, and \`onSuggestionSelect\` runs (for example **Start a project**) |
| \`followUps\` | The same items as \`suggestions\`, for the latest reply only; their \`icon\` is not shown. Shown while the last message is an assistant reply and \`thinking\` is off; gone the moment the visitor sends. The app decides which replies get them |
| \`followUpsPlacement\` | \`inline\` (default): rows in the conversation, under the reply. \`composer\`: pills pinned above the composer |
| \`onSend\` | Receives the typed message, a suggestion's prompt, or a follow-up's prompt |
| \`onMessageFeedback\` | Shows the thumbs under finished replies that carry \`feedback\` and receives each vote (\`null\` clears it). The app passes the vote back as the reply's \`feedback\` |
| \`gate\` | A form in the conversation — **ChatDock.Gate** with its steps, under the latest message. Setting it opens the window and moves focus in; the composer stays in place but is off (its placeholder says why), and the suggestion rows and follow-ups step aside. The window grows to fit the form, up to the viewport less 7rem; past that the conversation scrolls, and each step is brought into view. The window's close and Escape fold it and keep the gate, with its progress, for when it reopens; the gate's Cancel clears it and the composer comes back with focus. The window stays non-modal |
| \`open\` / \`onOpenChange\` | Optional control of the window |
| \`placement\` | \`fixed\` (default) pins it to the viewport; \`inline\` keeps it in flow for previews |

## Anatomy
\`\`\`
ChatDock — fixed to the bottom, page grid at --grid-max 40rem, under SiteNav
├── suggestion pills — Button secondary md + icon, on hover while the window is closed
├── window — opaque card on the surface behind the composer; grows from the bar (full screen below md, rising from the bottom edge)
│   ├── header — mark · title · subtitle | IconButton close (shared overlay header)
│   ├── conversation — greeting, replies as text, visitor turns on the brand tint, thinking row (Status dot); scrolls, stays at the end
│   │   ├── reply row — IconButton ghost Copy · thumbs up / down (toggles) · score caption; under finished replies, on hover or focus (always on touch)
│   │   └── follow-ups (inline) — Button ghost rows under the latest reply, each led by the corner-down-right arrow, 44px on phones
│   ├── suggestion rows — Button ghost row + icon, until the first message
│   └── follow-ups (composer) — Button secondary pills, text only, wrap
└── composer — one PromptBar in both states; off while a gate is up
    ├── start: mark — folds away while the window is open
│   │   └── gate — ChatDock.Gate under the latest message: hairline · step title, subtitle | previous · "2 of 4" · next · step · hairline · pending or error line · footer (start slot | Cancel · Next)
    └── disclaimer — caption, muted, opens under the composer
\`\`\`

## Best practices
- **Do** keep pill suggestions to two or three short questions. Put actions such as **Start a project** in the list only (no \`prompt\`).
- **Do** stream replies by updating the last assistant message's \`content\`; the thread stays pinned to the end while the reader is there.
- **Do** pass \`followUps\` only after replies that have an obvious next question — one to three, short labels — and clear them when the visitor sends. Leave out \`icon\`: every inline row leads with the same corner-down-right arrow, and pills above the composer are text only. Copy the follow-up state from **Pattern — chat dock**.
- **Do** keep follow-ups \`inline\`. They read as part of the answer and cost the conversation no height on a phone. Use \`composer\` only where the thread is long and the follow-ups must stay beside the field.
- **Do** pass \`meta\` only for a score the app stands behind: a short \`label\` ("Match 99%") and a \`description\` that says what it measures. It is read to screen readers after the label.
- **Do** keep votes in the app and pass each one back as the reply's \`feedback\`. **Pattern — chat dock** holds them and hands each vote to \`onFeedback\`.
- **Don't** put buttons or scores inside a reply's \`content\` — use \`copyText\`, \`meta\`, and \`onMessageFeedback\`.
- **Do** run Start a project as a \`gate\`, not a dialog over the chat: the form sits in the conversation, and its answers and the confirmation take its place when it finishes. Pass \`gateSubtitle\` with the form's name. Copy **Pattern — start a project gate** and return it from **Pattern — chat dock**'s \`renderStartProject\`.
- **Do** return the send's promise from the gate's \`onSubmit\` and reject when it fails: the gate keeps every answer, shows the error, and offers Try again. Don't thank the visitor before the send resolves.
- **Don't** put a form inside a message's \`content\`. When a gate finishes, add its answers as a message (**ChatQa**) and a confirmation line, as the patterns do.
- **Don't** make suggestions the only way to ask: touch devices never see the pills, only the rows in the window.
- **Don't** add a second send arrow or an expand button to the header. Send is the composer's arrow. Voice is not part of this version.
- **Don't** mount a second dock on a page, or restyle **SiteNav** to make room for it.
        `.trim(),
      },
    },
  },
} satisfies Meta<typeof ChatDock>;

export default meta;

type Story = StoryObj<typeof ChatDock>;

export const PatternChatDock: Story = {
  name: "Pattern — chat dock",
  globals: {
    viewport: { value: "review1440", isRotated: false },
  },
  parameters: withStoryCopySource(
    {
      docs: {
        story: { inline: false, height: "720px" },
        description: {
          story:
            "The site assistant on a page. Hover the composer for the two suggested questions; click into it to open the window. **Start a project** runs the app's handler instead of sending. The reply here is a canned stand-in for the app's request.",
        },
      },
    },
    chatDockCopySource,
  ),
  render: () => <ChatDockPage />,
};

export const Open: Story = {
  name: "Open",
  parameters: {
    docs: {
      description: {
        story: "The window before the first message: greeting, suggestion rows, composer, disclaimer.",
      },
    },
  },
  render: () => (
    <div className="bg-body py-8">
      <ChatDock
        placement="inline"
        defaultOpen
        title="WhatMatters"
        subtitle="Ask anything"
        mark={mark}
        greeting={greeting}
        suggestions={suggestions}
        onSend={() => undefined}
        placeholder="Ask anything about WhatMatters"
        disclaimer="Answers may be incomplete · AI assistant by WhatMatters"
      />
    </div>
  ),
};

export const Conversation: Story = {
  name: "Conversation",
  parameters: {
    docs: {
      description: {
        story: "After the first message the suggestion rows give way to the thread. `thinking` shows the row under the last turn.",
      },
    },
  },
  render: () => (
    <div className="bg-body py-8">
      <ChatDock
        placement="inline"
        defaultOpen
        title="WhatMatters"
        subtitle="Ask anything"
        mark={mark}
        greeting={greeting}
        messages={conversation}
        thinking
        suggestions={suggestions}
        onSend={() => undefined}
        placeholder="Ask anything about WhatMatters"
        disclaimer="Answers may be incomplete · AI assistant by WhatMatters"
      />
    </div>
  ),
};

export const AtRest: Story = {
  name: "At rest",
  parameters: {
    docs: {
      description: {
        story: "The resting bar. Hover it to show the suggestion pills above it; click into it to open the window. An inline specimen keeps the open window's height free above the bar.",
      },
    },
  },
  render: () => (
    <div className="bg-body py-8">
      <ChatDock
        placement="inline"
        title="WhatMatters"
        subtitle="Ask anything"
        mark={mark}
        greeting={greeting}
        suggestions={suggestions}
        onSend={() => undefined}
        placeholder="Ask anything about WhatMatters"
      />
    </div>
  ),
};

export const ReducedMotion: Story = {
  name: "Reduced motion",
  parameters: {
    docs: {
      description: {
        story:
          "With reduced motion the window does not grow or rise: it crossfades in place at full size. Nothing slides: the mark and the disclaimer line under the composer switch at once, so the composer steps up by that line. Click into the bar to open it.",
      },
    },
  },
  render: () => (
    <MotionConfig reducedMotion="always">
      <div className="bg-body py-8">
        <ChatDock
          placement="inline"
          title="WhatMatters"
          subtitle="Ask anything"
          mark={mark}
          greeting={greeting}
          suggestions={suggestions}
          onSend={() => undefined}
          placeholder="Ask anything about WhatMatters"
          disclaimer="Answers may be incomplete · AI assistant by WhatMatters"
        />
      </div>
    </MotionConfig>
  ),
};

export const At390: Story = {
  name: "At 390",
  globals: {
    viewport: { value: "review390", isRotated: false },
  },
  parameters: {
    docs: {
      story: { inline: false, height: "844px" },
      description: {
        story: "On phones the window fills the screen, above the site navigation. The pills never show on touch; the rows do.",
      },
    },
  },
  render: () => (
    <div className="min-h-screen bg-body">
      <ChatDock
        defaultOpen
        title="WhatMatters"
        subtitle="Ask anything"
        mark={mark}
        greeting={greeting}
        suggestions={suggestions}
        onSend={() => undefined}
        placeholder="Ask anything about WhatMatters"
        disclaimer="Answers may be incomplete · AI assistant by WhatMatters"
      />
    </div>
  ),
};

const followUpConversation: ChatDockMessage[] = [
  { id: "q1", role: "user", content: "What do you make?" },
  { id: "a1", role: "assistant", content: makeReply },
];

const followUpItems = [followUpCost, followUpProcess, followUpStart];

function FollowUpsSpecimen({ followUpsPlacement }: { followUpsPlacement: "inline" | "composer" }) {
  return (
    <div className="min-h-screen bg-body">
      <ChatDock
        defaultOpen
        title="WhatMatters"
        subtitle="Ask anything"
        mark={mark}
        greeting={greeting}
        messages={followUpConversation}
        suggestions={suggestions}
        followUps={followUpItems}
        followUpsPlacement={followUpsPlacement}
        onSend={() => undefined}
        placeholder="Ask anything about WhatMatters"
        disclaimer="Answers may be incomplete · AI assistant by WhatMatters"
      />
    </div>
  );
}

export const FollowUpsInline: Story = {
  name: "Follow-ups — inline",
  globals: {
    viewport: { value: "review1280", isRotated: false },
  },
  parameters: {
    docs: {
      story: { inline: false, height: "800px" },
      description: {
        story:
          "Default. Three follow-ups as rows directly under the reply they belong to. They read as part of the answer and take no fixed height; they scroll with the thread, which stays pinned to the end.",
      },
    },
  },
  render: () => <FollowUpsSpecimen followUpsPlacement="inline" />,
};

export const FollowUpsAboveComposer: Story = {
  name: "Follow-ups — above the composer",
  globals: {
    viewport: { value: "review1280", isRotated: false },
  },
  parameters: {
    docs: {
      story: { inline: false, height: "800px" },
      description: {
        story:
          "`followUpsPlacement=\"composer\"`. The same three follow-ups as pills pinned between the conversation and the composer. At this width two fit on a line.",
      },
    },
  },
  render: () => <FollowUpsSpecimen followUpsPlacement="composer" />,
};

export const FollowUpsInlineAt390: Story = {
  name: "Follow-ups — inline at 390",
  globals: {
    viewport: { value: "review390", isRotated: false },
  },
  parameters: {
    docs: {
      story: { inline: false, height: "844px" },
      description: {
        story: "Inline at 390. Each row is a 44px target and a long label stays on one line.",
      },
    },
  },
  render: () => <FollowUpsSpecimen followUpsPlacement="inline" />,
};

export const FollowUpsAboveComposerAt390: Story = {
  name: "Follow-ups — above the composer at 390",
  globals: {
    viewport: { value: "review390", isRotated: false },
  },
  parameters: {
    docs: {
      story: { inline: false, height: "844px" },
      description: {
        story:
          "Above the composer at 390. Each pill takes its own line, so three follow-ups take about 150px from the conversation, and more once the keyboard is open.",
      },
    },
  },
  render: () => <FollowUpsSpecimen followUpsPlacement="composer" />,
};

const costReply = "Most projects start at a fixed scope. Tell us what you need and we'll send a range within a day.";

const replyConversation: ChatDockMessage[] = [
  { id: "q1", role: "user", content: "What do you make?" },
  { id: "a1", role: "assistant", content: makeReply, copyText: makeReply, meta: matchScore(99), feedback: "up" },
  { id: "q2", role: "user", content: "How much does a project cost?" },
  { id: "a2", role: "assistant", content: costReply, copyText: costReply, meta: matchScore(97), feedback: null },
];

/** Holds the votes the way **Pattern — chat dock** does, so the thumbs toggle. */
function ReplyActionsSpecimen() {
  const [messages, setMessages] = useState(replyConversation);
  return (
    <div className="min-h-screen bg-body">
      <ChatDock
        defaultOpen
        title="WhatMatters"
        subtitle="Ask anything"
        mark={mark}
        greeting={greeting}
        messages={messages}
        suggestions={suggestions}
        onSend={() => undefined}
        onMessageFeedback={(reply, value) =>
          setMessages((current) =>
            current.map((message) => (message.id === reply.id ? { ...message, feedback: value } : message)),
          )
        }
        placeholder="Ask anything about WhatMatters"
        disclaimer="Answers may be incomplete · AI assistant by WhatMatters"
      />
    </div>
  );
}

/** Focuses the latest reply's Copy, as a keyboard user tabbing into the row would. */
async function focusLatestCopy(canvasElement: HTMLElement) {
  const rows = canvasElement.querySelectorAll<HTMLElement>("[data-reply-actions='ready']");
  rows[rows.length - 1]?.querySelector<HTMLButtonElement>("button")?.focus();
}

export const ReplyActions: Story = {
  name: "Reply actions",
  globals: {
    viewport: { value: "review1280", isRotated: false },
  },
  parameters: {
    docs: {
      story: { inline: false, height: "800px" },
      description: {
        story:
          "Hover a reply to show its row: **Copy** (`copyText`), the thumbs (`onMessageFeedback`), and the score (`meta`). The row keeps its place while hidden, so the thread never moves. The first reply has a helpful vote; pressing the active thumb clears it. On a touch screen the row is always shown.",
      },
    },
  },
  render: () => <ReplyActionsSpecimen />,
};

export const ReplyActionsKeyboardFocus: Story = {
  name: "Reply actions — keyboard focus",
  globals: {
    viewport: { value: "review1280", isRotated: false },
  },
  parameters: {
    docs: {
      story: { inline: false, height: "800px" },
      description: {
        story: "Focus inside a reply shows its row, so keyboard users reach the same actions. Here the latest reply's Copy has focus.",
      },
    },
  },
  render: () => <ReplyActionsSpecimen />,
  play: async ({ canvasElement }) => {
    await focusLatestCopy(canvasElement);
  },
};

export const ReplyActionsDark: Story = {
  name: "Reply actions — dark",
  globals: {
    viewport: { value: "review1280", isRotated: false },
    theme: "dark",
  },
  parameters: {
    docs: {
      story: { inline: false, height: "800px" },
      description: { story: "The same row in the dark theme, shown by keyboard focus." },
    },
  },
  render: () => <ReplyActionsSpecimen />,
  play: async ({ canvasElement }) => {
    await focusLatestCopy(canvasElement);
  },
};

export const ReplyActionsAt390: Story = {
  name: "Reply actions at 390",
  globals: {
    viewport: { value: "review390", isRotated: false },
  },
  parameters: {
    docs: {
      story: { inline: false, height: "844px" },
      description: {
        story:
          "On phones each button is a 44px target. A touch screen shows the row under every finished reply without hover; a desktop browser at this width still reveals it on hover or focus (focus shown here).",
      },
    },
  },
  render: () => <ReplyActionsSpecimen />,
  play: async ({ canvasElement }) => {
    await focusLatestCopy(canvasElement);
  },
};

export const ReplyActionsAt390Dark: Story = {
  name: "Reply actions at 390 — dark",
  globals: {
    viewport: { value: "review390", isRotated: false },
    theme: "dark",
  },
  parameters: {
    docs: {
      story: { inline: false, height: "844px" },
      description: { story: "The phone row in the dark theme." },
    },
  },
  render: () => <ReplyActionsSpecimen />,
  play: async ({ canvasElement }) => {
    await focusLatestCopy(canvasElement);
  },
};

const gateReply = "We can do both. Start a project and we'll get back to you within a day.";

const gateConversation: ChatDockMessage[] = [
  { id: "q1", role: "user", content: "I need a new brand and a site to go with it." },
  { id: "a1", role: "assistant", content: gateReply, copyText: gateReply, meta: matchScore(98), feedback: null },
];

/**
 * A dock with Start a project open on `step`, the way the site wires **Pattern — start a project
 * gate** through **Pattern — chat dock**. Storybook-only.
 */
function GateSpecimen({
  step,
  send = demoSend,
  conversation = gateConversation,
}: {
  step: number;
  /** The app's intake request. Default: sent after a short pause. */
  send?: () => Promise<void>;
  /** The conversation above the form. Default: one question and the reply that opened the form. */
  conversation?: ChatDockMessage[];
}) {
  const [messages, setMessages] = useState(conversation);
  const [gateOpen, setGateOpen] = useState(true);

  return (
    <ConfettiProvider>
      <div className="min-h-screen bg-body">
        <ChatDock
          defaultOpen
          title="WhatMatters"
          subtitle="Ask anything"
          gateSubtitle="Start a project"
          mark={mark}
          greeting={greeting}
          messages={messages}
          suggestions={suggestions}
          onSend={() => undefined}
          onMessageFeedback={(reply, value) =>
            setMessages((current) =>
              current.map((message) => (message.id === reply.id ? { ...message, feedback: value } : message)),
            )
          }
          gate={
            gateOpen ? (
              <StartProjectGate
                startAt={step}
                request={{ services: ["brand", "web"], budget: "25-50" }}
                close={() => setGateOpen(false)}
                complete={(answers, confirmation) => {
                  setMessages((current) => [
                    ...current,
                    { id: "summary", role: "assistant", content: <ChatQa pairs={answers} aria-label="Your project" /> },
                    { id: "confirmation", role: "assistant", content: confirmation },
                  ]);
                  setGateOpen(false);
                }}
                onSubmit={send}
                renderCalendar={demoCalendar}
              />
            ) : undefined
          }
          placeholder="Ask anything about WhatMatters"
          disclaimer="Answers may be incomplete · AI assistant by WhatMatters"
        />
      </div>
    </ConfettiProvider>
  );
}

export const PatternStartProjectGate: Story = {
  name: "Pattern — start a project gate",
  globals: {
    viewport: { value: "review1280", isRotated: false },
  },
  parameters: withStoryCopySource(
    {
      docs: {
        story: { inline: false, height: "800px" },
        description: {
          story:
            "Start a project in the conversation: **ChatDock.Gate** holds the four steps — name the work, budget, about you, book a call — under the latest reply, set off by a hairline. The window keeps its header (its subtitle becomes \"Start a project\") and grows to fit the step; the composer stays in place, off. Number keys pick the numbered options while focus is in the gate. The window's close or Escape folds it and keeps the answers for when it reopens; Cancel leaves the form and the composer comes back. Booking or skipping sends the intake (`onSubmit` returns a promise): \"Sending…\" shows meanwhile, and once it resolves confetti fires and the answers and a confirmation take the form's place. If it rejects, the answers stay and the gate offers Try again. Pass it through **Pattern — chat dock**'s `renderStartProject`; the services, budgets, copy, and calendar are yours to replace.",
        },
      },
    },
    startProjectGateCopySource,
  ),
  render: () => <GateSpecimen step={1} />,
};

/** Parameters and render for one step story; names, tags, and globals stay literal for the story index. */
function gateStepStory(step: number, viewport: "review1280" | "review390"): Pick<Story, "parameters" | "render"> {
  return {
    parameters: {
      docs: {
        story: { inline: false, height: viewport === "review1280" ? "800px" : "844px" },
        description: {
          story:
            viewport === "review1280"
              ? "Step " + step + " of **Pattern — start a project gate**, under the reply it answers. The window grows to fit the step, so it shows whole; the composer stays in place, off."
              : "Step " + step + " at 390: the conversation stays above the form and scrolls with it; each step is brought into view. Controls are 44px.",
        },
      },
    },
    render: () => <GateSpecimen step={step} />,
  };
}

const at1280 = { viewport: { value: "review1280", isRotated: false } };
const at390 = { viewport: { value: "review390", isRotated: false } };

export const GateStep1At1280: Story = {
  name: "Start a project — 1. Name the work at 1280",
  globals: at1280,
  ...gateStepStory(1, "review1280"),
};
export const GateStep2At1280: Story = {
  name: "Start a project — 2. Budget at 1280",
  globals: at1280,
  ...gateStepStory(2, "review1280"),
};
export const GateStep3At1280: Story = {
  name: "Start a project — 3. About you at 1280",
  globals: at1280,
  ...gateStepStory(3, "review1280"),
};
export const GateStep4At1280: Story = {
  name: "Start a project — 4. Book a call at 1280",
  globals: at1280,
  ...gateStepStory(4, "review1280"),
};
export const GateStep1At390: Story = {
  name: "Start a project — 1. Name the work at 390",
  globals: at390,
  ...gateStepStory(1, "review390"),
};
export const GateStep2At390: Story = {
  name: "Start a project — 2. Budget at 390",
  globals: at390,
  ...gateStepStory(2, "review390"),
};
export const GateStep3At390: Story = {
  name: "Start a project — 3. About you at 390",
  globals: at390,
  ...gateStepStory(3, "review390"),
};
export const GateStep4At390: Story = {
  name: "Start a project — 4. Book a call at 390",
  globals: at390,
  ...gateStepStory(4, "review390"),
};
const longReplyCost = "Most projects start at a fixed scope. Tell us what you need and we'll send a range within a day.";
const longReplyTime = "A focused brand or product sprint takes four to six weeks. Larger builds run in phases.";

/** A longer conversation before Start a project — the thread scrolls above the form. */
const longGateConversation: ChatDockMessage[] = [
  { id: "l1", role: "user", content: "What do you make?" },
  { id: "l2", role: "assistant", content: makeReply, copyText: makeReply, meta: matchScore(99), feedback: "up" },
  { id: "l3", role: "user", content: "How much does a project cost?" },
  { id: "l4", role: "assistant", content: longReplyCost, copyText: longReplyCost, meta: matchScore(97), feedback: null },
  { id: "l5", role: "user", content: "And how long does it take?" },
  { id: "l6", role: "assistant", content: longReplyTime, copyText: longReplyTime, meta: matchScore(91), feedback: null },
  ...gateConversation,
];

export const GateLongConversationAt1280: Story = {
  name: "Start a project — after a long conversation at 1280",
  globals: at1280,
  parameters: {
    docs: {
      story: { inline: false, height: "800px" },
      description: {
        story:
          "Three exchanges before the visitor asks for a new brand. The window has grown as far as the viewport allows; the form sits under the reply that opened it, whole, and the earlier turns scroll above it.",
      },
    },
  },
  render: () => <GateSpecimen step={1} conversation={longGateConversation} />,
};
export const GateLongConversationAt390: Story = {
  name: "Start a project — after a long conversation at 390",
  globals: at390,
  parameters: {
    docs: {
      story: { inline: false, height: "844px" },
      description: {
        story:
          "The same conversation at 390. The window fills the screen; the step is brought into view with the reply above it, and the earlier turns scroll.",
      },
    },
  },
  render: () => <GateSpecimen step={1} conversation={longGateConversation} />,
};
export const GateSendFailedAt1280: Story = {
  name: "Start a project — send failed at 1280",
  globals: at1280,
  parameters: {
    docs: {
      story: { inline: false, height: "800px" },
      description: {
        story:
          "The intake request rejects. The gate keeps every answer, says the send failed, and offers Try again in the footer; nothing lands in the conversation. Here the visitor chose to skip the call.",
      },
    },
  },
  render: () => <GateSpecimen step={4} send={demoSendFails} />,
  play: async ({ canvasElement }) => {
    const skip = await waitFor(() => {
      const link = Array.from(canvasElement.querySelectorAll<HTMLAnchorElement>("a")).find(
        (anchor) => anchor.textContent === "Skip, just email me",
      );
      if (link == null) throw new Error("Skip is missing");
      return link;
    });
    skip.click();
    await waitFor(
      () => {
        if (canvasElement.querySelector("[role='alert']") == null) throw new Error("No error yet");
      },
      { timeout: 3000 },
    );
  },
};
export const GateSendFailedAt390: Story = {
  name: "Start a project — send failed at 390",
  globals: at390,
  parameters: {
    docs: {
      story: { inline: false, height: "844px" },
      description: { story: "The failed send at 390: the error and Try again sit over the footer." },
    },
  },
  render: () => <GateSpecimen step={4} send={demoSendFails} />,
  play: GateSendFailedAt1280.play,
};
export const GateStep1At1280Dark: Story = {
  name: "Start a project — 1. Name the work at 1280, dark",
  tags: ["!autodocs"],
  globals: { ...at1280, theme: "dark" },
  ...gateStepStory(1, "review1280"),
};
export const GateStep2At1280Dark: Story = {
  name: "Start a project — 2. Budget at 1280, dark",
  tags: ["!autodocs"],
  globals: { ...at1280, theme: "dark" },
  ...gateStepStory(2, "review1280"),
};
export const GateStep3At1280Dark: Story = {
  name: "Start a project — 3. About you at 1280, dark",
  tags: ["!autodocs"],
  globals: { ...at1280, theme: "dark" },
  ...gateStepStory(3, "review1280"),
};
export const GateStep4At1280Dark: Story = {
  name: "Start a project — 4. Book a call at 1280, dark",
  tags: ["!autodocs"],
  globals: { ...at1280, theme: "dark" },
  ...gateStepStory(4, "review1280"),
};
export const GateStep1At390Dark: Story = {
  name: "Start a project — 1. Name the work at 390, dark",
  tags: ["!autodocs"],
  globals: { ...at390, theme: "dark" },
  ...gateStepStory(1, "review390"),
};
export const GateStep2At390Dark: Story = {
  name: "Start a project — 2. Budget at 390, dark",
  tags: ["!autodocs"],
  globals: { ...at390, theme: "dark" },
  ...gateStepStory(2, "review390"),
};
export const GateStep3At390Dark: Story = {
  name: "Start a project — 3. About you at 390, dark",
  tags: ["!autodocs"],
  globals: { ...at390, theme: "dark" },
  ...gateStepStory(3, "review390"),
};
export const GateStep4At390Dark: Story = {
  name: "Start a project — 4. Book a call at 390, dark",
  tags: ["!autodocs"],
  globals: { ...at390, theme: "dark" },
  ...gateStepStory(4, "review390"),
};
