import { useCallback, useEffect, useLayoutEffect, useRef, useState, type MouseEvent } from "react";
import { Copy, Sparkles, ThumbsDown, ThumbsUp } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "../../lib/cn";
import { motionTransitionProp } from "../../lib/motion";
import { Button } from "../../components/atoms/Button/Button";
import { IconButton } from "../../components/atoms/IconButton/IconButton";
import { TextLink } from "../../components/atoms/TextLink/TextLink";
import { ChatQa, type ChatQaPair } from "../../components/molecules/ChatQa/ChatQa";
import {
  intakeAboutEmpty,
  type IntakeAboutValues,
} from "../../components/molecules/IntakeForm/IntakeForm";
import { PromptBar } from "../../components/molecules/PromptBar/PromptBar";
import { ConfettiProvider } from "../../components/organisms/Confetti/Confetti";
import { SiteNav } from "../../components/organisms/SiteNav/SiteNav";
import {
  canContinueIntake,
  type IntakePhase,
  type IntakeStep,
} from "../Intake/IntakePattern";
import { PromptChatTrace } from "./PromptChatTrace";
import { PromptChatStartGate, promptChatIntakeQaPairs } from "./PromptChatStartGate";
import {
  promptChatActionsClasses,
  promptChatBarClasses,
  promptChatColumnClasses,
  promptChatComposerClasses,
  promptChatFollowUpClasses,
  promptChatFollowUpsClasses,
  promptChatHeadlineClasses,
  promptChatLandingClasses,
  promptChatPageClasses,
  promptChatReplyBlockClasses,
  promptChatReplyClasses,
  promptChatStageClasses,
  promptChatThreadClasses,
  promptChatUserClasses,
} from "./promptChatStyles";
import {
  promptChatFollowUps,
  promptChatPartDelay,
  promptChatReplyParts,
  promptChatSampleReply,
} from "./promptChatStream";
import {
  promptChatTraceBeatSeconds,
  promptChatTraceDurationSeconds,
  promptChatTraceSpinSeconds,
  promptChatTraces,
  type PromptChatTraceKind,
} from "./promptChatThinking";

export const promptChatHeadline = "What should we make?";

type Point = { top: number; left: number };

