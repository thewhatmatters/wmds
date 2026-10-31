import type { ReactNode } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState, useSyncExternalStore } from "react";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { ChartColumn, Download, FileText, FolderOpen, LayoutDashboard, Megaphone, Settings, Users } from "lucide-react";
import { Avatar } from "../../atoms/Avatar/Avatar";
import { Badge } from "../../atoms/Badge/Badge";
import { Button } from "../../atoms/Button/Button";
import { Card, cardLayoutBodyOccupantInsetXClasses, cardLayoutBodyOccupantPadYClasses, cardTitleClasses } from "../../molecules/Card/Card";
import { DescriptionList } from "../../molecules/DescriptionList/DescriptionList";
import {
  commitDisplayTheme,
  DisplayControls,
  readDisplayTheme,
  subscribeDisplayTheme,
  type DisplayControlThemeMode,
} from "../../molecules/DisplayControls/DisplayControls";
import { NavList, type NavListSectionDef } from "../../molecules/NavList/NavList";
import { Stat } from "../../molecules/Stat/Stat";
import { TaskRows, type TaskRowsColumn } from "../../molecules/TaskRows/TaskRows";
import { lockedViewportStory } from "../../../lib/viewports";
import { storyMetaDocsDefaults, withStoryCopySource } from "../../../lib/storyCopySource";
import { AppShell, type AppShellAsideMode, type AppShellMenuButton } from "./AppShell";

const sections: NavListSectionDef[] = [
  {
    items: [
      { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard strokeWidth={1.75} /> },
      { id: "campaigns", label: "Campaigns", icon: <Megaphone strokeWidth={1.75} />, count: 12 },
      { id: "creators", label: "Creators", icon: <Users strokeWidth={1.75} /> },
      { id: "reports", label: "Reports", icon: <ChartColumn strokeWidth={1.75} /> },
    ],
  },
  {
    label: "Workspace",
    items: [
      { id: "library", label: "Library", icon: <FolderOpen strokeWidth={1.75} /> },
      { id: "invoices", label: "Invoices", icon: <FileText strokeWidth={1.75} /> },
      { id: "settings", label: "Settings", icon: <Settings strokeWidth={1.75} /> },
    ],
  },
];

const columns: TaskRowsColumn[] = [
  { id: "title", header: "Campaign" },
  { id: "waiting", header: "Waiting on you" },
  { id: "metric", header: "Live posts", align: "end" },
];

const wellClasses = [
  "flex flex-col",
  cardLayoutBodyOccupantPadYClasses,
  cardLayoutBodyOccupantInsetXClasses,
].join(" ");

function themeServerSnapshot(): DisplayControlThemeMode {
  return "auto";
}

export interface PortalDashboardProps {
  defaultSidebarOpen?: boolean;
  defaultAsideOpen?: boolean;
  asideMode?: AppShellAsideMode;
  menuButton?: AppShellMenuButton;
  title?: string;
  toolbar?: ReactNode;
  asideFooter?: ReactNode;
}

