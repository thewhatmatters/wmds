import {
  Children,
  createContext,
  useContext,
  useId,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "../../../lib/cn";
import { IconButton } from "../../atoms/IconButton/IconButton";
import { TextLink } from "../../atoms/TextLink/TextLink";
import {
  indexListCaptionsClasses,
  indexListChevronClasses,
  indexListChevronOpenClasses,
  indexListEmptyClasses,
  indexListItemClasses,
  indexListListCaptionedClasses,
  indexListListClasses,
  indexListMetaClasses,
  indexListPanelClasses,
  indexListPanelContentClasses,
  indexListPanelInnerClasses,
  indexListRootClasses,
  indexListTitleCellClasses,
  indexListTitleClasses,
  indexListTitleSizeClasses,
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

/** Layout-only — width, margin, or grid placement. */
export type IndexListLayoutClassName = string;

export interface IndexListCaptions {
  /** Over the meta column, for example "Date". */
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
  /** The heading element around each title. Default: `h2`. */
  titleAs?: IndexListTitleElement;
  /** Shown in place of the rows when there are none — for example "No posts match these filters." */
  empty?: ReactNode;
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
  href: string;
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
  className?: IndexListLayoutClassName;
}

interface IndexListContextValue {
  size: IndexListSize;
  titleAs: IndexListTitleElement;
}

const IndexListContext = createContext<IndexListContextValue>({ size: "lg", titleAs: "h2" });

/**
 * Editorial index — a ruled list where each row has a meta column, a large linked title, and an
 * optional preview that expands under the title. Optional column captions share the rows' tracks.
 */
function IndexListRoot({
  captions,
  size = "lg",
  titleAs = "h2",
  empty,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  children,
  className,
}: IndexListProps) {
  const hasRows = Children.toArray(children).length > 0;
  const contextValue = useMemo(() => ({ size, titleAs }), [size, titleAs]);

  return (
    <IndexListContext.Provider value={contextValue}>
      <div className={cn(indexListRootClasses, className)} data-size={size}>
        {hasRows && captions != null ? (
          <div className={indexListCaptionsClasses} aria-hidden="true" data-index-list-captions="">
            <span>{captions.meta}</span>
            <span className="@lg:col-start-2">{captions.title}</span>
          </div>
        ) : null}
        {hasRows ? (
          <ul
            role="list"
            aria-label={ariaLabel}
            aria-labelledby={ariaLabelledBy}
            className={cn(indexListListClasses, captions != null && indexListListCaptionedClasses)}
          >
            {children}
          </ul>
        ) : empty != null ? (
          <div className={indexListEmptyClasses} data-index-list-empty="">
            {empty}
          </div>
        ) : null}
      </div>
    </IndexListContext.Provider>
  );
}

function IndexListItem({
  title,
  href,
  meta,
  preview,
  defaultOpen = false,
  open: openProp,
  onOpenChange,
  previewLabel,
  className,
}: IndexListItemProps) {
  const { size, titleAs: Title } = useContext(IndexListContext);
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
    <li className={cn(indexListItemClasses, className)}>
      {meta != null ? <div className={indexListMetaClasses}>{meta}</div> : null}
      <div className={indexListTitleCellClasses}>
        <Title className={cn(indexListTitleClasses, indexListTitleSizeClasses[size])}>
          <TextLink variant="quiet" href={href}>
            {title}
          </TextLink>
        </Title>
        {hasPreview ? (
          <IconButton
            size="md"
            className={indexListToggleAlignClasses[size]}
            icon={<ChevronDown className={cn(indexListChevronClasses, open && indexListChevronOpenClasses)} />}
            aria-label={previewLabel ?? `Preview: ${title}`}
            title=""
            aria-expanded={open}
            aria-controls={panelId}
            onClick={toggle}
          />
        ) : null}
      </div>
      {hasPreview ? (
        <div className={cn("motion-collapse", indexListPanelClasses)} data-visible={open ? "true" : "false"}>
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
