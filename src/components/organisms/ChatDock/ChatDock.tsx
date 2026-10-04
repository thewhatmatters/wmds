import {
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type KeyboardEvent,
  type ReactElement,
  type ReactNode,
} from "react";
import {
  AnimatePresence,
  MotionConfigContext,
  motion,
  useReducedMotion,
  type Transition,
  type Variants,
} from "motion/react";
import { CornerDownRight } from "lucide-react";
import { cn } from "../../../lib/cn";
import { motionBeatSeconds, motionStaggerSeconds, motionTransitionProp } from "../../../lib/motion";
import { Button } from "../../atoms/Button/Button";
import { ButtonIcon } from "../../atoms/Button/ButtonIcon";
import { Status } from "../../atoms/Status/Status";
import { PromptBar } from "../../molecules/PromptBar/PromptBar";
import { OverlayPanelHeader } from "../Dialog/OverlayPanelHeader";
import {
  chatDockAssistantMessageClasses,
  chatDockComposerClasses,
  chatDockComposerFootSpacerClasses,
  chatDockDisclaimerClasses,
  chatDockDockClasses,
  chatDockDockHoverClasses,
  chatDockFollowUpRowClasses,
  chatDockFollowUpsComposerClasses,
  chatDockFollowUpsInlineClasses,
  chatDockGridClasses,
  chatDockMarkClasses,
  chatDockPillClasses,
  chatDockPillsClasses,
  chatDockRootClasses,
  chatDockRootRaisedClasses,
  chatDockSuggestionLabelClasses,
  chatDockSuggestionListClasses,
  chatDockSuggestionRowContentClasses,
  chatDockThinkingClasses,
  chatDockThreadClasses,
  chatDockUserMessageClasses,
  chatDockWindowClasses,
  chatDockWindowContentClasses,
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
   * Follow-ups for the latest reply — one to three short items, the same shape and handlers as
   * `suggestions`. Their `icon` is not shown: inline rows all lead with a corner-down-right arrow,
   * and pills above the composer are text only. They show while the last message is an assistant
   * reply and `thinking` is off, and disappear the moment the visitor sends. The app decides which
   * replies get follow-ups and replaces or clears them with each reply.
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

/** From this width the fixed window grows out of the composer; below it the window fills the screen. */
const chatDockGrowQuery = "(min-width: 48rem)";

function subscribeViewport(onChange: () => void): () => void {
  window.addEventListener("resize", onChange);
  const query = typeof window.matchMedia === "function" ? window.matchMedia(chatDockGrowQuery) : null;
  query?.addEventListener("change", onChange);
  return () => {
    window.removeEventListener("resize", onChange);
    query?.removeEventListener("change", onChange);
  };
}

function readGrowLayout(): boolean {
  return typeof window.matchMedia === "function" ? window.matchMedia(chatDockGrowQuery).matches : true;
}

function readViewportHeight(): number {
  return window.innerHeight;
}

function readRemPx(): number {
  return Number.parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
}

/**
 * Height of the open window where it grows out of the composer, in px: 40rem, or the viewport less
 * 7rem when that is shorter. Inline specimens are 32rem.
 */
export function chatDockOpenHeight(placement: ChatDockPlacement, viewportHeight: number, remPx: number): number {
  if (placement === "inline") return 32 * remPx;
  return Math.max(0, Math.min(40 * remPx, viewportHeight - 7 * remPx));
}

/**
 * How the window moves. `grow` (from `md`, and inline): it sits on the composer's bottom edge and
 * grows up and out of it. `rise`: on phones it fills the screen and rises from the bottom edge.
 */
export type ChatDockWindowMotion = "grow" | "rise";

/**
 * Pinned prompt that opens into a chat window. At rest it is a **PromptBar** with the brand
 * mark; hovering shows suggestion pills above it. Focusing or typing opens a non-modal window
 * around the same composer — header, conversation, suggestion rows, and an optional disclaimer.
 * Escape or Close folds it back into the bar. The page behind stays usable.
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
  const { reducedMotion: reducedMotionConfig } = useContext(MotionConfigContext);
  const reduceMotion = useReducedMotion() === true || reducedMotionConfig === "always";
  const growLayout = useSyncExternalStore(subscribeViewport, readGrowLayout, () => true);
  const viewportHeight = useSyncExternalStore(subscribeViewport, readViewportHeight, () => 800);
  const remPx = useSyncExternalStore(subscribeViewport, readRemPx, () => 16);

  const isControlled = openProp !== undefined;
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const open = isControlled ? openProp : uncontrolledOpen;
  const [draft, setDraft] = useState("");
  /** Last message id when the visitor last sent — hides that reply's follow-ups at once. */
  const [sentAfterId, setSentAfterId] = useState<string | null>(null);
  /** The window has finished folding away and is hidden. Reopening shows it again at once. */
  const [folded, setFolded] = useState(!open);
  if (open && folded) setFolded(false);
  const windowHidden = !open && folded;

  const dockRef = useRef<HTMLDivElement>(null);
  const windowRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const footRef = useRef<HTMLDivElement>(null);
  const fieldRef = useRef<HTMLTextAreaElement>(null);
  const threadRef = useRef<HTMLDivElement>(null);
  const stickToEndRef = useRef(true);
  /** Set while focus returns to the composer after closing, so that focus does not reopen. */
  const returningFocusRef = useRef(false);
  const wasOpenRef = useRef(open);
  const openRef = useRef(open);

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
    fieldRef.current?.focus();
  }

  // One composer serves both states: opening keeps (or brings) focus in it, and closing hands focus
  // back to it from inside the window without reopening.
  useEffect(() => {
    openRef.current = open;
    const field = fieldRef.current;
    if (field != null && open && !wasOpenRef.current) {
      if (document.activeElement !== field) field.focus();
    } else if (field != null && !open && wasOpenRef.current) {
      const active = document.activeElement;
      const focusWasInside = active == null || active === document.body || dockRef.current?.contains(active) === true;
      if (active !== field && focusWasInside) {
        returningFocusRef.current = true;
        field.focus();
        returningFocusRef.current = false;
      }
    }
    wasOpenRef.current = open;
  }, [open]);

  // The window's content stops above the composer and the line under it, which sit on top of it.
  // Where the window fills the screen, that also includes the space between the dock and the bottom edge.
  const hasDisclaimer = disclaimer != null;
  const windowMotion: ChatDockWindowMotion = placement === "fixed" && !growLayout ? "rise" : "grow";
  useLayoutEffect(() => {
    const dock = dockRef.current;
    const bar = barRef.current;
    const foot = footRef.current;
    if (dock == null || bar == null || foot == null) return;
    const measure = () => {
      const below = windowMotion === "rise" ? Math.max(0, window.innerHeight - dock.getBoundingClientRect().bottom) : 0;
      windowRef.current?.style.setProperty("--chat-dock-composer", `${bar.offsetHeight + foot.offsetHeight + below}px`);
    };
    measure();
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(measure);
    observer.observe(bar);
    observer.observe(foot);
    return () => {
      observer.disconnect();
    };
  }, [hasDisclaimer, windowMotion, viewportHeight]);

  // Keep the newest turn in view while the reader is at the end of the thread.
  useLayoutEffect(() => {
    const thread = threadRef.current;
    if (thread != null && stickToEndRef.current) {
      thread.scrollTop = thread.scrollHeight;
    }
  });

  function handleDockKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (!open || event.key !== "Escape" || event.defaultPrevented) return;
    event.preventDefault();
    setOpen(false);
  }

  const pills = chatDockPillSuggestions(suggestions);
  const showRows = chatDockShowsSuggestionRows(suggestions, messages);
  const showFollowUps = chatDockShowsFollowUps({ followUps, messages, thinking, sentAfterId });
  const state = open ? "open" : "closed";

  const medium = motionTransitionProp("medium");
  const fast = motionTransitionProp("fast");
  const stagger = motionStaggerSeconds();
  const beat = motionBeatSeconds(1);
  /** Closing starts once the content has begun to fade. */
  const foldDelay = stagger;
  const instant: Transition = { duration: 0 };
  /** Reduced motion: sizes and positions change at once; only opacity fades. */
  const reducedTransition: Transition = { default: instant, opacity: fast };

  // Closed, the window is the resting bar's own pill, hidden behind it; open, a card 16px wider than
  // the bar on each side, so the composer keeps its width and only rises by the line under it.
  const barHeight = 3.25 * remPx;
  const closedShape = { height: barHeight, left: 0, right: 0, borderRadius: barHeight / 2 };
  const openShape = {
    height: chatDockOpenHeight(placement, viewportHeight, remPx),
    left: -remPx,
    right: -remPx,
    borderRadius: remPx,
  };
  const windowVariants: Variants = reduceMotion
    ? {
        // A plain crossfade in place.
        open: { ...(windowMotion === "grow" ? openShape : { y: 0 }), opacity: 1, transition: reducedTransition },
        closed: { ...(windowMotion === "grow" ? openShape : { y: 0 }), opacity: 0, transition: reducedTransition },
      }
    : windowMotion === "grow"
      ? {
          open: { ...openShape, opacity: 1, transition: medium },
          closed: { ...closedShape, opacity: 1, transition: { ...medium, delay: foldDelay } },
        }
      : {
          open: { y: 0, opacity: 1, transition: medium },
          closed: { y: "100%", opacity: 1, transition: { ...medium, delay: foldDelay } },
        };
  // Header, conversation, then rows settle in one stagger apart, a beat after the window starts
  // to open; they all fade out together before it folds.
  const sectionVariants: Variants = reduceMotion
    ? { open: {}, closed: {} }
    : {
        open: (index: number) => ({ opacity: 1, y: 0, transition: { ...fast, delay: beat + index * stagger } }),
        closed: { opacity: 0, y: 8, transition: fast },
      };
  const sectionMotion = { variants: sectionVariants, initial: false, animate: state } as const;
  // The mark folds out of the composer as the window opens (the header carries it) and comes back
  // as the window folds into the bar. With reduced motion sizes change at once and only opacity fades.
  const markVariants: Variants = {
    open: { width: 0, opacity: 0, transition: reduceMotion ? reducedTransition : { width: medium, opacity: fast } },
    closed: {
      width: "auto",
      opacity: 1,
      transition: reduceMotion
        ? reducedTransition
        : { width: { ...medium, delay: foldDelay }, opacity: { ...fast, delay: beat } },
    },
  };
  // The line under the composer opens with the window, so the composer travels up by its height.
  const footVariants: Variants = {
    open: {
      height: "auto",
      opacity: 1,
      transition: reduceMotion ? reducedTransition : { height: medium, opacity: { ...fast, delay: beat } },
    },
    closed: {
      height: 0,
      opacity: 0,
      transition: reduceMotion ? reducedTransition : { height: { ...medium, delay: foldDelay }, opacity: fast },
    },
  };
  // Follow-ups rise in one stagger apart when a reply brings them; they leave at once on send and
  // fade with the rest of the window when it closes.
  const followUpGroupMotion = {
    initial: reduceMotion ? false : ("hidden" as const),
    animate: open ? ("visible" as const) : ("folded" as const),
    exit: { opacity: 0, transition: instant },
    variants: {
      hidden: {},
      visible: { opacity: 1, transition: { ...fast, staggerChildren: stagger } },
      folded: { opacity: 0, transition: reduceMotion ? instant : fast },
    },
  };
  const followUpItemVariants: Variants = {
    hidden: { opacity: 0, y: 6 },
    visible: { opacity: 1, y: 0, transition: fast },
  };
  const keepComposerFocus = (event: { preventDefault: () => void }) => event.preventDefault();

  return (
    <div
      className={cn(
        chatDockRootClasses[placement],
        placement === "fixed" && !windowHidden ? chatDockRootRaisedClasses : undefined,
        className,
      )}
      data-open={open ? "" : undefined}
    >
      <div className={chatDockGridClasses}>
        <div className="band">
          <div
            ref={dockRef}
            className={cn(chatDockDockClasses, windowHidden ? chatDockDockHoverClasses : undefined)}
            role={open ? "dialog" : undefined}
            aria-modal={open ? "false" : undefined}
            aria-labelledby={open ? titleId : undefined}
            aria-describedby={open && subtitle != null ? subtitleId : undefined}
            onKeyDown={handleDockKeyDown}
          >
            <AnimatePresence initial={false}>
              {!open && pills.length > 0 ? (
                <motion.div
                  key="pills"
                  className={chatDockPillsClasses}
                  role="group"
                  aria-label={labels.suggestions}
                  exit={{ opacity: 0, transition: reduceMotion ? instant : fast }}
                >
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
                </motion.div>
              ) : null}
            </AnimatePresence>

            <motion.div
              // Phones and wider screens move the window differently; switching starts it fresh.
              key={windowMotion}
              ref={windowRef}
              className={chatDockWindowClasses[placement]}
              data-chat-dock-window={state}
              hidden={windowHidden}
              variants={windowVariants}
              initial={false}
              animate={state}
              onAnimationComplete={(definition) => {
                if (definition === "closed" && !openRef.current) setFolded(true);
              }}
            >
              <div className={chatDockWindowContentClasses}>
                <motion.div className="shrink-0" custom={0} {...sectionMotion}>
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
                </motion.div>

                <motion.div
                  ref={threadRef}
                  className={chatDockThreadClasses}
                  role="log"
                  aria-label={labels.conversation}
                  custom={1}
                  {...sectionMotion}
                  onScroll={(event) => {
                    const thread = event.currentTarget;
                    stickToEndRef.current =
                      thread.scrollHeight - thread.scrollTop - thread.clientHeight <= stickToEndThresholdPx;
                  }}
                >
                  {greeting != null ? <div className={chatDockAssistantMessageClasses}>{greeting}</div> : null}
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
                        transition={fast}
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
                        animate="visible"
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
                                <ButtonIcon size="md">
                                  <CornerDownRight />
                                </ButtonIcon>
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
                        exit={{ opacity: 0, transition: instant }}
                        transition={fast}
                      >
                        <Status variant="dot" tone="neutral" pulsing besideLabel />
                        <span>{labels.thinking}</span>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </motion.div>

                {showRows ? (
                  <motion.div
                    className={chatDockSuggestionListClasses}
                    role="group"
                    aria-label={labels.suggestions}
                    custom={2}
                    {...sectionMotion}
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
              </div>
            </motion.div>

            <div className={chatDockComposerClasses}>
              <div ref={barRef}>
                <PromptBar
                  ref={fieldRef}
                  value={draft}
                  onValueChange={(next) => {
                    setDraft(next);
                    setOpen(true);
                  }}
                  onSend={send}
                  onFocus={() => {
                    if (!returningFocusRef.current) setOpen(true);
                  }}
                  // After Escape the field keeps focus, so a click must open the window too.
                  onClick={() => setOpen(true)}
                  start={
                    mark != null ? (
                      <motion.span
                        className={chatDockMarkClasses}
                        aria-hidden={open ? true : undefined}
                        variants={markVariants}
                        initial={false}
                        animate={state}
                      >
                        {mark}
                      </motion.span>
                    ) : undefined
                  }
                  placeholder={placeholder}
                  aria-label={labels.field}
                  sendLabel={labels.send}
                />
              </div>
              <motion.div
                className="overflow-hidden"
                aria-hidden={open ? undefined : true}
                variants={footVariants}
                initial={false}
                animate={state}
              >
                <div ref={footRef}>
                  {disclaimer != null ? (
                    <p className={chatDockDisclaimerClasses[placement]}>{disclaimer}</p>
                  ) : (
                    <div className={chatDockComposerFootSpacerClasses[placement]} />
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
