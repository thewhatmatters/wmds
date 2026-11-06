import {
  Children,
  createContext,
  useContext,
  useId,
  useMemo,
  useState,
  type ReactElement,
  type ReactNode,
} from "react";
import { ArrowRight, ArrowUpRight, ChevronDown } from "lucide-react";
import { cn } from "../../../lib/cn";
import { IconButton } from "../../atoms/IconButton/IconButton";
import { TextLink } from "../../atoms/TextLink/TextLink";
import {
  indexListArrowClasses,
  indexListArrowNudgeClasses,
  indexListArrowNudgeExternalClasses,
  indexListCaptionsClasses,
  indexListChevronClasses,
  indexListChevronOpenClasses,
  indexListEmptyClasses,
  indexListItemClasses,
  indexListListCaptionedClasses,
  indexListListClasses,
  indexListMetaClasses,
  indexListPageCaptionsClasses,
  indexListPageItemClasses,
  indexListPageListClasses,
  indexListPageMetaClasses,
  indexListPagePanelClasses,
  indexListPageRootClasses,
  indexListPageEndClasses,
  indexListPageTitleCellClasses,
  indexListPageTitleCellEndClasses,
  indexListTagsClasses,
  indexListTagsInMetaClasses,
  indexListPanelClasses,
  indexListPanelContentClasses,
  indexListPanelInnerClasses,
  indexListRootClasses,
  indexListRowLinkClasses,
  indexListTitleCellClasses,
  indexListTitleClasses,
  indexListTitleSizeClasses,
  indexListToggleAboveRowClasses,
  indexListToggleAlignClasses,
  type IndexListSize,
  type IndexListTitleElement,
} from "./indexListStyles";

export {
  indexListSizes,
  indexListTitleElements,
  type IndexListSize,
  type IndexListTitleElement,
} from "./indexListStyles";
import { emptySlot } from "../EmptyState/EmptyState";

/** Layout-only — width, margin, or grid placement. */
export type IndexListLayoutClassName = string;

export interface IndexListCaptions {
  /** Over the meta column, in sentence case — for example "Date". The "/" marker comes with it. */
  meta: ReactNode;
  /** Over the titles, for example "Name". */
  title: ReactNode;
}

export interface IndexListProps {
  /**
   * Column captions over the rows, on the rows' own tracks. Hidden where the list is narrower than
   * 32rem (phones, narrow columns) and each row is one column. Visual only — the rows carry their
   * own meaning.
   */
  captions?: IndexListCaptions;
  /** Title scale: `lg` type-display-3 (default), `md` type-heading-1, `sm` type-heading-3. */
  size?: IndexListSize;
  /**
   * `tracks` (default): the list's own two tracks (meta and title). `page`: the rows sit on the WMDS page grid
   * (place the list as a direct child of a `grid-page` or Band): meta in the first two columns from md, the title
   * across the width, a row's arrow in the last column. Like a table of posts.
   */
  columns?: "tracks" | "page";
  /** The heading element around each title. Default: `h2`. */
  titleAs?: IndexListTitleElement;
  /** Shown in place of the rows when there are none — for example "No posts match these filters." */
  empty?: ReactNode;
  /**
   * The result count, read out when it changes (Empty states Z6): "12 projects", "0 projects match".
   * Kept in a status line that's always there, so the change is announced.
   */
  resultsLabel?: string;
  /** Names the list for screen readers, for example "Posts". */
  "aria-label"?: string;
  "aria-labelledby"?: string;
  /** **IndexList.Item** rows. */
  children?: ReactNode;
  className?: IndexListLayoutClassName;
}

export interface IndexListItemProps {
  /** The row's title — a link to `href`. */
  title: string;
  /** Where the title goes. Leave it out when `render` carries the destination. */
  href?: string;
  /** The router's link for the title, in place of a plain anchor — `render={<Link href="/blog/post" />}`. */
  render?: ReactElement;
  /** The meta column, for example a `<time>`. Above the title where the list is one column. */
  meta?: ReactNode;
  /** A short preview. When set, a control at the row's end expands it under the title. */
  preview?: ReactNode;
  /** Uncontrolled preview state. */
  defaultOpen?: boolean;
  /** Controlled preview state. */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Names the preview control. Default: "Preview: {title}". */
  previewLabel?: string;
  /**
   * An arrow at the row's end, and the whole row is the link (one hit area, a quiet fill on hover and keyboard
   * focus). `external` sets it too.
   */
  arrow?: boolean;
  /**
   * The row goes to another site: an out-arrow at the end, and the link opens in a new tab (said to screen readers).
   */
  external?: boolean;
  /**
   * Slot: the row's tags, a few WMDS `Badge`s (e.g. "Case study", "Guide"), at the row's end before its arrow (from
   * md; on phones they join the meta line). Needs `columns="page"`.
   */
  tags?: ReactNode;
  className?: IndexListLayoutClassName;
}

interface IndexListContextValue {
  size: IndexListSize;
  titleAs: IndexListTitleElement;
  page: boolean;
}

const IndexListContext = createContext<IndexListContextValue>({ size: "lg", titleAs: "h2", page: false });

