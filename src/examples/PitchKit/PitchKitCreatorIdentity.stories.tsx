import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  storyMetaDocsDefaults,
  withStoryCopySource,
} from "../../lib/storyCopySource";
import {
  creatorIdentityOwnerCopySource,
  creatorIdentityPublicCopySource,
} from "./creatorIdentityCopySource";
import { pitchKitCreatorIdentityStates } from "./pitchKitData";
import { PitchKitCreatorIdentityExample } from "./PitchKitCreatorIdentity";

const meta = {
  title: "Examples/PitchKit",
  component: PitchKitCreatorIdentityExample,
  ...storyMetaDocsDefaults(),
  argTypes: {
    identityState: {
      control: "select",
      options: pitchKitCreatorIdentityStates,
    },
    chrome: {
      control: "select",
      options: ["public", "owner"],
    },
  },
  args: {
    identityState: "resolved",
    chrome: "public",
  },
  parameters: {
    wmdsLayout: "fullscreen",
  },
} satisfies Meta<typeof PitchKitCreatorIdentityExample>;

export default meta;
type Story = StoryObj<typeof meta>;

export const CreatorIdentityPublic: Story = {
  name: "Pattern — creator identity (public)",
  args: {
    chrome: "public",
  },
  argTypes: {
    chrome: { table: { disable: true } },
  },
  parameters: withStoryCopySource(
    {
      docs: {
        description: {
          story:
            "Show code is the product contract for the public `/k/[handle]` nameplate — same identity strip as owner Settings, public surrounding chrome only. Graph `name` is hidden when missing; never invent a display name or bio. Followers stay supporting context, not a Stat. Copy that source into PitchKit. Do not reconstruct from PitchKitCreatorIdentity / pitchKitStyles, and do not ship ExampleGridControls.",
        },
      },
    },
    creatorIdentityPublicCopySource,
  ),
};

export const CreatorIdentityOwnerSettings: Story = {
  name: "Pattern — creator identity (owner settings)",
  args: {
    chrome: "owner",
  },
  argTypes: {
    chrome: { table: { disable: true } },
  },
  parameters: withStoryCopySource(
    {
      docs: {
        description: {
          story:
            "Show code is the product contract for Settings → Connected Instagram — same identity strip as the public nameplate, plus Share kit `/k/[handle]`, Copy, and connected / last sync. Professional chip is Business or Creator from Graph. Copy that source into PitchKit. Do not reconstruct from Storybook-only example files, and do not ship ExampleGridControls.",
        },
      },
    },
    creatorIdentityOwnerCopySource,
  ),
};

export const CreatorIdentityLoading: Story = {
  name: "State — creator identity loading",
  args: {
    identityState: "loading",
    chrome: "public",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Graph connect/refresh is in flight. Skeleton mirrors the identity strip — avatar circle plus name and handle lines. Owner Settings uses the same strip skeleton inside the Connected Instagram card. Do not invent a name, photo, bio, or follower Stat while loading. Controls → Chrome switches public nameplate vs owner Settings.",
      },
    },
  },
};

export const CreatorIdentityMissingPhoto: Story = {
  name: "State — creator identity missing photo",
  args: {
    identityState: "missingPhoto",
    chrome: "public",
  },
  parameters: {
    docs: {
      description: {
        story:
          "`profile_picture_url` was omitted. Avatar falls back to initials from Graph `name` (or the frozen handle when name is also missing). Do not invent a photo or bio. Controls → Chrome switches public nameplate vs owner Settings.",
      },
    },
  },
};

export const CreatorIdentityMissingName: Story = {
  name: "State — creator identity missing name",
  args: {
    identityState: "missingName",
    chrome: "public",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Graph `name` was omitted. Hide the display-name heading; never invent one. Frozen `@handle` and follower context stay. Avatar uses the handle for the accessible name and initials. Controls → Chrome switches public nameplate vs owner Settings.",
      },
    },
  },
};