export function PortalDashboard({
  defaultSidebarOpen = true,
  defaultAsideOpen = false,
  asideMode,
  menuButton,
  title = "Dashboard",
  toolbar,
  asideFooter,
}: PortalDashboardProps) {
  const [activeId, setActiveId] = useState("dashboard");
  const [asideOpen, setAsideOpen] = useState(defaultAsideOpen);
  const theme = useSyncExternalStore(subscribeDisplayTheme, readDisplayTheme, themeServerSnapshot);

  return (
    <AppShell
      title={title}
      defaultSidebarOpen={defaultSidebarOpen}
      asideOpen={asideOpen}
      onAsideOpenChange={setAsideOpen}
      asideMode={asideMode}
      toolbar={toolbar}
      asideFooter={asideFooter}
      menuButton={menuButton}
      labels={menuButton === "label" || menuButton === "picker" ? { menu: "Portal" } : undefined}
      asideTitle="Stir in strength"
      asideDescription="Campaign details"
      brand={
        <>
          <Avatar name="WhatMatters" size="sm" />
          <span className="type-label text-fg">WhatMatters</span>
        </>
      }
      sidebar={
        <NavList
          aria-label="Portal"
          className="w-full"
          sections={sections}
          activeId={activeId}
          onSelect={setActiveId}
        />
      }
      sidebarFooter={
        <div className="flex items-center justify-between gap-3">
          <span className="type-label">Appearance</span>
          <DisplayControls
            controls="theme"
            aria-label="Appearance"
            theme={theme}
            onThemeChange={commitDisplayTheme}
          />
        </div>
      }
      header={
        <>
          <Button role="secondary" size="sm" icon={<Download strokeWidth={2} />} className="max-sm:!hidden">
            Export
          </Button>
          <Button role="primary" size="sm" onClick={() => setAsideOpen(true)}>
            Details
          </Button>
        </>
      }
      aside={
        <DescriptionList rule="dotted">
          <DescriptionList.Item name="Status">
            <Badge status="success" dot>Active · day 41</Badge>
          </DescriptionList.Item>
          <DescriptionList.Item name="Creators">22</DescriptionList.Item>
          <DescriptionList.Item name="Waiting">4 over 5 days</DescriptionList.Item>
          <DescriptionList.Item name="Live posts">49</DescriptionList.Item>
        </DescriptionList>
      }
    >
      <div className="grid gap-6">
        <Stat.Group aria-label="Key figures" columns={4}>
          <Stat label="Live posts" value="49" trend={{ value: "+12.5%", direction: "up" }} context="vs 43 last month" />
          <Stat label="Creators" value="128" trend={{ value: "+4.1%", direction: "up" }} context="vs 123 last month" />
          <Stat label="Reach" value="256K" trend={{ value: "-1.2%", direction: "down" }} context="vs 259K last month" />
          <Stat label="Waiting on you" value="26" trend={{ value: "0%", direction: "neutral" }} context="across 3 campaigns" />
        </Stat.Group>
        <section aria-labelledby="needs-you-heading">
          <Card>
            <Card.Header start={<h2 id="needs-you-heading" className={cardTitleClasses}>Campaigns that need you</h2>} />
            <Card.Body>
              <div className={wellClasses}>
                <TaskRows variant="table" columns={columns} empty="Nothing waiting">
                  <TaskRows.Row
                    title="Stir in strength"
                    href="/campaigns/stir"
                    status={{ tone: "success", label: "Active · day 41" }}
                    waiting={{ label: "22 creators", detail: "4 waiting over 5 days" }}
                    metric={{ value: "49", detail: "12 this week" }}
                  />
                  <TaskRows.Row
                    title="Healthier every day"
                    href="/campaigns/healthier"
                    status={{ tone: "warning", label: "Open · 2d" }}
                    waiting={{ label: "4 creators", detail: "all within 48h target" }}
                    metric={{ value: "10", detail: "2 this week" }}
                  />
                  <TaskRows.Row
                    title="Summer launch"
                    href="/campaigns/summer"
                    status={{ tone: "destructive", label: "Paused · 9d" }}
                    waiting={{ label: "9 creators", detail: "brief needs approval" }}
                    metric={{ value: "3", detail: "none this week" }}
                  />
                </TaskRows>
              </div>
            </Card.Body>
          </Card>
        </section>
      </div>
    </AppShell>
  );
}

/** The overlay fades in over the medium tier; the accessibility check waits for the end of it. */
async function settleOverlay() {
  await waitFor(() => expect(document.body.querySelector('[role="dialog"]')).not.toBeNull());
  await new Promise((resolve) => setTimeout(resolve, 800));
}

