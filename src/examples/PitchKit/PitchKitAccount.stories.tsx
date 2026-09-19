import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  storyMetaDocsDefaults,
  withStoryCopySource,
} from "../../lib/storyCopySource";
import { createPitchKitProfileCalloutCopySource } from "./createProfileCalloutCopySource";
import { PitchKitCreateProfileCalloutExample } from "./PitchKitCreateProfileCallout";
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

export const UserSettingsOwner: Story = {
  name: "Pattern — user settings (owner)",
  render: () => <PitchKitUserSettingsOwnerExample />,
  parameters: withStoryCopySource(
    {
      docs: {
        description: {
          story:
            "Show code is the product contract for owner chrome User settings — topbar Avatar (wrapped in Button) opens Dialog titled User settings. Body stays thin: existing account display name and email only. Delete account lives inside this Dialog and confirms with AlertDialog confirmRole=\"destructive\". Not Settings → Connected Instagram. Copy that source into PitchKit. Do not reconstruct from Storybook-only example files, and do not ship ExampleGridControls.",
        },
      },
    },
    userSettingsOwnerCopySource,
  ),
};

export const CreatePitchkitProfileCallout: Story = {
  name: "Pattern — create PitchKit profile callout",
  render: () => <PitchKitCreateProfileCalloutExample />,
  parameters: withStoryCopySource(
    {
      docs: {
        description: {
          story:
            "Show code is the product contract for unsigned visitors on the public `/k/[handle]` kit — a Card callout titled Create your PitchKit Profile with supporting copy and a primary Get started Button, composed below a truncated shareable kit (identity, kit Stats, two selected posts). Public chrome only: PitchKit wordmark, no owner Avatar, MoreMenu, or edit controls. Do not invent KPI metrics. Copy that source into PitchKit. Do not reconstruct from Storybook-only example files, and do not ship ExampleGridControls.",
        },
      },
    },
    createPitchKitProfileCalloutCopySource,
  ),
};
