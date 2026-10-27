import { NavigationMenu } from "@base-ui/react/navigation-menu";
import { ChevronDown, Menu as MenuIcon } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  Children,
  createContext,
  isValidElement,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
  type RefObject,
} from "react";
import { createPortal } from "react-dom";
import { cn } from "../../../lib/cn";
import { motionTransitionProp } from "../../../lib/motion";
import { Button, type ButtonSize } from "../../atoms/Button/Button";
import { IconButton } from "../../atoms/IconButton/IconButton";
import { TextLink } from "../../atoms/TextLink/TextLink";
import {
  cardLayoutBodyOccupantRadiusClasses,
  cardLayoutBodyOccupantWellClasses,
} from "../../molecules/Card/Card";
import { Dropdown } from "../../molecules/Dropdown/Dropdown";
import { textOf, useOverflowMenu } from "../../molecules/Dropdown/useOverflowMenu";
import { Sheet } from "../Sheet/Sheet";
import {
  siteNavBarBaseClasses,
  siteNavBarCompactLayoutClasses,
  siteNavBarStateClasses,
  siteNavBrandClasses,
  siteNavContainerClasses,
  siteNavEndClasses,
  siteNavExpandedHeightClasses,
  siteNavLinkClasses,
  siteNavLinkListClasses,
  siteNavLinksRootClasses,
  siteNavMeasureRailClasses,
  siteNavMenuBackdropClasses,
  siteNavMenuContentClasses,
  siteNavMenuLinkClasses,
  siteNavMenuLinkGridClasses,
  siteNavMenuPopupClasses,
  siteNavMenuPositionerClasses,
  siteNavMenuSideOffsetPx,
  siteNavMenuSectionClasses,
  siteNavMenuSectionLabelClasses,
  siteNavMenuSectionSpanClasses,
  siteNavMenuViewportClasses,
  siteNavMenuReadRowClasses,
  siteNavMenuReadThumbClasses,
  siteNavMiddleClasses,
  siteNavMiddleHugClasses,
  siteNavMiddleHugResponsiveClasses,
  siteNavMobileLinkClasses,
  siteNavMiddleResponsiveClasses,
  siteNavMobileListClasses,
  siteNavMobileTriggerClasses,
  siteNavMeasureItemClasses,
  siteNavMeasureMoreClasses,
  siteNavMoreIconClasses,
  siteNavMoreTriggerClasses,
  siteNavNavigationRootClasses,
  siteNavRootFixedClasses,
  siteNavRootFlowClasses,
  siteNavRootInlineClasses,
  siteNavRootStickyClasses,
  siteNavSlotsClasses,
  siteNavStartClasses,
  siteNavTriggerClasses,
  siteNavTriggerIconClasses,
  siteNavTriggerLabelClasses,
  type SiteNavCompactLayout,
  type SiteNavPlacement,
  type SiteNavState,
} from "./siteNavStyles";
import { useSiteNavCollapse } from "./useSiteNavCollapse";

export type { SiteNavCompactLayout, SiteNavPlacement, SiteNavState } from "./siteNavStyles";
export {
  siteNavCompactLayouts,
  siteNavDefaultCollapseAt,
  siteNavDefaultCollapseRatio,
  siteNavExpandedHeightClasses,
  siteNavMenuReadRowClasses,
  siteNavMenuReadThumbClasses,
  siteNavPlacements,
  siteNavStates,
} from "./siteNavStyles";

/** Layout-only — placement or z-index adjustments; not for re-theming the bar. */
export type SiteNavLayoutClassName = string;

