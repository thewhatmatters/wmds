import type { ReactElement, ReactNode } from "react";
import { IconButton } from "../../atoms/IconButton/IconButton";
import { iconButtonSizeForCluster } from "../../../lib/clusterScale";
import { cn } from "../../../lib/cn";
import { NavRailBrandMark } from "./NavRailBrandMark";
import {
  navRailBrandBandClasses,
  navRailBrandClasses,
  navRailClusterTier,
  navRailFooterClasses,
  navRailIconScopeClasses,
  navRailItemActiveIndicatorClasses,
  navRailItemWrapClasses,
  navRailMainNavClasses,
  navRailShellClasses,
  navRailSlotClasses,
  type NavRailItemSurface,
} from "./navRailStyles";

export type { NavRailItemSurface } from "./navRailStyles";
export {
  navRailClusterTier,
  navRailItemStackGapClasses,
  navRailItemSurfaces,
} from "./navRailStyles";
export { NavRailBrandMark } from "./NavRailBrandMark";

/** Layout-only — margin beside workspace; shell width stays `w-14`. */
export type NavRailLayoutClassName = string;

export interface NavRailItem {
  id: string;
  label: string;
  icon: ReactElement;
}

export interface NavRailProps {
  items: NavRailItem[];
  activeId: string;
  onSelect: (id: string) => void;
  footerItems?: NavRailItem[];
  /** Custom mark — default sparkle; pass `null` to hide the brand band content. */
  brand?: ReactNode | null;
  /** Accessible name for the default brand mark slot. */
  brandLabel?: string;
  /** Item plate + hover chrome — `glass` (default) or flat `on-accent` fills. */
  itemSurface?: NavRailItemSurface;
  "aria-label"?: string;
  className?: NavRailLayoutClassName;
}

export function NavRail({
  items,
  activeId,
  onSelect,
  footerItems = [],
  brand,
  brandLabel = "WhatMatters",
  itemSurface = "glass",
  "aria-label": ariaLabel = "Primary",
  className,
}: NavRailProps) {
  function renderItem(item: NavRailItem) {
    const active = item.id === activeId;

    return (
      <div key={item.id} className={navRailItemWrapClasses}>
        {active ? (
          <span
            aria-hidden
            className={navRailItemActiveIndicatorClasses[itemSurface]}
          />
        ) : null}
        <IconButton
          icon={item.icon}
          aria-label={item.label}
          aria-current={active ? "page" : undefined}
          title={item.label}
          size={iconButtonSizeForCluster(navRailClusterTier)}
          role="ghost"
          onClick={() => onSelect(item.id)}
        />
      </div>
    );
  }

  return (
    <div className={cn(navRailSlotClasses, className)}>
      <nav
        aria-label={ariaLabel}
        className={cn(navRailShellClasses, navRailIconScopeClasses[itemSurface])}
      >
        {brand !== null ? (
          <div className={navRailBrandBandClasses}>
            <div className={navRailBrandClasses} aria-label={brandLabel}>
              {brand ?? <NavRailBrandMark />}
            </div>
          </div>
        ) : null}
        <div className={navRailMainNavClasses}>{items.map(renderItem)}</div>
        {footerItems.length > 0 ? (
          <div className={navRailFooterClasses}>{footerItems.map(renderItem)}</div>
        ) : null}
      </nav>
    </div>
  );
}
