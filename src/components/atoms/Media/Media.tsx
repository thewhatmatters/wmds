import { useRender } from "@base-ui/react/use-render";
import {
  useCallback,
  useState,
  type ImgHTMLAttributes,
  type ReactElement,
  type ReactNode,
  type SyntheticEvent,
} from "react";
import { ImageOff } from "lucide-react";
import { cn } from "../../../lib/cn";
import {
  mediaCaptionClasses,
  mediaFallbackClasses,
  mediaFigureClasses,
  mediaFitClasses,
  mediaFocusPosition,
  mediaFrameClasses,
  mediaImageClasses,
  mediaLegendClasses,
  mediaRadiusClasses,
  mediaRatioClasses,
  mediaTagClasses,
  type MediaFit,
  type MediaFocus,
  type MediaRadius,
  type MediaRatio,
} from "./mediaStyles";

export {
  mediaFits,
  mediaFocusPosition,
  mediaFocuses,
  mediaRadii,
  mediaRatios,
  type MediaFit,
  type MediaFocus,
  type MediaFocusName,
  type MediaFocusPoint,
  type MediaRadius,
  type MediaRatio,
} from "./mediaStyles";

/** Layout-only — width, margin, grid placement. */
export type MediaLayoutClassName = string;

export interface MediaProps
  extends Omit<ImgHTMLAttributes<HTMLImageElement>, "alt" | "children" | "className" | "src" | "style"> {
  /** Picture URL. Leave it out for an empty frame (the fallback shows). */
  src?: string;
  /** What the picture shows. Pass `""` when it is decoration. */
  alt: string;
  /** Frame shape, held before the picture loads. Default `4/3`. */
  ratio?: MediaRatio;
  /**
   * Crop point: the part of the picture that stays in the frame. A name (`top`, `bottom-left`…)
   * or percentages of the picture, `{ x: 50, y: 20 }`. Default `center`.
   */
  focus?: MediaFocus;
  /** `cover` (default) crops to fill the frame; `contain` shows the whole picture. */
  fit?: MediaFit;
  /** Corner: a step of the surface radius knob. Default `sm`, a **Card**'s corner. */
  radius?: MediaRadius;
  /** Caption under the frame. */
  caption?: ReactNode;
  /** Visible source label under the frame, in small capitals: "Stock photo". */
  tag?: ReactNode;
  /** Shown when `src` is missing or fails to load. Default: a quiet image-off glyph in the tinted frame. */
  fallback?: ReactNode;
  /**
   * Render through another image component (Base UI `render`) — `render={<Image fill sizes="50vw" />}`
   * for `next/image`. Media still passes `src`, `alt`, the fit, the crop point and error handling.
   */
  render?: ReactElement;
  className?: MediaLayoutClassName;
}

/**
 * A picture in a fixed-ratio frame. The frame holds its shape before the picture loads, crops to a
 * chosen point, and shows a tinted box if the picture is missing. Optional caption and source tag.
 */
export function Media({
  src,
  alt,
  ratio = "4/3",
  focus = "center",
  fit = "cover",
  radius = "sm",
  caption,
  tag,
  fallback,
  render,
  className,
  loading = "lazy",
  decoding = "async",
  onError,
  ...imgProps
}: MediaProps) {
  const hasSrc = src != null && src.length > 0;
  // Keyed by src, so a new src gets a fresh try without an effect.
  const [failedSrc, setFailedSrc] = useState<string | undefined>(undefined);
  const missing = !hasSrc || failedSrc === src;

  // A picture can fail before hydration (server HTML), so the error event never fires:
  // read the element's state when it mounts.
  const imageRef = useCallback(
    (image: HTMLImageElement | null) => {
      if (image != null && image.complete && image.naturalWidth === 0 && image.currentSrc !== "") setFailedSrc(src);
    },
    [src],
  );

  const image = useRender({
    render,
    defaultTagName: "img",
    ref: imageRef,
    props: {
      ...imgProps,
      src,
      alt,
      loading,
      decoding,
      className: cn(mediaImageClasses, mediaFitClasses[fit]),
      style: focus === "center" ? undefined : { objectPosition: mediaFocusPosition(focus) },
      onError: (event: SyntheticEvent<HTMLImageElement>) => {
        setFailedSrc(src);
        onError?.(event);
      },
    },
  });

  const hasLegend = caption != null || tag != null;

  const frame = (
    <span
      className={cn(mediaFrameClasses, mediaRatioClasses[ratio], mediaRadiusClasses[radius], !hasLegend && className)}
      data-slot="frame"
      data-status={missing ? "fallback" : "image"}
    >
      {missing ? (
        <span
          className={mediaFallbackClasses}
          data-slot="fallback"
          {...(alt.length > 0 ? { role: "img", "aria-label": alt } : { "aria-hidden": true })}
        >
          {fallback ?? <ImageOff strokeWidth={1.5} aria-hidden />}
        </span>
      ) : (
        image
      )}
    </span>
  );

  if (!hasLegend) return frame;

  return (
    <figure className={cn(mediaFigureClasses, className)}>
      {frame}
      <figcaption className={mediaLegendClasses}>
        {caption != null ? (
          <span className={mediaCaptionClasses} data-slot="caption">
            {caption}
          </span>
        ) : null}
        {tag != null ? (
          <span className={mediaTagClasses} data-slot="tag">
            {tag}
          </span>
        ) : null}
      </figcaption>
    </figure>
  );
}
