import { Fragment, useRef, type ReactElement } from "react";
import { useRender } from "@base-ui/react/use-render";
import { ChevronRight, Ellipsis } from "lucide-react";
import { cn } from "../../../lib/cn";
import { ButtonIcon } from "../../atoms/Button/ButtonIcon";
import { IconButton } from "../../atoms/IconButton/IconButton";
import { Dropdown } from "../Dropdown/Dropdown";
import { measureDropdownMenuStyle } from "../Dropdown/dropdownMenuPosition";
import { useDropdownMenu } from "../Dropdown/useDropdownMenu";
import {
  breadcrumbItemClasses,
  breadcrumbLinkClasses,
  breadcrumbListClasses,
  breadcrumbMoreClasses,
  breadcrumbPageClasses,
  breadcrumbSeparatorClasses,
  breadcrumbSlashClasses,
  breadcrumbTextClasses,
  breadcrumbVariantClasses,
  type BreadcrumbSeparator,
  type BreadcrumbVariant,
} from "./breadcrumbStyles";

export {
  breadcrumbSeparators,
  breadcrumbVariants,
  type BreadcrumbSeparator,
  type BreadcrumbVariant,
} from "./breadcrumbStyles";

/** Layout-only — margin or grid placement. */
export type BreadcrumbLayoutClassName = string;

export interface BreadcrumbItemDef {
  /** Stable key. Default: `href`, else `label`. */
  id?: string;
  label: string;
  /** Where the crumb goes. Leave it out on the last item — the current page. */
  href?: string;
}

/** A crumb with somewhere to go — what `renderLink` receives. */
export type BreadcrumbLinkItem = BreadcrumbItemDef & { href: string };

export interface BreadcrumbLabels {
  /** Names the navigation landmark. Default: "Breadcrumb". */
  nav: string;
  /** Names the "…" control. Default: "Show 2 more pages". */
  more: (count: number) => string;
}

export const breadcrumbDefaultLabels: BreadcrumbLabels = {
  nav: "Breadcrumb",
  more: (count) => `Show ${count} more ${count === 1 ? "page" : "pages"}`,
};

export interface BreadcrumbProps {
  /** The path, from the root to the current page (the last item). */
  items: BreadcrumbItemDef[];
  /**
   * The most crumbs shown. A longer path keeps the first item and the last `maxItems - 2`, and
   * folds the middle into a "…" control that opens a menu of its links. Default: 4. Minimum: 3.
   */
  maxItems?: number;
  /** `chevron` (default) or `slash`. */
  separator?: BreadcrumbSeparator;
  /** `sans` (default, body type) or `mono` (eyebrow caps, for editorial pages). */
  variant?: BreadcrumbVariant;
  /**
   * Route links through your router: return the link element without children, for example
   * `(item) => <Link href={item.href} />`. Default: `<a href={item.href} />`.
   */
  renderLink?: (item: BreadcrumbLinkItem) => ReactElement;
  labels?: Partial<BreadcrumbLabels>;
  className?: BreadcrumbLayoutClassName;
}

type BreadcrumbSlot =
  | { kind: "item"; item: BreadcrumbItemDef; current: boolean }
  | { kind: "more"; items: BreadcrumbItemDef[] };

/** First, the collapsed middle, then the last `maxItems - 2`. */
export function breadcrumbSlots(
  items: BreadcrumbItemDef[],
  maxItems = 4,
): BreadcrumbSlot[] {
  const limit = Math.max(3, Math.floor(maxItems));
  const last = items.length - 1;
  const asItem = (item: BreadcrumbItemDef, index: number): BreadcrumbSlot => ({
    kind: "item",
    item,
    current: index === last,
  });
  if (items.length <= limit) return items.map(asItem);
  const tail = limit - 2;
  return [
    asItem(items[0]!, 0),
    { kind: "more", items: items.slice(1, items.length - tail) },
    ...items
      .slice(items.length - tail)
      .map((item, index) => asItem(item, items.length - tail + index)),
  ];
}

function itemKey(item: BreadcrumbItemDef): string {
  return item.id ?? item.href ?? item.label;
}

function defaultRenderLink(item: BreadcrumbLinkItem): ReactElement {
  return <a href={item.href} />;
}

function hasHref(item: BreadcrumbItemDef): item is BreadcrumbLinkItem {
  return item.href != null;
}