export interface SiteNavProps {
  /** Leading slot — **SiteNav.Brand** (logo + wordmark). */
  start?: ReactNode;
  /** Center slot — **SiteNav.Links** (links + mega menus). Hidden below `md` when `mobile` is set. */
  middle?: ReactNode;
  /** Trailing slot — login link + primary CTA (**Button** `size="sm"`). */
  end?: ReactNode;
  /**
   * Mobile menu body (below `md`) — rendered inside a **Sheet** opened from a **Menu** IconButton
   * appended to `end`. Compose **SiteNav.MobileLink** rows or a **NavList**.
   */
  mobile?: ReactNode;
  /** Sheet title for the mobile menu. Default: `"Menu"`. */
  mobileTitle?: ReactNode;
  /**
   * Scroll distance (px) that reveals the compact pill. Omit to use half the scrollport
   * height (`siteNavDefaultCollapseRatio` — 50% of the window or `scrollContainer`).
   */
  collapseAt?: number;
  /** Controlled state — overrides scroll detection (Storybook specimens, tests). */
  state?: SiteNavState;
  onStateChange?: (state: SiteNavState) => void;
  /** Compact (scrolled) pill width — `hug` (default, narrower) or `grid` (same as expanded `--grid-max`). */
  compactLayout?: SiteNavCompactLayout;
  /** Page chrome (`fixed`, default) or static specimen (`inline`). Pair `inline` + `scrollContainer` for scroll demos. */
  placement?: SiteNavPlacement;
  /** When set, compact pins sticky inside this scroller (page chrome) instead of `fixed` to the window. */
  scrollContainer?: RefObject<HTMLElement | null>;
  /** Accessible name for the `<header>`. Default: `"Site"`. */
  "aria-label"?: string;
  className?: SiteNavLayoutClassName;
}

interface SiteNavContextValue {
  state: SiteNavState;
  /** Mega-menu width/position anchor — the grid container (not the hug pill). */
  anchorRef: RefObject<HTMLDivElement | null>;
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
}

const SiteNavContext = createContext<SiteNavContextValue | null>(null);

function slotsLayoutClass(
  hasStart: boolean,
  hasMiddle: boolean,
  hasEnd: boolean,
  hugCluster: boolean,
): string {
  if (hasMiddle && (hasStart || hasEnd)) {
    return hugCluster ? siteNavSlotsClasses.threeHug : siteNavSlotsClasses.three;
  }
  if (hasMiddle) return siteNavSlotsClasses.middleOnly;
  if (hasStart && hasEnd) return siteNavSlotsClasses.ends;
  if (hasStart) return siteNavSlotsClasses.startOnly;
  return siteNavSlotsClasses.endOnly;
}

/**
 * Marketing site header — in-flow expanded band that scrolls away with the page. Once the
 * reader scrolls past half the viewport (or `collapseAt` px), a separate floating pill
 * pins 1rem from the top (`fixed` on the window, `sticky` inside a `scrollContainer`).
 *
 * Mental model: **page chrome** (`placement="fixed"`, optional `scrollContainer`) vs
 * **specimen** (`placement="inline"` without a scroller). Collapse ownership lives in
 * {@link useSiteNavCollapse}.
 */
/**
 * While the compact bar is pinned over the page, keep the focused element out from under it:
 * browsers honour `scroll-padding-top` when they scroll a newly focused element into view.
 */
function usePinnedScrollPadding(pinned: boolean, scrollContainer?: RefObject<HTMLElement | null>) {
  useEffect(() => {
    if (!pinned || typeof document === "undefined") return;
    const scroller = scrollContainer?.current ?? document.documentElement;
    const previous = scroller.style.scrollPaddingTop;
    scroller.style.scrollPaddingTop = "calc(var(--site-nav-height) + var(--spacing) * 4)";
    return () => {
      scroller.style.scrollPaddingTop = previous;
    };
  }, [pinned, scrollContainer]);
}

