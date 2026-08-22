import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge } from "../Badge/Badge";
import { RestockCard } from "./RestockCard";

const meta = {
  title: "Examples/Restock agent card",
  component: RestockCard,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "**Design-system specimen — not a shipped component.** Recreates a target agent UI (restock prompt) using WMDS tokens and primitives only, to prove the system can generate real product surfaces. " +
          "If this pattern ships later, it would likely compose `Card`, `Button`, and extracted list-row pieces — not import this file as-is.",
      },
    },
  },
} satisfies Meta<typeof RestockCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Token-bound light-mode recreation — compare with the Paper artboard and reference frame. */
export const Default: Story = {
  args: {
    onAlternatives: () => {},
    onAccepted: () => {},
  },
};

/** Chip (startSlot) + plain pill directly adjacent — compare height alignment. */
export const InlineBadges: Story = {
  name: "Inline badges (chip + pill)",
  render: () => (
    <div className="flex max-w-[380px] flex-col gap-4 rounded-lg bg-surface p-4 shadow-md">
      <p className="text-xs font-medium uppercase tracking-wider text-muted">Side by side</p>
      <div className="flex flex-wrap items-center gap-2">
        <Badge
          variant="neutral"
          startSlot={
            <span className="flex size-3.5 shrink-0 items-center justify-center overflow-hidden rounded-full bg-bg p-[1px] outline outline-1 -outline-offset-1 outline-[color-mix(in_srgb,var(--color-fg)_10%,transparent)]">
              <img src="/brands/cone-king.svg" alt="" className="size-full object-contain" />
            </span>
          }
        >
          Cone King
        </Badge>
        <Badge variant="success">7 days</Badge>
      </div>
      <p className="text-xs font-medium uppercase tracking-wider text-muted">In prose (card body)</p>
      <p className="text-sm font-normal leading-[1.5] text-muted">
        Reorder waffle cones from{" "}
        <Badge
          variant="neutral"
          startSlot={
            <span className="flex size-3.5 shrink-0 items-center justify-center overflow-hidden rounded-full bg-bg p-[1px] outline outline-1 -outline-offset-1 outline-[color-mix(in_srgb,var(--color-fg)_10%,transparent)]">
              <img src="/brands/cone-king.svg" alt="" className="size-full object-contain" />
            </span>
          }
        >
          Cone King
        </Badge>{" "}
        with lead time{" "}
        <Badge variant="success" className="align-middle">7 days</Badge>
      </p>
    </div>
  ),
};
