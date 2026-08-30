import { motionTransition } from "../../../lib/motion";
import { typographyClass } from "../../../lib/typography";

export const taskRowsVariants = ["list", "capsule"] as const;

export type TaskRowsVariant = (typeof taskRowsVariants)[number];

export const taskRowStatuses = ["none", "done", "running", "pending", "failed"] as const;

export type TaskRowStatus = (typeof taskRowStatuses)[number];

export const taskRowsDetailLayouts = ["stack", "actions", "chips"] as const;

export type TaskRowsDetailLayout = (typeof taskRowsDetailLayouts)[number];

export const taskRowsDetailVariants = ["row", "button"] as const;

export type TaskRowsDetailVariant = (typeof taskRowsDetailVariants)[number];

export const taskRowsRootListClasses =
  "flex w-full flex-col overflow-hidden rounded-lg bg-surface font-sans text-fg shadow-raised";

export const taskRowsRootListInsetClasses =
  "flex w-full flex-col overflow-hidden rounded-none bg-transparent font-sans text-fg shadow-none";

export const taskRowsRootCapsuleClasses = "flex w-full min-h-0 flex-col gap-2 font-sans text-fg";

export const taskRowsItemListClasses =
  "overflow-hidden border-b border-border last:border-b-0 " + motionTransition("fast");

/** Hairline + elevation via `shadow-raised` only — do not add `border` (token already includes 1px ring). */
export const taskRowsItemCapsuleClasses =
  "overflow-hidden bg-surface shadow-raised transition-[border-radius] duration-300 " +
  motionTransition("medium");

/** Collapsed — full pill (h-11 row + 1.375rem ≈ half height). */
export const taskRowsItemCapsuleClosedClasses = "rounded-[1.375rem]";

/** Expanded — one step softer than 0.875rem; mutually exclusive with closed radius. */
export const taskRowsItemCapsuleOpenClasses = "rounded-xl";

export const taskRowsItemHoverClasses = "hover:bg-ghost-hover";

/** Horizontal inset — matches **Card** section padding (`px-4`). */
export const taskRowsInsetXClasses = "px-4";

export const taskRowsTriggerClasses =
  "flex h-11 w-full items-center gap-2.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-inset " +
  taskRowsInsetXClasses;

export const taskRowsStatusSlotClasses = "flex size-6 shrink-0 items-center justify-center";

/** Leading Lucide icon — expand-only rows (FM directions, services). Not combinable with `status`. */
export const taskRowsLeadingIconClasses =
  "text-muted [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:stroke-current";

export const taskRowsLabelClasses = `${typographyClass("ui-label")} min-w-0 flex-1 truncate text-[0.8125rem]`;

export const taskRowsMetaClasses = `${typographyClass("caption")} shrink-0 tabular-nums text-muted`;

export const taskRowsChevronButtonClasses =
  "-ml-2 flex size-7 shrink-0 items-center justify-center rounded-full text-muted";

export const taskRowsChevronClasses =
  "size-[0.9375rem] stroke-current " + motionTransition("medium") + " transition-transform";

export const taskRowsChevronOpenClasses = "rotate-180";

export const taskRowsStatusBadgeBaseClasses =
  "flex size-[1.375rem] shrink-0 items-center justify-center rounded-full text-on-success";

export const taskRowsStatusBadgeDoneClasses = "bg-success text-on-success";

export const taskRowsStatusBadgeFailedClasses = "bg-error text-on-error";

export const taskRowsStatusPillBaseClasses =
  "inline-flex h-[1.375rem] shrink-0 items-center rounded-full px-2 text-[0.71875rem] font-medium";

export const taskRowsStatusPillDoneClasses = "bg-success-muted text-success";

export const taskRowsStatusPillFailedClasses = "inline-flex gap-1.5 bg-error-muted text-error";

export const taskRowsExpandGridClasses =
  "grid transition-[grid-template-rows,opacity] duration-300 ease-[cubic-bezier(0.24,1,0.4,1)]";

export const taskRowsExpandGridOpenClasses = "grid-rows-[1fr] opacity-100";

export const taskRowsExpandGridClosedClasses = "grid-rows-[0fr] opacity-0";

export const taskRowsDetailsInnerClasses = "overflow-hidden";

export const taskRowsDetailsGridClasses =
  "grid grid-cols-[1.5rem_minmax(0,1fr)] gap-x-2.5 pb-4 pt-0 " + taskRowsInsetXClasses;

/** Expand-only panel when there is no leading icon/status column. */
export const taskRowsDetailsExpandOnlyClasses = "flex flex-col pb-4 " + taskRowsInsetXClasses;

/** Expanded details when row has no status badge — stacked lines. */
export const taskRowsDetailsPlainClasses = "flex flex-col gap-1.5";

/** Horizontal action buttons — FM map apps, quick choices. */
export const taskRowsDetailsActionsClasses = "flex w-full flex-row gap-2.5";

/** Read-only service tags — FM market detail, display-only Chip children. */
export const taskRowsDetailsChipsClasses = "flex w-full flex-row flex-wrap gap-2";

export const taskRowsDetailsLabelClasses = `${typographyClass("caption")} mb-2 text-muted`;

export const taskRowsDetailsPanelClasses = "flex min-w-0 flex-col";

export const taskRowsDetailButtonClasses = "min-w-0 flex-1";

export const taskRowsDetailsRailClasses = "mx-auto h-full w-px bg-border";

export const taskRowsDetailsListClasses = "flex flex-col gap-1.5";

export const taskRowsDetailRowClasses =
  "flex w-full items-center justify-between gap-3 text-left " + motionTransition("fast");

export const taskRowsDetailRowInteractiveClasses =
  "rounded-md px-1 py-0.5 hover:bg-ghost-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring";

export const taskRowsDetailLabelClasses = `${typographyClass("caption")} text-muted`;

export const taskRowsDetailMetaClasses = `${typographyClass("caption")} font-mono tabular-nums text-muted`;
