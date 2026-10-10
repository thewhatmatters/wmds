// @thewhatmatters/wmds@0.4.9 · Pattern — resource tile
// Storybook: Components/LinkTile → Pattern — resource tile (?path=/story/components-linktile--resource-tile)
// Show code — copy verbatim and keep this header; upgrades find pasted patterns by it.

import { Badge, LinkTile } from "@thewhatmatters/wmds";

export interface ResourceTileProps {
  title: string;
  href: string;
  /** Another site: opens in a new tab. */
  external?: boolean;
  /** One line under the title, for example the domain. */
  meta?: string;
  /** A short label over the image, for example "Free". */
  tag?: string;
  /** The preview. Its width and height hold the tile's space before the image loads. */
  image: { src: string; alt: string; width: number; height: number };
}

export function ResourceTile({ title, href, external, meta, tag, image }: ResourceTileProps) {
  return (
    <LinkTile
      title={title}
      href={href}
      external={external}
      meta={meta}
      tag={tag != null ? <Badge>{tag}</Badge> : undefined}
      media={
        <img src={image.src} alt={image.alt} width={image.width} height={image.height} loading="lazy" decoding="async" />
      }
    />
  );
}
