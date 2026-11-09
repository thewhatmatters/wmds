import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState, type FormEvent } from "react";
import { expect, userEvent, waitFor } from "storybook/test";
import { Field } from "../components/molecules/Field/Field";
import { Search } from "../components/molecules/Search/Search";

/**
 * Browser interaction tests for **Search** as a one-field signup — run via `npm run test:interactions`.
 * `actionType="submit"` sends the form from the inset button and from Enter; `status` + `message` open the band
 * under the pill without remounting the field.
 */
const meta = {
  title: "Internal/Interactions/Search",
  tags: ["test", "!dev", "!autodocs"],
  parameters: {
    docs: { disable: true },
    wmdsLayout: "centered",
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function Signup() {
  const [error, setError] = useState<string | undefined>();
  const [sent, setSent] = useState<string | null>(null);
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const email = String(new FormData(event.currentTarget).get("email") ?? "").trim();
    if (!email.includes("@") || !email.includes(".")) {
      setError("Enter an email address, like name@example.com.");
      return;
    }
    setError(undefined);
    setSent(email);
  };
  return (
    <form className="w-96" onSubmit={submit} noValidate>
      <Field label="Email address">
        <Search type="email" name="email" actionLabel="Subscribe" actionType="submit" status={error ? "error" : undefined} message={error} />
      </Field>
      {sent ? <p>Sent {sent}</p> : null}
    </form>
  );
}

export const SubmitsAndShowsTheMessage: Story = {
  name: "submit action sends the form; a message opens the band and keeps the field",
  render: () => <Signup />,
  play: async ({ canvas }) => {
    const field = canvas.getByLabelText("Email address");
    const button = canvas.getByRole("button", { name: "Subscribe" });
    expect(button.getAttribute("type")).toBe("submit");

    // A wrong address: the band opens, the field is marked invalid and described by the message.
    await userEvent.type(field, "randy@");
    await userEvent.click(button);
    const alert = await canvas.findByRole("alert");
    expect(alert.textContent).toContain("Enter an email address");
    expect(field.getAttribute("aria-invalid")).toBe("true");
    expect(field.getAttribute("aria-describedby")).toContain(alert.id);
    // Same <input>: the text and focus survive the band opening (Errors and validation V4).
    expect(canvas.getByLabelText("Email address")).toBe(field);
    expect((field as HTMLInputElement).value).toBe("randy@");

    // Enter sends the form too.
    await userEvent.type(field, "example.com{Enter}");
    await waitFor(() => expect(canvas.getByText("Sent randy@example.com")).toBeTruthy());
    expect(canvas.queryByRole("alert")).toBeNull();
    expect(field.getAttribute("aria-invalid")).toBeNull();
  },
};
