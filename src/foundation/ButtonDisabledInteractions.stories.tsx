import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, userEvent, waitFor } from "storybook/test";
import { Button } from "../components/atoms/Button/Button";
import { buttonRoles } from "../components/atoms/Button/buttonStyles";
import { IconButton } from "../components/atoms/IconButton/IconButton";

/**
 * Buttons rule U6: a disabled button stays in the tab order (`aria-disabled`), ignores presses,
 * shows no press feedback, and says why. Run via `npm run test:interactions`.
 */
const meta = {
  title: "Internal/Interactions/Button disabled",
  tags: ["test", "!dev", "!autodocs"],
  parameters: { docs: { disable: true }, wmdsLayout: "padded" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const DisabledStaysReachable: Story = {
  name: "a disabled button is reachable by keyboard, ignores presses and says why",
  render: function DisabledRender() {
    const [presses, setPresses] = useState(0);
    const [submits, setSubmits] = useState(0);
    return (
      <form
        className="flex flex-col items-start gap-4"
        onSubmit={(event) => {
          event.preventDefault();
          setSubmits((count) => count + 1);
        }}
      >
        <input aria-label="Email" defaultValue="randy@example.com" />
        <div className="flex flex-wrap items-center gap-3">
          <Button type="submit" disabled disabledReason="Add a date to send the request" onClick={() => setPresses((n) => n + 1)}>
            Send request
          </Button>
          <IconButton aria-label="Delete draft" icon={<span aria-hidden>×</span>} disabled onClick={() => setPresses((n) => n + 1)} />
        </div>
        <div className="flex flex-wrap gap-2">
          {buttonRoles.map((role) => (
            <Button key={role} role={role} disabled>
              {`Disabled ${role}`}
            </Button>
          ))}
        </div>
        <p data-testid="presses">{presses}</p>
        <p data-testid="submits">{submits}</p>
      </form>
    );
  },
  play: async ({ canvas }) => {
    const send = canvas.getByRole("button", { name: "Send request" });
    expect(send).toHaveAttribute("aria-disabled", "true");
    expect(send).not.toHaveAttribute("disabled");
    // The reason is shown and read with the button.
    expect(send).toHaveAccessibleDescription("Add a date to send the request");

    // Keyboard reaches it, and Enter, Space and a click do nothing.
    await userEvent.click(canvas.getByLabelText("Email"));
    await userEvent.tab();
    expect(send).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    await userEvent.keyboard(" ");
    send.click();
    // Enter in the field doesn't submit through the disabled default button either.
    await userEvent.click(canvas.getByLabelText("Email"));
    await userEvent.keyboard("{Enter}");
    await userEvent.tab();
    await userEvent.tab();
    const remove = canvas.getByRole("button", { name: "Delete draft" });
    expect(remove).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    await waitFor(() => expect(canvas.getByTestId("submits")).toHaveTextContent("0"));
    expect(canvas.getByTestId("presses")).toHaveTextContent("0");

    // No press feedback, and every role is dimmed the same way.
    for (const role of buttonRoles) {
      const button = canvas.getByRole("button", { name: `Disabled ${role}` });
      expect(getComputedStyle(button).opacity).toBe("0.7");
      expect(getComputedStyle(button).pointerEvents).toBe("none");
    }
  },
};