function SiteNavRoot({
  start,
  middle,
  end,
  mobile,
  mobileTitle = "Menu",
  collapseAt,
  state: controlledState,
  onStateChange,
  compactLayout = "hug",
  placement = "fixed",
  scrollContainer,
  "aria-label": ariaLabel = "Site",
  className,
}: SiteNavProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const shouldReduceMotion = useReducedMotion() ?? false;
  const { state, compact } = useSiteNavCollapse({
    collapseAt,
    scrollContainer,
    controlledState,
    placement,
    onStateChange,
  });
  const [mobileOpen, setMobileOpen] = useState(false);
  const mobileSheetId = useId();
  const [menuOpen, setMenuOpen] = useState(false);
  /** Compact hug is scroll-only — mega open must not change expanded chrome. */
  const hugCluster = compact && compactLayout === "hug";
  /** Slide + fade together — pixel `y` so the move stays readable; opacity feathers the edges. */
  const compactHidden = { y: -72, opacity: 0 } as const;
  const compactVisible = { y: 0, opacity: 1 } as const;
  const barTransition = shouldReduceMotion
    ? { duration: 0 }
    : { ...motionTransitionProp("medium"), type: "tween" as const };

  const hasScrollContainer = scrollContainer != null;
  /** Page / scroll-panel chrome: compact pins; expanded stays in normal document flow. */
  const isPageChrome = placement === "fixed" || hasScrollContainer;

  usePinnedScrollPadding(isPageChrome && compact, scrollContainer);

  const hasMobile = mobile != null;
  const hasStart = start != null;
  const hasMiddle = middle != null;
  const hasEnd = end != null || hasMobile;

  const mobileTrigger = hasMobile ? (
    <IconButton
      icon={<MenuIcon strokeWidth={2} />}
      aria-label={mobileOpen ? "Close menu" : "Open menu"}
      title=""
      size="sm"
      className={siteNavMobileTriggerClasses}
      aria-haspopup="dialog"
      aria-expanded={mobileOpen}
      /* The sheet only exists while open — never point at a missing id. */
      aria-controls={mobileOpen ? mobileSheetId : undefined}
      onClick={() => setMobileOpen((open) => !open)}
    />
  ) : null;

  function renderSlots(useHugCluster: boolean) {
    return (
      <div className={slotsLayoutClass(hasStart, hasMiddle, hasEnd, useHugCluster)}>
        {hasStart ? <div className={siteNavStartClasses}>{start}</div> : null}
        {hasMiddle ? (
          <div
            className={
              hasMobile
                ? useHugCluster
                  ? siteNavMiddleHugResponsiveClasses
                  : siteNavMiddleResponsiveClasses
                : useHugCluster
                  ? siteNavMiddleHugClasses
                  : siteNavMiddleClasses
            }
          >
            {middle}
          </div>
        ) : null}
        {hasEnd ? (
          <div className={siteNavEndClasses}>
            {end}
            {mobileTrigger}
          </div>
        ) : null}
      </div>
    );
  }

  const compactBarClassName = cn(
    siteNavBarBaseClasses,
    siteNavBarStateClasses.compact,
    siteNavBarCompactLayoutClasses[compactLayout],
  );

  const expandedBar = (
    <div
      data-state="expanded"
      className={cn(siteNavBarBaseClasses, siteNavBarStateClasses.expanded)}
    >
      {renderSlots(false)}
    </div>
  );

  const compactShell = (
    <div
      ref={containerRef}
      className={cn(siteNavContainerClasses, "px-[var(--grid-margin)]")}
    >
      <div data-state="compact" className={compactBarClassName}>
        {renderSlots(hugCluster)}
      </div>
    </div>
  );

  const compactMotionProps = {
    initial: shouldReduceMotion ? false : compactHidden,
    animate: compactVisible,
    exit: shouldReduceMotion ? compactVisible : compactHidden,
    transition: barTransition,
  };

  /** Page chrome: one AnimatePresence path; sticky pins inside a scroller, fixed pins to the window. */
  const pageCompactRootClass = hasScrollContainer
    ? cn(siteNavRootStickyClasses, "h-0 w-full overflow-visible")
    : siteNavRootFixedClasses;

  return (
    <SiteNavContext.Provider value={{ state, anchorRef: containerRef, menuOpen, setMenuOpen }}>
      {isPageChrome ? (
        <>
          <AnimatePresence>
            {compact ? (
              <motion.div
                key="site-nav-compact"
                {...compactMotionProps}
                className={cn(pageCompactRootClass, !hasScrollContainer && className)}
              >
                <header
                  aria-label={ariaLabel}
                  data-state="compact"
                  data-menu={menuOpen ? "open" : "closed"}
                  className={cn(hasScrollContainer && cn("w-full", className))}
                >
                  {compactShell}
                </header>
              </motion.div>
            ) : null}
          </AnimatePresence>

          {compact ? (
            <div className={cn(siteNavExpandedHeightClasses, "w-full")} aria-hidden />
          ) : null}

          {!compact ? (
            <header
              aria-label={ariaLabel}
              data-state="expanded"
              data-menu={menuOpen ? "open" : "closed"}
              className={cn(siteNavRootFlowClasses, className)}
            >
              <div ref={containerRef} className={siteNavContainerClasses}>
                {expandedBar}
              </div>
            </header>
          ) : null}
        </>
      ) : (
        <header
          aria-label={ariaLabel}
          data-state={state}
          data-menu={menuOpen ? "open" : "closed"}
          className={cn(siteNavRootInlineClasses, className)}
        >
          <div
            ref={containerRef}
            className={cn(siteNavContainerClasses, compact && "px-[var(--grid-margin)]")}
          >
            <AnimatePresence initial={false} mode="popLayout">
              {compact ? (
                <motion.div
                  key="compact"
                  initial={shouldReduceMotion ? false : compactHidden}
                  animate={compactVisible}
                  exit={shouldReduceMotion ? compactVisible : compactHidden}
                  transition={barTransition}
                  data-state="compact"
                  className={compactBarClassName}
                >
                  {renderSlots(true)}
                </motion.div>
              ) : (
                <div key="expanded">{expandedBar}</div>
              )}
            </AnimatePresence>
          </div>
        </header>
      )}

      {hasMobile ? (
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <Sheet.Content id={mobileSheetId} side="end" title={mobileTitle}>
            <div className={siteNavMobileListClasses}>{mobile}</div>
          </Sheet.Content>
        </Sheet>
      ) : null}
    </SiteNavContext.Provider>
  );
}