export const promptChatPatternCopySource = `
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type MouseEvent } from "react";
import { Check, ChevronDown, ChevronLeft, ChevronRight, Copy, LoaderCircle, Sparkle, Sparkles, ThumbsDown, ThumbsUp, X } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import {
  Button,
  CalEmbed,
  Card,
  cardLayoutBodyOccupantInsetXClasses,
  cardLayoutBodyOccupantWellClasses,
  cardSubtitleClasses,
  cardTitleClasses,
  ChatQa,
  Checkbox,
  ConfettiProvider,
  IconButton,
  IntakeConfirmation,
  IntakeForm,
  Kbd,
  PillGroup,
  PromptBar,
  SiteNav,
  TextLink,
  motionTransitionProp,
  useKbdChoiceKeys,
} from "@whatmatters/wmds";

const pageClasses = "flex h-[100svh] min-h-0 w-full flex-col overflow-hidden bg-body";
const columnClasses = "flex min-h-0 w-full flex-1 flex-col overflow-hidden [--grid-max:40rem]";
const stageClasses = "grid-page min-h-0 w-full flex-1 overflow-y-auto !py-0";
const landingClasses = "place-content-center";
const headlineClasses =
  "col-span-full type-display-2 !font-normal text-balance text-center text-brand";
const threadClasses = "col-span-full flex w-full min-w-0 flex-col items-start gap-6 pt-6";
const userClasses =
  "ml-auto max-w-full rounded-full bg-fill-selected px-4 py-2 type-body text-fg";
const replyClasses = "w-full type-body text-fg";
const replyBlockClasses =
  "group/reply w-full outline-none [&[data-actions=open]]:outline-none";
const traceClasses = "flex w-full flex-col items-start gap-2";
const traceTriggerClasses = "!w-auto !gap-1.5";
const traceBodyClasses =
  "flex w-full flex-col items-start gap-2 border-l border-border-control py-0.5 pl-3";
const traceLineClasses = "flex items-center gap-2 type-supporting text-muted";
const thinkingLabelClasses = "type-supporting text-muted";
const thoughtLabelClasses = "type-supporting text-muted";
const traceIconClasses = "size-4 shrink-0 text-muted";
const traceSpinClasses = "size-4 shrink-0 animate-spin text-muted";
const traceChevronClasses = "size-4 shrink-0 text-muted";
const actionsClasses =
  "flex items-center gap-1 opacity-0 pointer-events-none transition-opacity duration-fast ease-standard group-hover/reply:opacity-100 group-hover/reply:pointer-events-auto group-focus-within/reply:opacity-100 group-focus-within/reply:pointer-events-auto group-data-[actions=open]/reply:opacity-100 group-data-[actions=open]/reply:pointer-events-auto";
const followUpsClasses = "flex w-full flex-col gap-2";
const followUpClasses = "w-full !justify-start !border-border";
const barClasses = "grid-page w-full shrink-0 !pt-0 !pb-6";
const composerClasses = "col-span-full";
const startGateCardClasses = "h-[411px]";
const startGateOccupantClasses = "flex min-h-full w-full flex-col gap-3 py-3";
const startGateStepClasses = "type-supporting text-muted px-1 tabular-nums";
const startGateOptionsClasses = "flex w-full flex-col";
const startGateOptionClasses =
  "flex w-full items-center gap-3 border-b border-border py-3 last:border-b-0";
const startGateOptionNumberClasses = "shrink-0";
const startOptions = [
  { value: "brand", label: "Brand identity", description: "Name, mark, and a system you can actually use.", number: 1 },
  { value: "website", label: "Website", description: "A site that explains the work and earns the next conversation.", number: 2 },
  { value: "product", label: "Product design", description: "Flows, screens, and the details in between.", number: 3 },
  { value: "system", label: "Design system", description: "Components, tokens, and the rules that keep them honest.", number: 4 },
];
const startBudgets = [
  { value: "under-10", label: "<$10k", emphasis: "solid" },
  { value: "10-25", label: "$10–25k", emphasis: "solid" },
  { value: "25-50", label: "$25–50k", emphasis: "solid" },
  { value: "50-plus", label: "$50k+", emphasis: "solid" },
  { value: "unsure", label: "Not sure yet", emphasis: "muted" },
];
const startGateCopy = {
  1: { title: "Name the work", subtitle: "What are we making?" },
  2: { title: "What's the budget?", subtitle: "A range is enough. We can tighten it after the first conversation." },
  3: { title: "About you", subtitle: "A few sentences is enough. We'll reply to the email you leave here." },
  4: { title: "Book a call", subtitle: "Pick a time, or skip this and we'll write to you instead." },
};
const startGateTitle = startGateCopy[1].title;
const startGateSubtitle = startGateCopy[1].subtitle;
const aboutEmpty = { name: "", email: "", company: "", url: "", details: "" };

function canContinueStart(step, needs, budget, about) {
  if (step === 1) return needs.length > 0;
  if (step === 2) return budget != null;
  if (step === 3) {
    return about.name.trim().length > 0 && about.email.trim().length > 0 && about.details.trim().length > 0;
  }
  return false;
}

const headline = "What should we make?";
const sampleReply =
  "Brand, product, and the sites that explain them. The studio notes cover how a project starts.";
const wordStaggerSeconds = 0.06;
const replyParts = [
  { kind: "word", text: "Brand," },
  { kind: "word", text: "product," },
  { kind: "word", text: "and" },
  { kind: "word", text: "the" },
  { kind: "word", text: "sites" },
  { kind: "word", text: "that" },
  { kind: "word", text: "explain" },
  { kind: "word", text: "them." },
  { kind: "word", text: "The" },
  { kind: "source", text: "studio notes", href: "/notes" },
  { kind: "word", text: "cover" },
  { kind: "word", text: "how" },
  { kind: "word", text: "a" },
  { kind: "word", text: "project" },
  { kind: "word", text: "starts." },
];
const followUps = [
  "What does a brand engagement include?",
  "How do you start a product design?",
];
const thoughtLabel = "Thought for 4 seconds";
function thoughtForLabel(seconds) {
  const n = Math.max(1, Math.floor(seconds));
  return n === 1 ? "Thought for 1 second" : "Thought for " + n + " seconds";
}
const traceBeatSeconds = 0.48;
const traceSpinSeconds = 0.32;
const traceHoldSeconds = 2.08;
const traces = {
  steps: [
    { kind: "check", text: "Read the brief" },
    { kind: "check", text: "Name the brand" },
    { kind: "check", text: "Check the product site" },
    { kind: "check", text: "Find the studio notes" },
  ],
  reasoning: [
    { kind: "prose", text: "Brand, product, and the site have to say the same thing." },
    { kind: "prose", text: "The notes are where that line gets written down." },
  ],
  search: [
    { kind: "query", text: "sites that explain the brand" },
    { kind: "source", text: "Studio notes", href: "/notes" },
    { kind: "source", text: "Product", href: "/product" },
    { kind: "source", text: "What we make", href: "/services" },
  ],
  coding: [
    { kind: "file", text: "brief.md" },
    { kind: "file", text: "homepage.tsx" },
    { kind: "edit", text: "Set the brand line in brief.md" },
    { kind: "command", text: "npm run validate:composition" },
  ],
};
type Point = { top: number; left: number };
type ReplyPart = (typeof replyParts)[number];
type ChatQaPair = { question: string; answer: string };

function partDelay(index: number, reduce: boolean, settleSeconds: number) {
  if (reduce || index <= 0) return 0;
  let time = 0;
  for (let i = 0; i < index; i += 1) {
    const part = replyParts[i];
    const next = replyParts[i + 1];
    const hold = part?.kind === "source" || next?.kind === "source";
    time += hold ? settleSeconds : wordStaggerSeconds;
  }
  return time;
}

function intakeQaPairs(needs, budget, about, outcome) {
  const needsAnswer = startOptions
    .filter((option) => needs.includes(option.value))
    .map((option) => option.label)
    .join(", ");
  const budgetAnswer = startBudgets.find((option) => option.value === budget)?.label ?? "";
  const aboutAnswer = [about.name.trim(), about.company.trim()].filter((part) => part.length > 0).join(", ");
  const followUpAnswer = outcome === "booked" ? "Booked a call" : "Email me";
  return [
    { question: "What are we making?", answer: needsAnswer },
    { question: "What's the budget?", answer: budgetAnswer },
    { question: "About you", answer: aboutAnswer },
    { question: "How should we follow up?", answer: followUpAnswer },
  ].filter((pair) => pair.answer.length > 0);
}

type Turn =
  | { id: number; kind: "prompt"; prompt: string }
  | { id: number; kind: "intake"; pairs: ChatQaPair[] };

function IntakeExchange({
  pairs,
  latest,
  reduce,
  onFollowUp,
  onReplyGrown,
}) {
  const fast = motionTransitionProp("fast");
  const [mark, setMark] = useState(null);
  const [streamDone, setStreamDone] = useState(reduce);
  const [actionsOpen, setActionsOpen] = useState(false);
  const settleSeconds = typeof fast.duration === "number" ? fast.duration : 0.175;

  useEffect(() => {
    if (!actionsOpen) return;
    const onPointerDown = (event) => {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (target.closest?.("[data-reply-actions]") != null) return;
      setActionsOpen(false);
    };
    window.addEventListener("pointerdown", onPointerDown);
    return () => window.removeEventListener("pointerdown", onPointerDown);
  }, [actionsOpen]);

  useEffect(() => {
    if (streamDone) return;
    const last = replyParts.length - 1;
    const wait = (partDelay(last, reduce, settleSeconds) + settleSeconds) * 1000;
    const timer = window.setTimeout(() => setStreamDone(true), wait);
    return () => window.clearTimeout(timer);
  }, [reduce, streamDone, settleSeconds]);

  useLayoutEffect(() => {
    onReplyGrown();
  }, [streamDone, onReplyGrown]);

  function copyReply() {
    if (typeof navigator === "undefined" || navigator.clipboard == null) return;
    void navigator.clipboard.writeText(sampleReply).catch(() => undefined);
  }

  return (
    <>
      <ChatQa pairs={pairs} />
      <div
        className={replyBlockClasses}
        data-reply-actions=""
        data-actions={actionsOpen ? "open" : undefined}
        onClick={() => {
          if (typeof window === "undefined") return;
          if (!window.matchMedia("(hover: none)").matches) return;
          setActionsOpen(true);
        }}
      >
        <p className={replyClasses} aria-busy={streamDone ? undefined : true}>
          {replyParts.map((part, index) => (
            <ReplyWord
              key={part.kind + "-" + index}
              part={part}
              index={index}
              reduce={reduce}
              delay={partDelay(index, reduce, settleSeconds)}
              settle={fast}
              onDone={index === replyParts.length - 1 ? () => setStreamDone(true) : undefined}
            />
          ))}
        </p>
        {streamDone ? (
          <div className={actionsClasses}>
            <IconButton aria-label="Copy reply" size="sm" icon={<Copy />} onClick={copyReply} />
            <IconButton
              aria-label="Mark this reply helpful"
              size="sm"
              icon={<ThumbsUp />}
              aria-pressed={mark === "up"}
              onClick={() => setMark((current) => (current === "up" ? null : "up"))}
            />
            <IconButton
              aria-label="Mark this reply not helpful"
              size="sm"
              icon={<ThumbsDown />}
              aria-pressed={mark === "down"}
              onClick={() => setMark((current) => (current === "down" ? null : "down"))}
            />
          </div>
        ) : null}
      </div>
      {streamDone && latest ? (
        <div className={followUpsClasses}>
          {followUps.map((next) => (
            <Button key={next} role="outline" size="md" type="button" className={followUpClasses} onClick={() => onFollowUp(next)}>
              {next}
            </Button>
          ))}
        </div>
      ) : null}
    </>
  );
}

function Exchange({
  prompt,
  latest,
  reduce,
  onFollowUp,
  onReplyGrown,
}: {
  prompt: string;
  latest: boolean;
  reduce: boolean;
  onFollowUp: (value: string) => void;
  onReplyGrown: () => void;
}) {
  const fast = motionTransitionProp("fast");
  const lines = traces.steps;
  const [mark, setMark] = useState<"up" | "down" | null>(null);
  const [revealed, setRevealed] = useState(reduce ? lines.length : 0);
  const [resolved, setResolved] = useState(reduce ? lines.length : 0);
  const [traceOpen, setTraceOpen] = useState(false);
  const [replyReady, setReplyReady] = useState(reduce);
  const [streamDone, setStreamDone] = useState(reduce);
  const [actionsOpen, setActionsOpen] = useState(false);
  const [thoughtSeconds, setThoughtSeconds] = useState(1);

  useEffect(() => {
    if (reduce || replyReady) return;
    const timer = window.setInterval(() => setThoughtSeconds((current) => current + 1), 1000);
    return () => window.clearInterval(timer);
  }, [reduce, replyReady]);

  useEffect(() => {
    if (reduce) return;
    const beatMs = traceBeatSeconds * 1000;
    const spinMs = traceSpinSeconds * 1000;
    const timers = [];
    for (let index = 1; index <= lines.length; index += 1) {
      timers.push(window.setTimeout(() => setRevealed(index), index * beatMs));
      timers.push(window.setTimeout(() => setResolved(index), index * beatMs + spinMs));
    }
    timers.push(window.setTimeout(() => {
      setTraceOpen(false);
      setReplyReady(true);
    }, (lines.length * traceBeatSeconds + traceHoldSeconds) * 1000));
    return () => {
      for (const timer of timers) window.clearTimeout(timer);
    };
  }, [reduce, lines.length]);

  const settleSeconds = typeof fast.duration === "number" ? fast.duration : 0.175;

  useEffect(() => {
    if (!replyReady || streamDone) return;
    const last = replyParts.length - 1;
    const wait = (partDelay(last, reduce, settleSeconds) + settleSeconds) * 1000;
    const timer = window.setTimeout(() => setStreamDone(true), wait);
    return () => window.clearTimeout(timer);
  }, [replyReady, reduce, streamDone, settleSeconds]);

  useEffect(() => {
    if (!actionsOpen) return;
    const onPointerDown = (event) => {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (target.closest?.("[data-reply-actions]") != null) return;
      setActionsOpen(false);
    };
    window.addEventListener("pointerdown", onPointerDown);
    return () => window.removeEventListener("pointerdown", onPointerDown);
  }, [actionsOpen]);

  useLayoutEffect(() => {
    if (!replyReady) return;
    onReplyGrown();
  }, [replyReady, streamDone, onReplyGrown]);

  function copyReply() {
    if (typeof navigator === "undefined" || navigator.clipboard == null) return;
    void navigator.clipboard.writeText(sampleReply).catch(() => undefined);
  }

  return (
    <>
      <motion.p
        className={userClasses}
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={reduce ? { duration: 0 } : fast}
      >
        {prompt}
      </motion.p>
      {replyReady ? null : (
        <div className={traceClasses} aria-busy="true">
          <Button layout="row" role="ghost" type="button" className={traceTriggerClasses} aria-expanded={traceOpen} onClick={() => setTraceOpen((current) => !current)}>
            <Sparkle className={traceIconClasses} strokeWidth={2} aria-hidden />
            <span className={thoughtLabelClasses}>{thoughtForLabel(thoughtSeconds)}</span>
            <ChevronDown className={traceChevronClasses + (traceOpen ? " rotate-180" : "")} strokeWidth={2} aria-hidden />
          </Button>
          {traceOpen ? (
            <div className={traceBodyClasses}>
              {lines.slice(0, revealed).map((entry, index) => (
                <motion.div
                  key={entry.text}
                  className={traceLineClasses}
                  initial={reduce ? false : { opacity: 0, filter: "blur(4px)" }}
                  animate={{ opacity: 1, filter: "blur(0px)" }}
                  transition={reduce ? { duration: 0 } : fast}
                >
                  {index < resolved ? (
                    <Check className={traceIconClasses} strokeWidth={2} aria-hidden />
                  ) : (
                    <LoaderCircle className={traceSpinClasses} strokeWidth={2} aria-hidden />
                  )}
                  {entry.text}
                </motion.div>
              ))}
            </div>
          ) : null}
        </div>
      )}
      {replyReady ? (
        <>
          <div
            className={replyBlockClasses}
            data-reply-actions=""
            data-actions={actionsOpen ? "open" : undefined}
            onClick={() => {
              if (typeof window === "undefined") return;
              if (!window.matchMedia("(hover: none)").matches) return;
              setActionsOpen(true);
            }}
          >
            <p className={replyClasses} aria-busy={streamDone ? undefined : true}>
              {replyParts.map((part, index) => (
                <ReplyWord
                  key={part.kind + "-" + index}
                  part={part}
                  index={index}
                  reduce={reduce}
                  delay={partDelay(index, reduce, settleSeconds)}
                  settle={fast}
                  onDone={index === replyParts.length - 1 ? () => setStreamDone(true) : undefined}
                />
              ))}
            </p>
            {streamDone ? (
              <div className={actionsClasses}>
                <IconButton aria-label="Copy reply" size="sm" icon={<Copy />} onClick={copyReply} />
                <IconButton
                  aria-label="Mark this reply helpful"
                  size="sm"
                  icon={<ThumbsUp />}
                  aria-pressed={mark === "up"}
                  onClick={() => setMark((current) => (current === "up" ? null : "up"))}
                />
                <IconButton
                  aria-label="Mark this reply not helpful"
                  size="sm"
                  icon={<ThumbsDown />}
                  aria-pressed={mark === "down"}
                  onClick={() => setMark((current) => (current === "down" ? null : "down"))}
                />
              </div>
            ) : null}
          </div>
          {streamDone && latest ? (
            <div className={followUpsClasses}>
              {followUps.map((next) => (
                <Button key={next} role="outline" size="md" type="button" className={followUpClasses} onClick={() => onFollowUp(next)}>
                  {next}
                </Button>
              ))}
            </div>
          ) : null}
        </>
      ) : null}
    </>
  );
}

function StartGate({
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
}) {
  const step = phase.kind === "step" ? phase.step : 4;
  const copy = startGateCopy[step];
  const atStart = phase.kind !== "step" || phase.step <= 1;
  const hideContinue = phase.kind === "done" || (phase.kind === "step" && phase.step === 4);
  const hideFooter = phase.kind === "done";
  const continueDisabled =
    phase.kind !== "step" || !canContinueStart(phase.step, needs, budget, about);
  const stepOneOpen = phase.kind === "step" && phase.step === 1;

  function toggleNeed(value, checked) {
    if (checked) {
      onNeedsChange([...needs, value]);
      return;
    }
    onNeedsChange(needs.filter((item) => item !== value));
  }

  useKbdChoiceKeys({
    enabled: stepOneOpen,
    choices: Object.fromEntries(
      startOptions.map((option) => [
        String(option.number),
        () => toggleNeed(option.value, !needs.includes(option.value)),
      ]),
    ),
  });

  return (
    <Card shape="rounded" padding="none" variant="surface" aria-label={copy.title} className={startGateCardClasses}>
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
                <IconButton aria-label="Previous step" size="sm" icon={<ChevronLeft />} disabled={atStart} onClick={onBack} />
                <span className={startGateStepClasses}>{step} of 4</span>
                <IconButton aria-label="Next step" size="sm" icon={<ChevronRight />} disabled={hideContinue || continueDisabled} onClick={onNext} />
              </>
            ) : null}
            <IconButton aria-label="Close starter" size="sm" icon={<X />} onClick={onCancel} />
          </>
        }
      />
      <Card.Body>
        <div className={cardLayoutBodyOccupantWellClasses + " " + cardLayoutBodyOccupantInsetXClasses + " " + startGateOccupantClasses}>
          {phase.kind === "done" ? <IntakeConfirmation variant={phase.variant} onDone={onDone} /> : null}
          {phase.kind === "step" && phase.step === 1 ? (
            <div className={startGateOptionsClasses} role="group" aria-label={copy.subtitle}>
              {startOptions.map((option) => (
                <div key={option.value} className={startGateOptionClasses}>
                  <Checkbox
                    className="min-w-0 flex-1"
                    size="md"
                    label={option.label}
                    description={option.description}
                    checked={needs.includes(option.value)}
                    onChange={(event) => toggleNeed(option.value, event.target.checked)}
                  />
                  <Kbd className={startGateOptionNumberClasses} aria-label={"Press " + option.number}>
                    {option.number}
                  </Kbd>
                </div>
              ))}
            </div>
          ) : null}
          {phase.kind === "step" && phase.step === 2 ? (
            <PillGroup aria-label="Budget" value={budget} onValueChange={onBudgetChange}>
              {startBudgets.map((option) => (
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
              <Button role="primary" type="button" onClick={onBooked}>Confirm this time</Button>
            </CalEmbed>
          ) : null}
        </div>
      </Card.Body>
      {hideFooter ? null : (
        <Card.Footer>
          <div className="ml-auto flex items-center gap-2">
            <Button role="secondary" size="md" type="button" onClick={onCancel}>Cancel</Button>
            {hideContinue ? null : (
              <Button role="primary" size="md" type="button" disabled={continueDisabled} onClick={onNext}>Next</Button>
            )}
          </div>
        </Card.Footer>
      )}
    </Card>
  );
}

export function AskWhatMatters() {
  const reduce = useReducedMotion() === true;
  const travel = motionTransitionProp("medium");
  const fieldRef = useRef(null);
  const headlineRef = useRef(null);
  const stageRef = useRef(null);
  const threadRef = useRef(null);
  const composerRef = useRef(null);
  const stickToEnd = useRef(true);
  const [startGateOpen, setStartGateOpen] = useState(false);
  const [startPhase, setStartPhase] = useState({ kind: "step", step: 1 });
  const [startNeeds, setStartNeeds] = useState([]);
  const [startBudget, setStartBudget] = useState(null);
  const [startAbout, setStartAbout] = useState(aboutEmpty);
  const suppressScroll = useRef(false);
  const nextId = useRef(1);
  const [draft, setDraft] = useState("");
  const [turns, setTurns] = useState<Turn[]>([]);
  const [headlineExit, setHeadlineExit] = useState<Point | null>(null);
  const [composerSpace, setComposerSpace] = useState(0);
  const chatting = turns.length > 0;

  const scrollStageToEnd = useCallback(() => {
    const stage = stageRef.current;
    if (stage == null || !stickToEnd.current) return;
    const before = stage.scrollTop;
    suppressScroll.current = true;
    stage.scrollTop = stage.scrollHeight;
    if (stage.scrollTop === before) suppressScroll.current = false;
  }, []);

  useLayoutEffect(() => {
    const composer = composerRef.current;
    if (composer == null) return;
    const apply = () => {
      const stage = stageRef.current;
      const height = composer.offsetHeight;
      const composerBottom = composer.getBoundingClientRect().bottom;
      const bottoms = [stage, stage?.parentElement]
        .filter((node) => node instanceof HTMLElement)
        .map((node) => node.getBoundingClientRect().bottom);
      if (typeof window !== "undefined") bottoms.push(window.innerHeight);
      const tail = bottoms.reduce((extra, bottom) => Math.max(extra, bottom - composerBottom), 0);
      const next = Math.ceil(height + Math.max(0, tail));
      setComposerSpace((current) => (current === next ? current : next));
    };
    apply();
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(apply);
    observer.observe(composer);
    const stage = stageRef.current;
    if (stage != null) observer.observe(stage);
    if (stage?.parentElement != null) observer.observe(stage.parentElement);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const stage = stageRef.current;
    if (stage == null) return;
    const onScroll = () => {
      if (suppressScroll.current) {
        suppressScroll.current = false;
        return;
      }
      const distance = stage.scrollHeight - stage.clientHeight - stage.scrollTop;
      stickToEnd.current = distance <= 4;
    };
    stage.addEventListener("scroll", onScroll, { passive: true });
    return () => stage.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const thread = threadRef.current;
    if (thread == null || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(() => {
      scrollStageToEnd();
    });
    observer.observe(thread);
    return () => observer.disconnect();
  }, [chatting, scrollStageToEnd]);

  useLayoutEffect(() => {
    scrollStageToEnd();
  }, [turns.length, composerSpace, scrollStageToEnd]);

  function closeStartGate() {
    setStartGateOpen(false);
    setStartPhase({ kind: "step", step: 1 });
    setStartNeeds([]);
    setStartBudget(null);
    setStartAbout(aboutEmpty);
  }

  function openStartGate() {
    setStartPhase({ kind: "step", step: 1 });
    setStartNeeds([]);
    setStartBudget(null);
    setStartAbout(aboutEmpty);
    setStartGateOpen(true);
  }

  function goHome() {
    setTurns([]);
    setDraft("");
    setHeadlineExit(null);
    closeStartGate();
  }

  function onBrandClick(event: MouseEvent<HTMLDivElement>) {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const home = target.closest("a[aria-label='WhatMatters']");
    if (home == null) return;
    event.preventDefault();
    goHome();
  }

  function send(value: string) {
    const text = value.trim();
    if (text.length === 0) return;
    stickToEnd.current = true;
    const fromLanding = turns.length === 0;
    const title = headlineRef.current?.getBoundingClientRect();
    const id = nextId.current;
    nextId.current += 1;
    setDraft("");
    setTurns((current) => [...current, { id, kind: "prompt", prompt: text }]);
    if (reduce || !fromLanding || title == null) {
      setHeadlineExit(null);
      return;
    }
    setHeadlineExit({ top: title.top, left: title.left });
  }

  function finishStartGate() {
    const outcome = startPhase.kind === "done" ? startPhase.variant : "emailed";
    const pairs = intakeQaPairs(startNeeds, startBudget, startAbout, outcome);
    stickToEnd.current = true;
    const id = nextId.current;
    nextId.current += 1;
    setTurns((current) => [...current, { id, kind: "intake", pairs }]);
    closeStartGate();
  }

  return (
    <ConfettiProvider>
      <div className={pageClasses}>
        {chatting ? (
          <div onClick={onBrandClick}>
            <SiteNav
              start={<SiteNav.Brand href="/" aria-label="WhatMatters" icon={<Sparkles />} />}
              middle={
                <SiteNav.Links>
                  <SiteNav.Link href="/product" current>Product</SiteNav.Link>
                  <SiteNav.Link href="/pricing">Pricing</SiteNav.Link>
                  <SiteNav.Link href="/customers">Customers</SiteNav.Link>
                </SiteNav.Links>
              }
              end={
                <>
                  <Button role="ghost" size="sm" render={<a href="/signin" />} className="whitespace-nowrap">Sign in</Button>
                  <Button role="primary" size="sm" type="button" className="whitespace-nowrap" onClick={openStartGate}>Start Project</Button>
                </>
              }
              mobile={
                <>
                  <SiteNav.MobileLink href="/product" current>Product</SiteNav.MobileLink>
                  <SiteNav.MobileLink href="/pricing">Pricing</SiteNav.MobileLink>
                  <SiteNav.MobileLink href="/customers">Customers</SiteNav.MobileLink>
                </>
              }
            />
          </div>
        ) : null}
        <div className={columnClasses}>
          <main ref={stageRef} className={chatting ? stageClasses : stageClasses + " " + landingClasses}>
            {chatting ? (
              <div ref={threadRef} className={threadClasses} style={{ paddingBottom: composerSpace }}>
                {turns.map((turn, index) =>
                  turn.kind === "intake" ? (
                    <IntakeExchange
                      key={turn.id}
                      pairs={turn.pairs}
                      latest={index === turns.length - 1}
                      reduce={reduce}
                      onFollowUp={send}
                      onReplyGrown={scrollStageToEnd}
                    />
                  ) : (
                    <Exchange
                      key={turn.id}
                      prompt={turn.prompt}
                      latest={index === turns.length - 1}
                      reduce={reduce}
                      onFollowUp={send}
                      onReplyGrown={scrollStageToEnd}
                    />
                  ),
                )}
              </div>
            ) : (
              <h1 ref={headlineRef} className={headlineClasses}>{headline}</h1>
            )}
          </main>
          <div className={barClasses}>
            <div ref={composerRef} className={composerClasses}>
              {startGateOpen ? (
                <StartGate
                  phase={startPhase}
                  needs={startNeeds}
                  onNeedsChange={setStartNeeds}
                  budget={startBudget}
                  onBudgetChange={setStartBudget}
                  about={startAbout}
                  onAboutChange={setStartAbout}
                  onCancel={closeStartGate}
                  onBack={() => {
                    if (startPhase.kind !== "step" || startPhase.step <= 1) return;
                    setStartPhase({ kind: "step", step: startPhase.step - 1 });
                  }}
                  onNext={() => {
                    if (startPhase.kind !== "step") return;
                    if (!canContinueStart(startPhase.step, startNeeds, startBudget, startAbout)) return;
                    if (startPhase.step >= 4) return;
                    setStartPhase({ kind: "step", step: startPhase.step + 1 });
                  }}
                  onBooked={() => setStartPhase({ kind: "done", variant: "booked" })}
                  onEmailed={() => setStartPhase({ kind: "done", variant: "emailed" })}
                  onDone={finishStartGate}
                />
              ) : (
                <PromptBar ref={fieldRef} value={draft} onValueChange={setDraft} onSend={send} />
              )}
            </div>
          </div>
        </div>
        {headlineExit != null ? (
          <motion.p
            aria-hidden
            className={headlineClasses + " pointer-events-none fixed z-10 m-0"}
            style={{ top: headlineExit.top, left: headlineExit.left }}
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 0, y: -12 }}
            transition={travel}
            onAnimationComplete={() => setHeadlineExit(null)}
          >
            {headline}
          </motion.p>
        ) : null}
      </div>
    </ConfettiProvider>
  );
}

function ReplyWord({
  part,
  index,
  reduce,
  delay,
  settle,
  onDone,
}: {
  part: ReplyPart;
  index: number;
  reduce: boolean;
  delay: number;
  settle: { duration?: number; ease?: unknown };
  onDone?: () => void;
}) {
  return (
    <motion.span
      className="inline"
      initial={reduce ? false : { opacity: 0, filter: "blur(4px)" }}
      animate={{ opacity: 1, filter: "blur(0px)" }}
      transition={reduce ? { duration: 0 } : { ...settle, delay }}
      onAnimationComplete={onDone}
    >
      {index > 0 ? " " : null}
      {part.kind === "source" ? <TextLink href={part.href}>{part.text}</TextLink> : part.text}
    </motion.span>
  );
}
`.trim();

