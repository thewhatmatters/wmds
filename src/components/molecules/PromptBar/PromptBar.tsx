import {
  forwardRef,
  useState,
  type KeyboardEvent,
  type TextareaHTMLAttributes,
} from "react";
import { ArrowUp } from "lucide-react";
import { cn } from "../../../lib/cn";
import { IconButton } from "../../atoms/IconButton/IconButton";
import { TextArea } from "../../atoms/TextArea/TextArea";
import { promptBarFieldClasses, promptBarSendClasses, promptBarShellClasses } from "./promptBarStyles";

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
  className?: PromptBarLayoutClassName;
}

function draftCanSend(value: string): boolean {
  return value.trim().length > 0;
}

/**
 * Wide prompt pill — inline {@link TextArea} plus an {@link IconButton} send control.
 * Enter sends. Shift+Enter inserts a newline. The send control stays disabled until there is text,
 * then uses brand navy (`--color-brand`). Voice and attachments are not part of this version.
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
    <div className={cn(promptBarShellClasses, className)}>
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
      <IconButton
        type="button"
        role="primary"
        size="md"
        icon={<ArrowUp strokeWidth={2} />}
        aria-label={sendLabel}
        title={sendLabel}
        disabled={!canSend}
        className={promptBarSendClasses}
        onClick={send}
      />
    </div>
  );
});
