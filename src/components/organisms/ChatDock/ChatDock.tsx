import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type ReactElement,
  type ReactNode,
} from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { cn } from "../../../lib/cn";
import {
  motionBeatSeconds,
  motionStaggerSeconds,
  motionTransitionProp,
  readMotionDurationSeconds,
} from "../../../lib/motion";
import { Button } from "../../atoms/Button/Button";
import { ButtonIcon } from "../../atoms/Button/ButtonIcon";
import { Status } from "../../atoms/Status/Status";
import { PromptBar } from "../../molecules/PromptBar/PromptBar";
import { OverlayPanelHeader } from "../Dialog/OverlayPanelHeader";
import {
  chatDockAssistantMessageClasses,
  chatDockComposerClasses,
  chatDockDisclaimerClasses,
  chatDockDockClasses,
  chatDockFollowUpRowClasses,
  chatDockFollowUpsComposerClasses,
  chatDockFollowUpsInlineClasses,
  chatDockGridClasses,
  chatDockPillClasses,
  chatDockPillsClasses,
  chatDockRootClasses,
  chatDockSuggestionLabelClasses,
  chatDockSuggestionListClasses,
  chatDockSuggestionRowContentClasses,
  chatDockThinkingClasses,
  chatDockThreadClasses,
  chatDockUserMessageClasses,
  chatDockWindowClasses,
  type ChatDockPlacement,
} from "./chatDockStyles";

export { chatDockPlacements, type ChatDockPlacement } from "./chatDockStyles";

/** Layout-only — margin and placement. Not for colors or type. */
export type ChatDockLayoutClassName = string;

export interface ChatDockSuggestion {
  id: string;
  label: string;
  /** Leading Lucide icon element, for example `<DollarSign />`. */
  icon?: ReactElement;
  /**
   * Sent as the visitor's message when chosen. Suggestions with a prompt also show as pills
   * above the resting composer. Omit it for an action such as **Get started** — then only
   * `onSuggestionSelect` runs.
   */
  prompt?: string;
}

export interface ChatDockMessage {
  id: string;
  role: "user" | "assistant";
  /** Text, or Markdown the app has already rendered. ChatDock does not parse Markdown. */
  content: ReactNode;
}

export interface ChatDockLabels {
  /** Close control. Default: "Close chat". */
  close: string;
  /** Shown while `thinking`. Default: "Thinking…". */
  thinking: string;
  /** Accessible name for the message list. Default: "Conversation". */
  conversation: string;
  /** Accessible name for the suggestion groups. Default: "Suggested questions". */
  suggestions: string;
  /** Accessible name for the follow-ups under the latest reply. Default: "Suggested follow-ups". */
  followUps: string;
  /** Accessible name for the field. Default: "Ask anything". */
  field: string;
  /** Send control. Default: "Send". */
  send: string;
}

export const chatDockDefaultLabels: ChatDockLabels = {
  close: "Close chat",
  thinking: "Thinking…",
  conversation: "Conversation",
  suggestions: "Suggested questions",
  followUps: "Suggested follow-ups",
  field: "Ask anything",
  send: "Send",
};

export const chatDockFollowUpsPlacements = ["inline", "composer"] as const;

/**
 * `inline` — rows in the conversation, directly under the reply they belong to.
 * `composer` — pills pinned between the conversation and the composer.
 */
export type ChatDockFollowUpsPlacement = (typeof chatDockFollowUpsPlacements)[number];

