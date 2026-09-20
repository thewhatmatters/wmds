import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  storyMetaDocsDefaults,
  withStoryCopySource,
} from "../../lib/storyCopySource";
import { PitchKitUserSettingsOwnerExample } from "./PitchKitUserSettings";
import { userSettingsOwnerCopySource } from "./userSettingsCopySource";

const meta = {
  title: "Examples/PitchKit",
  ...storyMetaDocsDefaults(),
  parameters: {
    wmdsLayout: "fullscreen",
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const AccountSettingsOwner: Story = {
  name: "Pattern — account settings (owner)",
  render: () => <PitchKitUserSettingsOwnerExample />,
  parameters: withStoryCopySource(
    {
      docs: {
        description: {
          story:
            "Show code is the product contract for owner chrome Account settings — topbar Avatar md (ghost Button, aria-label My account) opens Dropdown titled My account. Items: Account settings / Share kit, then Sign out / Disconnect / Delete last. Account settings opens Dialog (Connected Instagram only — same strip + professional Chip + Connected / last sync as Pattern — creator identity (owner settings)). Share kit copies /k/[handle]. Delete confirms with AlertDialog title “Delete your Pitchkit account?” and confirmRole=\"destructive\". Footer is Privacy + Support only — not the delete destination. Not a second Connected Instagram page. Copy that source into PitchKit. Do not reconstruct from Storybook-only example files, and do not ship ExampleGridControls.",
        },
      },
    },
    userSettingsOwnerCopySource,
  ),
};
