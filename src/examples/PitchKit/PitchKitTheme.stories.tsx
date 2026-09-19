import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  storyMetaDocsDefaults,
  withStoryCopySource,
} from "../../lib/storyCopySource";
import { PitchKitThemePickerOwnerExample } from "./PitchKitThemePicker";
import { themePickerOwnerCopySource } from "./themePickerCopySource";

const meta = {
  title: "Examples/PitchKit",
  ...storyMetaDocsDefaults(),
  parameters: {
    wmdsLayout: "fullscreen",
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const ThemePickerOwner: Story = {
  name: "Pattern — theme picker (owner)",
  render: () => <PitchKitThemePickerOwnerExample />,
  parameters: withStoryCopySource(
    {
      docs: {
        description: {
          story:
            "Show code is the product contract for owner kit theme. Enum light | dark | soft, default light. SegmentedControl updates the public-kit preview only. Save theme applies the fixture — do not auto-save on pick. Preview is Pattern — shareable PitchKit 1:1 (intro / past brands / Graph KPIs; showCreateBand={false} because this is the owner). Soft remaps the same semantic color roles to a warmer paper floor. Copy that source into PitchKit. Do not reconstruct from Storybook-only example files, and do not ship ExampleGridControls.",
        },
      },
    },
    themePickerOwnerCopySource,
  ),
};
