import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type FocusEventHandler,
  type KeyboardEventHandler,
  type MouseEventHandler,
} from "react";
import { Copy } from "lucide-react";
import { Button, buttonStatusHoldMs, type ButtonStatus } from "../../atoms/Button/Button";
import { Input } from "../../atoms/Input/Input";
import { cn } from "../../../lib/cn";
import {
  copyFieldButtonClasses,
  copyFieldClasses,
  copyFieldControlClasses,
  copyFieldHintClasses,
  copyFieldRowClasses,
} from "./copyFieldStyles";

export const copyFieldStates = ["idle", "copied", "fallback"] as const;

export type CopyFieldState = (typeof copyFieldStates)[number];

/** Idle button label. */
export const copyFieldCopyLabel = "Copy key";

/** Confirmation label. Holds for {@link buttonStatusHoldMs}, then returns to idle. */
export const copyFieldCopiedLabel = "Copied";

/** Shown when the Clipboard API is missing or blocked. */
export const copyFieldFallbackHint = "Press Cmd/Ctrl+C to copy.";

/** Layout-only — width, margin, flex placement. Not for color or type. */
export type CopyFieldLayoutClassName = string;

export interface CopyFieldProps {
  /** Read-only value to show and copy. Never logged. */
  value: string;
  /** Visible label. Provide this or `aria-label`. */
  label?: string;
  /** Accessible name when `label` is omitted. */
  "aria-label"?: string;
  /** Idle button label. @default "Copy key" */
  copyLabel?: string;
  /** Confirmation label. @default "Copied" */
  copiedLabel?: string;
  /**
   * Hint when the Clipboard API is missing or blocked.
   * @default "Press Cmd/Ctrl+C to copy."
   */
  fallbackHint?: string;
  /**
   * Pin the appearance. Omit so a click copies and "Copied" returns to idle
   * after `buttonStatusHoldMs` (2s). `"copied"` and `"fallback"` are for specimens.
   */
  state?: CopyFieldState;
  id?: string;
  className?: CopyFieldLayoutClassName;
}

function clipboardWrite(): ((text: string) => Promise<void>) | null {
  if (typeof navigator === "undefined") return null;
  const clipboard = navigator.clipboard;
  if (clipboard == null || typeof clipboard.writeText !== "function") return null;
  return (text) => clipboard.writeText(text);
}

function selectFieldText(field: HTMLInputElement) {
  field.select();
  const length = field.value.length;
  try {
    field.setSelectionRange(0, length);
  } catch {
    // `setSelectionRange` rejects some input types. This field is text.
  }
}

/**
 * Read-only monospace value plus a button that copies it.
 * The value is never written to the console.
 */
export const CopyField = forwardRef<HTMLInputElement, CopyFieldProps>(function CopyField(
  {
    value,
    label,
    "aria-label": ariaLabel,
    copyLabel = copyFieldCopyLabel,
    copiedLabel = copyFieldCopiedLabel,
    fallbackHint = copyFieldFallbackHint,
    state,
    id,
    className,
  },
  ref,
) {
  const hintId = useId();
  const fieldRef = useRef<HTMLInputElement | null>(null);
  const mountedRef = useRef(true);
  const [internal, setInternal] = useState<CopyFieldState>("idle");
  const controlled = state !== undefined;
  const phase = state ?? internal;

  const setField = useCallback(
    (node: HTMLInputElement | null) => {
      fieldRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref != null) ref.current = node;
    },
    [ref],
  );

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (controlled || internal !== "copied") return;
    const timer = window.setTimeout(() => setInternal("idle"), buttonStatusHoldMs);
    return () => window.clearTimeout(timer);
  }, [controlled, internal]);

  useEffect(() => {
    if (phase !== "fallback") return;
    const field = fieldRef.current;
    if (field == null) return;
    field.focus();
    selectFieldText(field);
  }, [phase]);

  const buttonStatus: ButtonStatus = phase === "copied" ? "success" : "idle";

  async function copy() {
    const write = clipboardWrite();
    if (write != null) {
      try {
        await write(value);
        if (!mountedRef.current || controlled) return;
        setInternal("copied");
        return;
      } catch {
        // Clipboard API blocked. Do not log — a rejection can include the value.
      }
    }

    if (!mountedRef.current) return;
    const field = fieldRef.current;
    if (field != null) {
      field.focus();
      selectFieldText(field);
      try {
        document.execCommand("copy");
      } catch {
        // The hint tells the visitor to press the shortcut.
      }
    }
    if (!mountedRef.current || controlled) return;
    setInternal("fallback");
  }

  const onFocus: FocusEventHandler<HTMLInputElement> = () => {
    const field = fieldRef.current;
    if (field != null) selectFieldText(field);
  };

  const onMouseUp: MouseEventHandler<HTMLInputElement> = (event) => {
    event.preventDefault();
  };

  const onButtonKeyDown: KeyboardEventHandler<HTMLButtonElement> = (event) => {
    if (event.repeat) return;
    if (event.key !== "Enter" && event.key !== " ") return;
    if (event.metaKey || event.ctrlKey || event.altKey) return;
    // preventDefault stops the browser from clicking again, so Enter and Space copy once.
    event.preventDefault();
    event.currentTarget.click();
  };

  return (
    <div className={cn(copyFieldClasses, className)}>
      <div className={copyFieldRowClasses}>
        <div className={copyFieldControlClasses}>
          <Input
            ref={setField}
            id={id}
            mono
            readOnly
            value={value}
            label={label}
            aria-label={label == null ? ariaLabel : undefined}
            spellCheck={false}
            autoComplete="off"
            aria-describedby={phase === "fallback" ? hintId : undefined}
            onFocus={onFocus}
            onMouseUp={onMouseUp}
          />
        </div>
        <Button
          type="button"
          role="secondary"
          size="md"
          icon={<Copy strokeWidth={2} />}
          status={buttonStatus}
          statusLabels={{ success: copiedLabel }}
          className={copyFieldButtonClasses}
          onKeyDown={onButtonKeyDown}
          onClick={() => {
            void copy();
          }}
        >
          {copyLabel}
        </Button>
      </div>
      <p
        id={hintId}
        role="status"
        aria-live="polite"
        className={cn(copyFieldHintClasses, phase !== "fallback" && "sr-only")}
      >
        {phase === "fallback" ? fallbackHint : ""}
      </p>
    </div>
  );
});