type PromptChatTurn =
  | { id: number; kind: "prompt"; prompt: string }
  | { id: number; kind: "intake"; pairs: ChatQaPair[] };

/**
 * Start Project answers in the thread — quiet **ChatQa**, then the scripted reply.
 * No thinking row between the panel and the reply. Hover actions stay under the reply.
 */
function PromptChatIntakeExchange({
  pairs,
  latest,
  reduce,
  onFollowUp,
  onReplyGrown,
}: {
  pairs: readonly ChatQaPair[];
  latest: boolean;
  reduce: boolean;
  onFollowUp: (value: string) => void;
  onReplyGrown: () => void;
}) {
  const fast = motionTransitionProp("fast");
  const [mark, setMark] = useState<"up" | "down" | null>(null);
  const [streamDone, setStreamDone] = useState(reduce);
  const [actionsOpen, setActionsOpen] = useState(false);
  const settleSeconds = typeof fast.duration === "number" ? fast.duration : 0.175;

  useEffect(() => {
    if (!actionsOpen) return;
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) return;
      const block = (target as Element).closest?.("[data-reply-actions]");
      if (block != null) return;
      setActionsOpen(false);
    };
    window.addEventListener("pointerdown", onPointerDown);
    return () => window.removeEventListener("pointerdown", onPointerDown);
  }, [actionsOpen]);

  useEffect(() => {
    if (streamDone) return;
    const last = promptChatReplyParts.length - 1;
    const wait = (promptChatPartDelay(last, reduce, settleSeconds) + settleSeconds) * 1000;
    const timer = window.setTimeout(() => setStreamDone(true), wait);
    return () => window.clearTimeout(timer);
  }, [reduce, streamDone, settleSeconds]);

  useLayoutEffect(() => {
    onReplyGrown();
  }, [streamDone, onReplyGrown]);

  function copyReply() {
    if (typeof navigator === "undefined" || navigator.clipboard == null) return;
    void navigator.clipboard.writeText(promptChatSampleReply).catch(() => undefined);
  }

  return (
    <>
      <ChatQa pairs={pairs} />
      <div
        className={promptChatReplyBlockClasses}
        data-reply-actions=""
        data-actions={actionsOpen ? "open" : undefined}
        onClick={() => {
          if (typeof window === "undefined") return;
          if (!window.matchMedia("(hover: none)").matches) return;
          setActionsOpen(true);
        }}
      >
        <p className={promptChatReplyClasses} aria-busy={streamDone ? undefined : true}>
          {promptChatReplyParts.map((part, index) => (
            <motion.span
              key={`${part.kind}-${index}`}
              className="inline"
              initial={reduce ? false : { opacity: 0, filter: "blur(4px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              transition={
                reduce ? { duration: 0 } : { ...fast, delay: promptChatPartDelay(index, false, settleSeconds) }
              }
              onAnimationComplete={
                index === promptChatReplyParts.length - 1 ? () => setStreamDone(true) : undefined
              }
            >
              {index > 0 ? " " : null}
              {part.kind === "source" ? <TextLink href={part.href}>{part.text}</TextLink> : part.text}
            </motion.span>
          ))}
        </p>
        {streamDone ? (
          <div className={promptChatActionsClasses}>
            <IconButton aria-label="Copy reply" size="sm" icon={<Copy />} onClick={copyReply} />
            <IconButton
              aria-label="Mark this reply helpful"
              size="sm"
              icon={<ThumbsUp />}
              aria-pressed={mark === "up"}
              onClick={() => setMark((current) => (current === "up" ? null : "up"))}
            />
            <IconButton
              aria-label="Mark this reply not helpful"
              size="sm"
              icon={<ThumbsDown />}
              aria-pressed={mark === "down"}
              onClick={() => setMark((current) => (current === "down" ? null : "down"))}
            />
          </div>
        ) : null}
      </div>
      {streamDone && latest ? (
        <div className={promptChatFollowUpsClasses}>
          {promptChatFollowUps.map((next) => (
            <Button
              key={next}
              role="outline"
              size="md"
              type="button"
              className={promptChatFollowUpClasses}
              onClick={() => onFollowUp(next)}
            >
              {next}
            </Button>
          ))}
        </div>
      ) : null}
    </>
  );
}

