import { NavigationMenu } from "@base-ui/react/navigation-menu";
import { ChevronDown, Menu as MenuIcon } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  Children,
  createContext,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
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
import { measureDropdownMenuStyle } from "../../molecules/Dropdown/dropdownMenuPosition";
import { resolveTabOverflow } from "../Tab/tabOverflow";
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

  const hasMobile = mobile != null;
  const hasStart = start != null;
  const hasMiddle = middle != null;
  const hasEnd = end != null || hasMobile;

  const mobileTrigger = hasMobile ? (
    <IconButton
      icon={<MenuIcon strokeWidth={2} />}
      aria-label="Open menu"
      title=""
      size="sm"
      className={siteNavMobileTriggerClasses}
      aria-expanded={mobileOpen}
      onClick={() => setMobileOpen(true)}
    />
  ) : null;

  function renderSlots(useHugCluster: boolean) {
    return (
      <div className={slotsLayoutClass(hasStart, hasMiddle, hasEnd, useHugCluster)}>
        {hasStart ? <div className={siteNavStartClasses}>{start}</div> : null}
        {hasMiddle ? (
          <div
            className={cn(
              useHugCluster ? siteNavMiddleHugClasses : siteNavMiddleClasses,
              hasMobile && siteNavMiddleResponsiveClasses,
            )}
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
          <Sheet.Content side="end" title={mobileTitle}>
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
  const menuId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const moreRef = useRef<HTMLButtonElement>(null);
  const measureMoreRef = useRef<HTMLSpanElement>(null);
  const measureRefs = useRef(new Map<string, HTMLSpanElement>());

  const items = useMemo(() => toSiteNavChildren(children), [children]);
  const ids = items.map(siteNavItemId);
  const activeId = siteNavCurrentId(items);

  const [visibleIds, setVisibleIds] = useState(ids);
  const [overflowIds, setOverflowIds] = useState<string[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuStyle, setMenuStyle] = useState<CSSProperties | null>(null);
  const [menuActiveIndex, setMenuActiveIndex] = useState(0);

  const recalculate = useCallback(() => {
    const root = rootRef.current;
    const more = measureMoreRef.current;
    if (root == null || more == null) return;

    const measured = items.map((item) => ({
      value: siteNavItemId(item),
      width: Math.ceil(
        measureRefs.current.get(siteNavItemId(item))?.getBoundingClientRect().width ?? 0,
      ),
    }));
    if (measured.some((item) => item.width === 0)) return;

    const result = resolveTabOverflow(
      measured,
      activeId,
      root.clientWidth,
      Math.ceil(more.getBoundingClientRect().width),
    );
    setVisibleIds(result.visibleValues);
    setOverflowIds(result.overflowValues);
    if (result.overflowValues.length === 0) {
      setMenuOpen(false);
      setMenuStyle(null);
    }
  }, [activeId, items]);

  useLayoutEffect(() => {
    recalculate();
    const root = rootRef.current;
    if (root == null) return undefined;
    const observer = new ResizeObserver(recalculate);
    observer.observe(root);
    void document.fonts?.ready.then(recalculate);
    return () => observer.disconnect();
  }, [recalculate]);

  const visibleSet = new Set(visibleIds);
  const overflowSet = new Set(overflowIds);
  const visibleItems = items.filter((item) => visibleSet.has(siteNavItemId(item)));
  const overflowItems = items.filter((item) => overflowSet.has(siteNavItemId(item)));

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
    setMenuStyle(null);
  }, []);

  const openMenu = useCallback(() => {
    const trigger = moreRef.current;
    if (trigger == null) return;
    const rows = overflowItems.flatMap(overflowRows);
    setMenuStyle(
      measureDropdownMenuStyle(
        trigger,
        rows.map((row) => ({ label: String(row.label ?? "") })),
        {
          align: "end",
          widthMode: "content",
        },
      ),
    );
    setMenuActiveIndex(0);
    setMenuOpen(true);
  }, [overflowItems]);

  useEffect(() => {
    if (!menuOpen) return undefined;

    function handlePointerDown(event: MouseEvent) {
      const target = event.target as Node;
      if (rootRef.current?.contains(target)) return;
      const menu = document.getElementById(menuId);
      if (menu?.contains(target)) return;
      closeMenu();
    }

    function handleEscape(event: globalThis.KeyboardEvent) {
      if (event.key === "Escape") {
        closeMenu();
        moreRef.current?.focus();
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);
    window.addEventListener("resize", closeMenu);
    window.addEventListener("scroll", closeMenu, true);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
      window.removeEventListener("resize", closeMenu);
      window.removeEventListener("scroll", closeMenu, true);
    };
  }, [closeMenu, menuOpen]);

  function handleMoreKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    const rows = overflowItems.flatMap(overflowRows);
    if (rows.length === 0) return;
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (!menuOpen) {
        openMenu();
        setMenuActiveIndex(event.key === "ArrowDown" ? 0 : Math.max(rows.length - 1, 0));
        return;
      }
      const delta = event.key === "ArrowDown" ? 1 : -1;
      setMenuActiveIndex((current) => (current + delta + rows.length) % rows.length);
    }
    if ((event.key === "Enter" || event.key === " ") && menuOpen) {
      event.preventDefault();
      const rows = overflowItems.flatMap(overflowRows);
      const row = rows[menuActiveIndex];
      if (row != null) activateOverflowHref(row.href);
    }
  }

  function activateOverflowHref(href: string | undefined) {
    closeMenu();
    if (href != null && href.length > 0) {
      window.location.assign(href);
    }
  }

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
    <div ref={rootRef} className={siteNavLinksRootClasses}>
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

      {overflowItems.length > 0 ? (
        <Button
          ref={moreRef}
          role="ghost"
          size="sm"
          aria-haspopup="menu"
          aria-expanded={menuOpen}
          aria-controls={menuOpen ? menuId : undefined}
          data-state={menuOpen ? "open" : "closed"}
          className={siteNavMoreTriggerClasses}
          onClick={() => (menuOpen ? closeMenu() : openMenu())}
          onKeyDown={handleMoreKeyDown}
        >
          <span className={siteNavTriggerLabelClasses}>
            More
            <span className={siteNavMoreIconClasses} data-state={menuOpen ? "open" : "closed"}>
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
              ref={(node) => {
                if (node == null) measureRefs.current.delete(id);
                else measureRefs.current.set(id, node);
              }}
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
          ref={measureMoreRef}
          className={cn(siteNavMoreTriggerClasses, siteNavMeasureMoreClasses)}
        >
          More
          <ChevronDown className="size-3.5" strokeWidth={2} />
        </span>
      </div>

      {menuOpen && menuStyle != null
        ? createPortal(
            <Dropdown.Menu
              id={menuId}
              role="menu"
              aria-label={`${ariaLabel} overflow`}
              style={menuStyle}
            >
              {overflowItems.flatMap(overflowRows).map((row, index) => (
                <li key={row.id} role="presentation">
                  <Dropdown.Item
                    role="menuitem"
                    tabIndex={-1}
                    truncate={false}
                    selected={Boolean(row.current)}
                    active={index === menuActiveIndex}
                    onMouseEnter={() => setMenuActiveIndex(index)}
                    onClick={() => activateOverflowHref(row.href)}
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
