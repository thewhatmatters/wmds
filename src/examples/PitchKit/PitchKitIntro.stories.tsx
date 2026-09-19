import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  storyMetaDocsDefaults,
  withStoryCopySource,
} from "../../lib/storyCopySource";
import { introOwnerCopySource, introPublicCopySource } from "./introCopySource";
import {
  pitchKitCreatorIdentityStates,
  pitchKitIntroStates,
} from "./pitchKitData";
import { PitchKitIntroExample } from "./PitchKitIntro";

const meta = {
  title: "Examples/PitchKit",
  component: PitchKitIntroExample,
  ...storyMetaDocsDefaults(),
  argTypes: {
    identityState: {
      control: "select",
      options: pitchKitCreatorIdentityStates,
    },
    introState: {
      control: "select",
      options: pitchKitIntroStates,
    },
    chrome: {
      control: "select",
      options: ["public", "owner"],
    },
  },
  args: {
    identityState: "resolved",
    introState: "filled",
    chrome: "owner",
  },
  parameters: {
    wmdsLayout: "fullscreen",
  },
} satisfies Meta<typeof PitchKitIntroExample>;

export default meta;
type Story = StoryObj<typeof meta>;

export const IntroOwner: Story = {
  name: "Pattern — intro (owner)",
  args: {
    chrome: "owner",
    introState: "filled",
  },
  argTypes: {
    chrome: { table: { disable: true } },
  },
  parameters: withStoryCopySource(
    {
      docs: {
        description: {
          story:
            "Show code is the product contract for the Pitchkit-owned `intro` editor on the owner nameplate. Soft 160 / hard 280. Empty is a ghost **Add an intro** CTA, not an Instagram biography field. Copy that source into PitchKit. Do not reconstruct from Storybook-only example files, and do not ship ExampleGridControls.",
        },
      },
    },
    introOwnerCopySource,
  ),
};

export const IntroPublic: Story = {
  name: "Pattern — intro (public)",
  args: {
    chrome: "public",
    introState: "filled",
  },
  argTypes: {
    chrome: { table: { disable: true } },
  },
  parameters: withStoryCopySource(
    {
      docs: {
        description: {
          story:
            "Show code is the product contract for the public `/k/[handle]` intro under the identity nameplate. Show the Pitchkit-owned `intro` when non-empty; omit the block entirely when empty. Not Instagram biography. Copy that source into PitchKit. Do not reconstruct from Storybook-only example files, and do not ship ExampleGridControls.",
        },
      },
    },
    introPublicCopySource,
  ),
};

export const IntroOwnerEmpty: Story = {
  name: "State — intro owner empty",
  args: {
    chrome: "owner",
    introState: "empty",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Owner `intro` is empty. Ghost **Add an intro** CTA under the nameplate — not a blank TextArea and not Instagram biography. Controls → Intro state switches filled / soft / hard limits.",
      },
    },
  },
};

export const IntroOwnerSoftLimit: Story = {
  name: "State — intro owner soft limit",
  args: {
    chrome: "owner",
    introState: "softLimit",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Owner `intro` is at the soft 160-character limit. **TextArea** `status=\"warning\"` only — no invented helper copy. Hard cap stays 280.",
      },
    },
  },
};

export const IntroOwnerHardLimit: Story = {
  name: "State — intro owner hard limit",
  args: {
    chrome: "owner",
    introState: "hardLimit",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Owner `intro` is at the hard 280-character limit. **TextArea** `maxLength={280}` and `status=\"error\"` only — no invented helper copy.",
      },
    },
  },
};

export const IntroPublicOmit: Story = {
  name: "State — intro public omit",
  args: {
    chrome: "public",
    introState: "empty",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Public `intro` is empty. Omit the intro block entirely — do not show a placeholder, CTA, or Instagram biography.",
      },
    },
  },
};
