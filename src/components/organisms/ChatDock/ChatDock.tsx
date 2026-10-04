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
import { Check, Copy, CornerDownRight, ThumbsDown, ThumbsUp } from "lucide-react";
import { cn } from "../../../lib/cn";
import {
  motionBeatSeconds,
  motionStaggerSeconds,
  motionTransitionProp,
  readMotionDurationSeconds,
} from "../../../lib/motion";
import { Button } from "../../atoms/Button/Button";
import { ButtonIcon } from "../../atoms/Button/ButtonIcon";
import { IconButton } from "../../atoms/IconButton/IconButton";
import { Status } from "../../atoms/Status/Status";
import { PromptBar } from "../../molecules/PromptBar/PromptBar";
import { OverlayPanelHeader } from "../Dialog/OverlayPanelHeader";
import { ChatDockGate } from "./ChatDockGate";
import { subscribeChatDockViewport, useChatDockVisibleArea, useChatDockWide } from "./chatDockViewport";
import {
  chatDockAssistantMessageClasses,
  chatDockComposerAreaClasses,
  chatDockComposerClasses,
  chatDockComposerFootSpacerClasses,
  chatDockComposerLayerClasses,
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
  chatDockReplyActionsClasses,
  chatDockReplyActionsPendingClasses,
  chatDockReplyButtonsClasses,
  chatDockReplyClasses,
  chatDockReplyMetaClasses,
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
export {
  ChatDockGate,
  chatDockGateDefaultLabels,
  type ChatDockGateLabels,
  type ChatDockGateProps,
} from "./ChatDockGate";

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

/** The visitor's vote on a reply. `null` is no vote. */
export type ChatDockFeedback = "up" | "down" | null;

/** A short note under a reply — for example how sure the assistant was of its match. */
export interface ChatDockMessageMeta {
  /** The note itself, short — for example "Match 99%". */
  label: string;
  /** What the note means, for screen readers — for example "How sure the assistant is that it matched your question." */
  description?: string;
}

export interface ChatDockMessage {
  id: string;
  role: "user" | "assistant";
  /** Text, or Markdown the app has already rendered. ChatDock does not parse Markdown. */
  content: ReactNode;
  /** Replies only: the text **Copy** writes to the clipboard. Shows Copy under the reply. */
  copyText?: string;
  /** Replies only: a short muted note under the reply, such as the match score. */
  meta?: ChatDockMessageMeta;
  /**
   * Replies only: the visitor's vote — `null` until they vote. The thumbs show on replies that carry
   * it, when `onMessageFeedback` is passed. Leave it out on replies that take no vote, such as a
   * summary of a form.
   */
  feedback?: ChatDockFeedback;
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
  /** Copy under a reply. Default: "Copy reply". */
  copy: string;
  /** Copy, once the reply is on the clipboard; also announced. Default: "Copied". */
  copied: string;
  /** Thumbs up under a reply. Default: "Mark this reply helpful". */
  helpful: string;
  /** Thumbs down under a reply. Default: "Mark this reply not helpful". */
  notHelpful: string;
}

export const chatDockDefaultLabels: ChatDockLabels = {
  close: "Close chat",
  thinking: "Thinking…",
  conversation: "Conversation",
  suggestions: "Suggested questions",
  followUps: "Suggested follow-ups",
  field: "Ask anything",
  send: "Send",
  copy: "Copy reply",
  copied: "Copied",
  helpful: "Mark this reply helpful",
  notHelpful: "Mark this reply not helpful",
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
  /**
   * The visitor voted on a reply, or cleared their vote (`null`). Pass it to show thumbs up and down
   * under finished replies that carry `feedback`; the app stores the vote and passes it back there.
   */
  onMessageFeedback?: (message: ChatDockMessage, value: ChatDockFeedback) => void;
  /**
   * A form in the composer's place — usually **ChatDock.Gate** with the steps of Start a project.
   * While it is set and the window is open, it replaces the composer, and the suggestion rows,
   * follow-ups, and disclaimer step aside; the conversation stays above it. Setting it opens the
   * window and moves focus into it; clearing it brings the composer back with focus. Escape belongs
   * to the gate (**ChatDock.Gate** closes on Escape); the window's close still folds the window, and
   * the gate is there again when it reopens.
   */
  gate?: ReactNode;
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

/** What shows under a reply. `ready` is false while the reply is still arriving. */
export interface ChatDockReplyRow {
  copy: boolean;
  vote: boolean;
  meta: boolean;
  ready: boolean;
}

/**
 * The row under a reply: Copy with `copyText`, the score with `meta`, and the thumbs when the app
 * takes votes and the reply carries `feedback`. `null` for the visitor's turns and for replies with none of these. The latest reply
 * is still arriving while `thinking` is on, so its row keeps its place but shows nothing yet.
 */
export function chatDockReplyRow({
  message,
  isLatest,
  thinking,
  takesVotes,
}: {
  message: ChatDockMessage;
  isLatest: boolean;
  thinking: boolean;
  takesVotes: boolean;
}): ChatDockReplyRow | null {
  if (message.role !== "assistant") return null;
  const row = {
    copy: message.copyText != null,
    vote: takesVotes && message.feedback !== undefined,
    meta: message.meta != null,
  };
  if (!row.copy && !row.vote && !row.meta) return null;
  return { ...row, ready: !(isLatest && thinking) };
}

/** How long Copy shows that it worked. */
const copiedHoldMs = 2000;

/** Within this distance of the end, new content keeps the thread pinned to the latest message. */
const stickToEndThresholdPx = 48;

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

/** Conversation kept in view above a gate — the last lines of the latest reply. */
const gateThreadMinRem = 7;
/** A gate never shrinks below this, even with a phone keyboard up. */
const gateFloorRem = 12;

/**
 * The tallest a gate may be, in px: the window less its top padding, the header, the conversation
 * kept in view above the gate (7rem), the gaps between them, and the space under the gate. Never
 * below 12rem, so a gate stays usable when a phone keyboard leaves little room.
 */
export function chatDockGateMaxHeight({
  windowHeight,
  headerHeight,
  bottomInset,
  remPx,
}: {
  windowHeight: number;
  headerHeight: number;
  bottomInset: number;
  remPx: number;
}): number {
  const chrome = remPx + headerHeight + 0.75 * remPx + gateThreadMinRem * remPx + 0.75 * remPx + bottomInset;
  return Math.round(Math.max(gateFloorRem * remPx, windowHeight - chrome));
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
function ChatDockRoot({
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
  onMessageFeedback,
  gate,
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
  const growLayout = useChatDockWide();
  const viewportHeight = useSyncExternalStore(subscribeChatDockViewport, readViewportHeight, () => 800);
  const remPx = useSyncExternalStore(subscribeChatDockViewport, readRemPx, () => 16);

  const isControlled = openProp !== undefined;
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const open = isControlled ? openProp : uncontrolledOpen;
  const [draft, setDraft] = useState("");
  /** Last message id when the visitor last sent — hides that reply's follow-ups at once. */
  const [sentAfterId, setSentAfterId] = useState<string | null>(null);
  /** The reply whose Copy just worked; `at` restarts the hold when it is copied again. */
  const [copied, setCopied] = useState<{ id: string; at: number } | null>(null);
  /** The window has finished folding away and is hidden. Reopening shows it again at once. */
  const [folded, setFolded] = useState(!open);
  if (open && folded) setFolded(false);
  const windowHidden = !open && folded;
  const hasGate = gate != null;
  /** The gate shows in the composer's place while the window is open. */
  const showGate = hasGate && open;
  // The composer area eases between the composer's height and the gate's while they swap.
  const [swapShowsGate, setSwapShowsGate] = useState(showGate);
  const [swapping, setSwapping] = useState(false);
  if (swapShowsGate !== showGate) {
    setSwapShowsGate(showGate);
    setSwapping(true);
  }
  const [composerAreaHeight, setComposerAreaHeight] = useState<number | null>(null);
  // The gate and the composer stay mounted (so a gate keeps its progress while the window is closed);
  // each is hidden once it has faded out.
  const [gateFaded, setGateFaded] = useState(!showGate);
  if (showGate && gateFaded) setGateFaded(false);
  const [composerFaded, setComposerFaded] = useState(showGate);
  if (!showGate && composerFaded) setComposerFaded(false);
  // Phones: keep the window and composer inside the part of the screen a keyboard leaves visible.
  const visible = useChatDockVisibleArea(placement === "fixed" && !growLayout && !windowHidden);

  const dockRef = useRef<HTMLDivElement>(null);
  const windowRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const footRef = useRef<HTMLDivElement>(null);
  const composerAreaRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gateSlotRef = useRef<HTMLDivElement>(null);
  const hadGateRef = useRef(hasGate);
  const shownGateRef = useRef(showGate);
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

  function copyReply(message: ChatDockMessage) {
    const text = message.copyText;
    const clipboard = typeof navigator === "undefined" ? undefined : navigator.clipboard;
    if (text == null || clipboard == null) return;
    clipboard.writeText(text).then(
      () => setCopied({ id: message.id, at: Date.now() }),
      () => undefined,
    );
  }

  useEffect(() => {
    if (copied == null) return;
    const timer = window.setTimeout(() => setCopied(null), copiedHoldMs);
    return () => window.clearTimeout(timer);
  }, [copied]);

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

  // Setting a gate opens the window.
  useEffect(() => {
    if (hasGate && !hadGateRef.current && !openRef.current) setOpen(true);
    hadGateRef.current = hasGate;
  });

  // A gate that shows takes focus; when it goes while the window stays open, focus returns to the
  // composer — unless the visitor has moved focus elsewhere on the page.
  useEffect(() => {
    if (showGate && !shownGateRef.current) {
      const slot = gateSlotRef.current;
      const target = slot?.querySelector<HTMLElement>("[data-chat-dock-gate-focus]") ?? slot;
      target?.focus({ preventScroll: true });
    } else if (!showGate && shownGateRef.current && open) {
      const field = fieldRef.current;
      const active = document.activeElement;
      const focusWasInside = active == null || active === document.body || dockRef.current?.contains(active) === true;
      if (field != null && focusWasInside) {
        returningFocusRef.current = true;
        field.focus({ preventScroll: true });
        returningFocusRef.current = false;
      }
    }
    shownGateRef.current = showGate;
  }, [showGate, open]);

  // A swap ends when the area has eased to its new height; this also ends one where the heights match.
  useEffect(() => {
    if (!swapping) return;
    const swapMs = (readMotionDurationSeconds("fast") + readMotionDurationSeconds("medium")) * 1000 + 100;
    const timer = window.setTimeout(() => setSwapping(false), swapMs);
    return () => window.clearTimeout(timer);
  }, [swapping]);

  // The composer area's natural height — the composer, or the gate.
  useLayoutEffect(() => {
    const area = composerAreaRef.current;
    if (area == null || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(() => setComposerAreaHeight(area.offsetHeight));
    observer.observe(area);
    return () => {
      observer.disconnect();
    };
  }, []);

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
      // Where the window fills the screen, its bottom is the bottom of the visible area.
      const below =
        windowMotion === "rise"
          ? Math.max(0, window.innerHeight - visible.bottom - dock.getBoundingClientRect().bottom)
          : 0;
      windowRef.current?.style.setProperty("--chat-dock-composer", `${bar.offsetHeight + foot.offsetHeight + below}px`);
      const windowHeight =
        windowMotion === "rise"
          ? window.innerHeight - visible.top - visible.bottom
          : chatDockOpenHeight(placement, window.innerHeight, remPx);
      const headerHeight = headerRef.current?.offsetHeight || 4 * remPx;
      const gateMax = chatDockGateMaxHeight({ windowHeight, headerHeight, bottomInset: foot.offsetHeight + below, remPx });
      dock.style.setProperty("--chat-dock-gate-max", `${gateMax}px`);
    };
    measure();
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(measure);
    observer.observe(bar);
    observer.observe(foot);
    if (headerRef.current != null) observer.observe(headerRef.current);
    return () => {
      observer.disconnect();
    };
  }, [hasDisclaimer, windowMotion, viewportHeight, visible.top, visible.bottom, placement, remPx, showGate]);

  // Keep the newest turn in view while the reader is at the end of the thread.
  useLayoutEffect(() => {
    const thread = threadRef.current;
    if (thread != null && stickToEndRef.current) {
      thread.scrollTop = thread.scrollHeight;
    }
  });

  function handleDockKeyDown(event: KeyboardEvent<HTMLElement>) {
    // While a gate is up, Escape is the gate's (it closes the gate, not the window).
    if (!open || showGate || event.key !== "Escape" || event.defaultPrevented) return;
    event.preventDefault();
    setOpen(false);
  }

  const pills = chatDockPillSuggestions(suggestions);
  const showRows = !showGate && chatDockShowsSuggestionRows(suggestions, messages);
  const showFollowUps = !showGate && chatDockShowsFollowUps({ followUps, messages, thinking, sentAfterId });
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
  // 44px targets on phones, the 36px cluster height from md.
  const replyButtonSize = growLayout ? "sm" : "md";

  function renderReplyRow(message: ChatDockMessage, row: ChatDockReplyRow) {
    const isCopied = copied?.id === message.id;
    const vote = message.feedback ?? null;
    const castVote = (value: "up" | "down") => onMessageFeedback?.(message, vote === value ? null : value);
    return (
      <div
        className={cn(chatDockReplyActionsClasses, row.ready ? undefined : chatDockReplyActionsPendingClasses)}
        data-reply-actions={row.ready ? "ready" : "pending"}
      >
        {row.copy || row.vote ? (
          <div className={chatDockReplyButtonsClasses}>
            {row.copy ? (
              <IconButton
                size={replyButtonSize}
                icon={isCopied ? <Check /> : <Copy />}
                aria-label={isCopied ? labels.copied : labels.copy}
                onClick={() => copyReply(message)}
              />
            ) : null}
            {row.vote ? (
              <>
                <IconButton
                  size={replyButtonSize}
                  icon={<ThumbsUp />}
                  aria-label={labels.helpful}
                  pressed={vote === "up"}
                  onClick={() => castVote("up")}
                />
                <IconButton
                  size={replyButtonSize}
                  icon={<ThumbsDown />}
                  aria-label={labels.notHelpful}
                  pressed={vote === "down"}
                  onClick={() => castVote("down")}
                />
              </>
            ) : null}
          </div>
        ) : null}
        {message.meta != null ? (
          <p className={chatDockReplyMetaClasses}>
            {message.meta.label}
            {message.meta.description != null ? <span className="sr-only">. {message.meta.description}</span> : null}
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <div
      className={cn(
        chatDockRootClasses[placement],
        placement === "fixed" && !windowHidden ? chatDockRootRaisedClasses : undefined,
        className,
      )}
      data-open={open ? "" : undefined}
      data-gate={showGate ? "" : undefined}
      style={
        visible.top > 0 || visible.bottom > 0
          ? ({
              "--chat-dock-vv-top": `${visible.top}px`,
              "--chat-dock-vv-bottom": `${visible.bottom}px`,
            } as CSSProperties)
          : undefined
      }
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
                <motion.div ref={headerRef} className="shrink-0" custom={0} {...sectionMotion}>
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
                  tabIndex={0}
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
                    {messages.map((message, index) => {
                      const row = chatDockReplyRow({
                        message,
                        isLatest: index === messages.length - 1,
                        thinking,
                        takesVotes: onMessageFeedback != null,
                      });
                      return (
                        <motion.div
                          key={message.id}
                          data-role={message.role}
                          className={
                            message.role === "user"
                              ? chatDockUserMessageClasses
                              : row != null
                                ? chatDockReplyClasses
                                : chatDockAssistantMessageClasses
                          }
                          initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={fast}
                        >
                          {row == null ? (
                            message.content
                          ) : (
                            <>
                              <div className={chatDockAssistantMessageClasses}>{message.content}</div>
                              {renderReplyRow(message, row)}
                            </>
                          )}
                        </motion.div>
                      );
                    })}
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

            <span className="sr-only" role="status">
              {copied != null ? labels.copied : ""}
            </span>

            <div className={chatDockComposerClasses}>
              {/* The composer, or a gate in its place: both in one cell, crossfading, while the area eases between their heights. */}
              <motion.div
                ref={barRef}
                initial={false}
                animate={{ height: composerAreaHeight ?? "auto" }}
                transition={swapping && !reduceMotion ? medium : instant}
                style={swapping ? { overflow: "hidden" } : undefined}
                onAnimationComplete={() => setSwapping(false)}
              >
                <div ref={composerAreaRef} className={chatDockComposerAreaClasses}>
                  <AnimatePresence initial={false}>
                    {hasGate ? (
                      <motion.div
                        key="gate"
                        ref={gateSlotRef}
                        className={cn(chatDockComposerLayerClasses, showGate ? undefined : "pointer-events-none")}
                        data-chat-dock-gate=""
                        hidden={gateFaded}
                        initial={{ opacity: 0, y: 12 }}
                        animate={showGate ? { opacity: 1, y: 0, transition: { ...fast, delay: reduceMotion ? 0 : fast.duration } } : { opacity: 0, y: 12, transition: fast }}
                        exit={{ opacity: 0, y: 12, transition: fast }}
                        onAnimationComplete={() => {
                          if (!showGate) setGateFaded(true);
                        }}
                      >
                        {gate}
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                  <motion.div
                    className={cn(chatDockComposerLayerClasses, showGate ? "pointer-events-none" : undefined)}
                    hidden={composerFaded}
                    initial={false}
                    animate={showGate ? { opacity: 0, transition: fast } : { opacity: 1, transition: { ...fast, delay: swapping && !reduceMotion ? fast.duration : 0 } }}
                    onAnimationComplete={() => {
                      if (showGate) setComposerFaded(true);
                    }}
                  >
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
                  </motion.div>
                </div>
              </motion.div>
              <motion.div
                className="overflow-hidden"
                aria-hidden={open ? undefined : true}
                variants={footVariants}
                initial={false}
                animate={state}
              >
                <div ref={footRef}>
                  {disclaimer != null && !showGate ? (
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

/**
 * Pinned prompt that opens into a chat window. At rest it is a **PromptBar** with the brand
 * mark; hovering shows suggestion pills above it. Focusing or typing opens a non-modal window
 * around the same composer. **ChatDock.Gate** is the multi-step form a `gate` puts in the
 * composer's place.
 */
export const ChatDock = Object.assign(ChatDockRoot, {
  Gate: ChatDockGate,
});
