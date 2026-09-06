import type { ReactElement, ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  BarChart3,
  Bell,
  CreditCard,
  Home,
  Key,
  Plug,
  Settings,
  Shield,
  SlidersHorizontal,
  User,
  Users,
} from "lucide-react";
import { cn } from "../../lib/cn";
import {
  motionPanelRevealFromStart,
  motionPanelRevealTransition,
} from "../../lib/motion";
import { AppCanvas } from "./AppCanvas";
import { AppCanvasDragHandle } from "./AppCanvasDragHandle";
import {
  appCanvasHostClasses,
  appShellRootClasses,
  appShellWorkspaceClasses,
  sideNavHostClasses,
} from "./appShellStyles";
import { NavList, type NavListSectionDef } from "../../components/molecules/NavList/NavList";
import { NavRail, type NavRailItem } from "../../components/organisms/NavRail/NavRail";
import { sideNavCoverOpacity, useSideNavReveal } from "./useSideNavReveal";

export const appShellPrimaryNavItems: NavRailItem[] = [
  { id: "overview", label: "Home", icon: <Home strokeWidth={1.75} /> },
  { id: "content", label: "Content", icon: <BarChart3 strokeWidth={1.75} /> },
  { id: "audience", label: "Audience", icon: <Users strokeWidth={1.75} /> },
];

export const appShellPrimaryFooterItems: NavRailItem[] = [
  { id: "settings", label: "Settings", icon: <Settings strokeWidth={1.75} /> },
];

/** Settings-only secondary nav — other primary destinations skip **NavList**. */
export const appShellSettingsSideNavSections: NavListSectionDef[] = [
  {
    label: "Account",
    items: [
      { id: "profile", label: "Profile", icon: <User strokeWidth={1.75} /> },
      { id: "notifications", label: "Notifications", icon: <Bell strokeWidth={1.75} /> },
      { id: "security", label: "Security", icon: <Shield strokeWidth={1.75} /> },
    ],
  },
  {
    label: "Workspace",
    items: [
      { id: "general", label: "General", icon: <SlidersHorizontal strokeWidth={1.75} /> },
      { id: "members", label: "Members", icon: <Users strokeWidth={1.75} />, count: 8 },
      { id: "billing", label: "Billing", icon: <CreditCard strokeWidth={1.75} /> },
    ],
  },
  {
    label: "Integrations",
    items: [
      { id: "connected", label: "Connected apps", icon: <Plug strokeWidth={1.75} /> },
      { id: "api", label: "API keys", icon: <Key strokeWidth={1.75} /> },
    ],
  },
];

export interface AppShellSecondaryNavConfig {
  sections: NavListSectionDef[];
  activeId: string;
  onSelect: (id: string) => void;
}

export interface AppShellLayoutProps {
  children: ReactNode;
  activePrimaryId: string;
  onPrimaryChange: (id: string) => void;
  /** When omitted, workspace is **NavRail** + **AppCanvas** only — no drag handle. */
  secondaryNav?: AppShellSecondaryNavConfig | null;
  brand?: ReactElement;
}

export function AppShellLayout({
  children,
  activePrimaryId,
  onPrimaryChange,
  secondaryNav = null,
  brand,
}: AppShellLayoutProps) {
  const hasSecondaryNav = secondaryNav != null;
  const { reveal, isDragging, isCollapsed, handleProps } = useSideNavReveal(
    undefined,
    hasSecondaryNav,
  );

  return (
    <div className={appShellRootClasses}>
      <NavRail
        brand={brand}
        items={appShellPrimaryNavItems}
        footerItems={appShellPrimaryFooterItems}
        activeId={activePrimaryId}
        onSelect={onPrimaryChange}
        itemSurface="glass"
      />

      <div className={appShellWorkspaceClasses}>
        <AnimatePresence initial={false} mode="popLayout">
          {hasSecondaryNav ? (
            <motion.div
              key="app-shell-secondary-nav"
              className={sideNavHostClasses(isDragging)}
              style={{ opacity: sideNavCoverOpacity(reveal) }}
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
              />
            </motion.div>
          ) : null}
        </AnimatePresence>

        <motion.div
          layout
          className={cn(appCanvasHostClasses(isDragging))}
          style={{
            ...(hasSecondaryNav ? { marginLeft: -reveal } : {}),
            borderRadius: "1rem",
          }}
          transition={motionPanelRevealTransition()}
        >
          <AppCanvas>
            {hasSecondaryNav ? (
              <AppCanvasDragHandle
                reveal={reveal}
                isDragging={isDragging}
                isCollapsed={isCollapsed}
                {...handleProps}
              />
            ) : null}
            {children}
          </AppCanvas>
        </motion.div>
      </div>
    </div>
  );
}

/** Primary ids that mount a secondary **SideNav** in the example shell. */
export const appShellPrimaryIdsWithSecondaryNav = ["settings"] as const;

export function appShellHasSecondaryNav(primaryId: string) {
  return (appShellPrimaryIdsWithSecondaryNav as readonly string[]).includes(primaryId);
}
