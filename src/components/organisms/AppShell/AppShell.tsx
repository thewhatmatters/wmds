import {
  cloneElement,
  isValidElement,
  useEffect,
  useId,
  useMemo,
  useState,
  type ReactElement,
  type ReactNode,
  type SVGProps,
} from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronUp, X } from "lucide-react";
import { Button } from "../../atoms/Button/Button";
import { ButtonIcon } from "../../atoms/Button/ButtonIcon";
import { IconButton } from "../../atoms/IconButton/IconButton";
import { NavList, type NavListSectionDef } from "../../molecules/NavList/NavList";
import {
  navListItemCountClasses,
  navListItemIconClasses,
  navListItemLabelClasses,
} from "../../molecules/NavList/navListStyles";
import { Tab } from "../Tab/Tab";
import {
  NavRail,
  type NavRailItem,
  type NavRailItemSurface,
} from "../NavRail/NavRail";
import { iconButtonSizeForCluster } from "../../../lib/clusterScale";
import { cn } from "../../../lib/cn";
import {
  motionNavDockItemVariants,
  motionNavDockMenuVariants,
  motionPanelRevealFromStart,
  motionPanelRevealTransition,
  motionTransitionProp,
} from "../../../lib/motion";
import {
  appShellBodyClasses,
  appShellCanvasClasses,
  appShellCanvasHostClasses,
  appShellDragHandleBarClasses,
  appShellDragHandleClasses,
  appShellMobileBodyClasses,
  appShellMobileCanvasHostClasses,
  appShellMobileNavActiveButtonClasses,
  appShellMobileNavActiveIconClasses,
  appShellMobileNavActiveLabelClasses,
  appShellMobileNavClusterTier,
  appShellMobileNavDockClasses,
  appShellMobileNavHostClasses,
  appShellMobileNavMenuClasses,
  appShellMobileNavMenuItemClasses,
  appShellMobileNavScrimClasses,
  appShellMobileNavToggleClasses,
  appShellMobileRootClasses,
  appShellMobileSecondaryNavClasses,
  appShellRootClasses,
  appShellSecondaryNavHostClasses,
  appShellWorkspaceClasses,
} from "./appShellStyles";
import {
  appShellSecondaryNavOpacity,
  appShellSecondaryNavWidthPx,
  useAppShellSecondaryNavReveal,
} from "./useAppShellSecondaryNavReveal";

export {
  appShellBrandBandHeightClasses,
  appShellChromeInsetClasses,
} from "./appShellStyles";

export type AppShellLayoutClassName = string;

export interface AppShellNavItem extends Omit<NavRailItem, "icon"> {
  icon: ReactElement<SVGProps<SVGSVGElement>>;
  count?: number;
}

export interface AppShellSecondaryNavConfig {
  sections: NavListSectionDef[];
  activeId: string;
  onSelect: (id: string) => void;
  "aria-label"?: string;
}

export interface AppShellProps {
  children: ReactNode;
  items: AppShellNavItem[];
  activeId: string;
  onSelect: (id: string) => void;
  footerItems?: AppShellNavItem[];
  secondaryNav?: AppShellSecondaryNavConfig | null;
  brand?: ReactNode | null;
  brandLabel?: string;
  itemSurface?: NavRailItemSurface;
  "aria-label"?: string;
  className?: AppShellLayoutClassName;
}

export interface AppShellBodyProps {
  children: ReactNode;
  className?: AppShellLayoutClassName;
}

export interface AppShellMobileProps {
  children: ReactNode;
  header?: ReactNode;
  items: AppShellNavItem[];
  activeId: string;
  onSelect: (id: string) => void;
  footerItems?: AppShellNavItem[];
  secondaryNav?: AppShellSecondaryNavConfig | null;
  "aria-label"?: string;
  className?: AppShellLayoutClassName;
}

export function AppShellBody({ children, className }: AppShellBodyProps) {
  return <div className={cn(appShellBodyClasses, className)}>{children}</div>;
}

function AppShellCanvas({ children }: { children: ReactNode }) {
  return <div className={appShellCanvasClasses}>{children}</div>;
}

