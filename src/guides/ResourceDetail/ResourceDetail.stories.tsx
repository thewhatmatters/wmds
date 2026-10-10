import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, waitFor, within } from "storybook/test";
import { storyMetaDocsDefaults, withStoryCopySource } from "../../lib/storyCopySource";
import { lockedViewportStory } from "../../lib/viewports";
import { ResourceDetailOverGrid, ResourceDetailStandalone } from "./ResourceDetailExample";

const meta = {
  title: "Guides/Resource detail",
  tags: ["autodocs"],
  ...storyMetaDocsDefaults(),
  parameters: {
    wmdsLayout: "fullscreen",
    docs: {
      description: {
        component: `
## Usage

A resource's detail, in two forms with the same content. A tile in **Guides/Filter panel → Pattern — filtered grid** links to the resource's own route in the app; the app picks the form by route — the dialog when the visitor came from the grid, the page when the address was opened directly or shared. The visitor goes to the resource itself from the detail's Visit button.

| Form | Export | Built on |
|------|--------|----------|
| Over the grid | \`ResourceDetailDialog\` | **Dialog** \`size="full"\` — the grid stays behind it, dimmed, and does not scroll |
| As a page | \`ResourceDetailPage\` | \`grid-page\` with a **Breadcrumb** in place of the close |

It is a **Dialog**, not a **Sheet** or a **Panel**: the detail is centered and as large as the window allows, and it blocks the page. A **Sheet** is an edge drawer; a **Panel** leaves the page behind it in use.

| Part | Component | Why |
|------|-----------|-----|
| Media | \`img\` (or the app's image component through \`renderImage\`), or one \`video\` with controls | Whole, never cropped; the video does not play by itself |
| Eyebrow, title, note, date | \`type-eyebrow\`, \`type-heading-1\`, \`type-reading\`, \`time\` | The dialog is named by the title |
| Metadata | **DescriptionList** \`variant="mono"\` \`rule="dotted"\` | Category, Tags (**Badge** outline mono), Source, then the app's \`rows\` |
| Visit | **Button** \`role="primary"\` \`external\` | Opens the resource in a new tab and says so |
| Previous, next, close | **IconButton** \`size="sm"\` in the Dialog's \`headerEnd\`; the Dialog's close | Left and Right also move; Escape closes |
| Path | **Breadcrumb** \`variant="mono"\` \`separator="slash"\` | The page form only |

## Anatomy

\`\`\`
ResourceDetailDialog
└── Dialog → Dialog.Content size="full" (named by the title)
    ├── header — position ("3 of 9") · previous · next · close
    ├── body — grid: media | info (20rem from md, 24rem from lg); one column on phones, media first
    │   ├── media well — img or video, fitted to the height the window allows
    │   └── info (scrolls by itself from md) — eyebrow · h2 · note · Added date · DescriptionList
    └── footer — Visit (pinned)

ResourceDetailPage
└── main.grid-page
    ├── {overlay}
    └── article.band
        ├── Breadcrumb (col-span-full)
        ├── media well (lg:col-span-8)
        └── info (lg:col-span-4) — eyebrow · h1 · note · Added date · DescriptionList · Visit
\`\`\`

On phones the dialog is the whole screen: the media, then the info, in one scrolling column, with Visit pinned at the bottom.

Closing the dialog returns focus to the tile it was opened from. Previous is off on the first resource and next on the last — leave \`onPrevious\` or \`onNext\` out. Left and Right do nothing while focus is in the video, where they seek.

## Best practices

- **Do** give each resource its own route (\`/resources/<slug>\`) and open the dialog from that route, so the address can be shared and Back closes it. In Next.js this is an intercepting route for the dialog and a plain route for the page.
- **Do** make \`onPrevious\`, \`onNext\`, and \`onClose\` route changes — replace the route for previous and next, so Back still returns to the grid.
- **Do** keep the note to a sentence or two; the info column scrolls when it is longer.
- **Do** give a video a \`poster\`, and \`captions\` (WebVTT) when it has speech.
- **Don't** add view counts, stats, or a save control. They are not part of this pattern.
- **Don't** autoplay the video or pass more than one media item.
- **Don't** put the Visit link on the grid's tile — the tile is one link, to the detail.
        `.trim(),
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** The dialog fades in; wait for it before the accessibility check reads its colors. */
const dialogSettled: Story["play"] = async () => {
  const dialog = await waitFor(() => within(document.body).getByRole("dialog"));
  await waitFor(() => {
    expect(getComputedStyle(dialog).opacity).toBe("1");
    expect(getComputedStyle(dialog.parentElement ?? dialog).opacity).toBe("1");
  });
};

export const Detail: Story = {
  name: "Pattern — resource detail",
  render: () => <ResourceDetailOverGrid startAt="contrast" />,
  play: dialogSettled,
  parameters: withStoryCopySource(
    {
      docs: {
        description: {
          story:
            "The dialog over the filtered grid, on a resource with a screenshot. Close it and open another from its tile; previous, next, Left, and Right move through the list. Show code has both forms: `ResourceDetailDialog` and `ResourceDetailPage`.",
        },
      },
    },
    `
import { useEffect, useId, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Badge,
  Breadcrumb,
  Button,
  DescriptionList,
  Dialog,
  IconButton,
  type BreadcrumbItemDef,
} from "@thewhatmatters/wmds";

export interface ResourceImage {
  src: string;
  alt: string;
  /** The image's own size, in px. */
  width: number;
  height: number;
}

export interface ResourceVideo {
  src: string;
  /** The frame shown before the video plays. */
  poster: string;
  /** A WebVTT captions file, when the video has speech. */
  captions?: string;
}

export interface ResourceDetailItem {
  id: string;
  title: string;
  /** The preview. Shown unless there is a video. */
  image: ResourceImage;
  /** One video, with controls. It does not play by itself. */
  video?: ResourceVideo;
  /** The eyebrow over the title and the Category row, for example "Tools". */
  category: string;
  tags?: string[];
  /** Where the resource lives, for example the domain — the Source row and the Visit button. */
  meta?: string;
  /** The curator's note: one or two sentences. */
  note: string;
  /** ISO date the resource was added, for the time element. */
  added: string;
  /** The date as readers see it, for example "Sep 14, 2026". */
  addedLabel: string;
  /** The resource itself, on its own site. */
  visitHref: string;
  /** More metadata rows, after Source. */
  rows?: { name: string; value: string }[];
}

/** The media well: one image or one video, whole, on the page floor. */
const mediaClasses =
  "flex items-center justify-center overflow-hidden rounded-[var(--radius-card-body)] border border-border bg-muted-surface [&>img]:block [&>img]:h-auto [&>img]:w-full [&>video]:block [&>video]:h-auto [&>video]:w-full";

/** Over the grid, from md: the well takes the height the window allows and the media fits inside it. */
const mediaFillClasses =
  "md:h-full md:min-h-0 md:[&>img]:max-h-full md:[&>img]:w-auto md:[&>img]:max-w-full md:[&>img]:object-contain md:[&>video]:max-h-full md:[&>video]:w-auto md:[&>video]:max-w-full";

function ResourceMedia({
  item,
  fill = false,
  renderImage,
}: {
  item: ResourceDetailItem;
  fill?: boolean;
  renderImage?: (image: ResourceImage) => ReactNode;
}) {
  return (
    <div className={fill ? mediaClasses + " " + mediaFillClasses : mediaClasses}>
      {item.video != null ? (
        <video key={item.video.src} controls playsInline preload="metadata" poster={item.video.poster}>
          <source src={item.video.src} />
          {item.video.captions != null ? (
            <track kind="captions" src={item.video.captions} srcLang="en" label="English" default />
          ) : null}
        </video>
      ) : renderImage != null ? (
        renderImage(item.image)
      ) : (
        <img src={item.image.src} alt={item.image.alt} width={item.image.width} height={item.image.height} />
      )}
    </div>
  );
}

function ResourceInfo({
  item,
  headingId,
  titleAs: Title,
}: {
  item: ResourceDetailItem;
  headingId: string;
  titleAs: "h1" | "h2";
}) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <p className="type-eyebrow text-muted">{item.category}</p>
        <Title id={headingId} className="type-heading-1 text-balance text-fg">
          {item.title}
        </Title>
        <p className="type-reading text-fg">{item.note}</p>
        <p className="type-supporting text-muted">
          Added <time dateTime={item.added}>{item.addedLabel}</time>
        </p>
      </div>
      <DescriptionList variant="mono" rule="dotted" aria-label="Details">
        <DescriptionList.Item name="Category">{item.category}</DescriptionList.Item>
        {item.tags != null && item.tags.length > 0 ? (
          <DescriptionList.Item name="Tags">
            {item.tags.map((tag) => (
              <Badge key={tag} emphasis="outline" mono>
                {tag}
              </Badge>
            ))}
          </DescriptionList.Item>
        ) : null}
        {item.meta != null ? <DescriptionList.Item name="Source">{item.meta}</DescriptionList.Item> : null}
        {item.rows?.map((row) => (
          <DescriptionList.Item key={row.name} name={row.name}>
            {row.value}
          </DescriptionList.Item>
        ))}
      </DescriptionList>
    </div>
  );
}

function VisitButton({ item }: { item: ResourceDetailItem }) {
  return (
    <Button role="primary" external render={<a href={item.visitHref} />}>
      Visit {item.meta ?? "resource"}
    </Button>
  );
}

export interface ResourceDetailDialogProps {
  item: ResourceDetailItem;
  open: boolean;
  /** Close, the scrim, and Escape. Go back to the grid's route here. */
  onClose: () => void;
  /** Go to the resource before this one. Leave it out on the first: the control is off. */
  onPrevious?: () => void;
  /** Go to the resource after this one. Leave it out on the last. */
  onNext?: () => void;
  /** Where this resource is in the list, for example "3 of 9". */
  position?: string;
  /** The app's image component, in place of img — (image) => <Image {...image} sizes="…" />. */
  renderImage?: (image: ResourceImage) => ReactNode;
}

/** The detail over the grid: the page behind is dimmed and does not scroll. */
export function ResourceDetailDialog({
  item,
  open,
  onClose,
  onPrevious,
  onNext,
  position,
  renderImage,
}: ResourceDetailDialogProps) {
  const headingId = useId();

  // Left and Right move between resources — except in the video, where they seek.
  useEffect(() => {
    if (!open) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
      if (event.target instanceof HTMLVideoElement) return;
      if (event.key === "ArrowLeft" && onPrevious != null) {
        event.preventDefault();
        onPrevious();
      } else if (event.key === "ArrowRight" && onNext != null) {
        event.preventDefault();
        onNext();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onPrevious, onNext]);

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) onClose();
      }}
    >
      <Dialog.Content
        size="full"
        aria-labelledby={headingId}
        headerStart={position != null ? <span className="type-supporting tabular-nums">{position}</span> : undefined}
        headerEnd={
          <>
            <IconButton
              size="sm"
              role="ghost"
              icon={<ChevronLeft />}
              aria-label="Previous resource"
              disabled={onPrevious == null}
              onClick={onPrevious}
            />
            <IconButton
              size="sm"
              role="ghost"
              icon={<ChevronRight />}
              aria-label="Next resource"
              disabled={onNext == null}
              onClick={onNext}
            />
          </>
        }
        footer={<VisitButton item={item} />}
      >
        <div className="grid gap-6 md:h-full md:grid-cols-[minmax(0,1fr)_20rem] lg:grid-cols-[minmax(0,1fr)_24rem]">
          <ResourceMedia item={item} fill renderImage={renderImage} />
          <div className="md:min-h-0 md:overflow-y-auto">
            <ResourceInfo item={item} headingId={headingId} titleAs="h2" />
          </div>
        </div>
      </Dialog.Content>
    </Dialog>
  );
}

export interface ResourceDetailPageProps {
  item: ResourceDetailItem;
  /** The path to this resource, ending with it — Home, Resources, this resource. */
  breadcrumb: BreadcrumbItemDef[];
  /** The app's image component, in place of img — (image) => <Image {...image} sizes="…" />. */
  renderImage?: (image: ResourceImage) => ReactNode;
  /** Page-level layers inside the page grid — for example a GridOverlay. */
  overlay?: ReactNode;
}

/** The detail as its own page: opened directly, or from a shared link. */
export function ResourceDetailPage({ item, breadcrumb, renderImage, overlay }: ResourceDetailPageProps) {
  const headingId = useId();

  return (
    <main className="grid-page bg-body">
      {overlay}
      <article aria-labelledby={headingId} className="band py-6 sm:py-10 lg:py-14">
        <Breadcrumb items={breadcrumb} variant="mono" separator="slash" className="col-span-full mb-6" />
        <div className="col-span-full lg:col-span-8">
          <ResourceMedia item={item} renderImage={renderImage} />
        </div>
        <div className="col-span-full mt-6 flex flex-col items-start gap-6 lg:col-span-4 lg:mt-0">
          <ResourceInfo item={item} headingId={headingId} titleAs="h1" />
          <VisitButton item={item} />
        </div>
      </article>
    </main>
  );
}
`,
  ),
};

export const Video: Story = {
  name: "Dialog — video",
  render: () => <ResourceDetailOverGrid startAt="type-scale" />,
  play: dialogSettled,
  parameters: {
    docs: { description: { story: "`video: { src, poster, captions }` — one video with controls, fitted to the well. It does not play by itself." } },
  },
};

export const TallImage: Story = {
  name: "Dialog — first resource, tall image",
  render: () => <ResourceDetailOverGrid startAt="grid-notes" />,
  play: dialogSettled,
  parameters: {
    docs: { description: { story: "The first resource: previous is off. A 4:5 image is fitted to the window's height, not cropped." } },
  },
};

export const LongNote: Story = {
  name: "Dialog — long note",
  render: () => <ResourceDetailOverGrid startAt="motion-field" />,
  play: dialogSettled,
  parameters: {
    docs: { description: { story: "A note well past two sentences: the info column scrolls by itself and Visit stays pinned." } },
  },
};

export const Last: Story = {
  name: "Dialog — last resource",
  render: () => <ResourceDetailOverGrid startAt="landing-archive" />,
  play: dialogSettled,
  parameters: {
    docs: { description: { story: "The last resource: next is off." } },
  },
};

export const DialogTablet: Story = {
  name: "Dialog — tablet",
  render: () => <ResourceDetailOverGrid startAt="contrast" />,
  play: dialogSettled,
  ...lockedViewportStory("tablet"),
};

export const DialogPhone: Story = {
  name: "Dialog — phone",
  render: () => <ResourceDetailOverGrid startAt="contrast" />,
  play: dialogSettled,
  ...lockedViewportStory("mobile"),
};

export const DialogDark: Story = {
  name: "Dialog — dark",
  render: () => <ResourceDetailOverGrid startAt="type-scale" />,
  play: dialogSettled,
  globals: { theme: "dark" },
};

export const Page: Story = {
  name: "Page",
  render: () => <ResourceDetailStandalone id="contrast" />,
  parameters: {
    docs: { description: { story: "`ResourceDetailPage` — the same content on the page grid, with a Breadcrumb and no dimmed grid." } },
  },
};

export const PageVideo: Story = {
  name: "Page — video",
  render: () => <ResourceDetailStandalone id="type-scale" />,
};

export const PagePhone: Story = {
  name: "Page — phone",
  render: () => <ResourceDetailStandalone id="motion-field" />,
  ...lockedViewportStory("mobile"),
};

export const PageDark: Story = {
  name: "Page — dark",
  render: () => <ResourceDetailStandalone id="grid-notes" />,
  globals: { theme: "dark" },
};