const meta = {
  title: "Components/AppShell",
  component: AppShell,
  tags: ["autodocs"],
  ...storyMetaDocsDefaults(),
  parameters: {
    wmdsLayout: "fullscreen",
    docs: {
      description: {
        component: `
## Usage

App chrome for a signed-in product: a **sidebar** on the page background and the page as an inset, raised surface with a **title bar**. It composes **NavList** (the sidebar), **PageHeader** \`variant="app"\` (the title bar), **Sheet** (the sidebar below \`lg\`), and **Panel** (the aside). It adds no color, radius, or shadow of its own — the surface uses the **Card** shell radius and \`shadow-soft-card\`.

| Part | Prop or slot | Composes |
|------|--------------|----------|
| Brand row | \`brand\` / **AppShell.Brand** | A 56px band — the same token as the title bar, so their bottom edges align |
| Sidebar | \`sidebar\` / **AppShell.Sidebar** | **NavList** with \`className="w-full"\`, scrolls |
| Sidebar footer | \`sidebarFooter\` / **AppShell.SidebarFooter** | Pinned under the nav — **DisplayControls** \`controls="theme"\` |
| Title bar | \`title\`, \`header\` / **AppShell.Header** | **PageHeader** \`variant="app"\` — \`h1\`, the toggle, and trailing controls |
| Aside | \`aside\` / **AppShell.Aside**, \`asideTitle\`, \`asideMode\` | **Panel** \`side="end"\` — non-blocking; \`asideMode="docked"\`: a column beside the page from \`lg\` |
| Page | \`children\` | Scrolls inside \`main\` |

## Anatomy

\`\`\`
AppShell
├── sidebar column (lg+)      brand row · NavList (scrolls) · footer — on bg-body
├── surface                   rounded, shadow-soft-card, 8px inset
│   ├── PageHeader app        PanelLeft toggle · h1 · header
│   └── main                  children
├── Sheet side="start"        the sidebar below lg
└── Panel side="end"          aside
\`\`\`

## Best practices

- **Do** pass a **NavList** with \`aria-label\` — it is the navigation landmark. The title bar is the \`banner\`; the page is \`main\`.
- **Do** keep the toggle: it collapses the sidebar from \`lg\` and opens the **Sheet** below it. **Ctrl** / **⌘** + **B** does the same. Focus inside a collapsing sidebar returns to the toggle.
- **Do** own the aside state (\`asideOpen\`, \`onAsideOpenChange\`) when a title-bar button opens it. **Panel** keeps the page interactive; Escape closes it and returns focus to that button.
- **Do** use \`useAppShell()\` in a child when it needs the shell's state.
- **Don't** put a second page \`h1\` in \`children\` — \`title\` is the \`h1\`.
- **Don't** re-theme the surface with \`className\` — it is layout only (height).
- **Don't** use it for marketing pages — that is **SiteNav**.

## Sidebar footer

\`sidebarFooter\` / **AppShell.SidebarFooter** is pinned to the bottom of the sidebar column and of the phone **Sheet**; the **NavList** above it scrolls on its own. Put a **DisplayControls** \`controls="theme"\` switch there (**Pattern — portal dashboard**) and it stays visible at 1440×900 and on a phone. The slot adds only the brand row's 16px inset — no fill, border, or type. Using it does not close the phone menu.

## Mobile toggle name

Below \`lg\` the title-bar toggle is named **Menu** (\`labels.menu\`) and so is the **Sheet** it opens. Keep that name — find it in tests with \`getByRole("button", { name: "Menu" })\`. Translate it through \`labels\`; do not rename it. The desktop toggle is **Collapse sidebar** / **Expand sidebar**.

## Server rendering

**Which parts render on the server.** All of **AppShell** server-renders when it is imported from a client module: the sidebar column (brand row, **NavList**, \`sidebarFooter\`), the title bar with both toggles, and \`main\` with the page. The desktop and phone toggles are two buttons, one hidden by CSS per breakpoint, so the server HTML needs no viewport query. The phone **Sheet** and the aside **Panel** render nothing until they open (they portal on the client), so no dialog is in the server HTML. \`sidebarOpen\` and the aside state start from \`defaultSidebarOpen\` / \`defaultAsideOpen\`. **DisplayControls** renders its \`auto\` state on the server; \`useSyncExternalStore\` with a server snapshot of \`"auto"\` switches to the saved choice after hydration without a mismatch.

**What needs \`"use client"\`.** Every module in \`@thewhatmatters/wmds\` ships with the \`"use client"\` directive, so a Server Component can render the components but cannot call hooks or pass event handlers into them, and a non-component export (such as \`displayThemeNoFlashScript\`) is a client reference there, not its value. **AppShell** takes \`onSidebarOpenChange\`, \`onAsideOpenChange\`, **NavList** \`onSelect\`, and a **DisplayControls** \`onThemeChange\` — all functions — so the file that renders it is a \`"use client"\` module. Page content passed as \`children\` can stay a Server Component: a client component renders the server-rendered \`children\` it is given.

**The no-flash script goes in the head.** \`displayThemeNoFlashScript\` sets or clears \`data-theme\` on \`<html>\` before first paint. Render it in \`<head>\` before the stylesheet, from a client module that renders the \`<script>\` (below), and put \`suppressHydrationWarning\` on \`<html>\` because the script changes its attributes.

**Next.js App Router.**

\`\`\`tsx
// app/theme-script.tsx — a client module: the package's exports are client references on the server
"use client";

import { displayThemeNoFlashScript } from "@thewhatmatters/wmds";

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: displayThemeNoFlashScript }} />;
}
\`\`\`

\`\`\`tsx
// app/layout.tsx — a Server Component
import "@thewhatmatters/wmds/styles.css";
import type { ReactNode } from "react";
import { ThemeScript } from "./theme-script";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body>{children}</body>
    </html>
  );
}
\`\`\`

\`\`\`tsx
// app/(portal)/portal-shell.tsx — the client boundary
"use client";

import { usePathname } from "next/navigation";
import { useSyncExternalStore, type ReactNode } from "react";
import {
  AppShell,
  DisplayControls,
  NavList,
  commitDisplayTheme,
  readDisplayTheme,
  subscribeDisplayTheme,
  type DisplayControlThemeMode,
} from "@thewhatmatters/wmds";

function themeServerSnapshot(): DisplayControlThemeMode {
  return "auto";
}

export function PortalShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const theme = useSyncExternalStore(subscribeDisplayTheme, readDisplayTheme, themeServerSnapshot);

  return (
    <AppShell
      title="Dashboard"
      sidebar={
        <NavList
          aria-label="Portal"
          className="w-full"
          activeId={pathname}
          sections={[{ items: [{ id: "/", label: "Dashboard", href: "/" }] }]}
        />
      }
      sidebarFooter={
        <DisplayControls controls="theme" aria-label="Appearance" theme={theme} onThemeChange={commitDisplayTheme} />
      }
    >
      {children}
    </AppShell>
  );
}
\`\`\`

\`\`\`tsx
// app/(portal)/layout.tsx — a Server Component; its pages stay Server Components
import type { ReactNode } from "react";
import { PortalShell } from "./portal-shell";

export default function PortalLayout({ children }: { children: ReactNode }) {
  return <PortalShell>{children}</PortalShell>;
}
\`\`\`

## For agents building UIs

Copy **Pattern — portal dashboard**. The states below reuse the same page: **State — collapsed**, **State — aside open**, **State — phone**, and **State — phone menu open**.
        `.trim(),
      },
    },
  },
} satisfies Meta<typeof AppShell>;