/**
 * One exchange in the thread. Earlier turns stay mounted when a follow-up is sent.
 * Steps leave when this reply starts. The other traces keep their settled row.
 */
function PromptChatExchange({
  prompt,
  trace,
  latest,
  reduce,
  onFollowUp,
  onReplyGrown,
}: {
  prompt: string;
  trace: PromptChatTraceKind;
  latest: boolean;
  reduce: boolean;
  onFollowUp: (value: string) => void;
  onReplyGrown: () => void;
}) {
  const fast = motionTransitionProp("fast");
  const count = promptChatTraces[trace].length;
  const [mark, setMark] = useState<"up" | "down" | null>(null);
  const [revealed, setRevealed] = useState(reduce ? count : 0);
  const [resolved, setResolved] = useState(reduce ? count : 0);
  const [traceSettled, setTraceSettled] = useState(reduce);
  const [traceOpen, setTraceOpen] = useState(false);
  const [replyReady, setReplyReady] = useState(reduce);
  const [streamDone, setStreamDone] = useState(reduce);
  const [actionsOpen, setActionsOpen] = useState(false);

  useEffect(() => {
    if (reduce) return;
    const beatMs = promptChatTraceBeatSeconds * 1000;
    const spinMs = promptChatTraceSpinSeconds * 1000;
    const timers: number[] = [];
    for (let index = 1; index <= count; index += 1) {
      timers.push(window.setTimeout(() => setRevealed(index), index * beatMs));
      timers.push(window.setTimeout(() => setResolved(index), index * beatMs + spinMs));
    }
    timers.push(
      window.setTimeout(() => {
        setTraceSettled(true);
        setTraceOpen(false);
        setReplyReady(true);
      }, promptChatTraceDurationSeconds(count) * 1000),
    );
    return () => {
      for (const timer of timers) window.clearTimeout(timer);
    };
  }, [count, reduce]);

  useEffect(() => {
    if (!actionsOpen) return;
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) return;
      const block = (target as Element).closest?.("[data-reply-actions]");
      if (block != null) return;
      setActionsOpen(false);
    };
    window.addEventListener("pointerdown", onPointerDown);
    return () => window.removeEventListener("pointerdown", onPointerDown);
  }, [actionsOpen]);

  const settleSeconds = typeof fast.duration === "number" ? fast.duration : 0.175;

  useEffect(() => {
    if (!replyReady || streamDone) return;
    const last = promptChatReplyParts.length - 1;
    const wait = (promptChatPartDelay(last, reduce, settleSeconds) + settleSeconds) * 1000;
    const timer = window.setTimeout(() => setStreamDone(true), wait);
    return () => window.clearTimeout(timer);
  }, [replyReady, reduce, streamDone, settleSeconds]);

  useLayoutEffect(() => {
    if (!replyReady) return;
    onReplyGrown();
  }, [replyReady, streamDone, onReplyGrown]);

  function copyReply() {
    if (typeof navigator === "undefined" || navigator.clipboard == null) return;
    void navigator.clipboard.writeText(promptChatSampleReply).catch(() => undefined);
  }

  return (
    <>
      <motion.p
        className={promptChatUserClasses}
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={reduce ? { duration: 0 } : fast}
      >
        {prompt}
      </motion.p>
      {trace === "steps" && replyReady ? null : (
        <PromptChatTrace
          entries={promptChatTraces[trace]}
          revealed={revealed}
          resolved={resolved}
          settled={traceSettled}
          open={traceOpen}
          onToggle={() => setTraceOpen((current) => !current)}
        />
      )}
      {replyReady ? (
        <>
          <div
            className={promptChatReplyBlockClasses}
            data-reply-actions=""
            data-actions={actionsOpen ? "open" : undefined}
            onClick={() => {
              if (typeof window === "undefined") return;
              if (!window.matchMedia("(hover: none)").matches) return;
              setActionsOpen(true);
            }}
          >
            <p className={promptChatReplyClasses} aria-busy={streamDone ? undefined : true}>
              {promptChatReplyParts.map((part, index) => (
                <motion.span
                  key={`${part.kind}-${index}`}
                  className="inline"
                  initial={reduce ? false : { opacity: 0, filter: "blur(4px)" }}
                  animate={{ opacity: 1, filter: "blur(0px)" }}
                  transition={
                    reduce ? { duration: 0 } : { ...fast, delay: promptChatPartDelay(index, false, settleSeconds) }
                  }
                  onAnimationComplete={
                    index === promptChatReplyParts.length - 1 ? () => setStreamDone(true) : undefined
                  }
                >
                  {index > 0 ? " " : null}
                  {part.kind === "source" ? <TextLink href={part.href}>{part.text}</TextLink> : part.text}
                </motion.span>
              ))}
            </p>
            {streamDone ? (
              <div className={promptChatActionsClasses}>
                <IconButton aria-label="Copy reply" size="sm" icon={<Copy />} onClick={copyReply} />
                <IconButton
                  aria-label="Mark this reply helpful"
                  size="sm"
                  icon={<ThumbsUp />}
                  aria-pressed={mark === "up"}
                  onClick={() => setMark((current) => (current === "up" ? null : "up"))}
                />
                <IconButton
                  aria-label="Mark this reply not helpful"
                  size="sm"
                  icon={<ThumbsDown />}
                  aria-pressed={mark === "down"}
                  onClick={() => setMark((current) => (current === "down" ? null : "down"))}
                />
              </div>
            ) : null}
          </div>
          {streamDone && latest ? (
            <div className={promptChatFollowUpsClasses}>
              {promptChatFollowUps.map((next) => (
                <Button
                  key={next}
                  role="outline"
                  size="md"
                  type="button"
                  className={promptChatFollowUpClasses}
                  onClick={() => onFollowUp(next)}
                >
                  {next}
                </Button>
              ))}
            </div>
          ) : null}
        </>
      ) : null}
    </>
  );
}

