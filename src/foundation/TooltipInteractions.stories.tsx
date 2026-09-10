import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Info } from "lucide-react";
import { expect, userEvent, waitFor } from "storybook/test";
import { Button } from "../components/atoms/Button/Button";
import { IconButton } from "../components/atoms/IconButton/IconButton";
import { Tooltip } from "../components/atoms/Tooltip/Tooltip";

const meta = {
  title: "Internal/Interactions/Tooltip",
  tags: ["test", "!dev", "!autodocs"],
  parameters: {
    docs: { disable: true },
    wmdsLayout: "centered",
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const HoverFocusEscapeAndAria: Story = {
  name: "Tooltip — hover, focus, Escape, and ARIA",
  render: () => (
    <Tooltip.Provider delay={0}>
      <Tooltip>
        <Tooltip.Trigger
          render={
            <IconButton
              icon={<Info />}
              aria-label="About scoring"
              title=""
            />
          }
        />
        <Tooltip.Content>How recommendation scoring works</Tooltip.Content>
      </Tooltip>
    </Tooltip.Provider>
  ),
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole("button", { name: "About scoring" });

    await expect(trigger).toHaveAttribute("data-base-ui-tooltip-trigger");
    const tooltipId = trigger.getAttribute("aria-describedby");
    expect(tooltipId).toBeTruthy();
    await userEvent.hover(trigger);
    let hoveredTooltip: HTMLElement | null = null;
    await waitFor(() => {
      hoveredTooltip = trigger.ownerDocument.getElementById(tooltipId!);
      expect(hoveredTooltip).toBeVisible();
    });
    expect(hoveredTooltip).toHaveAttribute("role", "tooltip");
    await expect(hoveredTooltip).toHaveTextContent("How recommendation scoring works");
    await expect(trigger).toHaveAttribute("aria-describedby", tooltipId);

    await userEvent.unhover(trigger);
    await waitFor(() => {
      expect(trigger.ownerDocument.getElementById(tooltipId!)).not.toBeInTheDocument();
    });

    await userEvent.tab();
    await expect(trigger).toHaveFocus();
    await waitFor(() => {
      expect(trigger.ownerDocument.getElementById(tooltipId!)).toBeVisible();
    });

    await userEvent.keyboard("{Escape}");
    await waitFor(() => {
      expect(trigger.ownerDocument.getElementById(tooltipId!)).not.toBeInTheDocument();
    });
    await expect(trigger).toHaveFocus();
  },
};

export const ControlledProviderDelay: Story = {
  name: "Tooltip — controlled state and provider delay",
  render: function ControlledProviderDelayExample() {
    const [open, setOpen] = useState(false);

    return (
      <Tooltip.Provider delay={120}>
        <Tooltip open={open} onOpenChange={setOpen}>
          <Tooltip.Trigger
            render={<Button role="secondary">Delay details</Button>}
          />
          <Tooltip.Content>Shared provider delay</Tooltip.Content>
        </Tooltip>
        <output data-testid="tooltip-state">{open ? "open" : "closed"}</output>
      </Tooltip.Provider>
    );
  },
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole("button", { name: "Delay details" });

    await expect(trigger).toHaveAttribute("data-base-ui-tooltip-trigger");
    const tooltipId = trigger.getAttribute("aria-describedby");
    expect(tooltipId).toBeTruthy();
    await expect(canvas.getByTestId("tooltip-state")).toHaveTextContent("closed");
    await userEvent.hover(trigger);
    await expect(trigger.ownerDocument.getElementById(tooltipId!)).not.toBeInTheDocument();

    await waitFor(() => {
      expect(trigger.ownerDocument.getElementById(tooltipId!)).toBeVisible();
      expect(canvas.getByTestId("tooltip-state")).toHaveTextContent("open");
    });

    await userEvent.unhover(trigger);
    await waitFor(() => {
      expect(trigger.ownerDocument.getElementById(tooltipId!)).not.toBeInTheDocument();
      expect(canvas.getByTestId("tooltip-state")).toHaveTextContent("closed");
    });
  },
};
