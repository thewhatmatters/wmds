import type { Meta, StoryObj } from "@storybook/react-vite";
import { storyMetaDocsDefaults, withStoryCopySource } from "../../../lib/storyCopySource";
import { storybookViewports } from "../../../lib/viewports";
import { TextLink } from "../../atoms/TextLink/TextLink";
import { Card } from "../../molecules/Card/Card";
import { cardLayoutBodyOccupantRadiusClasses } from "../../molecules/Card/cardStyles";
import { Carousel, carouselProgressPlacements, type CarouselProps } from "./Carousel";

interface SampleImage {
  id: string;
  src: string;
  alt: string;
  title: string;
}

const sampleImages: SampleImage[] = [
  { id: "plan", src: "/hero-tiles/plan.svg", alt: "Weekly plan on a lime tile", title: "Weekly plan" },
  { id: "focus", src: "/hero-tiles/focus.svg", alt: "Blue focus card", title: "Focus card" },
  { id: "week", src: "/hero-tiles/week.svg", alt: "Abstract shapes for the week", title: "The week" },
  { id: "note", src: "/hero-tiles/note.svg", alt: "A pale note about what matters", title: "A note" },
];

const manyImages: SampleImage[] = [1, 2, 3].flatMap((round) =>
  sampleImages.map((image) => ({
    ...image,
    id: `${image.id}-${round}`,
    alt: `${image.alt} (set ${round})`,
  })),
);

const reviewViewports = {
  ...storybookViewports,
  review1280: {
    name: "Review 1280",
    styles: { width: "1280px", height: "800px" },
    type: "desktop" as const,
  },
  review820: {
    name: "Review 820",
    styles: { width: "820px", height: "1180px" },
    type: "tablet" as const,
  },
  review390: {
    name: "Review 390",
    styles: { width: "390px", height: "844px" },
    type: "mobile" as const,
  },
};

function ImageTile({ image }: { image: SampleImage }) {
  return (
    <Card variant="outlined" shape="rounded">
      <Card.Body>
        <img
          className={`aspect-[4/3] w-full object-cover ${cardLayoutBodyOccupantRadiusClasses}`}
          src={image.src}
          alt={image.alt}
        />
      </Card.Body>
    </Card>
  );
}

function ImageRow({ images, ...props }: CarouselProps & { images: SampleImage[] }) {
  return (
    <Carousel {...props}>
      {images.map((image) => (
        <Carousel.Item key={image.id}>
          <ImageTile image={image} />
        </Carousel.Item>
      ))}
    </Carousel>
  );
}

type PageSpecimenProps = Pick<CarouselProps, "itemWidth" | "snap" | "bleed" | "fade" | "progress"> & {
  images?: SampleImage[];
};

/** The carousel on the page grid, under the heading that names it — what the review stories show at each width. */
function PageSpecimen({ images = sampleImages, itemWidth, snap, bleed, fade, progress }: PageSpecimenProps) {
  return (
    <main className="grid-page">
      <div className="band">
        <h2 id="carousel-specimen-heading" className="type-heading-2 col-span-full">
          Selected work
        </h2>
        <ImageRow
          aria-labelledby="carousel-specimen-heading"
          images={images}
          itemWidth={itemWidth}
          snap={snap}
          bleed={bleed}
          fade={fade}
          progress={progress}
          className="col-span-full"
        />
      </div>
    </main>
  );
}

