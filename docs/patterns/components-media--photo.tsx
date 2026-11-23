// @thewhatmatters/wmds@0.4.54 · Pattern — photo with a source tag
// Storybook: Components/Media → Pattern — photo with a source tag (?path=/story/components-media--photo)
// Show code — copy verbatim and keep this header; upgrades find pasted patterns by it.

import { Media, type MediaFocus, type MediaRatio } from "@thewhatmatters/wmds";

export interface PhotoProps {
  src: string;
  /** What the picture shows. */
  alt: string;
  ratio?: MediaRatio;
  /** The part of the picture to keep when it is cropped. */
  focus?: MediaFocus;
  caption?: string;
  /** True for a stock picture: it gets a visible "Stock photo" label. */
  stock?: boolean;
}

export function Photo({ src, alt, ratio = "4/3", focus, caption, stock = false }: PhotoProps) {
  return (
    <Media
      src={src}
      alt={alt}
      ratio={ratio}
      focus={focus}
      caption={caption}
      tag={stock ? "Stock photo" : undefined}
    />
  );
}
