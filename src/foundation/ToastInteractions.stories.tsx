import type { Meta, StoryObj } from "@storybook/react-vite";
import { useEffect, useState } from "react";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { Button } from "../components/atoms/Button/Button";
import {
  Toaster,
  toast,
} from "../components/organisms/Toast/Toast";

const meta = {
  title: "Internal/Interactions/Toast",
  tags: ["test", "!dev", "!autodocs"],
  parameters: {
    docs: { disable: true },
    wmdsLayout: "centered",
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function ActionFixture() {
  const [restored, setRestored] = useState(false);

  useEffect(() => {
    toast.dismiss();
    return () => toast.dismiss();
  }, []);

  return (
    <>
      <Button
        onClick={() =>
          toast.add({
            title: "Post hidden",
            description: "The post was removed from your shareable kit.",
            duration: null,
            action: {
              label: "Undo",
              onClick: () => setRestored(true),
            },
          })
        }
      >
        Hide post
      </Button>
      {restored ? <p>Post restored</p> : null}
      <Toaster position="top-right" />
    </>
  );
}

export const ActionAndDismiss: Story = {
  name: "Toast — action and dismiss",
  render: () => <ActionFixture />,
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: /hide post/i }));

    const viewport = within(document.body).getByRole("list", {
      name: /notifications/i,
    });
    expect(viewport).toHaveAttribute("data-position", "top-right");
    expect(within(viewport).getByRole("status")).toHaveTextContent(
      /post hidden/i,
    );

    await userEvent.click(
      within(viewport).getByRole("button", { name: /undo/i }),
    );

    await waitFor(() => {
      expect(canvas.getByText(/post restored/i)).toBeVisible();
      expect(within(viewport).queryByRole("status")).not.toBeInTheDocument();
    });
  },
};

function StackFixture() {
  useEffect(() => {
    toast.dismiss();
    return () => toast.dismiss();
  }, []);

  return (
    <>
      <Button
        onClick={() => {
          ["First", "Second", "Third"].forEach((title) =>
            toast.add({ title, tone: "info", duration: null }),
          );
        }}
      >
        Add stack
      </Button>
      <Toaster position="top-center" maxVisible={2} />
    </>
  );
}

export const StackAndPlacement: Story = {
  name: "Toast — stack and placement",
  render: () => <StackFixture />,
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: /add stack/i }));

    const viewport = within(document.body).getByRole("list", {
      name: /notifications/i,
    });
    const notifications = Array.from(viewport.children);

    expect(viewport).toHaveAttribute("data-position", "top-center");
    expect(notifications).toHaveLength(2);
    expect(notifications[0]).toHaveTextContent("Third");
    expect(notifications[1]).toHaveTextContent("Second");
    expect(within(viewport).getAllByRole("status")).toHaveLength(1);
    expect(notifications[1]).toHaveAttribute("aria-hidden", "true");
  },
};
