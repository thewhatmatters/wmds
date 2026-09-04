import { cn } from "../../../lib/cn";
import { badgeBaseClasses, badgeSegmentCountClasses } from "./badgeStyles";

/** Trailing count on filter segments — Chip and Tab toolbars. Not notification {@link Badge} count. */
export function BadgeSegmentCount({ active, count }: { active: boolean; count: number }) {
  return (
    <span className={cn(badgeBaseClasses, badgeSegmentCountClasses(active))}>
      {count.toLocaleString("en-US")}
    </span>
  );
}
