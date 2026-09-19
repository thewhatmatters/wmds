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
            "Show code is the product contract for owner chrome Account settings — topbar Avatar (wrapped in Button, aria-label Account settings) opens Dialog titled Account settings. Body order: Connected Instagram (same strip + professional Chip + Connected / last sync as Pattern — creator identity (owner settings)), Share kit Copy, Sign out, Disconnect, then Delete account last. Delete confirms with AlertDialog title “Delete your Pitchkit account?” and confirmRole=\"destructive\". The app footer is not the delete destination — remove footer delete when copying this freeze. Not a second Connected Instagram page. Copy that source into PitchKit. Do not reconstruct from Storybook-only example files, and do not ship ExampleGridControls.",
        },
      },
    },
    userSettingsOwnerCopySource,
  ),
};
