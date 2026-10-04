import {
  forwardRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
  type TextareaHTMLAttributes,
} from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "../../../lib/cn";
import { IconButton } from "../../atoms/IconButton/IconButton";
import { TextArea } from "../../atoms/TextArea/TextArea";
import {
  promptBarFieldClasses,
  promptBarSendClasses,
  promptBarSendMutedClasses,
  promptBarSendReadyClasses,
  promptBarEndSlotClasses,
  promptBarShellClasses,
  promptBarShellStartPadClasses,
  promptBarStartSlotClasses,
} from "./promptBarStyles";

/** Layout-only — width, margin, flex placement. Not for colors. */
export type PromptBarLayoutClassName = string;

export const promptBarPlaceholder = "Ask anything…";

export interface PromptBarProps
  extends Omit<
    TextareaHTMLAttributes<HTMLTextAreaElement>,
    "children" | "className" | "defaultValue" | "onChange" | "placeholder" | "rows" | "size" | "value"
  > {
  /** Controlled draft. Omit to let PromptBar hold the draft. */
  value?: string;
  /** Uncontrolled initial draft. */
  defaultValue?: string;
  /** Fires on each edit. */
  onValueChange?: (value: string) => void;
  /**
   * Enter or the send control. Receives the current draft.
   * Empty and whitespace-only drafts do not send.
   */
  onSend?: (value: string) => void;
  /** Default: "Ask anything…" */
  placeholder?: string;
  /** Accessible name for the field. Default: "Ask anything". */
  "aria-label"?: string;
  /** Accessible name for the send control. Default: "Send". */
  sendLabel?: string;
  disabled?: boolean;
  /**
   * Leading slot inside the pill — a brand mark or **Avatar** `sm` (2.25rem). Decorative or
   * labeled by the caller; not a control.
   */
  start?: ReactNode;
  /**
   * Extra inset controls before send — for example a mic **IconButton** `sm` `role="secondary"`.
   * The caller owns the handler and accessible name.
   */
  end?: ReactNode;
  className?: PromptBarLayoutClassName;
}

function draftCanSend(value: string): boolean {
  return value.trim().length > 0;
}

/**
 * Wide prompt pill — inline {@link TextArea} plus an {@link IconButton} send control.
 * Enter sends. Shift+Enter inserts a newline. The field stays one line until the text wraps,
 * grows through three lines, then scrolls. The send control is muted until there is text,
 * then brand navy (`--color-brand`). Voice and attachments are not part of this version.
 */
export const PromptBar = forwardRef<HTMLTextAreaElement, PromptBarProps>(function PromptBar(
  {
    value,
    defaultValue = "",
    onValueChange,
    onSend,
    placeholder = promptBarPlaceholder,
    "aria-label": ariaLabel = "Ask anything",
    sendLabel = "Send",
    disabled = false,
    start,
    end,
    className,
    onKeyDown,
    ...fieldProps
  },
  ref,
) {
  const isControlled = value !== undefined;
  const [uncontrolled, setUncontrolled] = useState(defaultValue);
  const draft = isControlled ? value : uncontrolled;
  const canSend = !disabled && draftCanSend(draft);

  function setDraft(next: string) {
    if (!isControlled) {
      setUncontrolled(next);
    }
    onValueChange?.(next);
  }

  function send() {
    if (!canSend) return;
    onSend?.(draft);
    if (!isControlled) {
      setUncontrolled("");
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    onKeyDown?.(event);
    if (event.defaultPrevented) return;
    if (event.key !== "Enter" || event.shiftKey || event.nativeEvent.isComposing) return;
    event.preventDefault();
    send();
  }

  return (
    <div
      className={cn(
        promptBarShellClasses,
        start != null ? promptBarShellStartPadClasses.slot : promptBarShellStartPadClasses.field,
        className,
      )}
    >
      {start != null ? <div className={promptBarStartSlotClasses}>{start}</div> : null}
      <TextArea
        {...fieldProps}
        ref={ref}
        inline
        rows={1}
        resize="none"
        value={draft}
        placeholder={placeholder}
        aria-label={ariaLabel}
        disabled={disabled}
        className={promptBarFieldClasses}
        onChange={(event) => {
          setDraft(event.target.value);
        }}
        onKeyDown={handleKeyDown}
      />
      {end != null ? <div className={promptBarEndSlotClasses}>{end}</div> : null}
      <IconButton
        type="button"
        role="primary"
        size="sm"
        icon={<ArrowRight strokeWidth={2} />}
        aria-label={sendLabel}
        title={sendLabel}
        disabled={!canSend}
        className={cn(promptBarSendClasses, canSend ? promptBarSendReadyClasses : promptBarSendMutedClasses)}
        onClick={send}
      />
    </div>
  );
});