export default meta;
type Story = StoryObj<typeof AppShell>;

export const PortalDashboardPattern: Story = {
  name: "Pattern — portal dashboard",
  parameters: withStoryCopySource(
    {
      docs: {
        description: {
          story:
            "A WhatMatters portal page — brand row, grouped **NavList**, key figures as **Stat** tiles, and a campaigns table in a **Card**. The toggle in the title bar collapses the sidebar; Details opens the aside.",
        },
      },
    },
    `"use client";

import { useState, useSyncExternalStore } from "react";
import { ChartColumn, Download, FileText, FolderOpen, LayoutDashboard, Megaphone, Settings, Users } from "lucide-react";
import {
  AppShell,
  Avatar,
  Badge,
  Button,
  Card,
  DescriptionList,
  DisplayControls,
  NavList,
  Stat,
  TaskRows,
  commitDisplayTheme,
  readDisplayTheme,
  subscribeDisplayTheme,
  cardLayoutBodyOccupantInsetXClasses,
  cardLayoutBodyOccupantPadYClasses,
  cardTitleClasses,
  type DisplayControlThemeMode,
  type NavListSectionDef,
  type TaskRowsColumn,
} from "@thewhatmatters/wmds";

const sections: NavListSectionDef[] = [
  {
    items: [
      { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard strokeWidth={1.75} /> },
      { id: "campaigns", label: "Campaigns", icon: <Megaphone strokeWidth={1.75} />, count: 12 },
      { id: "creators", label: "Creators", icon: <Users strokeWidth={1.75} /> },
      { id: "reports", label: "Reports", icon: <ChartColumn strokeWidth={1.75} /> },
    ],
  },
  {
    label: "Workspace",
    items: [
      { id: "library", label: "Library", icon: <FolderOpen strokeWidth={1.75} /> },
      { id: "invoices", label: "Invoices", icon: <FileText strokeWidth={1.75} /> },
      { id: "settings", label: "Settings", icon: <Settings strokeWidth={1.75} /> },
    ],
  },
];

const columns: TaskRowsColumn[] = [
  { id: "title", header: "Campaign" },
  { id: "waiting", header: "Waiting on you" },
  { id: "metric", header: "Live posts", align: "end" },
];

const wellClasses = [
  "flex flex-col",
  cardLayoutBodyOccupantPadYClasses,
  cardLayoutBodyOccupantInsetXClasses,
].join(" ");

function themeServerSnapshot(): DisplayControlThemeMode {
  return "auto";
}

interface PortalDashboardProps {
  defaultSidebarOpen?: boolean;
  defaultAsideOpen?: boolean;
}

export function PortalDashboard({
  defaultSidebarOpen = true,
  defaultAsideOpen = false,
}: PortalDashboardProps) {
  const [activeId, setActiveId] = useState("dashboard");
  const [asideOpen, setAsideOpen] = useState(defaultAsideOpen);
  const theme = useSyncExternalStore(subscribeDisplayTheme, readDisplayTheme, themeServerSnapshot);

  return (
    <AppShell
      title="Dashboard"
      defaultSidebarOpen={defaultSidebarOpen}
      asideOpen={asideOpen}
      onAsideOpenChange={setAsideOpen}
      asideTitle="Stir in strength"
      asideDescription="Campaign details"
      brand={
        <>
          <Avatar name="WhatMatters" size="sm" />
          <span className="type-label text-fg">WhatMatters</span>
        </>
      }
      sidebar={
        <NavList
          aria-label="Portal"
          className="w-full"
          sections={sections}
          activeId={activeId}
          onSelect={setActiveId}
        />
      }
      sidebarFooter={
        <div className="flex items-center justify-between gap-3">
          <span className="type-label">Appearance</span>
          <DisplayControls
            controls="theme"
            aria-label="Appearance"
            theme={theme}
            onThemeChange={commitDisplayTheme}
          />
        </div>
      }
      header={
        <>
          <Button role="secondary" size="sm" icon={<Download strokeWidth={2} />} className="max-sm:!hidden">
            Export
          </Button>
          <Button role="primary" size="sm" onClick={() => setAsideOpen(true)}>
            Details
          </Button>
        </>
      }
      aside={
        <DescriptionList rule="dotted">
          <DescriptionList.Item name="Status">
            <Badge status="success" dot>Active · day 41</Badge>
          </DescriptionList.Item>
          <DescriptionList.Item name="Creators">22</DescriptionList.Item>
          <DescriptionList.Item name="Waiting">4 over 5 days</DescriptionList.Item>
          <DescriptionList.Item name="Live posts">49</DescriptionList.Item>
        </DescriptionList>
      }
    >
      <div className="grid gap-6">
        <Stat.Group aria-label="Key figures" columns={4}>
          <Stat label="Live posts" value="49" trend={{ value: "+12.5%", direction: "up" }} context="vs 43 last month" />
          <Stat label="Creators" value="128" trend={{ value: "+4.1%", direction: "up" }} context="vs 123 last month" />
          <Stat label="Reach" value="256K" trend={{ value: "-1.2%", direction: "down" }} context="vs 259K last month" />
          <Stat label="Waiting on you" value="26" trend={{ value: "0%", direction: "neutral" }} context="across 3 campaigns" />
        </Stat.Group>
        <section aria-labelledby="needs-you-heading">
          <Card>
            <Card.Header start={<h2 id="needs-you-heading" className={cardTitleClasses}>Campaigns that need you</h2>} />
            <Card.Body>
              <div className={wellClasses}>
                <TaskRows variant="table" columns={columns} empty="Nothing waiting">
                  <TaskRows.Row
                    title="Stir in strength"
                    href="/campaigns/stir"
                    status={{ tone: "success", label: "Active · day 41" }}
                    waiting={{ label: "22 creators", detail: "4 waiting over 5 days" }}
                    metric={{ value: "49", detail: "12 this week" }}
                  />
                  <TaskRows.Row
                    title="Healthier every day"
                    href="/campaigns/healthier"
                    status={{ tone: "warning", label: "Open · 2d" }}
                    waiting={{ label: "4 creators", detail: "all within 48h target" }}
                    metric={{ value: "10", detail: "2 this week" }}
                  />
                  <TaskRows.Row
                    title="Summer launch"
                    href="/campaigns/summer"
                    status={{ tone: "destructive", label: "Paused · 9d" }}
                    waiting={{ label: "9 creators", detail: "brief needs approval" }}
                    metric={{ value: "3", detail: "none this week" }}
                  />
                </TaskRows>
              </div>
            </Card.Body>
          </Card>
        </section>
      </div>
    </AppShell>
  );
}
`,
  ),
  render: () => <PortalDashboard />,
};

