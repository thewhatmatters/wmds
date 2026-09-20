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
            "Show code is the product contract for owner Past brands add / edit / reorder. Items are ordered `{ id, name, logo_key?, result_label? }` — `name` required, max 8, **Brand name** ~40. Missing or unknown `logo_key` uses a letter **Avatar**; curated keys use a WMDS knockout mark. Optional **Result** is a creator-entered phrase (max 24) — empty/whitespace omits the **Chip**. **MoreMenu** stays in **Card.Header** `end` (Edit, Add result / Clear result, Remove). Empty is ghost **Add brands you've worked with**. Copy that source into PitchKit. Do not reconstruct from Storybook-only example files, and do not ship ExampleGridControls.",
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
            "Show code is the product contract for public Past brands. Render ordered `{ id, name, logo_key?, result_label? }` in a static row when the set fits, or a hover/focus-pausing marquee only when it overflows. `prefers-reduced-motion` wraps statically. Letter **Avatar** when `logo_key` is missing or unknown; **Chip** only when `result_label` is non-empty after trim. Omit the section when the list is empty. No year, summary, Graph KPIs, or public Add result. Copy that source into PitchKit. Do not reconstruct from Storybook-only example files, and do not ship ExampleGridControls.",
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
          "Owner Past brands is empty. Keep the **Past brands** heading and show ghost **Add brands you've worked with**. The Add dialog is **Brand name** (~40), optional **Result** (max 24), optional curated **Logo**, primary **Add**.",
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

export const PastBrandsOwnerOverflow: Story = {
  name: "State — past brands owner overflow",
  args: {
    chrome: "owner",
    brandState: "overflow",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Owner list at the max of 8. Keep stacked editor cards with reorder and **MoreMenu** — the public marquee is not used here.",
      },
    },
  },
};

export const PastBrandsPublicOverflow: Story = {
  name: "State — past brands public overflow",
  args: {
    chrome: "public",
    brandState: "overflow",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Eight public brands overflow the rail, so the row marquees. Hover or focus pauses. Reduced motion wraps statically. Brands without a result omit the **Chip**.",
      },
    },
  },
};
