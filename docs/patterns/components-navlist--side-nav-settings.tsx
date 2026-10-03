// @whatmatters/wmds@0.2.0 · Pattern — side nav (settings)
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
import { NavList } from "@whatmatters/wmds";

const sections = [
  {
    label: "Account",
    items: [
      { id: "profile", label: "Profile", icon: <User strokeWidth={1.75} /> },
      { id: "notifications", label: "Notifications", icon: <Bell strokeWidth={1.75} /> },
    ],
  },
  {
    label: "Workspace",
    items: [
      { id: "members", label: "Members", icon: <Users strokeWidth={1.75} />, count: 8 },
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
