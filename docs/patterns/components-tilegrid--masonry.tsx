// @thewhatmatters/wmds@0.4.9 · Pattern — tile grid
// Storybook: Components/TileGrid → Pattern — tile grid (?path=/story/components-tilegrid--masonry)
// Show code — copy verbatim and keep this header; upgrades find pasted patterns by it.

import { LinkTile, TileGrid } from "@thewhatmatters/wmds";

export interface ResourceTileItem {
  id: string;
  title: string;
  href: string;
  /** Another site: the tile opens it in a new tab. */
  external?: boolean;
  /** One line under the title, for example the domain. */
  meta?: string;
  /** The preview. Its width and height hold the tile's space before the image loads. */
  image: { src: string; alt: string; width: number; height: number };
}

export function ResourceGrid({ label, items }: { label: string; items: ResourceTileItem[] }) {
  return (
    <TileGrid aria-label={label} empty={<p className="type-body text-muted">Nothing here yet.</p>}>
      {items.map((item) => (
        <TileGrid.Item key={item.id}>
          <LinkTile
            title={item.title}
            href={item.href}
            external={item.external}
            meta={item.meta}
            media={
              <img
                src={item.image.src}
                alt={item.image.alt}
                width={item.image.width}
                height={item.image.height}
                loading="lazy"
                decoding="async"
              />
            }
          />
        </TileGrid.Item>
      ))}
    </TileGrid>
  );
}
