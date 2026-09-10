import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Camera, FileText, Image, Pencil } from "lucide-react";
import { expect, userEvent, waitFor } from "storybook/test";
import { FloatingActionButton } from "../components/molecules/FloatingActionButton/FloatingActionButton";

const meta = {
  title: "Internal/Interactions/Floating action button",
  tags: ["test", "!dev", "!autodocs"],
  parameters: {
    docs: { disable: true },
    wmdsLayout: "centered",
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const OpenSelectAndDismiss: Story = {
  name: "FloatingActionButton — open, select, and dismiss",
  render: function FloatingActionButtonInteractionExample() {
    const [selected, setSelected] = useState("none");

    return (
      <div className="relative h-[420px] w-[360px]">
        <p data-testid="fab-selection">Selected: {selected}</p>
        <FloatingActionButton
          className="absolute bottom-4 right-4"
          items={[
            { id: "camera", label: "Camera", icon: <Camera /> },
            { id: "image", label: "Image", icon: <Image /> },
            { id: "file", label: "File", icon: <FileText /> },
            { id: "edit", label: "Edit", icon: <Pencil /> },
          ]}
          onAction={setSelected}
          backdrop
        />
      </div>
    );
  },
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole("button", { name: /open actions/i });
    await userEvent.click(trigger);

    await waitFor(() => {
      expect(canvas.getByRole("button", { name: /camera/i })).toBeVisible();
      expect(canvas.getByRole("button", { name: /edit/i })).toBeVisible();
    });

    await userEvent.click(canvas.getByRole("button", { name: /edit/i }));
    await expect(canvas.getByTestId("fab-selection")).toHaveTextContent("Selected: edit");

    await waitFor(() => {
      expect(canvas.queryByRole("button", { name: /camera/i })).not.toBeInTheDocument();
    });

    await userEvent.click(canvas.getByRole("button", { name: /open actions/i }));
    await userEvent.keyboard("{Escape}");

    await waitFor(() => {
      expect(canvas.queryByRole("button", { name: /camera/i })).not.toBeInTheDocument();
    });
    await expect(canvas.getByRole("button", { name: /open actions/i })).toHaveFocus();
  },
};
