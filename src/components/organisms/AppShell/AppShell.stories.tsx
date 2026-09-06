import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Bell, Home, Settings, Shield, User } from "lucide-react";
import { PageHeader } from "../../molecules/PageHeader/PageHeader";
import { lockedViewportStory } from "../../../lib/viewports";
import { storyCopySource, storyMetaDocsDefaults } from "../../../lib/storyCopySource";
import { AppShell, type AppShellNavItem } from "./AppShell";

const primaryItems: AppShellNavItem[] = [
  { id: "home", label: "Home", icon: <Home /> },
  { id: "settings", label: "Settings", icon: <Settings /> },
];

const settingsSections = [
  {
    label: "Account",
    items: [
      { id: "profile", label: "Profile", icon: <User /> },
      { id: "notifications", label: "Notifications", icon: <Bell /> },
      { id: "security", label: "Security", icon: <Shield /> },
    ],
  },
];

const meta = {
  title: "Organisms/AppShell",
  component: AppShell,
  tags: ["autodocs"],
  ...storyMetaDocsDefaults(),
  parameters: {
    wmdsLayout: "fullscreen",
    docs: {
      description: {
        component: `
## Usage

**AppShell** is the exported application-chrome contract. It composes primary **NavRail**, optional secondary **NavList**, and the inset canvas. **AppShell.Mobile** maps the same navigation data to an expandable bottom dock and responsive **Tab** row.

Use **AppShell.Body** below **PageHeader** for the scrollable page region. Pass route state through \`activeId\` / \`onSelect\`; the shell does not own routing.

## Anatomy

\`\`\`
AppShell
├── NavRail
├── NavList? + drag-to-cover handle
└── canvas
    ├── PageHeader
    └── AppShell.Body

AppShell.Mobile
├── PageHeader?
├── Tab.Group?
├── page content
└── expandable primary-nav dock
\`\`\`

## Best practices

- **Do** use the same item IDs as application routes.
- **Do** omit \`secondaryNav\` for destinations without section navigation.
- **Do** choose desktop or mobile composition at the app breakpoint.
- **Don't** put page-specific state or content definitions inside the shell.
        `.trim(),
      },
    },
  },
} satisfies Meta<typeof AppShell>;

export default meta;
type Story = StoryObj<typeof meta>;

function DesktopExample() {
  const [primaryId, setPrimaryId] = useState("home");
  const [sectionId, setSectionId] = useState("profile");
  const secondaryNav =
    primaryId === "settings"
      ? {
          sections: settingsSections,
          activeId: sectionId,
          onSelect: setSectionId,
          "aria-label": "Settings pages",
        }
      : null;

  return (
    <AppShell
      items={primaryItems}
      activeId={primaryId}
      onSelect={setPrimaryId}
      secondaryNav={secondaryNav}
    >
      <PageHeader variant="app" title={primaryId === "settings" ? "Settings" : "Home"} />
      <AppShell.Body>
        <p className="text-fg">
          {primaryId === "settings" ? `Settings: ${sectionId}` : "Home content"}
        </p>
      </AppShell.Body>
    </AppShell>
  );
}

export const DesktopNavigation: Story = {
  name: "Pattern — desktop navigation",
  render: () => <DesktopExample />,
  globals: lockedViewportStory("desktop").globals,
  parameters: {
    ...lockedViewportStory("desktop").parameters,
    ...storyCopySource(`
import { useState } from "react";
import { Home, Settings } from "lucide-react";
import { AppShell, PageHeader } from "@whatmatters/wmds";

export function ApplicationFrame() {
  const [activeId, setActiveId] = useState("home");

  return (
    <AppShell
      items={[
        { id: "home", label: "Home", icon: <Home /> },
        { id: "settings", label: "Settings", icon: <Settings /> },
      ]}
      activeId={activeId}
      onSelect={setActiveId}
    >
      <PageHeader variant="app" title="Home" />
      <AppShell.Body>{/* route content */}</AppShell.Body>
    </AppShell>
  );
}
`),
  },
};

function MobileExample() {
  const [primaryId, setPrimaryId] = useState("settings");
  const [sectionId, setSectionId] = useState("profile");

  return (
    <AppShell.Mobile
      items={primaryItems}
      activeId={primaryId}
      onSelect={setPrimaryId}
      header={<PageHeader variant="app" title="Settings" />}
      secondaryNav={{
        sections: settingsSections,
        activeId: sectionId,
        onSelect: setSectionId,
        "aria-label": "Settings pages",
      }}
    >
      <p className="text-fg">Settings: {sectionId}</p>
    </AppShell.Mobile>
  );
}

export const MobileNavigation: Story = {
  name: "Pattern — mobile navigation",
  render: () => <MobileExample />,
  globals: lockedViewportStory("mobile").globals,
  parameters: {
    ...lockedViewportStory("mobile").parameters,
    ...storyCopySource(`
import { AppShell, PageHeader } from "@whatmatters/wmds";

<AppShell.Mobile
  items={primaryItems}
  activeId={primaryId}
  onSelect={setPrimaryId}
  header={<PageHeader variant="app" title="Settings" />}
  secondaryNav={settingsNavigation}
>
  {/* route content */}
</AppShell.Mobile>
`),
  },
};