export const Collapsed: Story = {
  name: "State — collapsed",
  parameters: {
    docs: { description: { story: "`sidebarOpen` false — the surface takes the full width and the toggle expands it." } },
  },
  render: () => <PortalDashboard defaultSidebarOpen={false} />,
};

export const AsideOpen: Story = {
  name: "State — aside open",
  parameters: {
    docs: { description: { story: "The aside is a **Panel** on the end edge. The page behind it stays interactive." } },
  },
  render: () => <PortalDashboard defaultAsideOpen />,
  play: async () => {
    await settleOverlay();
  },
};

export const AsideInset: Story = {
  name: "State — aside inset, with a toolbar",
  parameters: {
    docs: {
      description: {
        story:
          "`asideMode=\"inset\"`: from `lg` the aside is a raised card floating inside the page surface, under the title bar and the `toolbar` band, 12px from the end and bottom edges; the page narrows beside it and is never covered. Its header is the title bar's 56px band, and `asideFooter` stays pinned under the scrolling body. Put the button that opens it at the end of the toolbar, right above it. Below `lg` it's the overlay **Panel**.",
      },
    },
  },
  render: () => (
    <PortalDashboard
      asideMode="inset"
      toolbar={<div className="flex items-center justify-end px-4 py-3"><span className="type-label">View toolbar</span></div>}
      asideFooter={
        <div className="flex w-full flex-col gap-3">
          <Button role="secondary" width="fill">Copy link</Button>
          <Button role="secondary" width="fill">Archive campaign</Button>
        </div>
      }
    />
  ),
  play: async ({ canvas }) => {
    const main = canvas.getByRole("main");
    const fullWidth = main.offsetWidth;
    await userEvent.click(canvas.getByRole("button", { name: "Details" }));
    const aside = await canvas.findByRole("complementary", { name: "Stir in strength" });
    expect(canvas.queryByRole("dialog")).toBeNull();
    // Inside the page surface, under the toolbar band, beside the narrowed page.
    const toolbar = canvas.getByText("View toolbar");
    await waitFor(() => expect(main.offsetWidth).toBeLessThan(fullWidth - 200));
    expect(aside.getBoundingClientRect().left).toBeGreaterThanOrEqual(main.getBoundingClientRect().right);
    expect(aside.getBoundingClientRect().top).toBeGreaterThan(toolbar.getBoundingClientRect().bottom);
    const surface = main.closest("[class*='shadow-soft-card']") as HTMLElement;
    expect(surface.contains(aside)).toBe(true);
    const gap = surface.getBoundingClientRect().right - aside.getBoundingClientRect().right;
    expect(Math.round(gap)).toBe(12);
    // The header is the title bar's 56px band.
    const heading = aside.querySelector("h2") as HTMLElement;
    const header = heading.closest("[role='presentation']") as HTMLElement;
    expect(header.offsetHeight).toBe(56);
    // asideFooter is pinned: outside the scrolling body, inside the card's bottom edge.
    const archive = canvas.getByRole("button", { name: "Archive campaign" });
    const footer = archive.closest("footer") as HTMLElement;
    expect(aside.contains(footer)).toBe(true);
    expect(footer.previousElementSibling?.className).toContain("overflow-y-auto");
    expect(archive.getBoundingClientRect().bottom).toBeLessThanOrEqual(aside.getBoundingClientRect().bottom);
  },
};

