import { cn } from "../../../lib/cn";
import { motionTransition } from "../../../lib/motion";
import { typographyClass } from "../../../lib/typography";

export const breadcrumbSeparators = ["chevron", "slash"] as const;

/** Between crumbs: a chevron (default) or a slash. */
export type BreadcrumbSeparator = (typeof breadcrumbSeparators)[number];

export const breadcrumbVariants = ["sans", "mono"] as const;

/** `sans` (default) — body type. `mono` — `type-eyebrow` caps, for editorial pages beside **SectionCaption**. */
export type BreadcrumbVariant = (typeof breadcrumbVariants)[number];

export const breadcrumbListClasses = "m-0 flex min-w-0 list-none flex-wrap items-center gap-x-1.5 gap-y-1 p-0 sm:gap-x-2";

export const breadcrumbVariantClasses: Record<BreadcrumbVariant, string> = {
  sans: cn(typographyClass("body"), "text-muted"),
  mono: typographyClass("eyebrow"),
};

export const breadcrumbItemClasses = "inline-flex min-w-0 items-center";

/** Long labels truncate; the full label stays in the accessible name and the `title`. */
const breadcrumbLabelClasses = "block max-w-[10rem] truncate sm:max-w-[16rem] lg:max-w-[24rem]";

/** A link crumb — muted, darkening with an underline on hover, the focus ring. */
export const breadcrumbLinkClasses = cn(
  breadcrumbLabelClasses,
  "rounded-sm text-muted underline decoration-transparent decoration-solid underline-offset-4",
  "transition-[color,text-decoration-color]",
  motionTransition("fast"),
  "hover:text-fg hover:decoration-current",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-body",
);

/** The current page — the last crumb, not a link. */
export const breadcrumbPageClasses = cn(breadcrumbLabelClasses, "text-fg");

/** A crumb with no link that is not the current page. */
export const breadcrumbTextClasses = cn(breadcrumbLabelClasses, "text-muted");

export const breadcrumbSeparatorClasses = "inline-flex shrink-0 items-center text-muted";

/** The slash separator — a character in the crumbs' own type. */
export const breadcrumbSlashClasses = "select-none";

/** Holds the 36px "…" control in the text line without growing the row. */
export const breadcrumbMoreClasses = "relative -mx-2.5 -my-2 inline-flex";