/**
 * Editorial index — a ruled list where each row has a meta column, a large linked title, and an
 * optional preview that expands under the title. Optional column captions share the rows' tracks.
 */
function IndexListRoot({
  captions,
  size = "lg",
  titleAs = "h2",
  columns = "tracks",
  empty,
  resultsLabel,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  children,
  className,
}: IndexListProps) {
  const hasRows = Children.toArray(children).length > 0;
  const page = columns === "page";
  const contextValue = useMemo(() => ({ size, titleAs, page }), [size, titleAs, page]);

  return (
    <IndexListContext.Provider value={contextValue}>
      <div className={cn(page ? indexListPageRootClasses : indexListRootClasses, className)} data-size={size} data-columns={columns}>
        {hasRows && captions != null ? (
          <div className={page ? indexListPageCaptionsClasses : indexListCaptionsClasses} aria-hidden="true" data-index-list-captions="">
            <span className={page ? "md:col-span-2" : undefined}>/ {captions.meta}</span>
            <span className={page ? "md:col-span-6 md:col-start-3 lg:col-span-10" : "@lg:col-start-2"}>/ {captions.title}</span>
          </div>
        ) : null}
        {hasRows ? (
          <ul
            role="list"
            aria-label={ariaLabel}
            aria-labelledby={ariaLabelledBy}
            className={cn(indexListListClasses, page && indexListPageListClasses, captions != null && indexListListCaptionedClasses)}
          >
            {children}
          </ul>
        ) : empty != null ? (
          <div className={indexListEmptyClasses} data-index-list-empty="">
            {emptySlot(empty)}
          </div>
        ) : null}
        {resultsLabel != null ? (
          <p role="status" className="sr-only">
            {resultsLabel}
          </p>
        ) : null}
      </div>
    </IndexListContext.Provider>
  );
}

function IndexListItem({
  title,
  href,
  render,
  meta,
  preview,
  defaultOpen = false,
  open: openProp,
  onOpenChange,
  previewLabel,
  arrow = false,
  external = false,
  tags,
  className,
}: IndexListItemProps) {
  const { size, titleAs: Title, page } = useContext(IndexListContext);
  const rowLink = arrow || external;
  const hasEnd = page && (rowLink || tags != null);
  const panelId = useId();
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const isControlled = openProp !== undefined;
  const open = isControlled ? openProp : uncontrolledOpen;
  const hasPreview = preview != null;

  function toggle() {
    const next = !open;
    if (!isControlled) setUncontrolledOpen(next);
    onOpenChange?.(next);
  }

  return (
    <li
      className={cn(page ? indexListPageItemClasses : indexListItemClasses, rowLink && indexListRowLinkClasses, className)}
      data-row-link={rowLink ? "" : undefined}
    >
      {meta != null ? (
        <div className={page ? indexListPageMetaClasses : indexListMetaClasses}>
          {meta}
          {page && tags != null ? <span className={indexListTagsInMetaClasses}>{tags}</span> : null}
        </div>
      ) : null}
      <div className={page ? (hasEnd ? indexListPageTitleCellEndClasses : indexListPageTitleCellClasses) : indexListTitleCellClasses}>
        <Title className={cn(indexListTitleClasses, indexListTitleSizeClasses[size])}>
          <TextLink variant="quiet" href={href} render={render} newTab={external}>
            {title}
          </TextLink>
        </Title>
        {hasPreview ? (
          <IconButton
            size="md"
            className={cn(indexListToggleAlignClasses[size], rowLink && indexListToggleAboveRowClasses)}
            icon={<ChevronDown className={cn(indexListChevronClasses, open && indexListChevronOpenClasses)} />}
            aria-label={previewLabel ?? `Preview: ${title}`}
            title=""
            aria-expanded={open}
            aria-controls={panelId}
            onClick={toggle}
          />
        ) : null}
        {rowLink && !page ? (
          <span aria-hidden="true" className={cn(indexListArrowClasses, external ? indexListArrowNudgeExternalClasses : indexListArrowNudgeClasses)}>
            {external ? <ArrowUpRight className="size-5" strokeWidth={2} /> : <ArrowRight className="size-5" strokeWidth={2} />}
          </span>
        ) : null}
      </div>
      {hasEnd ? (
        <div className={indexListPageEndClasses}>
          {tags != null ? <span className={indexListTagsClasses}>{tags}</span> : null}
          {rowLink ? (
            <span aria-hidden="true" className={cn(indexListArrowClasses, external ? indexListArrowNudgeExternalClasses : indexListArrowNudgeClasses)}>
              {external ? <ArrowUpRight className="size-5" strokeWidth={2} /> : <ArrowRight className="size-5" strokeWidth={2} />}
            </span>
          ) : null}
        </div>
      ) : null}
      {hasPreview ? (
        <div className={cn("motion-collapse", page ? indexListPagePanelClasses : indexListPanelClasses)} data-visible={open ? "true" : "false"}>
          <div id={panelId} className={indexListPanelInnerClasses}>
            <div className={indexListPanelContentClasses}>{preview}</div>
          </div>
        </div>
      ) : null}
    </li>
  );
}

export const IndexList = Object.assign(IndexListRoot, {
  Item: IndexListItem,
});