export interface ChatDockProps {
  /** Window title — usually the product or brand name. */
  title: string;
  /** Line under the title. */
  subtitle?: string;
  /**
   * Brand mark — **Avatar** `size="md"` (2.25rem). Shown at the start of the composer and in
   * the window header.
   */
  mark?: ReactNode;
  /** First assistant message, always at the top of the window. */
  greeting?: ReactNode;
  /** The conversation, oldest first. The app owns it and appends replies as they stream. */
  messages?: ChatDockMessage[];
  /** Shows the thinking row after the last message while a reply is on its way. */
  thinking?: boolean;
  /** Pills above the resting composer (those with a `prompt`) and rows in the window. */
  suggestions?: ChatDockSuggestion[];
  /** Receives the visitor's message — typed, or a suggestion's `prompt`. */
  onSend: (prompt: string) => void;
  /** Every suggestion and follow-up choice, including actions without a `prompt`. */
  onSuggestionSelect?: (suggestion: ChatDockSuggestion) => void;
  /**
   * Follow-ups for the latest reply — one to three short items with Lucide icons, the same shape
   * and handlers as `suggestions`. They show while the last message is an assistant reply and
   * `thinking` is off, and disappear the moment the visitor sends. The app decides which replies
   * get follow-ups and replaces or clears them with each reply.
   */
  followUps?: ChatDockSuggestion[];
  /** Where follow-ups sit. Default: `inline`. */
  followUpsPlacement?: ChatDockFollowUpsPlacement;
  /** Controlled open state. */
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Field placeholder. Default: "Ask anything…". */
  placeholder?: string;
  /** One line under the window's composer — for example what the assistant can't do. */
  disclaimer?: ReactNode;
  labels?: Partial<ChatDockLabels>;
  /** `fixed` (default) pins the dock to the viewport; `inline` keeps it in flow for specimens. */
  placement?: ChatDockPlacement;
  className?: ChatDockLayoutClassName;
}

/** Pills above the resting composer: suggestions that send a prompt. */
export function chatDockPillSuggestions(suggestions: readonly ChatDockSuggestion[]): ChatDockSuggestion[] {
  return suggestions.filter((suggestion) => suggestion.prompt != null && suggestion.prompt.trim() !== "");
}

/** Suggestion rows show until the conversation starts. */
export function chatDockShowsSuggestionRows(
  suggestions: readonly ChatDockSuggestion[],
  messages: readonly ChatDockMessage[],
): boolean {
  return suggestions.length > 0 && messages.length === 0;
}

/**
 * Follow-ups belong to the latest reply: it is the last message, no reply is pending, and the
 * visitor has not sent anything since it arrived (`sentAfterId` is the last message id at send).
 */
export function chatDockShowsFollowUps({
  followUps,
  messages,
  thinking,
  sentAfterId,
}: {
  followUps: readonly ChatDockSuggestion[];
  messages: readonly ChatDockMessage[];
  thinking: boolean;
  sentAfterId: string | null;
}): boolean {
  const last = messages[messages.length - 1];
  return followUps.length > 0 && !thinking && last?.role === "assistant" && last.id !== sentAfterId;
}

/** Within this distance of the end, new content keeps the thread pinned to the latest message. */
const stickToEndThresholdPx = 48;

/**
 * Window reveal. Closed, the clip is the resting composer's strip at the bottom of the window
 * (full width, 3.25rem tall, pill radius); open, it is the whole card at the shell radius. Both
 * strings share one shape so Motion can interpolate them. The clip is cleared once open so the
 * card's shadow is not cut off.
 */
export const chatDockClosedClip = "inset(calc(100% - 3.25rem) 0rem 0rem 0rem round 1.625rem)";
export const chatDockOpenClip = "inset(calc(0% - 0rem) 0rem 0rem 0rem round 1rem)";

/**
 * Pinned prompt that opens into a chat window. At rest it is a **PromptBar** with the brand
 * mark; hovering shows suggestion pills above it. Focusing or typing opens a non-modal window
 * in its place — header, conversation, suggestion rows, composer, and an optional disclaimer.
 * Escape or Close returns to the resting bar. The page behind stays usable.
 */
