import { cn } from "../../../lib/cn";
import { focusRingTransitionClasses, motionTransition } from "../../../lib/motion";
import { typographyClass } from "../../../lib/typography";

/** The frame's ratio (width / height) while `loading`, and for a tile with `ratio` left out there. */
export const linkTileLoadingRatio = 4 / 3;

/**
 * The whole tile is the link: one hit area and one focus ring, at the media frame's radius and
 * 4px off the tile so it clears the image's edge.
 */
export const linkTileRootClasses = cn(
  "group/link-tile relative flex w-full min-w-0 flex-col gap-3 rounded-[var(--radius-card-body)] text-left no-underline",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-4 focus-visible:ring-offset-body",
  focusRingTransitionClasses,
);

export const linkTileLoadingRootClasses = "flex w-full min-w-0 flex-col gap-3";

/**
 * The media frame. The hairline is drawn over the image, inside its edge, so a light image on the
 * light page and a dark image on the dark page both keep an edge; it darkens on hover and focus.
 */
export const linkTileFrameClasses = cn(
  "relative block w-full overflow-hidden rounded-[var(--radius-card-body)] bg-muted-surface",
  "after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:border after:border-border after:content-['']",
  "after:transition-[border-color,background-color] after:duration-fast after:ease-standard",
  "group-hover/link-tile:after:border-border-emphasized group-hover/link-tile:after:bg-overlay-hover",
  "group-focus-visible/link-tile:after:border-border-emphasized",
);

/** The image keeps its own ratio: the `width` and `height` on it reserve the space before it loads. */
export const linkTileFrameNaturalClasses = "[&>img]:block [&>img]:h-auto [&>img]:w-full";

/** A fixed `ratio`: the frame sets the shape and the image fills it, cropped from the center. */
export const linkTileFrameFixedClasses =
  "[&>img]:absolute [&>img]:inset-0 [&>img]:block [&>img]:size-full [&>img]:object-cover";

/** The tag over the image's top-start corner. */
export const linkTileTagOverClasses = "absolute start-2 top-2 z-[1] flex max-w-[calc(100%-1rem)]";

/** Under the image: the source mark, then the title over the meta line. */
export const linkTileCaptionClasses = "flex min-w-0 items-start gap-2";

/** Holds the source mark on the title's first line. */
export const linkTileSourceClasses = "flex h-5 shrink-0 items-center";

/** The title's lines, then the meta line on its 16px line, with no gap between them: the leading is the space. */
export const linkTileTextClasses = "flex min-w-0 flex-1 flex-col";

/** The loading placeholder's title line — the title's 20px line box, with the bar centered in it. */
export const linkTileLoadingLineClasses = "flex h-5 items-center";

/** The loading placeholder's meta line — the meta's 16px line box. */
export const linkTileLoadingMetaLineClasses = "flex h-4 items-center";

/** Two lines at most. Hover and keyboard focus underline it, as a quiet **TextLink** does. */
export const linkTileTitleClasses = cn(
  typographyClass("ui-label"),
  "line-clamp-2 text-pretty underline decoration-transparent decoration-solid underline-offset-[0.2em]",
  "transition-[text-decoration-color]",
  motionTransition("fast"),
  "group-hover/link-tile:decoration-current group-focus-visible/link-tile:decoration-current",
);

export const linkTileExternalIconClasses = "ml-1 inline-block size-[0.85em] align-[-0.05em] stroke-current text-muted";

/** One line, on the 16px caption line so it sits close under the title. */
export const linkTileMetaClasses = cn(typographyClass("caption-tight"), "truncate");

/** A tag on a tile with no image sits at the caption's end. */
export const linkTileTagInlineClasses = "flex shrink-0 items-center";
