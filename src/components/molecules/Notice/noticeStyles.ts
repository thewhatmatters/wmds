import { typographyClass } from "../../../lib/typography";

export const noticeTones = ["neutral", "info", "success", "warning", "error"] as const;

export type NoticeTone = (typeof noticeTones)[number];

/**
 * The tint is the status colour mixed into the current surface, not the fixed `*-muted` fill.
 * Inside a toned band or a dark theme the surface and `text-fg` swap together, so the body copy
 * keeps its contrast wherever the notice sits.
 */
export const noticeToneClasses: Record<NoticeTone, string> = {
  neutral: "border-border-emphasized bg-surface",
  info: "border-[color-mix(in_srgb,var(--color-info)_32%,transparent)] bg-[color-mix(in_srgb,var(--color-info)_10%,var(--color-background-surface))]",
  success:
    "border-[color-mix(in_srgb,var(--color-success)_32%,transparent)] bg-[color-mix(in_srgb,var(--color-success)_10%,var(--color-background-surface))]",
  warning:
    "border-[color-mix(in_srgb,var(--color-warning)_36%,transparent)] bg-[color-mix(in_srgb,var(--color-warning)_14%,var(--color-background-surface))]",
  error:
    "border-[color-mix(in_srgb,var(--color-error)_32%,transparent)] bg-[color-mix(in_srgb,var(--color-error)_10%,var(--color-background-surface))]",
};

export const noticeClasses =
  "flex w-full min-w-0 items-start gap-3 rounded-[var(--radius-card-shell)] border p-4 text-fg";

export const noticeIconClasses = "mt-0.5 shrink-0";

export const noticeContentClasses = "flex min-w-0 flex-1 flex-col gap-1";

export const noticeTitleClasses = `${typographyClass("ui-label")} text-fg`;

export const noticeBodyClasses = `${typographyClass("caption")} text-muted`;

/** Under the copy, so a long link wraps instead of squeezing the text at 390px. */
export const noticeActionClasses = "mt-2 flex flex-wrap items-center gap-2";

export const noticeDismissClasses = "-my-1 -me-1 shrink-0";
