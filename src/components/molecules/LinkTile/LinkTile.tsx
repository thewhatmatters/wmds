import { useRender } from "@base-ui/react/use-render";
import { useId, type CSSProperties, type ReactElement, type ReactNode } from "react";
import { SquareArrowOutUpRight } from "lucide-react";
import { cn } from "../../../lib/cn";
import { Skeleton } from "../../atoms/Skeleton/Skeleton";
import {
  linkTileCaptionClasses,
  linkTileExternalIconClasses,
  linkTileFrameClasses,
  linkTileFrameFixedClasses,
  linkTileFrameNaturalClasses,
  linkTileLoadingLineClasses,
  linkTileLoadingMetaLineClasses,
  linkTileLoadingRatio,
  linkTileLoadingRootClasses,
  linkTileMetaClasses,
  linkTileRootClasses,
  linkTileSourceClasses,
  linkTileTagInlineClasses,
  linkTileTagOverClasses,
  linkTileTextClasses,
  linkTileTitleClasses,
} from "./linkTileStyles";

export { linkTileLoadingRatio } from "./linkTileStyles";

/** Layout-only — width, margin, or grid placement. */
export type LinkTileLayoutClassName = string;

export interface LinkTileProps {
  /** The resource's name. Two lines at most. Not needed while `loading`. */
  title?: string;
  /** Where the tile goes. Leave it out when `render` carries the destination. */
  href?: string;
  /**
   * Compose the tile onto another element (Base UI `render`) — `render={<Link href="/work" />}` for
   * a router link. The tile is that one link; never put a link or a button inside it.
   */
  render?: ReactElement;
  /**
   * Another site: opens in a new tab (`target="_blank"`, a safe `rel`), tells screen readers so,
   * and shows the mark **TextLink** `external` uses after the title.
   */
  external?: boolean;
  /**
   * The preview — an `<img>` (or `next/image`) with its `width` and `height`, so the tile holds its
   * space before the image loads. One image; not a video.
   */
  media?: ReactNode;
  /**
   * Fixes the frame's shape as width / height (`4 / 3`, `1`, `16 / 9`) and crops the image to it —
   * for a grid of equal tiles. Left out, the image keeps its own ratio and tiles vary in height.
   */
  ratio?: number;
  /** One line under the title — for example the domain, "linear.app". */
  meta?: ReactNode;
  /** A **Badge** over the image's top-start corner (at the caption's end when there is no image). Not a link. */
  tag?: ReactNode;
  /** A mark before the title — **Avatar** `size="xsm"`, or a 20px favicon `<img alt="">`. */
  source?: ReactNode;
  /** A placeholder in the tile's shape, built on **Skeleton** — not a link, and hidden from screen readers. */
  loading?: boolean;
  className?: LinkTileLayoutClassName;
}

interface LinkTileShellProps {
  render?: ReactElement;
  href?: string;
  target?: string;
  rel?: string;
  className: string;
  children: ReactNode;
  "aria-labelledby": string;
  "data-link-tile": string;
  "data-external"?: string;
}

/** The link — an `<a>` by default, or tile chrome composed onto `render` (Base UI). */
function LinkTileShell({ render, ...props }: LinkTileShellProps) {
  return useRender({ render, defaultTagName: "a", props });
}

function frameStyle(ratio: number | undefined): CSSProperties | undefined {
  return ratio == null ? undefined : { aspectRatio: String(ratio) };
}

/**
 * A resource tile that is one link — a preview image with the resource's name and where it lives
 * under it. Screen readers hear the title, the meta line, the tag, then "opens in a new tab".
 */
export function LinkTile({
  title,
  href,
  render,
  external = false,
  media,
  ratio,
  meta,
  tag,
  source,
  loading = false,
  className,
}: LinkTileProps) {
  const id = useId();
  const titleId = `${id}-title`;
  const metaId = `${id}-meta`;
  const tagId = `${id}-tag`;
  const hintId = `${id}-hint`;

  if (loading) {
    return (
      <div className={cn(linkTileLoadingRootClasses, className)} data-link-tile="" data-loading="" aria-hidden="true">
        <span className={linkTileFrameClasses} style={frameStyle(ratio ?? linkTileLoadingRatio)}>
          <Skeleton radius="none" />
        </span>
        <span className={linkTileTextClasses}>
          <span className={linkTileLoadingLineClasses}>
            <Skeleton width="70%" height={12} radius="inner" index={1} />
          </span>
          <span className={linkTileLoadingMetaLineClasses}>
            <Skeleton width="40%" height={10} radius="inner" index={2} />
          </span>
        </span>
      </div>
    );
  }

  if (href == null && render == null) {
    console.warn("[WMDS LinkTile] Pass `href`, or `render` with a link that carries it.");
  }

  const hasMedia = media != null;
  const labelledBy = [titleId, meta != null && metaId, tag != null && tagId, external && hintId]
    .filter(Boolean)
    .join(" ");

  return (
    <LinkTileShell
      render={render}
      {...(href != null ? { href } : null)}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : null)}
      className={cn(linkTileRootClasses, className)}
      aria-labelledby={labelledBy}
      data-link-tile=""
      data-external={external ? "" : undefined}
    >
      {hasMedia ? (
        <span
          className={cn(linkTileFrameClasses, ratio == null ? linkTileFrameNaturalClasses : linkTileFrameFixedClasses)}
          style={frameStyle(ratio)}
          data-link-tile-frame=""
        >
          {media}
          {tag != null ? (
            <span id={tagId} className={linkTileTagOverClasses}>
              {tag}
            </span>
          ) : null}
        </span>
      ) : null}
      <span className={linkTileCaptionClasses}>
        {source != null ? (
          <span className={linkTileSourceClasses} aria-hidden="true">
            {source}
          </span>
        ) : null}
        <span className={linkTileTextClasses}>
          <span id={titleId} className={linkTileTitleClasses}>
            {title}
            {external ? (
              <SquareArrowOutUpRight className={linkTileExternalIconClasses} strokeWidth={2} aria-hidden />
            ) : null}
          </span>
          {meta != null ? (
            <span id={metaId} className={linkTileMetaClasses}>
              {meta}
            </span>
          ) : null}
          {external ? (
            <span id={hintId} className="sr-only">
              (opens in a new tab)
            </span>
          ) : null}
        </span>
        {tag != null && !hasMedia ? (
          <span id={tagId} className={linkTileTagInlineClasses}>
            {tag}
          </span>
        ) : null}
      </span>
    </LinkTileShell>
  );
}
