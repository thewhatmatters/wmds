import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactElement,
  type ReactNode,
} from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { cn } from "../../../lib/cn";
import { motionTransitionProp } from "../../../lib/motion";
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
  chatDockGridClasses,
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
  field: "Ask anything",
  send: "Send",
};

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
  /** Every suggestion choice, including actions without a `prompt`. */
  onSuggestionSelect?: (suggestion: ChatDockSuggestion) => void;
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

/** Within this distance of the end, new content keeps the thread pinned to the latest message. */
const stickToEndThresholdPx = 48;

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

  const restFieldRef = useRef<HTMLTextAreaElement>(null);
  const windowFieldRef = useRef<HTMLTextAreaElement>(null);
  const threadRef = useRef<HTMLDivElement>(null);
  const stickToEndRef = useRef(true);
  /** Set while focus returns to the resting bar after closing, so that focus does not reopen. */
  const returningFocusRef = useRef(false);
  const wasOpenRef = useRef(open);

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
    onSend(text);
  }

  function selectSuggestion(suggestion: ChatDockSuggestion) {
    onSuggestionSelect?.(suggestion);
    if (suggestion.prompt != null) send(suggestion.prompt);
  }

  useEffect(() => {
    if (open && !wasOpenRef.current) {
      windowFieldRef.current?.focus();
    } else if (!open && wasOpenRef.current) {
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
  const windowTransition = motionTransitionProp("medium");
  const windowOffset = reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.98 };

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
                style={{ transformOrigin: "50% 100%" }}
                initial={windowOffset}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={windowOffset}
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
                  {greeting != null ? <div className={chatDockAssistantMessageClasses}>{greeting}</div> : null}
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      data-role={message.role}
                      className={
                        message.role === "user" ? chatDockUserMessageClasses : chatDockAssistantMessageClasses
                      }
                    >
                      {message.content}
                    </div>
                  ))}
                  {thinking ? (
                    <div className={chatDockThinkingClasses}>
                      <Status variant="dot" tone="neutral" pulsing besideLabel />
                      <span>{labels.thinking}</span>
                    </div>
                  ) : null}
                </div>

                {showRows ? (
                  <div className={chatDockSuggestionListClasses} role="group" aria-label={labels.suggestions}>
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
                  </div>
                ) : null}

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
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={windowTransition}
              >
                {pills.length > 0 ? (
                  <div className={chatDockPillsClasses} role="group" aria-label={labels.suggestions}>
                    {pills.map((suggestion) => (
                      <Button
                        key={suggestion.id}
                        type="button"
                        role="secondary"
                        size="md"
                        icon={suggestion.icon}
                        onClick={() => selectSuggestion(suggestion)}
                      >
                        {suggestion.label}
                      </Button>
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