/**
 * Landing statement, then a thread that keeps growing.
 * Send or Enter: the bar stays, the headline fades, and the sent line fades in where it rests.
 * A collapsed sparkle + Thought-for timer plays until that reply starts, then leaves.
 * Expand the row while it is thinking to read the steps. Reply actions stay hidden until hover.
 * A follow-up appends the next user line in the same thread. Earlier messages stay.
 * The thread, follow-ups, and composer share one narrowed page grid (`--grid-max: 40rem`).
 * The thread reserves the composer's measured height plus the space under the pill, and keeps
 * that end in view while a reply grows, so the reply and its follow-ups finish above the composer.
 * Reduced motion skips the fade and the trace play, and shows the finished reply.
 * Voice and attachments are not part of this version.
 */
export function AskWhatMatters({ trace = "steps" }: { trace?: PromptChatTraceKind } = {}) {
  const reduce = useReducedMotion() === true;
  const travel = motionTransitionProp("medium");
  const fieldRef = useRef<HTMLTextAreaElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const stageRef = useRef<HTMLElement>(null);
  const threadRef = useRef<HTMLDivElement>(null);
  const composerRef = useRef<HTMLDivElement>(null);
  const stickToEnd = useRef(true);
  const [startGateOpen, setStartGateOpen] = useState(false);
  const [startPhase, setStartPhase] = useState<IntakePhase>({ kind: "step", step: 1 });
  const [startNeeds, setStartNeeds] = useState<string[]>([]);
  const [startBudget, setStartBudget] = useState<string | null>(null);
  const [startAbout, setStartAbout] = useState<IntakeAboutValues>(intakeAboutEmpty);
  const suppressScroll = useRef(false);
  const nextId = useRef(1);
  const [draft, setDraft] = useState("");
  const [turns, setTurns] = useState<PromptChatTurn[]>([]);
  const [headlineExit, setHeadlineExit] = useState<Point | null>(null);
  const [composerSpace, setComposerSpace] = useState(0);
  const chatting = turns.length > 0;

  const scrollStageToEnd = useCallback(() => {
    const stage = stageRef.current;
    if (stage == null || !stickToEnd.current) return;
    const before = stage.scrollTop;
    suppressScroll.current = true;
    stage.scrollTop = stage.scrollHeight;
    if (stage.scrollTop === before) suppressScroll.current = false;
  }, []);

  useLayoutEffect(() => {
    const composer = composerRef.current;
    if (composer == null) return;
    const apply = () => {
      const stage = stageRef.current;
      const height = composer.offsetHeight;
      const composerBottom = composer.getBoundingClientRect().bottom;
      const bottoms = [stage, stage?.parentElement]
        .filter((node) => node instanceof HTMLElement)
        .map((node) => node.getBoundingClientRect().bottom);
      if (typeof window !== "undefined") bottoms.push(window.innerHeight);
      const tail = bottoms.reduce((extra, bottom) => Math.max(extra, bottom - composerBottom), 0);
      const next = Math.ceil(height + Math.max(0, tail));
      setComposerSpace((current) => (current === next ? current : next));
    };
    apply();
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(apply);
    observer.observe(composer);
    const stage = stageRef.current;
    if (stage != null) observer.observe(stage);
    if (stage?.parentElement != null) observer.observe(stage.parentElement);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const stage = stageRef.current;
    if (stage == null) return;
    const onScroll = () => {
      if (suppressScroll.current) {
        suppressScroll.current = false;
        return;
      }
      const distance = stage.scrollHeight - stage.clientHeight - stage.scrollTop;
      stickToEnd.current = distance <= 4;
    };
    stage.addEventListener("scroll", onScroll, { passive: true });
    return () => stage.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const thread = threadRef.current;
    if (thread == null || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(() => {
      scrollStageToEnd();
    });
    observer.observe(thread);
    return () => observer.disconnect();
  }, [chatting, scrollStageToEnd]);

  useLayoutEffect(() => {
    scrollStageToEnd();
  }, [turns.length, composerSpace, scrollStageToEnd]);

  function goHome() {
    setTurns([]);
    setDraft("");
    setHeadlineExit(null);
    closeStartGate();
  }

  function openStartGate() {
    setStartPhase({ kind: "step", step: 1 });
    setStartNeeds([]);
    setStartBudget(null);
    setStartAbout(intakeAboutEmpty);
    setStartGateOpen(true);
  }

  function closeStartGate() {
    setStartGateOpen(false);
    setStartPhase({ kind: "step", step: 1 });
    setStartNeeds([]);
    setStartBudget(null);
    setStartAbout(intakeAboutEmpty);
  }

  function onStartGateDone() {
    const outcome = startPhase.kind === "done" ? startPhase.variant : "emailed";
    const pairs = promptChatIntakeQaPairs({
      needs: startNeeds,
      budget: startBudget,
      about: startAbout,
      outcome,
    });
    stickToEnd.current = true;
    const id = nextId.current;
    nextId.current += 1;
    setTurns((current) => [...current, { id, kind: "intake", pairs }]);
    closeStartGate();
  }

  function onStartGateNext() {
    if (startPhase.kind !== "step") return;
    if (!canContinueIntake({ step: startPhase.step, needs: startNeeds, budget: startBudget, about: startAbout })) {
      return;
    }
    if (startPhase.step >= 4) return;
    const next = (startPhase.step + 1) as IntakeStep;
    setStartPhase({ kind: "step", step: next });
  }

  function onStartGateBack() {
    if (startPhase.kind !== "step" || startPhase.step <= 1) return;
    const previous = (startPhase.step - 1) as IntakeStep;
    setStartPhase({ kind: "step", step: previous });
  }

  function onStartGateBooked() {
    setStartPhase({ kind: "done", variant: "booked" });
  }

  function onStartGateEmailed() {
    setStartPhase({ kind: "done", variant: "emailed" });
  }

  function onBrandClick(event: MouseEvent<HTMLDivElement>) {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const home = target.closest("a[aria-label='WhatMatters']");
    if (home == null) return;
    event.preventDefault();
    goHome();
  }

  function send(value: string) {
    const text = value.trim();
    if (text.length === 0) return;
    stickToEnd.current = true;
    const fromLanding = turns.length === 0;
    const title = headlineRef.current?.getBoundingClientRect();
    const id = nextId.current;
    nextId.current += 1;
    setDraft("");
    setTurns((current) => [...current, { id, kind: "prompt", prompt: text }]);
    if (reduce || !fromLanding || title == null) {
      setHeadlineExit(null);
      return;
    }
    setHeadlineExit({ top: title.top, left: title.left });
  }

  return (
    <ConfettiProvider>
      <div className={promptChatPageClasses}>
        {chatting ? (
          <div onClick={onBrandClick}>
            <SiteNav
              start={<SiteNav.Brand href="/" aria-label="WhatMatters" icon={<Sparkles />} />}
              middle={
                <SiteNav.Links>
                  <SiteNav.Link href="/product" current>
                    Product
                  </SiteNav.Link>
                  <SiteNav.Link href="/pricing">Pricing</SiteNav.Link>
                  <SiteNav.Link href="/customers">Customers</SiteNav.Link>
                </SiteNav.Links>
              }
              end={
                <>
                  <Button role="ghost" size="sm" render={<a href="/signin" />} className="whitespace-nowrap">
                    Sign in
                  </Button>
                  <Button
                    role="primary"
                    size="sm"
                    type="button"
                    className="whitespace-nowrap"
                    onClick={openStartGate}
                  >
                    Start Project
                  </Button>
                </>
              }
              mobile={
                <>
                  <SiteNav.MobileLink href="/product" current>
                    Product
                  </SiteNav.MobileLink>
                  <SiteNav.MobileLink href="/pricing">Pricing</SiteNav.MobileLink>
                  <SiteNav.MobileLink href="/customers">Customers</SiteNav.MobileLink>
                </>
              }
            />
          </div>
        ) : null}
        <div className={promptChatColumnClasses}>
          <main
            ref={stageRef}
            className={cn(promptChatStageClasses, !chatting && promptChatLandingClasses)}
          >
            {chatting ? (
              <div ref={threadRef} className={promptChatThreadClasses} style={{ paddingBottom: composerSpace }}>
                {turns.map((turn, index) =>
                  turn.kind === "intake" ? (
                    <PromptChatIntakeExchange
                      key={turn.id}
                      pairs={turn.pairs}
                      latest={index === turns.length - 1}
                      reduce={reduce}
                      onFollowUp={send}
                      onReplyGrown={scrollStageToEnd}
                    />
                  ) : (
                    <PromptChatExchange
                      key={turn.id}
                      prompt={turn.prompt}
                      trace={trace}
                      latest={index === turns.length - 1}
                      reduce={reduce}
                      onFollowUp={send}
                      onReplyGrown={scrollStageToEnd}
                    />
                  ),
                )}
              </div>
            ) : (
              <h1 ref={headlineRef} className={promptChatHeadlineClasses}>
                {promptChatHeadline}
              </h1>
            )}
          </main>
          <div className={promptChatBarClasses}>
            <div ref={composerRef} className={promptChatComposerClasses}>
              {startGateOpen ? (
                <PromptChatStartGate
                  phase={startPhase}
                  needs={startNeeds}
                  onNeedsChange={setStartNeeds}
                  budget={startBudget}
                  onBudgetChange={setStartBudget}
                  about={startAbout}
                  onAboutChange={setStartAbout}
                  onCancel={closeStartGate}
                  onBack={onStartGateBack}
                  onNext={onStartGateNext}
                  onBooked={onStartGateBooked}
                  onEmailed={onStartGateEmailed}
                  onDone={onStartGateDone}
                />
              ) : (
                <PromptBar ref={fieldRef} value={draft} onValueChange={setDraft} onSend={send} />
              )}
            </div>
          </div>
        </div>
        {headlineExit != null ? (
          <motion.p
            aria-hidden
            className={cn(promptChatHeadlineClasses, "pointer-events-none fixed z-10 m-0")}
            style={{ top: headlineExit.top, left: headlineExit.left }}
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 0, y: -12 }}
            transition={travel}
            onAnimationComplete={() => setHeadlineExit(null)}
          >
            {promptChatHeadline}
          </motion.p>
        ) : null}
      </div>
    </ConfettiProvider>
  );
}
