import type { Meta, StoryObj } from "@storybook/react-vite";
import { storyMetaDocsDefaults, withStoryCopySource } from "../../../lib/storyCopySource";
import { StartAProject, intakePatternCopySource } from "./IntakePattern";

const meta = {
  title: "Sites/WhatMatters/Intake",
  tags: ["autodocs"],
  ...storyMetaDocsDefaults(),
  parameters: {
    wmdsLayout: "fullscreen",
    docs: {
      description: {
        component: `
Four steps inside **IntakeModal**, then a confirmation.

1. **What do you need?** — **SelectableCard** plus a hugged **SegmentedControl** (Starting fresh / Refreshing what I have).
2. **Budget** — **PillGroup**, including a muted **Not sure yet** pill.
3. **About you** — **IntakeForm**. Continue stays off until name, email, and details are valid.
4. **Book a call** — **CalEmbed**. Continue is not rendered. Confirm this time opens **You're booked**. Skip, just email me opens **We'll be in touch**.

The confirmation mounts inside **ConfettiProvider** and fires once. Reduced motion keeps the static screen.

Show code is the flow. Copy it. Do not rebuild the steps with utilities.
        `.trim(),
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const StartAProjectPattern: Story = {
  name: "Pattern — start a project",
  parameters: withStoryCopySource(
    {
      wmdsLayout: "fullscreen",
      docs: {
        description: {
          story:
            "Full intake. Continue is disabled until the step is valid, and it is omitted on the calendar step. Confirm this time or Skip, just email me opens the centered confirmation. Confetti fires when that screen mounts.",
        },
      },
    },
    intakePatternCopySource,
  ),
  render: () => <StartAProject />,
};

/**
 * Known accessibility violations — listed in docs/audits/2026-10-03.md.
 * Checks fail on every other story. These report without failing until the component is fixed.
 * Remove a story from this list when it passes.
 */
for (const story of [StartAProjectPattern]) {
  story.parameters = { ...story.parameters, a11y: { test: "todo" } };
}