export interface SiteNavBrandProps {
  href: string;
  /**
   * Lucide mark for a circular **IconButton** brand. Prefer this over putting an
   * icon in `children`.
   */
  icon?: ReactElement;
  /** Wordmark text, or a Lucide icon when `icon` is omitted (still requires `aria-label`). */
  children?: ReactNode;
  /** Required when the brand is icon-only. */
  "aria-label"?: string;
}

/** Brand link — circular **IconButton** for marks, or ghost **Button** for wordmarks. */
function SiteNavBrand({ href, icon, children, "aria-label": ariaLabel }: SiteNavBrandProps) {
  const mark =
    icon ?? (isValidElement(children) && children.type !== undefined ? children : null);

  if (mark != null) {
    return (
      <IconButton
        icon={mark as ReactElement}
        aria-label={ariaLabel ?? "Home"}
        role="ghost"
        size="sm"
        title=""
        render={<a href={href} />}
        className={siteNavBrandClasses}
      />
    );
  }

  return (
    <Button
      role="ghost"
      size="sm"
      render={<a href={href} />}
      aria-label={ariaLabel}
      className={siteNavBrandClasses}
    >
      {children}
    </Button>
  );
}

export interface SiteNavLinksProps {
  children: ReactNode;
  /** Accessible name for the navigation region. Default: `"Primary"`. */
  "aria-label"?: string;
  /** Hover-open delay for mega menus (ms). Default: `100`. */
  delay?: number;
  /** Close delay after the pointer leaves (ms). Default: `150`. */
  closeDelay?: number;
}

type SiteNavChild = ReactElement<SiteNavLinkProps | SiteNavMenuProps>;

function toSiteNavChildren(children: ReactNode): SiteNavChild[] {
  return Children.toArray(children).filter(isValidElement) as SiteNavChild[];
}

function siteNavItemId(item: SiteNavChild): string {
  const props = item.props as SiteNavLinkProps & SiteNavMenuProps;
  if (typeof props.value === "string" && props.value.length > 0) return props.value;
  if (typeof props.href === "string") return props.href;
  if (typeof props.label === "string") return props.label;
  return "item";
}

function siteNavItemLabel(item: SiteNavChild): ReactNode {
  const props = item.props as SiteNavLinkProps & SiteNavMenuProps;
  return props.label ?? props.children;
}

function siteNavItemIsMenu(item: SiteNavChild): boolean {
  return "label" in item.props && !("href" in item.props);
}

function siteNavCurrentId(items: SiteNavChild[]): string {
  for (const item of items) {
    const props = item.props as SiteNavLinkProps;
    if (props.current) return siteNavItemId(item);
  }
  return items[0] != null ? siteNavItemId(items[0]) : "";
}

/**
 * Primary link cluster — NavigationMenu + Tab-style More when items overflow.
 * Overflow math is shared ({@link resolveTabOverflow}); More UI stays here so mega flatten
 * and NavigationMenu triggers stay local (full shared More track deferred).
 */
