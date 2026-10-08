// @thewhatmatters/wmds@0.4.7 · Pattern — side nav (settings)
// Storybook: Components/NavList → Pattern — side nav (settings) (?path=/story/components-navlist--side-nav-settings)
// Show code — copy verbatim and keep this header; upgrades find pasted patterns by it.

import {
  Bell,
  CreditCard,
  Key,
  Plug,
  Shield,
  SlidersHorizontal,
  User,
  Users,
} from "lucide-react";
import { NavList } from "@thewhatmatters/wmds";

const sections = [
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

export function SettingsSideNav({
  activeId,
  onSelect,
}: {
  activeId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <NavList
      aria-label="Settings"
      sections={sections}
      activeId={activeId}
      onSelect={onSelect}
    />
  );
}