export const AsideDocked: Story = {
  name: "State — aside docked",
  parameters: {
    docs: {
      description: {
        story:
          "`asideMode=\"docked\"`: from `lg` the aside is a column beside the page, which narrows to make room, so you can watch the page while you use its controls. Escape or Close returns focus to the button that opened it. Below `lg` it's the overlay **Panel**.",
      },
    },
  },
  render: () => <PortalDashboard asideMode="docked" />,
  play: async ({ canvas }) => {
    const main = canvas.getByRole("main");
    const fullWidth = main.offsetWidth;
    const details = canvas.getByRole("button", { name: "Details" });
    await userEvent.click(details);
    const aside = await canvas.findByRole("complementary", { name: "Stir in strength" });
    // Docked, not an overlay: no dialog, and the page narrowed beside it.
    expect(canvas.queryByRole("dialog")).toBeNull();
    await waitFor(() => expect(main.offsetWidth).toBeLessThan(fullWidth - 200));
    expect(aside.getBoundingClientRect().left).toBeGreaterThanOrEqual(main.getBoundingClientRect().right);
    // Escape from inside closes it and gives focus back to Details.
    await userEvent.click(canvas.getByRole("button", { name: "Close panel" }));
    await waitFor(() => expect(canvas.queryByRole("complementary", { name: "Stir in strength" })).toBeNull());
    expect(details).toHaveFocus();
    await userEvent.click(details);
    const reopened = await canvas.findByRole("complementary", { name: "Stir in strength" });
    reopened.querySelector<HTMLElement>("button")?.focus();
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(canvas.queryByRole("complementary")).toBeNull());
    expect(details).toHaveFocus();
    await userEvent.click(details);
    await canvas.findByRole("complementary", { name: "Stir in strength" });
  },
};