function SiteNavLinks({
  children,
  "aria-label": ariaLabel = "Primary",
  delay = 100,
  closeDelay = 150,
}: SiteNavLinksProps) {
  const context = useContext(SiteNavContext);

  const items = useMemo(() => toSiteNavChildren(children), [children]);
  const itemsById = new Map(items.map((item) => [siteNavItemId(item), item]));
  const pick = (ids: readonly string[]) => ids.flatMap((id) => itemsById.get(id) ?? []);
  const rowsFor = (ids: readonly string[]) => pick(ids).flatMap(overflowRows);

  const overflow = useOverflowMenu({
    ids: items.map(siteNavItemId),
    activeId: siteNavCurrentId(items),
    toMenuRows: (ids) => rowsFor(ids).map((row) => ({ label: textOf(row.label), disabled: row.href == null })),
  });
  const { menu } = overflow;
  const visibleItems = pick(overflow.visibleIds);
  const menuRows = rowsFor(overflow.overflowIds);

  function overflowRows(item: SiteNavChild): Array<{
    id: string;
    label: ReactNode;
    href?: string;
    current?: boolean;
  }> {
    if (!siteNavItemIsMenu(item)) {
      const props = item.props as SiteNavLinkProps;
      return [
        {
          id: siteNavItemId(item),
          label: props.children,
          href: props.href,
          current: props.current,
        },
      ];
    }

    const rows: Array<{ id: string; label: ReactNode; href?: string; current?: boolean }> = [];
    function walk(node: ReactNode) {
      Children.forEach(node, (child) => {
        if (!isValidElement(child)) return;
        const childProps = child.props as { href?: string; children?: ReactNode; label?: ReactNode };
        if (typeof childProps.href === "string" && childProps.label == null) {
          rows.push({
            id: childProps.href,
            label: childProps.children,
            href: childProps.href,
          });
          return;
        }
        if (childProps.children != null) walk(childProps.children);
      });
    }
    walk((item.props as SiteNavMenuProps).children);
    if (rows.length === 0) {
      rows.push({ id: siteNavItemId(item), label: siteNavItemLabel(item) });
    }
    return rows;
  }

  return (
    <div {...overflow.rowProps} className={siteNavLinksRootClasses}>
      <NavigationMenu.Root
        aria-label={ariaLabel}
        delay={delay}
        closeDelay={closeDelay}
        className={siteNavNavigationRootClasses}
        onValueChange={(value) => context?.setMenuOpen(value != null)}
      >
        <NavigationMenu.List className={siteNavLinkListClasses}>{visibleItems}</NavigationMenu.List>
        <NavigationMenu.Portal>
          <NavigationMenu.Backdrop className={siteNavMenuBackdropClasses} />
          <NavigationMenu.Positioner
            anchor={context?.anchorRef}
            positionMethod="fixed"
            side="bottom"
            align="center"
            sideOffset={siteNavMenuSideOffsetPx}
            collisionPadding={8}
            className={siteNavMenuPositionerClasses}
          >
            <NavigationMenu.Popup className={siteNavMenuPopupClasses}>
              <NavigationMenu.Viewport className={siteNavMenuViewportClasses} />
            </NavigationMenu.Popup>
          </NavigationMenu.Positioner>
        </NavigationMenu.Portal>
      </NavigationMenu.Root>

      {overflow.overflowIds.length > 0 ? (
        <Button
          ref={overflow.moreRef}
          role="ghost"
          size="sm"
          aria-haspopup="menu"
          aria-expanded={menu.open}
          aria-controls={menu.triggerProps["aria-controls"]}
          data-state={menu.open ? "open" : "closed"}
          className={siteNavMoreTriggerClasses}
          onClick={menu.toggle}
        >
          <span className={siteNavTriggerLabelClasses}>
            More
            <span className={siteNavMoreIconClasses} data-state={menu.open ? "open" : "closed"}>
              <ChevronDown strokeWidth={2} aria-hidden />
            </span>
          </span>
        </Button>
      ) : null}

      <div className={siteNavMeasureRailClasses} aria-hidden>
        {items.map((item) => {
          const id = siteNavItemId(item);
          const label = siteNavItemLabel(item);
          const menu = siteNavItemIsMenu(item);
          return (
            <span
              key={id}
              ref={overflow.measureRef(id)}
              className={cn(
                siteNavMeasureItemClasses,
                menu ? siteNavTriggerClasses : siteNavLinkClasses,
              )}
            >
              {label}
              {menu ? <ChevronDown className="ml-1 size-3.5" strokeWidth={2} /> : null}
            </span>
          );
        })}
        <span
          ref={overflow.moreMeasureRef}
          className={cn(siteNavMoreTriggerClasses, siteNavMeasureMoreClasses)}
        >
          More
          <ChevronDown className="size-3.5" strokeWidth={2} />
        </span>
      </div>

      {menu.open && menu.menuStyle != null
        ? createPortal(
            <Dropdown.Menu {...menu.menuProps} role="menu" aria-label={`${ariaLabel} overflow`}>
              {menuRows.map((row, index) => (
                <li key={row.id} role="presentation">
                  {/* Real links: Cmd-click and middle-click open a new tab, as in the bar. */}
                  <Dropdown.Item
                    {...menu.rowProps(index)}
                    role="menuitem"
                    truncate={false}
                    selected={Boolean(row.current)}
                    disabled={row.href == null}
                    render={row.href != null ? <a href={row.href} aria-current={row.current ? "page" : undefined} /> : undefined}
                    onClick={() => menu.close()}
                  >
                    {row.label}
                  </Dropdown.Item>
                </li>
              ))}
            </Dropdown.Menu>,
            document.body,
          )
        : null}
    </div>
  );
}