const meta = {
  title: "Components/Carousel",
  component: Carousel,
  tags: ["autodocs"],
  ...storyMetaDocsDefaults(),
  argTypes: {
    progress: { control: "inline-radio", options: [...carouselProgressPlacements] },
    snap: { control: "boolean" },
    bleed: { control: "boolean" },
    fade: { control: "boolean" },
    itemWidth: { control: "object" },
    labels: { control: false },
    children: { control: false },
  },
  args: {
    "aria-label": "Selected work",
    progress: "center",
    snap: true,
    bleed: false,
    fade: true,
  },
  parameters: {
    wmdsLayout: "padded",
    viewport: { options: reviewViewports },
    docs: {
      description: {
        component: `
## Usage

A horizontal row of items with a progress scrubber under it — a strip of work images, a set of cards, quotes. The visitor drags the row, scrolls it with a trackpad or shift-wheel, swipes it on touch, steps through it with the keyboard, or drags the scrubber. The row does not loop. Each **Carousel.Item** holds anything; the first use is image tiles.

| Pattern | Props |
|---------|--------|
| **Name the row** | \`aria-label\`, or \`aria-labelledby\` pointing at the heading over it — one is required |
| **Item width** | \`itemWidth\` — a percentage of the row, as one number or per breakpoint: \`{ base: 80, sm: 55, lg: 40 }\` (default). Under 100, so the next item shows |
| **Rest on item edges** | \`snap\` (default on) — the row settles on an item's leading edge |
| **Run to the page edges** | \`bleed\` — the row reaches the page edges; items still start on the grid |
| **Edge fade** | \`fade\` (default on) — items fade where the row clips them |
| **Scrubber** | \`progress\` — \`center\` (default) or \`start\`: a shorter track, full width on phones; \`full\`: the row's width; \`none\`: no scrubber |
| **Item names** | \`labels={{ item: (position, count) => … }}\` — default "2 of 4" |

## Anatomy

\`\`\`
Carousel
├── row — a labelled region and the tab stop; scrolls sideways
│   └── Carousel.Item — a group named by its place ("2 of 4"), on the grid gutter
└── scrubber — a slim track in a 44px hit area
    └── filled part — its place is the row's progress, its width the share of the row in view
\`\`\`

**Keyboard.** The row takes focus. Left and Right move one item, Home and End go to the ends; in a right-to-left page the arrows swap. Tab reaches links inside the items, and a focused item scrolls into view.

**The scrubber is for pointers.** Drag the filled part, or press the track to move the row there. It is hidden from assistive tech and is not a tab stop: the row takes the same keys, and its items say their place. It hides itself while every item fits, keeping its space so the page under it does not move.

**Reduced motion.** No glide and no animated settle — a drag, a key, or a press on the track moves the row at once.

The row measures itself again when it resizes and when an image finishes loading. On the server and on the first paint it is at its start with the scrubber at zero.

## Best practices

- **Do** give every item the same shape — a rounded outlined **Card** for image tiles (**Pattern — image carousel**).
- **Do** keep \`itemWidth\` under 100 at every breakpoint so the next item shows there is more.
- **Do** place **Carousel** on **grid-page** through a \`band\` column span; \`className\` is layout only.
- **Do** make **Carousel.Item** a direct child of **Carousel**, one per item.
- **Don't** put the only way to reach something behind a drag — an item that navigates is a link, and a drag never clicks it.
- **Don't** use it for a gallery driven by page scroll — that is **ScrollHorizontal**.
- **Don't** add previous and next buttons beside it; the row, the keys, and the scrubber cover it.
        `.trim(),
      },
    },
  },
} satisfies Meta<typeof Carousel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ImageCarousel: Story = {
  name: "Pattern — image carousel",
  render: (args) => <ImageRow {...args} images={sampleImages} />,
  parameters: withStoryCopySource(
    {
      docs: {
        description: {
          story:
            "A strip of work images: rounded outlined cards with an image in the body, the row, and the scrubber under it. Pass the images in and name the row.",
        },
      },
    },
    `
import { Card, Carousel, cardLayoutBodyOccupantRadiusClasses } from "@thewhatmatters/wmds";

export interface CarouselImage {
  src: string;
  alt: string;
}

export function ImageCarousel({ label, images }: { label: string; images: CarouselImage[] }) {
  return (
    <Carousel aria-label={label}>
      {images.map((image) => (
        <Carousel.Item key={image.src}>
          <Card variant="outlined" shape="rounded">
            <Card.Body>
              <img
                className={\`aspect-[4/3] w-full object-cover \${cardLayoutBodyOccupantRadiusClasses}\`}
                src={image.src}
                alt={image.alt}
              />
            </Card.Body>
          </Card>
        </Carousel.Item>
      ))}
    </Carousel>
  );
}
`,
  ),
};

export const FewItems: Story = {
  name: "Reference — few items",
  args: { itemWidth: 30 },
  render: (args) => <ImageRow {...args} images={sampleImages.slice(0, 2)} />,
  parameters: {
    docs: {
      description: {
        story: "Every item fits, so the scrubber hides itself and the row is not a tab stop. Its space stays.",
      },
    },
  },
};

export const ManyItems: Story = {
  name: "Reference — many items",
  render: (args) => <ImageRow {...args} images={manyImages} />,
  parameters: {
    docs: {
      description: {
        story: "Twelve items: the filled part narrows to the share of the row in view and stays wide enough to grab.",
      },
    },
  },
};

