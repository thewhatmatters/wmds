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
import type {
  AppShellNavItem,
  AppShellSecondaryNavConfig,
} from "../../components/organisms/AppShell/AppShell";

export const appShellPrimaryNavItems: AppShellNavItem[] = [
  { id: "overview", label: "Home", icon: <Home strokeWidth={1.75} /> },
  { id: "content", label: "Content", icon: <BarChart3 strokeWidth={1.75} /> },
  { id: "audience", label: "Audience", icon: <Users strokeWidth={1.75} /> },
];

export const appShellPrimaryFooterItems: AppShellNavItem[] = [
  { id: "settings", label: "Settings", icon: <Settings strokeWidth={1.75} /> },
];

export const appShellSettingsSideNavSections: AppShellSecondaryNavConfig["sections"] = [
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

export const appShellPrimaryIdsWithSecondaryNav = ["settings"] as const;

export function appShellHasSecondaryNav(primaryId: string) {
  return (appShellPrimaryIdsWithSecondaryNav as readonly string[]).includes(primaryId);
}