export interface SiteNavLinkProps {
  href: string;
  children: ReactNode;
  /** Marks the current page — selected fill pill + `aria-current="page"`. */
  current?: boolean;
  /** Stable id for overflow measurement. Defaults to `href`. */
  value?: string;
}

/** One top-level link — ghost **Button** anchor inside the NavigationMenu list. */
function SiteNavLink({ href, children, current = false, value }: SiteNavLinkProps) {
  return (
    <NavigationMenu.Item value={value ?? href}>
      <NavigationMenu.Link
        href={href}
        active={current}
        aria-current={current ? "page" : undefined}
        render={
          <Button role="ghost" size="sm" render={<a />} className={siteNavLinkClasses}>
            {children}
          </Button>
        }
      />
    </NavigationMenu.Item>
  );
}

export interface SiteNavMenuProps {
  /** Trigger label (e.g. "Resources"). */
  label: ReactNode;
  /** Panel body — compose **SiteNav.MenuSection** columns. */
  children: ReactNode;
  /** Stable value for controlled NavigationMenu usage. Defaults to the label when it is a string. */
  value?: string;
}

/** Mega-menu item — ghost **Button** trigger with a flipping chevron and a portaled content panel. */
function SiteNavMenu({ label, children, value }: SiteNavMenuProps) {
  const itemValue = value ?? (typeof label === "string" ? label : undefined);

  return (
    <NavigationMenu.Item value={itemValue}>
      <NavigationMenu.Trigger
        render={
          <Button role="ghost" size="sm" className={siteNavTriggerClasses}>
            <span className={siteNavTriggerLabelClasses}>
              {label}
              <NavigationMenu.Icon className={siteNavTriggerIconClasses}>
                <ChevronDown strokeWidth={2} aria-hidden />
              </NavigationMenu.Icon>
            </span>
          </Button>
        }
      />
      <NavigationMenu.Content className={siteNavMenuContentClasses}>{children}</NavigationMenu.Content>
    </NavigationMenu.Item>
  );
}

export interface SiteNavMenuSectionProps {
  /** Column overline (e.g. "Featured", "Read", "Links"). */
  label?: ReactNode;
  /** Column width in grid tracks. Default: `1`. */
  span?: 1 | 2 | 3;
  children: ReactNode;
}

/** One mega-menu column — overline + stacked content (**Card**, **SiteNav.MenuLink** rows, copy). */
function SiteNavMenuSection({ label, span = 1, children }: SiteNavMenuSectionProps) {
  return (
    <section className={cn(siteNavMenuSectionClasses, siteNavMenuSectionSpanClasses[span])}>
      {label != null ? <h3 className={siteNavMenuSectionLabelClasses}>{label}</h3> : null}
      {children}
    </section>
  );
}