export const ProgressStart: Story = {
  name: "Reference — scrubber at the start",
  args: { progress: "start" },
  render: (args) => <ImageRow {...args} images={sampleImages} />,
};

export const ProgressFull: Story = {
  name: "Reference — full-width scrubber",
  args: { progress: "full" },
  render: (args) => <ImageRow {...args} images={sampleImages} />,
};

export const NoProgress: Story = {
  name: "Reference — no scrubber",
  args: { progress: "none" },
  render: (args) => <ImageRow {...args} images={sampleImages} />,
};

export const FreeScroll: Story = {
  name: "Reference — snap off",
  args: { snap: false },
  render: (args) => <ImageRow {...args} images={manyImages} />,
  parameters: {
    docs: {
      description: {
        story: "With `snap` off the row rests wherever a drag or a scrub leaves it. The keys still move one item.",
      },
    },
  },
};

export const LinkedItems: Story = {
  name: "Reference — linked items",
  render: (args) => (
    <Carousel {...args}>
      {sampleImages.map((image) => (
        <Carousel.Item key={image.id}>
          <a
            href={`#${image.id}`}
            className="block rounded-[var(--radius-card-shell)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-body"
          >
            <ImageTile image={image} />
          </a>
        </Carousel.Item>
      ))}
    </Carousel>
  ),
  parameters: {
    docs: {
      description: {
        story: "Each tile is a link. A click follows it; a drag moves the row and does not. Tab reaches each link and scrolls it into view.",
      },
    },
  },
};

export const MixedContent: Story = {
  name: "Reference — any content",
  args: { "aria-label": "Notes", itemWidth: { base: 85, sm: 45, lg: 30 } },
  render: (args) => (
    <Carousel {...args}>
      {manyImages.slice(0, 6).map((image, index) => (
        <Carousel.Item key={image.id}>
          <Card padding="md" className="h-full">
            <p className="type-heading-4">{image.title}</p>
            <p className="type-body text-muted mt-2">
              Note {index + 1}. An item holds any content; the row sets its width and the gutter.
            </p>
            <p className="type-body mt-4">
              <TextLink href={`#${image.id}`}>Read the note</TextLink>
            </p>
          </Card>
        </Carousel.Item>
      ))}
    </Carousel>
  ),
};

export const Bleed: Story = {
  name: "Reference — bleed to the page edges",
  args: { bleed: true },
  render: (args) => <PageSpecimen {...args} images={manyImages} />,
  parameters: {
    wmdsLayout: "fullscreen",
    docs: {
      description: {
        story: "On **grid-page** with `bleed`: the first item starts on the grid, and the row runs out to both page edges as it scrolls. The scrubber stays on the grid.",
      },
    },
  },
};

export const RightToLeft: Story = {
  name: "Reference — right to left",
  render: (args) => (
    <div dir="rtl">
      <ImageRow {...args} images={sampleImages} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "The row starts at the right, the scrubber fills from the right, and Left moves toward the end.",
      },
    },
  },
};

const reviewParameters = { wmdsLayout: "fullscreen" } as const;

export const Review1280: Story = {
  name: "Review — 1280",
  render: (args) => <PageSpecimen {...args} />,
  parameters: reviewParameters,
  globals: { viewport: { value: "review1280", isRotated: false } },
};

export const Review1280Dark: Story = {
  name: "Review — 1280 dark",
  render: (args) => <PageSpecimen {...args} />,
  parameters: reviewParameters,
  globals: { viewport: { value: "review1280", isRotated: false }, theme: "dark" },
};

export const Review820: Story = {
  name: "Review — 820",
  render: (args) => <PageSpecimen {...args} />,
  parameters: reviewParameters,
  globals: { viewport: { value: "review820", isRotated: false } },
};

export const Review820Dark: Story = {
  name: "Review — 820 dark",
  render: (args) => <PageSpecimen {...args} />,
  parameters: reviewParameters,
  globals: { viewport: { value: "review820", isRotated: false }, theme: "dark" },
};

export const Review390: Story = {
  name: "Review — 390",
  render: (args) => <PageSpecimen {...args} />,
  parameters: reviewParameters,
  globals: { viewport: { value: "review390", isRotated: false } },
};

export const Review390Dark: Story = {
  name: "Review — 390 dark",
  render: (args) => <PageSpecimen {...args} />,
  parameters: reviewParameters,
  globals: { viewport: { value: "review390", isRotated: false }, theme: "dark" },
};
