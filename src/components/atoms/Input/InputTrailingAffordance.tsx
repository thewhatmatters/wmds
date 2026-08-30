import { CheckCircle2, CircleX, Loader2, TriangleAlert } from "lucide-react";
import { cn } from "../../../lib/cn";
import {
  inputSpinnerSizeClasses,
  inputStatusIconClasses,
  inputStatusIconSizeClasses,
  type InputSize,
  type InputStatus,
} from "./inputShellStyles";

function StatusIcon({ status, size }: { status: InputStatus; size: InputSize }) {
  const className = cn(inputStatusIconSizeClasses[size], inputStatusIconClasses[status]);
  const strokeWidth = 2;

  if (status === "error") {
    return <CircleX className={className} strokeWidth={strokeWidth} aria-hidden />;
  }
  if (status === "warning") {
    return <TriangleAlert className={className} strokeWidth={strokeWidth} aria-hidden />;
  }
  return <CheckCircle2 className={className} strokeWidth={strokeWidth} aria-hidden />;
}

export function InputTrailingAffordance({
  size,
  status,
  loading,
}: {
  size: InputSize;
  status?: InputStatus;
  loading?: boolean;
}) {
  if (loading) {
    return (
      <Loader2
        className={cn(
          inputSpinnerSizeClasses[size],
          "animate-spin stroke-current text-muted",
        )}
        strokeWidth={2}
        aria-hidden
      />
    );
  }

  if (status == null) {
    return null;
  }

  return <StatusIcon status={status} size={size} />;
}
