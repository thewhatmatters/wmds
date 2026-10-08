// @thewhatmatters/wmds@0.4.7 · Pattern — settings pages
// Storybook: Components/Tab → Pattern — settings pages (?path=/story/components-tab--settings-pages)
// Show code — copy verbatim and keep this header; upgrades find pasted patterns by it.

import { useState } from "react";
import { Tab } from "@thewhatmatters/wmds";

export function SettingsTabs() {
  const [page, setPage] = useState("profile");

  return (
    <>
      <Tab.Group aria-label="Settings pages" value={page} onValueChange={setPage}>
        <Tab value="profile" panelId="settings-panel-profile">Profile</Tab>
        <Tab value="notifications" panelId="settings-panel-notifications">Notifications</Tab>
        <Tab value="security" panelId="settings-panel-security">Security</Tab>
      </Tab.Group>
      <section role="tabpanel">{/* active settings page */}</section>
    </>
  );
}
