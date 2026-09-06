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
      <span>{message}</span>
    </p>
  );
}
