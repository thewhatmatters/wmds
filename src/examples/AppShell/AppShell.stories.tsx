import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { lockedViewportStory } from "../../lib/viewports";
import { storyCopySource, storyMetaDocsDefaults } from "../../lib/storyCopySource";
import { PageHeader } from "../../components/molecules/PageHeader/PageHeader";
import { AppCanvasBody } from "./AppCanvas";
import { AppShellHeaderAvatar } from "./AppShellHeaderAvatar";
import {
  appShellHasSecondaryNav,
  appShellPrimaryFooterItems,
  appShellPrimaryNavItems,
  appShellSettingsSideNavSections,
  AppShellLayout,
} from "./AppShellLayout";
import { AppShellMobileLayout } from "./AppShellMobileLayout";
import { CreatorInsightsPage } from "./CreatorInsightsPage";
import { SettingsPage } from "./SettingsPage";

const meta = {
  title: "Examples/App shell",
  tags: ["autodocs"],
  ...storyMetaDocsDefaults(),
  parameters: {
    wmdsLayout: "fullscreen",
    docs: {
      description: {
        component: `
## Usage

Desktop **application shell** — floating **NavRail** on a \`bg-body\` gutter with an inset **AppCanvas**.

Not every primary destination needs a secondary nav. Pass \`secondaryNav\` only when the active section has a section list (e.g. **Settings**). Home / insights routes omit it — workspace becomes **NavRail** + **AppCanvas** only; no drag handle. Toggling \`secondaryNav\` uses **Foundation → Motion** panel reveal (\`motionPanelRevealFromStart\`) — column slides in and the canvas eases aside.

| Layer | Role |
|-------|------|
| **NavRail** | Floating accent rail — **Organisms/NavRail** · \`itemSurface="glass"\` · static active plate |
| **NavList** | Optional secondary inset pills — icon + label; instant active swap |
| **AppCanvas** | \`surface\` sheet — drag handle only when **NavList** is mounted |
| **PageHeader** | \`variant="app"\` — 56px canvas band; same height as **NavRail** logo |
| **AppCanvasBody** | Scrollable flex column below the header — Tailwind page layout |

When **NavList** is present: drag the leading-edge pill left to cover it; labels fade with cover progress; release past halfway to snap. Double-click toggles.

Copy **Pattern — shell navigation (desktop)** — switch **Home** vs **Settings** in the rail to compare layouts.

## Anatomy

\`\`\`
AppShellLayout
├── NavRail
├── NavList?      — only when secondaryNav prop is set
└── AppCanvas
    ├── AppCanvasDragHandle? — only with NavList
    ├── PageHeader (\`variant="app"\`)? — canvas top band
    └── AppCanvasBody → Tailwind sections (e.g. **Stat.Group**)
\`\`\`

## Best practices

- **Do** omit \`secondaryNav\` for top-level panels that do not need a section list.
- **Do** reset drag reveal when unmounting **NavList** — \`useSideNavReveal(_, enabled)\` handles this.
- **Do** compose canvas pages in **AppCanvasBody** with Tailwind utilities (\`flex\`, \`grid\`, \`gap-*\`).
- **Don't** show a drag handle when there is nothing to cover.
        `.trim(),
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const primaryTitles: Record<string, string> = {
  overview: "Insights",
  content: "Content",
  audience: "Audience",
  settings: "Settings",
};

function InsightsCanvasHeader({ title }: { title: string }) {
  return <PageHeader variant="app" title={title} end={<AppShellHeaderAvatar />} />;
}

function AppShellNavigationDemo() {
  const [primaryId, setPrimaryId] = useState("overview");
  const [settingsSectionId, setSettingsSectionId] = useState("profile");

  const hasSecondaryNav = appShellHasSecondaryNav(primaryId);
  const secondaryNav = hasSecondaryNav
    ? {
        sections: appShellSettingsSideNavSections,
        activeId: settingsSectionId,
        onSelect: setSettingsSectionId,
      }
    : null;

  return (
    <AppShellLayout
      activePrimaryId={primaryId}
      onPrimaryChange={setPrimaryId}
      secondaryNav={secondaryNav}
    >
      {primaryId === "settings" ? (
        <>
          <PageHeader variant="app" title="Settings" />
          <AppCanvasBody>
            <SettingsPage activeSection={settingsSectionId} />
          </AppCanvasBody>
        </>
      ) : (
        <>
          <InsightsCanvasHeader title={primaryTitles[primaryId] ?? "Insights"} />
          <AppCanvasBody>
            <CreatorInsightsPage />
          </AppCanvasBody>
        </>
      )}
    </AppShellLayout>
  );
}

export const ShellNavigationDesktop: Story = {
  name: "Pattern — shell navigation (desktop)",
  render: () => (
    <div className="flex h-full min-h-0 w-full flex-1">
      <AppShellNavigationDemo />
    </div>
  ),
  globals: lockedViewportStory("desktop").globals,
  parameters: {
    ...lockedViewportStory("desktop").parameters,
    docs: {
      description: {
        story:
          "Switch **Home** ↔ **Settings** — **NavList** slides in from the rail and the canvas eases over. Drag-to-cover still works on Settings.",
      },
    },
    ...storyCopySource(`
import { useState } from "react";
import { PageHeader } from "@whatmatters/wmds";
import {
  appShellHasSecondaryNav,
  appShellSettingsSideNavSections,
  AppCanvasBody,
  AppShellHeaderAvatar,
  AppShellLayout,
  CreatorInsightsPage,
  SettingsPage,
} from "./examples/AppShell";

export function AppShellNavigationExample() {
  const [primaryId, setPrimaryId] = useState("overview");
  const [settingsSectionId, setSettingsSectionId] = useState("profile");

  const secondaryNav = appShellHasSecondaryNav(primaryId)
    ? {
        sections: appShellSettingsSideNavSections,
        activeId: settingsSectionId,
        onSelect: setSettingsSectionId,
      }
    : null;

  return (
    <AppShellLayout
      activePrimaryId={primaryId}
      onPrimaryChange={setPrimaryId}
      secondaryNav={secondaryNav}
    >
      {primaryId === "settings" ? (
        <>
          <PageHeader variant="app" title="Settings" />
          <AppCanvasBody>
            <SettingsPage activeSection={settingsSectionId} />
          </AppCanvasBody>
        </>
      ) : (
        <>
          <PageHeader
            variant="app"
            title="Insights"
            end={<AppShellHeaderAvatar />}
          />
          <AppCanvasBody>
            <CreatorInsightsPage />
          </AppCanvasBody>
        </>
      )}
    </AppShellLayout>
  );
}
`),
  },
};

/** @deprecated Use **Pattern — shell navigation (desktop)** — kept as alias for bookmarks. */
export const CreatorInsightsDesktop: Story = {
  ...ShellNavigationDesktop,
  name: "Pattern — creator insights (desktop)",
};

function AppShellMobileNavigationDemo() {
  const [primaryId, setPrimaryId] = useState("overview");
  const [settingsSectionId, setSettingsSectionId] = useState("profile");

  const hasSecondaryNav = appShellHasSecondaryNav(primaryId);
  const secondaryNav = hasSecondaryNav
    ? {
        sections: appShellSettingsSideNavSections,
        activeId: settingsSectionId,
        onSelect: setSettingsSectionId,
      }
    : null;

  const mobileItems = appShellPrimaryNavItems.map((item) =>
    item.id === "content" ? { ...item, label: "Content performance" } : item,
  );

  return (
    <AppShellMobileLayout
      activePrimaryId={primaryId}
      onPrimaryChange={setPrimaryId}
      items={mobileItems}
      footerItems={appShellPrimaryFooterItems}
      secondaryNav={secondaryNav}
      header={
        primaryId === "settings" ? (
          <PageHeader variant="app" title="Settings" />
        ) : (
          <InsightsCanvasHeader title={primaryTitles[primaryId] ?? "Insights"} />
        )
      }
    >
      {primaryId === "settings" ? (
        <SettingsPage activeSection={settingsSectionId} />
      ) : (
        <CreatorInsightsPage />
      )}
    </AppShellMobileLayout>
  );
}

export const ShellNavigationMobile: Story = {
  name: "Pattern — shell navigation (mobile)",
  render: () => (
    <div className="flex h-full min-h-0 w-full flex-1">
      <AppShellMobileNavigationDemo />
    </div>
  ),
  globals: lockedViewportStory("mobile").globals,
  parameters: {
    ...lockedViewportStory("mobile").parameters,
    docs: {
      description: {
        story:
          "Expandable bottom **MobileNavDock** — vertical menu stack for long labels (not a radial arch or cramped tab bar). On **Settings**, one responsive **Tab** row replaces the desktop NavList; excess pages move into More and a selected hidden page is promoted before More.",
      },
    },
    ...storyCopySource(`
import { useState } from "react";
import { PageHeader } from "@whatmatters/wmds";
import {
  appShellHasSecondaryNav,
  appShellPrimaryFooterItems,
  appShellPrimaryNavItems,
  appShellSettingsSideNavSections,
  AppShellMobileLayout,
  AppShellHeaderAvatar,
  CreatorInsightsPage,
  SettingsPage,
} from "./examples/AppShell";

export function AppShellMobileExample() {
  const [primaryId, setPrimaryId] = useState("overview");
  const [settingsSectionId, setSettingsSectionId] = useState("profile");

  const secondaryNav = appShellHasSecondaryNav(primaryId)
    ? {
        sections: appShellSettingsSideNavSections,
        activeId: settingsSectionId,
        onSelect: setSettingsSectionId,
      }
    : null;

  return (
    <AppShellMobileLayout
      activePrimaryId={primaryId}
      onPrimaryChange={setPrimaryId}
      items={appShellPrimaryNavItems}
      footerItems={appShellPrimaryFooterItems}
      secondaryNav={secondaryNav}
      header={
        primaryId === "settings" ? (
          <PageHeader variant="app" title="Settings" />
        ) : (
          <PageHeader
            variant="app"
            title="Insights"
            end={<AppShellHeaderAvatar />}
          />
        )
      }
    >
      {primaryId === "settings" ? (
        <SettingsPage activeSection={settingsSectionId} />
      ) : (
        <CreatorInsightsPage />
      )}
    </AppShellMobileLayout>
  );
}
`),
  },
};