export const PhoneLabelledMenu: Story = {
  name: "State — phone, labelled menu",
  ...lockedViewportStory("mobile"),
  parameters: {
    ...lockedViewportStory("mobile").parameters,
    docs: {
      ...lockedViewportStory("mobile").parameters.docs,
      description: {
        story:
          "`menuButton=\"label\"`: the phone menu button shows `labels.menu` beside the icon (here \"Portal\"), for when the glyph alone wouldn't say what the menu holds. A long title ends in an ellipsis instead of wrapping.",
      },
    },
  },
  render: () => <PortalDashboard menuButton="label" />,
  play: async ({ canvas }) => {
    const button = canvas.getByRole("button", { name: "Portal" });
    expect(button).toHaveTextContent("Portal");
    await userEvent.click(button);
    await settleOverlay();
    // The Sheet portals to the body, outside the story root.
    expect(await within(document.body).findByRole("dialog", { name: "Portal" })).toBeVisible();
  },
};

export const PhonePicker: Story = {
  name: "State — phone, page picker",
  ...lockedViewportStory("mobile"),
  parameters: {
    ...lockedViewportStory("mobile").parameters,
    docs: {
      ...lockedViewportStory("mobile").parameters.docs,
      description: {
        story:
          "`menuButton=\"picker\"`: on phones the menu button carries the current page (`title`) with a chevron, in place of the title, so a long name isn't cut to one word. The `h1` stays in the page for screen readers.",
      },
    },
  },
  render: () => <PortalDashboard menuButton="picker" title="Campaign performance — Stir in strength" />,
  play: async ({ canvas }) => {
    const button = canvas.getByRole("button", { name: "Portal: Campaign performance — Stir in strength" });
    expect(button).toHaveTextContent("Campaign performance");
    // The chevron is a plain glyph on the ghost button, not a filled square.
    const chevron = button.querySelector("svg.lucide-chevron-down");
    expect(chevron).not.toBeNull();
    expect(getComputedStyle(chevron!.parentElement!).backgroundColor).toBe(getComputedStyle(button).backgroundColor);
    // One line: the chevron sits beside the name, and the button keeps its single-row height.
    const name = chevron!.previousElementSibling as HTMLElement;
    expect(Math.abs(chevron!.getBoundingClientRect().top + chevron!.getBoundingClientRect().height / 2 - (name.getBoundingClientRect().top + name.getBoundingClientRect().height / 2))).toBeLessThan(4);
    expect(button.scrollWidth).toBeLessThanOrEqual(button.clientWidth + 1);
    // A long name ends in an ellipsis instead of pushing the chevron off.
    expect(name.scrollWidth).toBeGreaterThan(name.clientWidth);
    // The h1 is still the page's heading, visually hidden below lg.
    const heading = canvas.getByRole("heading", { level: 1, name: "Campaign performance — Stir in strength" });
    expect(heading.className).toContain("max-lg:sr-only");
    await userEvent.click(button);
    await settleOverlay();
    expect(await within(document.body).findByRole("dialog", { name: "Portal" })).toBeVisible();
  },
};

export const Phone: Story = {
  name: "State — phone",
  render: () => <PortalDashboard />,
  ...lockedViewportStory("mobile"),
};

export const PhoneMenuOpen: Story = {
  name: "State — phone menu open",
  render: () => <PortalDashboard />,
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Menu" }));
    await settleOverlay();
  },
  ...lockedViewportStory("mobile"),
};
