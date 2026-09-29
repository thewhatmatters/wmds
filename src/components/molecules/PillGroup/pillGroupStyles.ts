import { badgeBaseClasses, badgeMutedClasses, badgeSolidClasses } from "../../atoms/Badge/badgeStyles";
import { cn } from "../../../lib/cn";

/** Wrapping single-select pills. Height is the 44px touch target, not Badge label scale. */
export const pillGroupClasses = "flex flex-wrap gap-2";

export const pillGroupShapeClasses = cn(
  badgeBaseClasses,
  "min-h-11 cursor-pointer rounded-full px-4",
  "peer-focus-visible:ring-2 peer-focus-visible:ring-focus-ring peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-body",
);

/** Idle range pill — Badge neutral solid. */
export const pillGroupIdleClasses = cn(pillGroupShapeClasses, badgeSolidClasses.neutral);

/**
 * Softer idle pill — Badge neutral muted (`emphasis="muted"`).
 * No new Badge emphasis. The muted surface drops the solid pill's raised shadow.
 */
export const pillGroupMutedClasses = cn(pillGroupShapeClasses, badgeMutedClasses.neutral);

/** Selected pill — brand navy fill. Owned by PillGroup, not a Badge variant. */
export const pillGroupSelectedClasses = cn(
  pillGroupShapeClasses,
  "border border-transparent bg-brand text-on-brand",
);