interface AppShellDragHandleProps {
  reveal: number;
  isDragging: boolean;
  isCollapsed: boolean;
  onPointerDown: React.PointerEventHandler<HTMLButtonElement>;
  onPointerMove: React.PointerEventHandler<HTMLButtonElement>;
  onPointerUp: React.PointerEventHandler<HTMLButtonElement>;
  onPointerCancel: React.PointerEventHandler<HTMLButtonElement>;
  onDoubleClick: React.MouseEventHandler<HTMLButtonElement>;
}

function AppShellDragHandle({
  reveal,
  isDragging,
  isCollapsed,
  ...eventProps
}: AppShellDragHandleProps) {
  return (
    <button
      type="button"
      data-app-shell-drag-handle=""
      className={cn(appShellDragHandleClasses, isDragging && "cursor-col-resize!")}
      style={{ cursor: "col-resize" }}
      aria-label={isCollapsed ? "Show section navigation" : "Hide section navigation"}
      aria-valuemin={0}
      aria-valuemax={appShellSecondaryNavWidthPx}
      aria-valuenow={Math.round(reveal)}
      aria-orientation="vertical"
      role="separator"
      {...eventProps}
    >
      <span aria-hidden className={appShellDragHandleBarClasses} />
    </button>
  );
}

function AppShellRoot({
  children,
  items,
  activeId,
  onSelect,
  footerItems = [],
  secondaryNav = null,
  brand,
  brandLabel,
  itemSurface = "glass",
  "aria-label": ariaLabel = "Primary",
  className,
}: AppShellProps) {
  const hasSecondaryNav = secondaryNav != null;
  const { reveal, isDragging, isCollapsed, handleProps } =
    useAppShellSecondaryNavReveal(undefined, hasSecondaryNav);

  return (
    <div className={cn(appShellRootClasses, className)}>
      <NavRail
        brand={brand}
        brandLabel={brandLabel}
        items={items}
        footerItems={footerItems}
        activeId={activeId}
        onSelect={onSelect}
        itemSurface={itemSurface}
        aria-label={ariaLabel}
      />

      <div className={appShellWorkspaceClasses}>
        <AnimatePresence initial={false} mode="popLayout">
          {secondaryNav ? (
            <motion.div
              key="app-shell-secondary-nav"
              className={appShellSecondaryNavHostClasses(isDragging)}
              style={{ opacity: appShellSecondaryNavOpacity(reveal) }}
              variants={motionPanelRevealFromStart}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={motionPanelRevealTransition()}
              aria-hidden={isCollapsed}
            >
              <NavList
                sections={secondaryNav.sections}
                activeId={secondaryNav.activeId}
                onSelect={secondaryNav.onSelect}
                aria-label={secondaryNav["aria-label"]}
              />
            </motion.div>
          ) : null}
        </AnimatePresence>

        <motion.div
          layout
          className={appShellCanvasHostClasses(isDragging)}
          style={{
            ...(hasSecondaryNav ? { marginLeft: -reveal } : {}),
            borderRadius: "1rem",
          }}
          transition={motionPanelRevealTransition()}
        >
          <AppShellCanvas>
            {hasSecondaryNav ? (
              <AppShellDragHandle
                reveal={reveal}
                isDragging={isDragging}
                isCollapsed={isCollapsed}
                {...handleProps}
              />
            ) : null}
            {children}
          </AppShellCanvas>
        </motion.div>
      </div>
    </div>
  );
}

function AppShellMobileNavIcon({
  icon,
  selected,
}: {
  icon: AppShellNavItem["icon"];
  selected: boolean;
}) {
  const glyph = isValidElement(icon)
    ? cloneElement(icon, {
        strokeWidth: selected ? 2.25 : 1.75,
        ...(selected ? { fill: "currentColor", fillOpacity: 0.12 } : { fill: "none" }),
      })
    : icon;

  return (
    <span className={cn("inline-flex shrink-0", navListItemIconClasses(selected))}>
      <ButtonIcon size="sm">{glyph}</ButtonIcon>
    </span>
  );
}