/** A crumb link — breadcrumb chrome composed onto the app's link element. */
function BreadcrumbLink({
  item,
  renderLink,
}: {
  item: BreadcrumbLinkItem;
  renderLink: (item: BreadcrumbLinkItem) => ReactElement;
}) {
  return useRender({
    render: renderLink(item),
    props: {
      className: breadcrumbLinkClasses,
      title: item.label,
      children: item.label,
    },
  });
}

function Separator({ separator }: { separator: BreadcrumbSeparator }) {
  return (
    <li
      role="presentation"
      aria-hidden="true"
      className={breadcrumbSeparatorClasses}
    >
      {separator === "slash" ? (
        <span className={breadcrumbSlashClasses}>/</span>
      ) : (
        <ButtonIcon size="xs">
          <ChevronRight />
        </ButtonIcon>
      )}
    </li>
  );
}

/** The "…" control and its menu of the collapsed links — a disclosure, not an action menu. */
function BreadcrumbMore({
  items,
  label,
  renderLink,
}: {
  items: BreadcrumbItemDef[];
  label: string;
  renderLink: (item: BreadcrumbLinkItem) => ReactElement;
}) {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const rows = items.map((item) => ({ label: item.label, disabled: !hasHref(item) }));
  const menu = useDropdownMenu({
    rows,
    triggerRef,
    focus: "items",
    measure: () =>
      triggerRef.current == null
        ? null
        : measureDropdownMenuStyle(
            triggerRef.current,
            items.map((item) => ({ label: item.label })),
            { align: "start", widthMode: "content" },
          ),
  });

  return (
    <div {...menu.rootProps} className={breadcrumbMoreClasses}>
      <IconButton
        ref={triggerRef}
        size="sm"
        icon={<Ellipsis />}
        aria-label={label}
        title=""
        aria-expanded={menu.triggerProps["aria-expanded"]}
        aria-controls={menu.triggerProps["aria-controls"]}
        onClick={menu.toggle}
      />
      {menu.open && menu.menuStyle != null ? (
        <Dropdown.Menu {...menu.menuProps} aria-label={label}>
          {items.map((item, index) => (
            <li key={itemKey(item)}>
              {hasHref(item) ? (
                <Dropdown.Item
                  {...menu.rowProps(index)}
                  truncate={false}
                  render={renderLink(item)}
                  onClick={() => menu.close()}
                >
                  {item.label}
                </Dropdown.Item>
              ) : (
                <Dropdown.Item {...menu.rowProps(index)} truncate={false} disabled>
                  {item.label}
                </Dropdown.Item>
              )}
            </li>
          ))}
        </Dropdown.Menu>
      ) : null}
    </div>
  );
}

/**
 * The path to the current page — links from the root, the current page last. A long path folds its
 * middle into a "…" control that opens a menu of the hidden links.
 */
export function Breadcrumb({
  items,
  maxItems = 4,
  separator = "chevron",
  variant = "sans",
  renderLink = defaultRenderLink,
  labels: labelsProp,
  className,
}: BreadcrumbProps) {
  const labels = { ...breadcrumbDefaultLabels, ...labelsProp };
  const slots = breadcrumbSlots(items, maxItems);

  return (
    <nav aria-label={labels.nav} className={className} data-variant={variant}>
      <ol
        className={cn(breadcrumbListClasses, breadcrumbVariantClasses[variant])}
      >
        {slots.map((slot, index) => (
          <Fragment key={slot.kind === "more" ? "more" : itemKey(slot.item)}>
            {index > 0 ? <Separator separator={separator} /> : null}
            <li className={breadcrumbItemClasses}>
              {slot.kind === "more" ? (
                <BreadcrumbMore
                  items={slot.items}
                  label={labels.more(slot.items.length)}
                  renderLink={renderLink}
                />
              ) : slot.current ? (
                <span
                  className={breadcrumbPageClasses}
                  aria-current="page"
                  title={slot.item.label}
                >
                  {slot.item.label}
                </span>
              ) : hasHref(slot.item) ? (
                <BreadcrumbLink item={slot.item} renderLink={renderLink} />
              ) : (
                <span className={breadcrumbTextClasses} title={slot.item.label}>
                  {slot.item.label}
                </span>
              )}
            </li>
          </Fragment>
        ))}
      </ol>
    </nav>
  );
}
