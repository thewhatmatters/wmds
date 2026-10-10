import type { Meta, StoryObj } from "@storybook/react-vite";
import { storyMetaDocsDefaults, withStoryCopySource } from "../../../lib/storyCopySource";
import { sampleImage } from "../../../storybook/sampleImage";
import { Avatar } from "../../atoms/Avatar/Avatar";
import { Badge } from "../../atoms/Badge/Badge";
import { LinkTile } from "./LinkTile";

const preview = { src: sampleImage(800, 600, "blue"), alt: "Contrast checker home page", width: 800, height: 600 };

const meta = {
  title: "Components/LinkTile",
  component: LinkTile,
  tags: ["autodocs"],
  ...storyMetaDocsDefaults(),
  argTypes: {
    media: { control: false },
    tag: { control: false },
    source: { control: false },
    render: { control: false },
  },
  args: {
    title: "Contrast checker",
    href: "https://contrast.example",
    meta: "contrast.example",
    external: true,
  },
  parameters: {
    wmdsLayout: "centered",
    docs: {
      description: {
        component: `
## Usage

A resource tile that is one link — a preview image with the resource's name and where it lives under it. Use it for a browsable grid of links (resources, a link library, related work) inside **TileGrid**. It is its own component, not a **Card** option: a Card is a surface with header, body, and footer slots that can hold several controls, and a tile is a single anchor with no shell.

| Pattern | Props |
|---------|--------|
| **Resource tile** | \`title\` + \`href\` + \`media\` + \`meta\` |
| **Another site** | \`external\` — new tab, safe \`rel\`, the trailing mark, spoken "(opens in a new tab)" |
| **Router link** | \`render={<Link href="/work" />}\` in place of \`href\` |
| **Equal tiles** | \`ratio={4 / 3}\` — the frame's shape is fixed and the image is cropped to it |
| **Tag** | \`tag={<Badge>Free</Badge>}\` — over the image's top-start corner |
| **Source mark** | \`source={<Avatar name="…" src="…" size="xsm" />}\` — before the title |
| **Loading** | \`loading\` — a **Skeleton** placeholder in the tile's shape |

## Anatomy

\`\`\`
a (the whole tile — one link, one focus ring)
├── frame — the image at its own ratio (or a fixed ratio), with a hairline inside its edge
│   ├── media — img
│   └── tag — Badge, top-start
└── caption
    ├── source — Avatar xsm or a favicon
    └── title (two lines at most) · external mark
        meta (one line)
\`\`\`

Screen readers hear the title, the meta line, the tag, then "opens in a new tab". The image's \`alt\` is not part of the link's name.

By default the image keeps its own ratio: its \`width\` and \`height\` reserve the space, so the tile does not move when the image loads, and tiles in a grid vary in height. The hairline is drawn over the image, so a light image on the light page and a dark image on the dark page both keep an edge.

## Best practices

- **Do** give the image its real \`width\` and \`height\`. With \`next/image\`, pass \`<Image>\` as \`media\` with those and a \`sizes\` that matches the grid's columns.
- **Do** use \`external\` for another site; never hand-write \`target\` or the new-tab text.
- **Do** keep \`meta\` to one short line — a domain, an author, a year.
- **Don't** put a link or a button inside the tile (a linked **Badge**, a save button). The tile is one link.
- **Don't** pass a video as \`media\` in this version — the frame sizes and crops an image.
- **Don't** restyle it with \`className\` — it is layout only.
        `.trim(),
      },
    },
  },
} satisfies Meta<typeof LinkTile>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ResourceTile: Story = {
  name: "Pattern — resource tile",
  render: (args) => (
    <div className="w-72">
      <LinkTile
        {...args}
        tag={<Badge>Free</Badge>}
        media={<img src={preview.src} alt={preview.alt} width={preview.width} height={preview.height} loading="lazy" decoding="async" />}
      />
    </div>
  ),
  parameters: withStoryCopySource(
    {
      docs: {
        description: {
          story: "An image at its own ratio, a tag over it, the name, and the domain. `external` opens a new tab and says so.",
        },
      },
    },
    `
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
`,
  ),
};

export const RouterLink: Story = {
  name: "Pattern — router link",
  render: (args) => (
    <div className="w-72">
      <LinkTile
        {...args}
        title="Our brief template"
        meta="whatmatters.so"
        external={false}
        href={undefined}
        render={<a href="#brief-template" />}
        ratio={4 / 3}
        media={<img src={sampleImage(800, 900, "sand")} alt="The brief template" width={800} height={900} />}
      />
    </div>
  ),
  parameters: withStoryCopySource(
    {
      docs: {
        description: {
          story: "A page in the same app: `render` composes the tile onto the router's link, and `ratio` fixes the image at 4:3.",
        },
      },
    },
    `
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
`,
  ),
};

export const SourceMark: Story = {
  name: "Source mark",
  render: (args) => (
    <div className="w-72">
      <LinkTile
        {...args}
        source={<Avatar name="Contrast" size="xsm" />}
        media={<img src={preview.src} alt={preview.alt} width={preview.width} height={preview.height} />}
      />
    </div>
  ),
};

export const Edges: Story = {
  name: "Reference — image edges",
  render: (args) => (
    <div className="grid w-[36rem] grid-cols-2 gap-6">
      <LinkTile
        {...args}
        title="A light image"
        media={<img src={sampleImage(800, 600, "light")} alt="A white page" width={800} height={600} />}
      />
      <LinkTile
        {...args}
        title="A dark image"
        media={<img src={sampleImage(800, 600, "dark")} alt="A black page" width={800} height={600} />}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "The hairline inside the frame keeps an edge on a light image on the light page and a dark image on the dark page. Switch the theme in the toolbar.",
      },
    },
  },
};

export const NoMedia: Story = {
  name: "No image",
  render: (args) => (
    <div className="w-72">
      <LinkTile {...args} tag={<Badge>Free</Badge>} />
    </div>
  ),
};

export const Loading: Story = {
  name: "Loading",
  render: () => (
    <div className="w-72" aria-busy="true">
      <LinkTile loading />
    </div>
  ),
};