function AppShellMobileNav({
  items,
  footerItems = [],
  activeId,
  onSelect,
  "aria-label": ariaLabel = "Primary",
}: Pick<
  AppShellMobileProps,
  "items" | "footerItems" | "activeId" | "onSelect" | "aria-label"
>) {
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const allItems = useMemo(() => [...items, ...footerItems], [items, footerItems]);
  const activeItem = allItems.find((item) => item.id === activeId) ?? items[0];

  useEffect(() => {
    if (!open) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  if (!activeItem) return null;

  function handleSelect(id: string) {
    onSelect(id);
    setOpen(false);
  }

  return (
    <div className={appShellMobileNavHostClasses}>
      <AnimatePresence>
        {open ? (
          <motion.button
            key="app-shell-mobile-nav-scrim"
            type="button"
            aria-label="Close navigation menu"
            className={appShellMobileNavScrimClasses}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={motionTransitionProp("medium")}
            onClick={() => setOpen(false)}
          />
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {open ? (
          <motion.nav
            key="app-shell-mobile-nav-menu"
            id={menuId}
            aria-label={ariaLabel}
            className={appShellMobileNavMenuClasses}
            variants={motionNavDockMenuVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            {allItems.map((item) => {
              const selected = item.id === activeId;
              return (
                <motion.div
                  key={item.id}
                  variants={motionNavDockItemVariants}
                  className={appShellMobileNavMenuItemClasses}
                >
                  <Button
                    layout="nav"
                    type="button"
                    selected={selected}
                    onClick={() => handleSelect(item.id)}
                  >
                    <AppShellMobileNavIcon icon={item.icon} selected={selected} />
                    <span className={navListItemLabelClasses}>{item.label}</span>
                    {item.count != null ? (
                      <span className={navListItemCountClasses}>
                        {item.count.toLocaleString()}
                      </span>
                    ) : null}
                  </Button>
                </motion.div>
              );
            })}
          </motion.nav>
        ) : null}
      </AnimatePresence>

      <div className={appShellMobileNavDockClasses}>
        <Button
          layout="nav"
          type="button"
          className={appShellMobileNavActiveButtonClasses}
          onClick={() => setOpen(true)}
          aria-expanded={open}
          aria-controls={menuId}
        >
          <span className={appShellMobileNavActiveIconClasses}>
            <AppShellMobileNavIcon icon={activeItem.icon} selected />
          </span>
          <span className={appShellMobileNavActiveLabelClasses}>{activeItem.label}</span>
        </Button>

        <div className={appShellMobileNavToggleClasses}>
          <IconButton
            icon={open ? <X strokeWidth={2} /> : <ChevronUp strokeWidth={2} />}
            aria-label={open ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={open}
            aria-controls={menuId}
            size={iconButtonSizeForCluster(appShellMobileNavClusterTier)}
            role="secondary"
            onClick={() => setOpen((current) => !current)}
          />
        </div>
      </div>
    </div>
  );
}

export function AppShellMobile({
  children,
  header,
  items,
  activeId,
  onSelect,
  footerItems,
  secondaryNav = null,
  "aria-label": ariaLabel,
  className,
}: AppShellMobileProps) {
  const secondaryItems = secondaryNav?.sections.flatMap((section) => section.items) ?? [];

  return (
    <div className={cn(appShellMobileRootClasses, className)}>
      <div className={appShellMobileCanvasHostClasses}>
        <AppShellCanvas>
          {header}
          {secondaryNav ? (
            <div className={appShellMobileSecondaryNavClasses}>
              <Tab.Group
                aria-label={secondaryNav["aria-label"] ?? "Page sections"}
                value={secondaryNav.activeId}
                onValueChange={secondaryNav.onSelect}
                size="md"
              >
                {secondaryItems.map((item) => (
                  <Tab key={item.id} value={item.id} count={item.count}>
                    {item.label}
                  </Tab>
                ))}
              </Tab.Group>
            </div>
          ) : null}
          <div className={appShellMobileBodyClasses}>{children}</div>
        </AppShellCanvas>
      </div>

      <AppShellMobileNav
        items={items}
        footerItems={footerItems}
        activeId={activeId}
        onSelect={onSelect}
        aria-label={ariaLabel}
      />
    </div>
  );
}

export const AppShell = Object.assign(AppShellRoot, {
  Body: AppShellBody,
  Mobile: AppShellMobile,
});
