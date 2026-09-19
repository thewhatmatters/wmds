import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  storyMetaDocsDefaults,
  withStoryCopySource,
} from "../../lib/storyCopySource";
import {
  pastBrandsOwnerCopySource,
  pastBrandsPublicCopySource,
} from "./pastBrandsCopySource";
import {
  pitchKitCreatorIdentityStates,
  pitchKitPastBrandStates,
} from "./pitchKitData";
import { PitchKitPastBrandsExample } from "./PitchKitPastBrands";

const meta = {
  title: "Examples/PitchKit",
  component: PitchKitPastBrandsExample,
  ...storyMetaDocsDefaults(),
  argTypes: {
    identityState: {
      control: "select",
      options: pitchKitCreatorIdentityStates,
    },
    brandState: {
      control: "select",
      options: pitchKitPastBrandStates,
    },
    chrome: {
      control: "select",
      options: ["public", "owner"],
    },
  },
  args: {
    identityState: "resolved",
    brandState: "filled",
    chrome: "owner",
  },
  parameters: {
    wmdsLayout: "fullscreen",
  },
} satisfies Meta<typeof PitchKitPastBrandsExample>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PastBrandsOwner: Story = {
  name: "Pattern — past brands (owner)",
  args: {
    chrome: "owner",
    brandState: "filled",
  },
  argTypes: {
    chrome: { table: { disable: true } },
  },
  parameters: withStoryCopySource(
    {
      docs: {
        description: {
          story:
            "Show code is the product contract for owner Past brands add / edit / reorder. Items are ordered `{ id, name }` only — letter **Avatar**, no logo upload, max 8, **Brand name** ~40. Empty is ghost **Add brands you've worked with**. **MoreMenu** stays in **Card.Header** `end`. Copy that source into PitchKit. Do not reconstruct from Storybook-only example files, and do not ship ExampleGridControls.",
        },
      },
    },
    pastBrandsOwnerCopySource,
  ),
};

export const PastBrandsPublic: Story = {
  name: "Pattern — past brands (public)",
  args: {
    chrome: "public",
    brandState: "filled",
  },
  argTypes: {
    chrome: { table: { disable: true } },
  },
  parameters: withStoryCopySource(
    {
      docs: {
        description: {
          story:
            "Show code is the product contract for public Past brands. Render ordered `{ id, name }` rows with a letter **Avatar**. Omit the section when the list is empty. No year, summary, logo, or KPIs. Copy that source into PitchKit. Do not reconstruct from Storybook-only example files, and do not ship ExampleGridControls.",
        },
      },
    },
    pastBrandsPublicCopySource,
  ),
};

export const PastBrandsOwnerEmpty: Story = {
  name: "State — past brands owner empty",
  args: {
    chrome: "owner",
    brandState: "empty",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Owner Past brands is empty. Keep the **Past brands** heading and show ghost **Add brands you've worked with**. The Add dialog is label **Brand name**, primary **Add**, max length 40.",
      },
    },
  },
};

export const PastBrandsPublicOmit: Story = {
  name: "State — past brands public omit",
  args: {
    chrome: "public",
    brandState: "empty",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Public Past brands is empty. Omit the section entirely — no heading, no placeholder, no CTA.",
      },
    },
  },
};
