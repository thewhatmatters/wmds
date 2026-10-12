import { typographyClass } from "../../../lib/typography";

export const taskRowsVariants = ["list", "capsule", "table"] as const;

export type TaskRowsVariant = (typeof taskRowsVariants)[number];

export const taskRowStatuses = ["none", "done", "running", "pending", "failed"] as const;

export type TaskRowStatus = (typeof taskRowStatuses)[number];

export const taskRowsDetailLayouts = ["stack", "actions", "chips"] as const;

export type TaskRowsDetailLayout = (typeof taskRowsDetailLayouts)[number];

export const taskRowsDetailVariants = ["row", "button"] as const;

export type TaskRowsDetailVariant = (typeof taskRowsDetailVariants)[number];

/** Wraps **Accordion** leading slot — centers 24px ring / 22px badge in the 24px column. */
export const taskRowsStatusSlotClasses = "flex size-6 shrink-0 items-center justify-center";

/** Trailing cluster — meta, status pill, and optional app `trailing` content. Chevron sits outside. */
export const taskRowsTrailingClusterClasses = "flex shrink-0 items-center gap-2";

export const taskRowsMetaClasses = `${typographyClass("caption")} shrink-0 tabular-nums text-muted`;

export const taskRowsDetailsGridClasses =
  "grid grid-cols-[1.5rem_minmax(0,1fr)] gap-x-2.5 pt-0";

/** Expand-only panel when there is no leading icon/status column. */
export const taskRowsDetailsExpandOnlyClasses = "flex flex-col";

/** Expanded details when row has no status badge — stacked lines. */
export const taskRowsDetailsPlainClasses = "flex flex-col gap-1.5";

/** Horizontal action buttons — map apps, quick choices. One line, equal height, no wrap. */
export const taskRowsDetailsActionsClasses = "flex w-full flex-nowrap items-stretch gap-2.5";

/** Read-only tags — display-only Chip children in expanded rows. */
export const taskRowsDetailsChipsClasses = "flex w-full flex-row flex-wrap gap-2";

export const taskRowsDetailsLabelClasses = `${typographyClass("caption")} mb-2 text-muted`;

export const taskRowsDetailsPanelClasses = "flex min-w-0 flex-col";

/** Fill the row equally; `min-w-0` is omitted so labels cannot wrap (Google / Maps fail). */
export const taskRowsDetailButtonClasses = "min-w-max flex-1 whitespace-nowrap";

export const taskRowsDetailsRailClasses = "mx-auto h-full w-px bg-border";

export const taskRowsDetailsListClasses = "flex flex-col gap-1.5";

export const taskRowsDetailRowClasses =
  "flex w-full items-center justify-between gap-3 text-left";

export const taskRowsDetailLabelClasses = `${typographyClass("caption")} text-muted`;

export const taskRowsDetailMetaClasses = `${typographyClass("caption")} font-mono tabular-nums text-muted`;

/** Needs-you table — column headers from `md`, two-line rows below. */
export const taskRowsTableClasses = "flex w-full min-w-0 flex-col";

export const taskRowsTableHeadClasses =
  "max-md:sr-only md:grid md:items-baseline md:gap-4 md:border-b md:border-border md:pb-2";

export const taskRowsTableHeadCellClasses = `${typographyClass("caption")} text-muted`;

export const taskRowsTableColumnsClasses = "md:[grid-template-columns:var(--task-rows-columns)]";

export const taskRowsTableRowClasses =
  "grid grid-cols-1 gap-1 border-b border-border py-3 last:border-b-0 md:items-center md:gap-4";

export const taskRowsTableTitleClasses = `${typographyClass("ui-label")} min-w-0 text-fg`;

export const taskRowsTableStatusClasses = "flex min-w-0 items-center gap-2 text-muted";

export const taskRowsTableStatusLabelClasses = `${typographyClass("caption")} text-muted`;

export const taskRowsTableWaitingClasses = "flex min-w-0 flex-col items-start gap-1";

export const taskRowsTableDetailClasses = `${typographyClass("caption")} text-muted`;

export const taskRowsTableMetricClasses = "flex min-w-0 flex-col gap-1 md:items-end";

export const taskRowsTableMetricValueClasses =
  "font-mono text-sm tabular-nums leading-none text-fg";

export const taskRowsTableMobileLineClasses =
  "max-md:flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 md:hidden";

export const taskRowsTableNoteClasses = `${typographyClass("caption")} text-muted`;

export const taskRowsTableErrorClasses = "type-supporting text-destructive";

export const taskRowsTableEmptyClasses = `${typographyClass("body")} py-6 text-center text-muted`;

export const taskRowsTableAlignEndClasses = "md:text-end";