export function ChatDock({
  title,
  subtitle,
  mark,
  greeting,
  messages = [],
  thinking = false,
  suggestions = [],
  onSend,
  onSuggestionSelect,
  followUps = [],
  followUpsPlacement = "inline",
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  placeholder,
  disclaimer,
  labels: labelsProp,
  placement = "fixed",
  className,
}: ChatDockProps) {
  const labels = { ...chatDockDefaultLabels, ...labelsProp };
  const titleId = useId();
  const subtitleId = useId();
  const reduceMotion = useReducedMotion();

  const isControlled = openProp !== undefined;
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const open = isControlled ? openProp : uncontrolledOpen;
  const [draft, setDraft] = useState("");
  /** Last message id when the visitor last sent — hides that reply's follow-ups at once. */
  const [sentAfterId, setSentAfterId] = useState<string | null>(null);

  const restFieldRef = useRef<HTMLTextAreaElement>(null);
  const windowFieldRef = useRef<HTMLTextAreaElement>(null);
  const threadRef = useRef<HTMLDivElement>(null);
  const stickToEndRef = useRef(true);
  /** Set while focus returns to the resting bar after closing, so that focus does not reopen. */
  const returningFocusRef = useRef(false);
  const wasOpenRef = useRef(open);
  /** True while the window is still the one rendered open at mount — its content does not animate in. */
  const openAtMountRef = useRef(open);

  function setOpen(next: boolean) {
    if (next === open) return;
    if (!isControlled) setUncontrolledOpen(next);
    onOpenChange?.(next);
  }

  function send(prompt: string) {
    const text = prompt.trim();
    if (text === "") return;
    setOpen(true);
    stickToEndRef.current = true;
    setDraft("");
    setSentAfterId(messages[messages.length - 1]?.id ?? null);
    onSend(text);
  }

  function selectSuggestion(suggestion: ChatDockSuggestion) {
    onSuggestionSelect?.(suggestion);
    if (suggestion.prompt != null) send(suggestion.prompt);
  }

  /** Follow-ups keep focus in the composer: the press does not take focus, and a keyboard choice hands it back. */
  function selectFollowUp(suggestion: ChatDockSuggestion) {
    selectSuggestion(suggestion);
    windowFieldRef.current?.focus();
  }

  useEffect(() => {
    if (open && !wasOpenRef.current) {
      windowFieldRef.current?.focus();
    } else if (!open && wasOpenRef.current) {
      openAtMountRef.current = false;
      returningFocusRef.current = true;
      restFieldRef.current?.focus();
      returningFocusRef.current = false;
    }
    wasOpenRef.current = open;
  }, [open]);

  // Keep the newest turn in view while the reader is at the end of the thread.
  useLayoutEffect(() => {
    const thread = threadRef.current;
    if (thread != null && stickToEndRef.current) {
      thread.scrollTop = thread.scrollHeight;
    }
  });

  function handleWindowKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (event.key !== "Escape" || event.defaultPrevented) return;
    event.preventDefault();
    setOpen(false);
  }

  const pills = chatDockPillSuggestions(suggestions);
  const showRows = chatDockShowsSuggestionRows(suggestions, messages);
  const showFollowUps = chatDockShowsFollowUps({ followUps, messages, thinking, sentAfterId });
  const windowTransition = motionTransitionProp("medium");
  const fastTransition = motionTransitionProp("fast");
  const windowMotion = reduceMotion
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
      }
    : {
        // Grows up out of the resting composer, and folds back into it on close.
        initial: { clipPath: chatDockClosedClip, opacity: 0.6 },
        animate: { clipPath: chatDockOpenClip, opacity: 1, transitionEnd: { clipPath: "none" } },
        exit: { clipPath: [chatDockOpenClip, chatDockClosedClip], opacity: [1, 0.6] },
      };
  // Window content settles in one beat after the reveal starts (not when it mounts already open).
  const contentMotion =
    reduceMotion || openAtMountRef.current
      ? {}
      : {
          initial: { opacity: 0, y: 8 },
          animate: { opacity: 1, y: 0 },
          transition: { ...fastTransition, delay: motionBeatSeconds(1) },
        };
  // Follow-ups rise in one stagger apart when a reply brings them; they leave at once on send.
  const followUpGroupMotion = {
    initial: reduceMotion ? false : ("hidden" as const),
    animate: "visible" as const,
    exit: { opacity: 0, transition: { duration: 0 } },
    variants: { hidden: {}, visible: { transition: { staggerChildren: motionStaggerSeconds() } } },
  };
  const followUpItemVariants = {
    hidden: { opacity: 0, y: 6 },
    visible: { opacity: 1, y: 0, transition: fastTransition },
  };
  const keepComposerFocus = (event: { preventDefault: () => void }) => event.preventDefault();
  // While the window folds away, the resting bar waits, then fades in where the fold ends.
  const restEnterDelay = reduceMotion ? 0 : readMotionDurationSeconds("medium") * 0.6;

  return (
    <div className={cn(chatDockRootClasses[placement], className)} data-open={open ? "" : undefined}>
      <div className={chatDockGridClasses}>
        <div className="band">
          <AnimatePresence initial={false} mode="popLayout">
            {open ? (
              <motion.section
                key="window"
                role="dialog"
                aria-modal="false"
                aria-labelledby={titleId}
                aria-describedby={subtitle != null ? subtitleId : undefined}
                className={chatDockWindowClasses[placement]}
                initial={windowMotion.initial}
                animate={windowMotion.animate}
                exit={windowMotion.exit}
                transition={windowTransition}
                onKeyDown={handleWindowKeyDown}
              >
                <OverlayPanelHeader
                  titleId={titleId}
                  descriptionId={subtitleId}
                  title={title}
                  description={subtitle}
                  headerStart={mark}
                  closeLabel={labels.close}
                  onClose={() => setOpen(false)}
                  delineated
                />

                <div
                  ref={threadRef}
                  className={chatDockThreadClasses}
                  role="log"
                  aria-label={labels.conversation}
                  onScroll={(event) => {
                    const thread = event.currentTarget;
                    stickToEndRef.current =
                      thread.scrollHeight - thread.scrollTop - thread.clientHeight <= stickToEndThresholdPx;
                  }}
                >
                  {greeting != null ? (
                    <motion.div className={chatDockAssistantMessageClasses} {...contentMotion}>
                      {greeting}
                    </motion.div>
                  ) : null}
                  {/* Turns already in the thread when the window opens do not animate; new ones slide in. */}
                  <AnimatePresence initial={false}>
                    {messages.map((message) => (
                      <motion.div
                        key={message.id}
                        data-role={message.role}
                        className={
                          message.role === "user" ? chatDockUserMessageClasses : chatDockAssistantMessageClasses
                        }
                        initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={fastTransition}
                      >
                        {message.content}
                      </motion.div>
                    ))}
                    {showFollowUps && followUpsPlacement === "inline" ? (
                      <motion.div
                        key="follow-ups"
                        role="group"
                        aria-label={labels.followUps}
                        data-follow-ups="inline"
                        className={chatDockFollowUpsInlineClasses}
                        {...followUpGroupMotion}
                      >
                        {followUps.map((suggestion) => (
                          <motion.div
                            key={suggestion.id}
                            className={chatDockFollowUpRowClasses}
                            variants={followUpItemVariants}
                          >
                            <Button
                              type="button"
                              role="ghost"
                              layout="row"
                              onMouseDown={keepComposerFocus}
                              onClick={() => selectFollowUp(suggestion)}
                            >
                              <span className={chatDockSuggestionRowContentClasses}>
                                {suggestion.icon != null ? <ButtonIcon size="md">{suggestion.icon}</ButtonIcon> : null}
                                <span className={chatDockSuggestionLabelClasses}>{suggestion.label}</span>
                              </span>
                            </Button>
                          </motion.div>
                        ))}
                      </motion.div>
                    ) : null}
                    {thinking ? (
                      <motion.div
                        key="thinking"
                        className={chatDockThinkingClasses}
                        initial={reduceMotion ? false : { opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, transition: { duration: 0 } }}
                        transition={fastTransition}
                      >
                        <Status variant="dot" tone="neutral" pulsing besideLabel />
                        <span>{labels.thinking}</span>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </div>

                {showRows ? (
                  <motion.div
                    className={chatDockSuggestionListClasses}
                    role="group"
                    aria-label={labels.suggestions}
                    {...contentMotion}
                  >
                    {suggestions.map((suggestion) => (
                      <Button
                        key={suggestion.id}
                        type="button"
                        role="ghost"
                        layout="row"
                        onClick={() => selectSuggestion(suggestion)}
                      >
                        <span className={chatDockSuggestionRowContentClasses}>
                          {suggestion.icon != null ? <ButtonIcon size="md">{suggestion.icon}</ButtonIcon> : null}
                          <span className={chatDockSuggestionLabelClasses}>{suggestion.label}</span>
                        </span>
                      </Button>
                    ))}
                  </motion.div>
                ) : null}

                <AnimatePresence initial={false}>
                  {showFollowUps && followUpsPlacement === "composer" ? (
                    <motion.div
                      key="follow-ups"
                      role="group"
                      aria-label={labels.followUps}
                      data-follow-ups="composer"
                      className={chatDockFollowUpsComposerClasses}
                      {...followUpGroupMotion}
                    >
                      {followUps.map((suggestion) => (
                        <motion.span key={suggestion.id} className="inline-flex" variants={followUpItemVariants}>
                          <Button
                            type="button"
                            role="secondary"
                            size="md"
                            icon={suggestion.icon}
                            onMouseDown={keepComposerFocus}
                            onClick={() => selectFollowUp(suggestion)}
                          >
                            {suggestion.label}
                          </Button>
                        </motion.span>
                      ))}
                    </motion.div>
                  ) : null}
                </AnimatePresence>

                <div className={chatDockComposerClasses}>
                  <PromptBar
                    ref={windowFieldRef}
                    value={draft}
                    onValueChange={setDraft}
                    onSend={send}
                    placeholder={placeholder}
                    aria-label={labels.field}
                    sendLabel={labels.send}
                  />
                </div>

                {disclaimer != null ? <p className={chatDockDisclaimerClasses}>{disclaimer}</p> : null}
              </motion.section>
            ) : (
              <motion.div
                key="rest"
                className={chatDockDockClasses}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { ...fastTransition, delay: restEnterDelay } }}
                // Gone at once on open: the window's reveal starts from this bar's place.
                exit={{ opacity: 0, transition: { duration: 0 } }}
              >
                {pills.length > 0 ? (
                  <div className={chatDockPillsClasses} role="group" aria-label={labels.suggestions}>
                    {pills.map((suggestion, index) => (
                      <span
                        key={suggestion.id}
                        className={chatDockPillClasses}
                        style={{ "--chat-dock-pill-index": index } as CSSProperties}
                      >
                        <Button
                          type="button"
                          role="secondary"
                          size="md"
                          icon={suggestion.icon}
                          onClick={() => selectSuggestion(suggestion)}
                        >
                          {suggestion.label}
                        </Button>
                      </span>
                    ))}
                  </div>
                ) : null}
                <PromptBar
                  ref={restFieldRef}
                  value={draft}
                  onValueChange={(next) => {
                    setDraft(next);
                    setOpen(true);
                  }}
                  onSend={send}
                  onFocus={() => {
                    if (!returningFocusRef.current) setOpen(true);
                  }}
                  // After Escape the resting field already has focus, so a click must open it too.
                  onClick={() => setOpen(true)}
                  start={mark}
                  placeholder={placeholder}
                  aria-label={labels.field}
                  sendLabel={labels.send}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
