import type { ReactNode } from "react";
import { cn } from "../../lib/cn";
import { AppCanvas } from "./AppCanvas";
import {
  appCanvasBodyClasses,
  appCanvasHostClasses,
  appShellMobileRootClasses,
} from "./appShellStyles";
import { MobileNavDock, type MobileNavDockItem } from "./MobileNavDock";
import { MobileSecondaryNav } from "./MobileSecondaryNav";
import { appShellMobileBodyPadBottomClasses } from "./mobileNavDockStyles";
import type { AppShellSecondaryNavConfig } from "./AppShellLayout";

export interface AppShellMobileLayoutProps {
  /** App-level page header — stays above compact secondary navigation. */
  header?: ReactNode;
  children: ReactNode;
  activePrimaryId: string;
  onPrimaryChange: (id: string) => void;
  items: MobileNavDockItem[];
  footerItems?: MobileNavDockItem[];
  secondaryNav?: AppShellSecondaryNavConfig | null;
}

/**
 * Mobile application shell — full-width canvas + expandable bottom **MobileNavDock**.
 * Secondary navigation becomes compact grouped segments; page content remains visible.
 */
export function AppShellMobileLayout({
  header,
  children,
  activePrimaryId,
  onPrimaryChange,
  items,
  footerItems,
  secondaryNav = null,
}: AppShellMobileLayoutProps) {
  return (
    <div className={appShellMobileRootClasses}>
      <div className={cn(appCanvasHostClasses(false), "min-h-0 flex-1 rounded-none border-0 shadow-none")}>
        <AppCanvas>
          {header}
          {secondaryNav != null ? (
            <MobileSecondaryNav
              sections={secondaryNav.sections}
              activeId={secondaryNav.activeId}
              onSelect={secondaryNav.onSelect}
            />
          ) : null}
          <div className={cn(appCanvasBodyClasses, appShellMobileBodyPadBottomClasses)}>{children}</div>
        </AppCanvas>
      </div>

      <MobileNavDock
        items={items}
        footerItems={footerItems}
        activeId={activePrimaryId}
        onSelect={onPrimaryChange}
      />
    </div>
  );
}
