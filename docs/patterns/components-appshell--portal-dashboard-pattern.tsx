// @thewhatmatters/wmds@0.4.26 · Pattern — portal dashboard
// Storybook: Components/AppShell → Pattern — portal dashboard (?path=/story/components-appshell--portal-dashboard-pattern)
// Show code — copy verbatim and keep this header; upgrades find pasted patterns by it.

"use client";

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
