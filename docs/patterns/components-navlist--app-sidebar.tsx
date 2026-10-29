// @thewhatmatters/wmds@0.4.36 · Pattern — app sidebar
// Storybook: Components/NavList → Pattern — app sidebar (?path=/story/components-navlist--app-sidebar)
// Show code — copy verbatim and keep this header; upgrades find pasted patterns by it.

import { useState } from "react";
import { Home, ListFilter, Menu, Package, Plane, Rocket, SunMoon, Utensils } from "lucide-react";
import {
  Button,
  ButtonIcon,
  IconButton,
  NavList,
  PageHeader,
  Search,
  Sheet,
  Status,
  type NavListSectionDef,
} from "@thewhatmatters/wmds";

const sections: NavListSectionDef[] = [
  {
    label: "Pinned",
    labelAlign: "section",
    action: (
      <IconButton role="ghost" size="xs" aria-label="Filter pinned" icon={<ListFilter strokeWidth={2} />} />
    ),
    items: [
      { id: "melbourne", label: "Weekend in Melbourne", href: "/tasks/melbourne", icon: <Plane strokeWidth={1.75} /> },
      {
        id: "apartment",
        label: "Find a new apartment",
        href: "/tasks/apartment",
        icon: <Home strokeWidth={1.75} />,
        trailing: <Status variant="dot" tone="warning" label="Unread" />,
      },
      { id: "dinner", label: "Plan team dinner", href: "/tasks/dinner", icon: <Utensils strokeWidth={1.75} /> },
    ],
  },
  {
    label: "Recent",
    labelAlign: "section",
    items: [
      {
        id: "ikea",
        label: "Track my IKEA order",
        href: "/tasks/ikea",
        icon: <Package strokeWidth={1.75} />,
        trailing: <Status variant="dot" tone="warning" label="Unread" pulsing />,
      },
    ],
  },
];

function SidebarBody({
  activeId,
  onSelect,
}: {
  activeId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="flex h-full min-h-0 w-52 flex-col bg-body">
      <div className="flex items-center gap-2 px-4 py-4">
        <span className="inline-flex size-7 items-center justify-center rounded-lg bg-brand-tint text-brand-outline">
          <ButtonIcon size="xs"><Rocket strokeWidth={2} /></ButtonIcon>
        </span>
        <span className="type-label text-fg">Orbit</span>
      </div>
      <div className="px-3 pb-2">
        <Search size="sm" actionLabel="Search" aria-label="Search tasks" placeholder="Search" />
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto">
        <NavList aria-label="Tasks" sections={sections} activeId={activeId} onSelect={onSelect} />
      </div>
      <div className="mt-auto px-2 py-2">
        <Button role="ghost" size="sm" align="start" className="w-full" icon={<SunMoon strokeWidth={2} />}>
          Appearance
        </Button>
      </div>
    </div>
  );
}

export function AppSidebar() {
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState("ikea");

  return (
    <div className="flex h-full min-h-0 w-full flex-col bg-body lg:flex-row">
      <div className="max-lg:hidden h-full lg:block">
        <SidebarBody activeId={activeId} onSelect={setActiveId} />
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <PageHeader
          variant="app"
          className="lg:hidden"
          title="Overview"
          start={
            <IconButton
              role="ghost"
              size="sm"
              aria-label="Open menu"
              icon={<Menu strokeWidth={2} />}
              onClick={() => setOpen(true)}
            />
          }
        />
        <div className="max-lg:hidden px-4 py-6 lg:block">
          <PageHeader variant="page" title="Overview" />
        </div>
      </div>
      <Sheet open={open} onOpenChange={setOpen}>
        <Sheet.Content side="start" title="Menu">
          <SidebarBody activeId={activeId} onSelect={setActiveId} />
        </Sheet.Content>
      </Sheet>
    </div>
  );
}
