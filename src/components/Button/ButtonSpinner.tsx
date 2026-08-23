import { cn } from "../../lib/cn";
import { buttonIconSizeClasses, type ButtonSize } from "./buttonStyles";

/** Loading spinner sized to match {@link ButtonIcon} for the same button size. */
export function ButtonSpinner({ size }: { size: ButtonSize }) {
  return (
    <span
      className={cn(
        "animate-spin shrink-0 rounded-full border-2 border-current border-r-transparent",
        buttonIconSizeClasses[size],
      )}
      aria-hidden
    />
  );
}
