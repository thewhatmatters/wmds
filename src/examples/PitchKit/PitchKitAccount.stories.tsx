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
            "Show code is the product contract for owner chrome account / User settings — topbar Avatar (wrapped in Button) opens Dialog titled User settings. Body stays thin: existing account display name and email only. Delete account is the last action in this Dialog and confirms with AlertDialog confirmRole=\"destructive\". The app footer is not the delete destination — remove footer delete when copying this freeze. Not Settings → Connected Instagram. Copy that source into PitchKit. Do not reconstruct from Storybook-only example files, and do not ship ExampleGridControls.",
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
            "Show code is the product contract for unsigned / no-account visitors on the public `/k/[handle]` kit — a Card band titled Create your PitchKit (RE memo: “Create your Pitchkit”; WMDS uses joined PitchKit) with two CTAs: primary Create your PitchKit and secondary Continue with Instagram. Composed below a truncated shareable kit (identity, kit Stats, two selected posts). Public chrome only: PitchKit wordmark, no owner Avatar, MoreMenu, or edit controls. Do not invent KPI metrics. Copy that source into PitchKit. Do not reconstruct from Storybook-only example files, and do not ship ExampleGridControls.",
        },
      },
    },
    createPitchKitProfileCalloutCopySource,
  ),
};
