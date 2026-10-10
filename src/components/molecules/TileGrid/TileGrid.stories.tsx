import type { Meta, StoryObj } from "@storybook/react-vite";
import { storyMetaDocsDefaults, withStoryCopySource } from "../../../lib/storyCopySource";
import { sampleImage, type SampleImageTone } from "../../../storybook/sampleImage";
import { LinkTile } from "../LinkTile/LinkTile";
import { TileGrid, tileGridLayouts } from "./TileGrid";

interface SampleTile {
  id: string;
  title: string;
  meta: string;
  size: [number, number];
  tone: SampleImageTone;
}

const sampleTiles: SampleTile[] = [
  { id: "grid-notes", title: "Grid notes", meta: "gridnotes.example", size: [800, 1000], tone: "light" },
  { id: "type-scale", title: "Type scale", meta: "typescale.example", size: [800, 450], tone: "dark" },
  { id: "contrast", title: "Contrast checker", meta: "contrast.example", size: [800, 600], tone: "blue" },
  { id: "serif-library", title: "Serif library", meta: "seriflibrary.example", size: [800, 800], tone: "sand" },
  { id: "motion-field", title: "Motion field notes", meta: "motionfield.example", size: [800, 1100], tone: "dark" },
  { id: "palette", title: "Palette from a photo", meta: "palette.example", size: [800, 520], tone: "lime" },
];

function tiles(ratio?: number) {
  return sampleTiles.map((tile) => (
    <TileGrid.Item key={tile.id}>
      <LinkTile
        title={tile.title}
        href={`https://${tile.meta}`}
        external
        meta={tile.meta}
        ratio={ratio}
        media={
          <img
            src={sampleImage(tile.size[0], tile.size[1], tile.tone)}
            alt={`${tile.title} home page`}
            width={tile.size[0]}
            height={tile.size[1]}
          />
        }
      />
    </TileGrid.Item>
  ));
}

const meta = {
  title: "Components/TileGrid",
  component: TileGrid,
  tags: ["autodocs"],
  ...storyMetaDocsDefaults(),
  argTypes: {
    layout: { control: "inline-radio", options: [...tileGridLayouts] },
    columns: { control: "object" },
    empty: { control: false },
    children: { control: false },
  },
  args: {
    layout: "masonry",
    columns: { base: 1, sm: 2, lg: 3 },
  },
  parameters: {
    wmdsLayout: "padded",
    docs: {
      description: {
        component: `
## Usage

A grid for tiles — **LinkTile**, or cards — on the page gutter. Use it for a browsable set of image tiles; for dated rows use **IndexList**, and for a row to drag through use **Carousel**.

| Pattern | Props |
|---------|--------|
| **Masonry** | \`layout="masonry"\` (default) — tiles keep their heights and pack upward |
| **Uniform** | \`layout="uniform"\` — rows of equal height; give the tiles a fixed \`ratio\` |
| **Columns** | \`columns\` — one number or \`{ base, sm, md, lg, xl }\`; default \`{ base: 1, sm: 2, lg: 3 }\` |
| **Empty state** | \`empty\` — shown in the tiles' place when there are none |
| **Loading** | \`busy\` with placeholder tiles (**LinkTile** \`loading\`) |

## Anatomy

\`\`\`
TileGrid
└── ul (role="list", named by aria-label / aria-labelledby)
    └── TileGrid.Item (li) — one tile each, with a key
\`\`\`

**Reading order and tab order are the order of the items, in both layouts.** A masonry grid puts each next item in the shortest column (the first of them on a tie), so the order runs across the top row and then down the page — never down one column and then the next.

A masonry grid packs once it has measured its tiles. On the server and the first paint the tiles sit in aligned rows; after that they close up, and again whenever a tile's height or the column count changes. One column needs no packing. The space under a tile is the row gap (2rem), within 3px.

**On a server-rendered page**, a masonry grid of two or more columns moves once, at hydration: the tiles go from aligned rows to packed. That move is instant — no tile slides or fades; motion is for a change in the items only. **\`layout="uniform"\` does not move at all**: it is laid out by CSS alone, so the server's markup is the final layout. Use it where a move at hydration is not acceptable.

When the set of items changes — a filter — the tiles that stay move to their new places and the ones that come and go fade. Under reduced motion they change at once.

## Best practices

- **Do** give each **TileGrid.Item** a stable \`key\` — the item's id, not its index.
- **Do** give every image its \`width\` and \`height\`, so a tile holds its space before the image loads.
- **Do** name the list: \`aria-label\`, or \`aria-labelledby\` a **SectionCaption** over it.
- **Do** pass items in the order they should read.
- **Do** set \`columns\` for the column the grid sits in — three suits a 9-column main area, four a full-width band.
- **Don't** use CSS columns or reorder tiles with \`order\` — the tab order would stop matching what is on screen.
        `.trim(),
      },
    },
  },
} satisfies Meta<typeof TileGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Masonry: Story = {
  name: "Pattern — tile grid",
  render: (args) => (
    <TileGrid {...args} aria-label="Resources">
      {tiles()}
    </TileGrid>
  ),
  parameters: withStoryCopySource(
    {
      docs: {
        description: {
          story: "Images at their own ratios, packed. Tab through the tiles: focus follows the order of the items, across the top and then down.",
        },
      },
    },
    `
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
`,
  ),
};

export const Uniform: Story = {
  name: "Uniform",
  args: { layout: "uniform" },
  render: (args) => (
    <TileGrid {...args} aria-label="Resources">
      {tiles(4 / 3)}
    </TileGrid>
  ),
  parameters: {
    docs: {
      description: { story: '`layout="uniform"` with `ratio={4 / 3}` on each tile — level rows.' },
    },
  },
};

export const FourColumns: Story = {
  name: "Columns",
  args: { columns: { base: 2, md: 4 } },
  render: (args) => (
    <TileGrid {...args} aria-label="Resources">
      {tiles()}
    </TileGrid>
  ),
  parameters: {
    docs: {
      description: { story: "`columns={{ base: 2, md: 4 }}` — two on phones, four from `md`." },
    },
  },
};

export const Empty: Story = {
  name: "Empty",
  render: (args) => (
    <TileGrid {...args} aria-label="Resources" empty={<p className="type-body text-muted">No resources match these filters.</p>} />
  ),
};

export const Loading: Story = {
  name: "Loading",
  render: (args) => (
    <TileGrid {...args} aria-label="Resources" busy>
      {["one", "two", "three", "four", "five", "six"].map((key) => (
        <TileGrid.Item key={key}>
          <LinkTile loading />
        </TileGrid.Item>
      ))}
    </TileGrid>
  ),
};
