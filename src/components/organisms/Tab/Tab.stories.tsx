import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Tab, tabSizes } from "./Tab";
import { storyCopySource, storyMetaDocsDefaults } from "../../../lib/storyCopySource";

const settingsTabs = [
  { value: "profile", label: "Profile" },
  { value: "notifications", label: "Notifications" },
  { value: "security", label: "Security" },
  { value: "general", label: "General" },
  { value: "members", label: "Members", count: 8 },
  { value: "billing", label: "Billing" },
  { value: "connected", label: "Connected apps" },
  { value: "api", label: "API keys" },
];

const meta = {
  title: "Components/Navigation/Tab",
  component: Tab.Group,
  tags: ["autodocs"],
  ...storyMetaDocsDefaults(),
  argTypes: {
    size: { control: "select", options: [...tabSizes] },
    children: { control: false },
    onValueChange: { action: "value changed" },
  },
  parameters: {
    docs: {
      description: {
        component: `
## Usage

Responsive view navigation — **Tab.Group** owns the \`tablist\`; **Tab** owns each \`tab\`. Use for peer pages or views such as Profile / Notifications / Security. Use **SegmentedControl** for a compact setting choice, not page navigation.

When tabs exceed the available width, the final control becomes **More**. Selecting an overflow item promotes it into the final visible tab position immediately before More.

## Anatomy

\`\`\`
Tab.Group
├── active label + bottom rule — one Motion indicator
├── pill surface — hover feedback only
├── Tab × visible capacity
└── More? → Dropdown.Menu → hidden tabs
\`\`\`

## Best practices

- Keep labels concise, but do not truncate destinations to force them into the viewport.
- Keep the active tab visible; overflow promotion handles selections from More.
- Use \`count\` for compact totals—do not put Badge inside a tab.
- Render the controlled panel outside Tab.Group and connect it with \`panelId\`.
        `.trim(),
      },
    },
  },
} satisfies Meta<typeof Tab.Group>;

export default meta;
type Story = StoryObj<typeof meta>;

function SettingsTabs({ width = "100%" }: { width?: string }) {
  const [value, setValue] = useState("profile");

  return (
    <div style={{ width }}>
      <Tab.Group aria-label="Settings pages" value={value} onValueChange={setValue}>
        {settingsTabs.map((item) => (
          <Tab
            key={item.value}
            value={item.value}
            count={item.count}
            panelId={`settings-panel-${item.value}`}
          >
            {item.label}
          </Tab>
        ))}
      </Tab.Group>
      <div
        id={`settings-panel-${value}`}
        role="tabpanel"
        className="mt-4 rounded-2xl border border-border bg-surface p-4 text-sm text-fg"
      >
        {settingsTabs.find((item) => item.value === value)?.label} settings
      </div>
    </div>
  );
}

export const SettingsPages: Story = {
  name: "Pattern — settings pages",
  render: () => <SettingsTabs />,
  parameters: storyCopySource(`
import { useState } from "react";
import { Tab } from "@whatmatters/wmds";

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
`),
};

export const ResponsiveOverflow: Story = {
  name: "Pattern — responsive overflow",
  render: () => <SettingsTabs width="360px" />,
  parameters: {
    docs: {
      description: {
        story:
          "At 360px, hidden destinations move into More. Choose one to promote it into the last visible position before More.",
      },
    },
  },
};

export const CompactOverflow: Story = {
  name: "Reference — compact overflow",
  render: () => <SettingsTabs width="280px" />,
};
