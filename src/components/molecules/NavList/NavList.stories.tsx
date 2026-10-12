import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import {
  Bell,
  CreditCard,
  Home,
  Key,
  ListFilter,
  Menu,
  Package,
  Plane,
  Plug,
  Rocket,
  Shield,
  SlidersHorizontal,
  SunMoon,
  User,
  Users,
  Utensils,
} from "lucide-react";
import { Button } from "../../atoms/Button/Button";
import { ButtonIcon } from "../../atoms/Button/ButtonIcon";
import { IconButton } from "../../atoms/IconButton/IconButton";
import { Status } from "../../atoms/Status/Status";
import { PageHeader } from "../PageHeader/PageHeader";
import { Search } from "../Search/Search";
import { Sheet } from "../../organisms/Sheet/Sheet";
import { NavList, type NavListSectionDef } from "./NavList";
import { storyCopySource, storyMetaDocsDefaults, withStoryCopySource } from "../../../lib/storyCopySource";

const settingsSections = [
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

const meta = {
  title: "Components/NavList",
  component: NavList,
  tags: ["autodocs"],
  ...storyMetaDocsDefaults(),
  parameters: {
    wmdsLayout: "padded",
    docs: {
      description: {
        component: `
## Usage

Sectioned **secondary navigation** — inset pills on \`bg-body\` gutter with optional Lucide icons and trailing counts. Not primary app navigation and not **SegmentedControl** (mutually exclusive segments).

| Pattern | API |
|---------|-----|
| **Side nav** | \`sections\` + \`activeId\` + \`onSelect\` — first section label defaults to \`labelAlign="brand"\` (56px band) |
| **Link row** | \`href\` or \`render={<Link href />}\` — the row is an anchor. \`trailing\` is a **Status** dot or a **Badge** \`status\` pill |
| **Section action** | \`action\` — **IconButton** for filter or more |
| **App sidebar** | Brand, **Search**, sections, a footer slot, and **Sheet** \`side="start"\` below \`lg\` |
| **Compound** | **NavList.Section** + **NavList.Item** — custom order and mixed label bands |
| **Row chrome** | **Button** \`layout="nav"\` — selected inset pill; \`render\` makes the row a link |

## Anatomy

\`\`\`
NavList (nav)
└── NavList.Section
    ├── label? (overline — brand band | section pad)
    └── NavList.Item × n
        ├── label row — overline + action?
        └── Button layout="nav" (button, or an anchor via href / render)
            ├── ButtonIcon + Lucide?
            ├── label
            └── count? + trailing?
\`\`\`

## Best practices

- **Do** use \`labelAlign="brand"\` when a first section must align with an adjacent 56px page-header band.
- **Do** pass \`href\` (or \`render\` for the app router) so the row navigates without a client \`onSelect\` island.
- **Do** put a **Status** dot or a **Badge** \`status\` pill in \`trailing\`. Counts stay tabular.
- **Do** keep one \`activeId\` — instant swap; no Motion thumb on items.
- **Do** pass \`aria-label\` when the nav landmark needs more context than section labels.
- **Don't** hand-roll inset pill \`<button>\` rows — extend **Button** \`layout="nav"\` via **NavList**.
- **Don't** pass both \`href\` and \`render\`.
- **Don't** use for primary app destinations.
        `.trim(),
      },
    },
  },
} satisfies Meta<typeof NavList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SideNavSettings: Story = {
  name: "Pattern — side nav (settings)",
  render: function SideNavSettingsDemo() {
    return (
      <div className="h-[420px] w-52 rounded-2xl bg-body p-1">
        <NavList
          aria-label="Settings"
          sections={settingsSections}
          activeId="profile"
          onSelect={() => undefined}
        />
      </div>
    );
  },
  parameters: storyCopySource(`
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
`),
};

const appSidebarCopySource = `
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
      <div className="hidden h-full lg:block">
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
        <div className="hidden px-4 py-6 lg:block">
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
`;

export const AppSidebar: Story = {
  name: "Pattern — app sidebar",
  parameters: withStoryCopySource(
    {
      wmdsLayout: "fullscreen",
      docs: {
        description: {
          story:
            "Grouped tasks with link rows, a trailing status dot, and a section filter. Below lg the same nav opens in a start Sheet from the page header. The footer slot is where the theme control sits.",
        },
      },
    },
    appSidebarCopySource,
  ),
  render: function AppSidebarRender() {
    const [open, setOpen] = useState(false);
    const [activeId, setActiveId] = useState("ikea");
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

    function SidebarBody() {
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
            <NavList aria-label="Tasks" sections={sections} activeId={activeId} onSelect={setActiveId} />
          </div>
          <div className="mt-auto px-2 py-2">
            <Button role="ghost" size="sm" align="start" className="w-full" icon={<SunMoon strokeWidth={2} />}>
              Appearance
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className="flex h-full min-h-0 w-full flex-col bg-body lg:flex-row">
        <div className="hidden h-full lg:block">
          <SidebarBody />
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
          <div className="hidden px-4 py-6 lg:block">
            <PageHeader variant="page" title="Overview" />
          </div>
        </div>
        <Sheet open={open} onOpenChange={setOpen}>
          <Sheet.Content side="start" title="Menu">
            <SidebarBody />
          </Sheet.Content>
        </Sheet>
      </div>
    );
  },
};

export const CompoundSections: Story = {
  name: "Pattern — compound sections",
  render: () => (
    <div className="h-64 w-52 bg-body">
      <NavList aria-label="Workspace" activeId="general" onSelect={() => undefined}>
        <NavList.Section label="Workspace" labelAlign="brand">
          <NavList.Item
            id="general"
            label="General"
            icon={<SlidersHorizontal strokeWidth={1.75} />}
          />
          <NavList.Item id="members" label="Members" icon={<Users strokeWidth={1.75} />} count={8} />
        </NavList.Section>
      </NavList>
    </div>
  ),
};
