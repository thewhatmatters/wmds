import type { Meta, StoryObj } from "@storybook/react-vite";
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
import { NavList } from "./NavList";
import { storyCopySource, storyMetaDocsDefaults } from "../../../lib/storyCopySource";

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
  title: "Components/Navigation/NavList",
  component: NavList,
  tags: ["autodocs"],
  ...storyMetaDocsDefaults(),
  argTypes: {
    variant: { control: false },
  },
  parameters: {
    wmdsLayout: "padded",
    docs: {
      description: {
        component: `
## Usage

Sectioned **secondary navigation** — inset pills on \`bg-body\` gutter with optional Lucide icons and trailing counts. Not primary **NavRail** (icon-only) and not **SegmentedControl** (mutually exclusive segments).

| Pattern | API |
|---------|-----|
| **Side nav** | \`sections\` + \`activeId\` + \`onSelect\` — first section label defaults to \`labelAlign="brand"\` (56px band) |
| **Compound** | **NavList.Section** + **NavList.Item** — custom order and mixed label bands |
| **Row chrome** | **Button** \`layout="nav"\` — selected inset pill; compose icon via **ButtonIcon** in **NavList** only |

## Anatomy

\`\`\`
NavList (nav)
└── NavList.Section
    ├── label? (overline — brand band | section pad)
    └── NavList.Item × n
        └── Button layout="nav"
            ├── ButtonIcon + Lucide?
            ├── label
            └── count?
\`\`\`

## Best practices

- **Do** use \`labelAlign="brand"\` when a first section must align with an adjacent 56px page-header band.
- **Do** keep one \`activeId\` — instant swap; no Motion thumb on items.
- **Do** pass \`aria-label\` when the nav landmark needs more context than section labels.
- **Don't** hand-roll inset pill \`<button>\` rows — extend **Button** \`layout="nav"\` via **NavList**.
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
`),
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
