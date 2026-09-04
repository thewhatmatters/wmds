/**
 * Concentric inset radii — TaskRows capsule stacks and nested list panels.
 *
 * Capsule rows (`h-11`) use pill equator **1.375rem** (22px), not `rounded-lg` (8px),
 * because a 44px-tall row needs ~22px curvature.
 *
 * **Card.Body** is a transparent slot (`px-[2px]` gutter only) — no well tokens here.
 */

/** h-11 capsule row — full pill equator (R = height / 2) when collapsed. */
export const capsuleRowRadiusClass = "rounded-[22px]";

/** Open capsule — uniform softer corner (reference TaskRows: `open ? 14 : 22`). */
export const capsuleRowOpenRadiusClass = "rounded-[14px]";

export const capsuleStackGapClass = "gap-[4px]";

/** Stacked capsule joint — R_joint = R_capsule − gap (multi-row inset stacks only). */
export const capsuleStackJointRadiusClass = "rounded-[calc(22px-4px)]";

export const capsuleStackOpenRowClasses =
  "rounded-t-[calc(22px-4px)] rounded-b-[calc(22px-4px)] first:rounded-t-[22px] last:rounded-b-[22px] only:rounded-[22px]";

/** Flat list panel inside **Card.Body** — content-owned surface. */
export const insetPanelRadiusClass = "rounded-[2px]";