export interface SiteNavMenuLinkProps {
  href: string;
  children: ReactNode;
  /** Leading Lucide glyph. */
  icon?: ReactElement;
  /** Opens in a new tab with the external-destination indicator. */
  external?: boolean;
  size?: Extract<ButtonSize, "xs" | "sm">;
}

/** Quiet link row inside a menu section — ghost **Button** anchor that closes the menu on click. */
function SiteNavMenuLink({ href, children, icon, external = false, size = "sm" }: SiteNavMenuLinkProps) {
  return (
    <NavigationMenu.Link
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      render={
        <Button
          role="ghost"
          size={size}
          render={<a />}
          className={siteNavMenuLinkClasses}
          icon={icon}
        >
          {children}
          {external ? <span className="sr-only"> (opens in a new tab)</span> : null}
        </Button>
      }
    />
  );
}

/** Two-column grid of **SiteNav.MenuLink** rows. */
function SiteNavMenuLinkGrid({ children }: { children: ReactNode }) {
  return <div className={siteNavMenuLinkGridClasses}>{children}</div>;
}

export interface SiteNavMenuMediaProps {
  /** Spoken name for the placeholder / image. */
  label: string;
  /** `featured` = wide band; `thumb` = responsive read-row media (default). */
  variant?: "featured" | "thumb";
  className?: string;
}

/** Quiet media well for mega Featured / Read — owns Card occupant + responsive thumb recipes. */
function SiteNavMenuMedia({
  label,
  variant = "thumb",
  className,
}: SiteNavMenuMediaProps) {
  return (
    <div
      role="img"
      aria-label={label}
      className={cn(
        cardLayoutBodyOccupantWellClasses,
        cardLayoutBodyOccupantRadiusClasses,
        variant === "featured" ? "aspect-[16/10] w-full" : siteNavMenuReadThumbClasses,
        className,
      )}
    />
  );
}

export interface SiteNavFeaturedProps {
  media: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  href: string;
  linkLabel?: ReactNode;
}

/** Featured mega column body — media + heading + copy + **TextLink** (no **Card**). */
function SiteNavFeatured({
  media,
  title,
  description,
  href,
  linkLabel = "Read now",
}: SiteNavFeaturedProps) {
  return (
    <div className="flex flex-col gap-1 type-body">
      {media}
      <h2 className="type-heading-2 text-fg">{title}</h2>
      {description != null ? <p className="text-muted">{description}</p> : null}
      <TextLink href={href}>{linkLabel}</TextLink>
    </div>
  );
}

export interface SiteNavReadRowProps {
  media: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  href: string;
  linkLabel?: ReactNode;
}

/** Read mega row — stacks media → copy below `md`; thumb beside copy from `md` up. */
function SiteNavReadRow({
  media,
  title,
  description,
  href,
  linkLabel = "Read now",
}: SiteNavReadRowProps) {
  return (
    <div className={siteNavMenuReadRowClasses}>
      {media}
      <div className="flex min-w-0 flex-col gap-1 type-body">
        <h3 className="type-heading-3 text-fg">{title}</h3>
        {description != null ? <p className="text-muted">{description}</p> : null}
        <TextLink href={href}>{linkLabel}</TextLink>
      </div>
    </div>
  );
}

export interface SiteNavMobileLinkProps {
  href: string;
  children: ReactNode;
  current?: boolean;
}

/** Full-width link row for the mobile **Sheet** — **Button** `layout="nav"` chrome on an anchor. */
function SiteNavMobileLink({ href, children, current = false }: SiteNavMobileLinkProps) {
  return (
    <Button
      role="ghost"
      size="md"
      render={<a href={href} />}
      aria-current={current ? "page" : undefined}
      className={siteNavMobileLinkClasses}
    >
      {children}
    </Button>
  );
}

export const SiteNav = Object.assign(SiteNavRoot, {
  Brand: SiteNavBrand,
  Links: SiteNavLinks,
  Link: SiteNavLink,
  Menu: SiteNavMenu,
  MenuSection: SiteNavMenuSection,
  MenuLink: SiteNavMenuLink,
  MenuLinkGrid: SiteNavMenuLinkGrid,
  MenuMedia: SiteNavMenuMedia,
  Featured: SiteNavFeatured,
  ReadRow: SiteNavReadRow,
  MobileLink: SiteNavMobileLink,
});
