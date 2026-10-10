// @thewhatmatters/wmds@0.4.9 · Pattern — router link
// Storybook: Components/LinkTile → Pattern — router link (?path=/story/components-linktile--router-link)
// Show code — copy verbatim and keep this header; upgrades find pasted patterns by it.

import Link from "next/link";
import { LinkTile } from "@thewhatmatters/wmds";

export interface PageTileProps {
  title: string;
  href: string;
  meta?: string;
  image: { src: string; alt: string; width: number; height: number };
}

export function PageTile({ title, href, meta, image }: PageTileProps) {
  return (
    <LinkTile
      title={title}
      meta={meta}
      render={<Link href={href} />}
      ratio={4 / 3}
      media={<img src={image.src} alt={image.alt} width={image.width} height={image.height} loading="lazy" decoding="async" />}
    />
  );
}
