import { CheckCircle2, CircleX, TriangleAlert } from "lucide-react";
import { cn } from "../../../lib/cn";
import {
  inputStatusBannerClassesFor,
  inputStatusBannerIconClasses,
  type InputMessagePosition,
  type InputSize,
  type InputStatus,
} from "./inputShellStyles";

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

export function InputStatusBanner({
  status,
  message,
  messageId,
  size,
  messagePosition,
}: {
  status: InputStatus;
  message: string;
  messageId: string;
  size: InputSize;
  messagePosition: InputMessagePosition;
}) {
  return (
    <p
      id={messageId}
      className={cn(
        inputStatusBannerClassesFor(status, size, messagePosition),
        "text-xs font-normal tracking-normal",
      )}
      role={status === "error" ? "alert" : "status"}
    >
      <BannerIcon status={status} />
      <span>{message}</span>
    </p>
  );
}
