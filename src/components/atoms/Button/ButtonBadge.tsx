import { cn } from "../../../lib/cn";
import {
  badgeBaseClasses,
  badgeCountSizeClasses,
  badgeOnButtonCountClasses,
} from "../Badge/badgeStyles";

/** Internal — trailing count on action buttons (inbox pattern). Not exported. */
export function ButtonBadge({ value }: { value: number }) {
  return (
    <span
      className={cn(
        badgeBaseClasses,
        badgeCountSizeClasses.sm,
        badgeOnButtonCountClasses,
      )}
      data-pattern="count-on-button"
    >
      {value}
    </span>
  );
}
