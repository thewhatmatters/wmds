import { CheckCircle2, CircleX, TriangleAlert } from "lucide-react";
import { cn } from "../../../lib/cn";
import {
  inputStatusBannerClassesFor,
  inputStatusBannerIconClasses,
  type InputMessagePosition,
  type InputSize,
  type InputStatus,
} from "../Input/inputShellStyles";

function BannerIcon({ status }: { status: InputStatus }) {
  const className = inputStatusBannerIconClasses[status];
  const strokeWidth = 2;

  if (status === "error") {
    return <CircleX className={className} strokeWidth={strokeWidth} aria-hidden />;
  }
  if (status === "warning") {
    return <TriangleAlert className={className} strokeWidth={strokeWidth} aria-hidden />;
  }
  return <CheckCircle2 className={className} strokeWidth={strokeWidth} aria-hidden />;
}

/** Read before the message by screen readers (V6). Success has its tick and needs no prefix. */
const statusPrefix: Record<InputStatus, string | null> = { error: "Error:", warning: "Warning:", success: null };

/**
 * Errors and validation V10: an error or a warning always says what's wrong. Warns in the console when a
 * field has `status="error"` or `"warning"` and no `message`; a status-only success tick is fine.
 */
export function warnStatusWithoutMessage(component: string, status: InputStatus | undefined, message: unknown) {
  if ((status === "error" || status === "warning") && (message == null || message === "")) {
    console.warn(`[WMDS ${component}] \`status="${status}"\` needs a \`message\` that says what's wrong and how to fix it.`);
  }
}

/** Tinted validation band — shared by **Input** and **TextArea** (ADR-0006). */
export function InputStatusBanner({
  status,
  message,
  messageId,
  size,
  messagePosition,
  bannerClassName,
  className,
}: {
  status: InputStatus;
  message: string;
  messageId: string;
  size: InputSize;
  messagePosition: InputMessagePosition;
  /** Replace default pill overlap band geometry — e.g. **TextArea** multiline shell. */
  bannerClassName?: string;
  className?: string;
}) {
  return (
    <p
      id={messageId}
      className={cn(
        bannerClassName ?? inputStatusBannerClassesFor(status, size, messagePosition),
        "text-xs font-normal tracking-normal",
        className,
      )}
      role={status === "error" ? "alert" : "status"}
    >
      <BannerIcon status={status} />
      <span>
        {/* Errors and validation V6: the message is announced with its kind, not by colour or icon alone. */}
        {statusPrefix[status] != null ? <span className="sr-only">{statusPrefix[status]} </span> : null}
        {message}
      </span>
    </p>
  );
}
