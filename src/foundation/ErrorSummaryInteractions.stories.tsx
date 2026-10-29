import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { ContactFormExample } from "../components/molecules/ErrorSummary/ErrorSummary.stories";

/** Errors and validation V4, V5, V6: run via `npm run test:interactions`. */
const meta = {
  title: "Internal/Interactions/ErrorSummary",
  tags: ["test", "!dev", "!autodocs"],
  parameters: { docs: { disable: true }, wmdsLayout: "padded" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const SubmitWithErrors: Story = {
  name: "a failed submit focuses the summary, its links focus the fields, and typed values stay",
  render: () => <ContactFormExample />,
  play: async ({ canvas }) => {
    const email = canvas.getByLabelText("Email");
    await userEvent.type(email, "randy@");
    await userEvent.click(canvas.getByRole("button", { name: "Send message" }));

    const summary = await canvas.findByRole("alert", { name: "There's a problem" });
    await waitFor(() => expect(summary).toHaveFocus());
    const links = within(summary).getAllByRole("link");
    await expect(links.map((link) => link.textContent)).toEqual(["Enter your name", "Enter an email address like name@example.com"]);

    // V4: what was typed stays (the field is the same element: showing a message doesn't remount it).
    await expect(canvas.getByLabelText("Email")).toBe(email);
    await expect(email).toHaveValue("randy@");
    // V6: the inline message is announced as an error.
    await waitFor(() => expect(email).toHaveAccessibleDescription(/Error: Enter an email address like name@example.com/));

    // V5: a link moves focus to its field.
    await userEvent.click(links[1]);
    await expect(email).toHaveFocus();
  },
};
