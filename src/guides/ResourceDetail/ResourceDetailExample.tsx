/**
 * Storybook-only — the live **Guides/Resource detail** pattern and its sample data. Apps copy the
 * Show code in ResourceDetail.stories.tsx, not this file.
 */
import { useEffect, useId, useState, type ReactElement, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "../../components/atoms/Badge/Badge";
import { Button } from "../../components/atoms/Button/Button";
import { IconButton } from "../../components/atoms/IconButton/IconButton";
import { Breadcrumb, type BreadcrumbItemDef, type BreadcrumbLinkItem } from "../../components/molecules/Breadcrumb/Breadcrumb";
import { DescriptionList } from "../../components/molecules/DescriptionList/DescriptionList";
import { Dialog } from "../../components/organisms/Dialog/Dialog";
import { FilteredGrid, sampleResourceGroups, sampleResources } from "../FilterPanel/FilterPanelExample";
import { sampleImage } from "../../storybook/sampleImage";

// ── The pattern — mirrors Show code in ResourceDetail.stories.tsx line for line ──────────

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
  /** The router's link for the breadcrumb, in place of a plain anchor — (item) => <Link href={item.href} />. */
  renderLink?: (item: BreadcrumbLinkItem) => ReactElement;
  /** The app's image component, in place of img — (image) => <Image {...image} sizes="…" />. */
  renderImage?: (image: ResourceImage) => ReactNode;
  /** Page-level layers inside the page grid — for example a GridOverlay. */
  overlay?: ReactNode;
}

/** The detail as its own page: opened directly, or from a shared link. */
export function ResourceDetailPage({ item, breadcrumb, renderLink, renderImage, overlay }: ResourceDetailPageProps) {
  const headingId = useId();

  return (
    <main className="grid-page bg-body">
      {overlay}
      <article aria-labelledby={headingId} className="band py-6 sm:py-10 lg:py-14">
        <Breadcrumb
          items={breadcrumb}
          variant="mono"
          separator="slash"
          renderLink={renderLink}
          className="col-span-full mb-6"
        />
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

// ── Sample data and the Storybook-only stage ─────────────────────────────────────────────

const sampleCaptions = `data:text/vtt,${encodeURIComponent("WEBVTT\n\n00:00.000 --> 00:02.000\n(No speech)\n")}`;

const sampleNotes: Record<string, string> = {
  "grid-notes": "The clearest writing on page grids we know. Start with the piece on margins.",
  "type-scale": "Pick a ratio, see the whole scale, and copy the values. We use it at the start of every identity.",
  "motion-field":
    "A long-running notebook on interface motion: what a transition is for, how long it should take, and when to leave it out. Each entry takes one interaction apart frame by frame and says what the timing does to how it feels, which is rare. Read the early entries first; the later ones lean on their terms.",
};

const sampleCategories: Record<string, string> = { tools: "Tools", inspiration: "Inspiration", fonts: "Fonts" };

/** The grid's nine resources, each with what the detail adds. The second is a video. */
export const sampleDetails: ResourceDetailItem[] = sampleResources.map((resource, index) => {
  const type = resource.facets.type;
  return {
    id: resource.id,
    title: resource.title,
    image: resource.image,
    video:
      resource.id === "type-scale"
        ? { src: "/sample/resource-clip.mp4", poster: sampleImage(1280, 720, "dark"), captions: sampleCaptions }
        : undefined,
    category: sampleCategories[Array.isArray(type) ? type[0] : type],
    tags: resource.facets.price === "free" ? ["Free", "Web"] : ["Paid"],
    meta: resource.meta,
    note: sampleNotes[resource.id] ?? "A short note on why this is worth your time, in a sentence or two.",
    added: `2026-09-${String(index + 10)}`,
    addedLabel: `Sep ${index + 10}, 2026`,
    visitHref: `https://${resource.meta}`,
    rows: index % 2 === 0 ? [{ name: "Made by", value: "A small studio" }] : undefined,
  };
});

export const sampleBreadcrumb = (item: ResourceDetailItem): BreadcrumbItemDef[] => [
  { label: "Home", href: "#home" },
  { label: "Resources", href: "#resources" },
  { label: item.title },
];

/** The dialog over the grid, opened from a tile — as an app's route would open it. */
export function ResourceDetailOverGrid({ startAt }: { startAt?: string } = {}) {
  const [openId, setOpenId] = useState<string | null>(startAt ?? null);
  const [lastId, setLastId] = useState(startAt ?? sampleDetails[0].id);
  const index = sampleDetails.findIndex((item) => item.id === (openId ?? lastId));

  function show(id: string | null) {
    if (id != null) setLastId(id);
    setOpenId(id);
  }

  return (
    <div
      className="min-h-screen bg-body"
      onClick={(event) => {
        // Stands in for the router: a tile's link opens its resource.
        const link = (event.target as HTMLElement).closest<HTMLAnchorElement>("a[href^='#resources/']");
        if (link == null) return;
        event.preventDefault();
        show(link.getAttribute("href")?.replace("#resources/", "") ?? null);
      }}
    >
      <FilteredGrid
        title="Resources"
        caption="Library"
        items={sampleResources.map((resource) => ({ ...resource, external: false, href: `#resources/${resource.id}` }))}
        groups={sampleResourceGroups}
      />
      <ResourceDetailDialog
        item={sampleDetails[index]}
        open={openId != null}
        onClose={() => show(null)}
        onPrevious={index > 0 ? () => show(sampleDetails[index - 1].id) : undefined}
        onNext={index < sampleDetails.length - 1 ? () => show(sampleDetails[index + 1].id) : undefined}
        position={`${index + 1} of ${sampleDetails.length}`}
      />
    </div>
  );
}

/** The page form of one sample resource. */
export function ResourceDetailStandalone({ id }: { id: string }) {
  const item = sampleDetails.find((detail) => detail.id === id) ?? sampleDetails[0];
  return <ResourceDetailPage item={item} breadcrumb={sampleBreadcrumb(item)} />;
}
