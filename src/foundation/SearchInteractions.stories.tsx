import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState, type FormEvent } from "react";
import { type ButtonStatus } from "../components/atoms/Button/buttonStatusStyles";
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

function SlowSignup() {
  const [send, setSend] = useState<ButtonStatus>("idle");
  const [sends, setSends] = useState(0);
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSends((count) => count + 1);
    setSend("loading");
    window.setTimeout(() => setSend("success"), 900);
  };
  return (
    <form className="w-96" onSubmit={submit} noValidate>
      <Field label="Email address">
        <Search
          type="email"
          name="email"
          actionLabel="Subscribe"
          actionType="submit"
          actionStatus={send}
          actionStatusLabels={{ loading: "Sending…", success: "Subscribed", error: "Try again" }}
        />
      </Field>
      <p>Sends: {sends}</p>
    </form>
  );
}

export const ActionShowsTheSend: Story = {
  name: "actionStatus: the inset action shows the send, and sends once",
  render: () => <SlowSignup />,
  play: async ({ canvas }) => {
    const field = canvas.getByLabelText("Email address");
    const button = canvas.getByRole("button", { name: "Subscribe" });
    const atRest = { width: button.offsetWidth, height: button.offsetHeight };
    // The plain action's height (36px in md), with the box left open so the touch layer isn't cut off.
    expect(atRest.height).toBe(36);
    expect(getComputedStyle(button).overflow).toBe("visible");
    expect(button.getAttribute("aria-busy")).toBeNull();

    await userEvent.type(field, "randy@example.com");
    await userEvent.click(button);
    await waitFor(() => expect(button.getAttribute("aria-busy")).toBe("true"));
    // The same button, still holding the focus, at the same size, saying what is happening.
    expect(button.isConnected).toBe(true);
    expect(document.activeElement).toBe(button);
    expect(button.getAttribute("aria-disabled")).toBe("true");
    expect(button.hasAttribute("disabled")).toBe(false);
    // The old label leaves as the new one arrives, so wait for the swap to finish.
    await waitFor(() => expect(button.textContent).toBe("Sending…"));
    expect(button.offsetWidth).toBe(atRest.width);
    expect(button.offsetHeight).toBe(atRest.height);

    // A second press, and Enter in the field, don't send again. The pointer can't reach the busy button;
    // a click from the keyboard or from script is stopped by the button itself.
    expect(getComputedStyle(button).pointerEvents).toBe("none");
    button.click();
    await userEvent.keyboard("{Enter}");
    expect(document.activeElement).toBe(button);
    await userEvent.type(field, "{Enter}");
    expect(canvas.getByText("Sends: 1")).toBeTruthy();

    await waitFor(() => expect(button.dataset.status).toBe("success"), { timeout: 3000 });
    await waitFor(() => expect(button.textContent).toBe("Subscribed"));
    expect(button.getAttribute("aria-busy")).toBeNull();
    expect(button.offsetWidth).toBe(atRest.width);
    expect(button.offsetHeight).toBe(atRest.height);
    expect(canvas.getByText("Sends: 1")).toBeTruthy();
    // Let the label's swap finish before the accessibility pass reads the colours.
    await new Promise((resolve) => window.setTimeout(resolve, 600));
  },
};

export const ActionSendSizes: Story = {
  name: "actionStatus: sm, md and lg are the plain action's height in every state",
  render: () => (
    <div className="flex w-96 flex-col gap-4">
      {(["sm", "md", "lg"] as const).map((size) => (
        <Search key={size} size={size} label={`Email ${size} plain`} actionLabel="Subscribe" />
      ))}
      {(["sm", "md", "lg"] as const).map((size) =>
        (["idle", "loading", "success", "error"] as const).map((state) => (
          <Search
            key={`${size}-${state}`}
            size={size}
            label={`Email ${size} ${state}`}
            actionLabel="Subscribe"
            actionStatus={state}
            actionStatusLabels={{ loading: "Sending…", success: "Subscribed", error: "Try again" }}
          />
        )),
      )}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const all = [...canvasElement.querySelectorAll<HTMLElement>("button")];
    const plain = all.filter((button) => button.dataset.status == null);
    const buttons = all.filter((button) => button.dataset.status != null);
    expect(plain).toHaveLength(3);
    expect(buttons).toHaveLength(12);
    // What the plain action measures in sm, md and lg: turning `actionStatus` on must not change it.
    const want = { xs: plain[0]!.offsetHeight, sm: plain[1]!.offsetHeight, md: plain[2]!.offsetHeight };
    expect(want).toEqual({ xs: 32, sm: 36, md: 40 });
    for (const button of buttons) {
      expect(button.offsetHeight).toBe(want[button.dataset.size as keyof typeof want]);
      // Inside the pill, top and bottom: the action never grows past the shell.
      const shell = button.closest<HTMLElement>("[data-variant]")!;
      expect(button.getBoundingClientRect().top).toBeGreaterThan(shell.getBoundingClientRect().top);
      expect(button.getBoundingClientRect().bottom).toBeLessThan(shell.getBoundingClientRect().bottom);
    }
    // One width per size, whatever the state.
    for (const size of ["xs", "sm", "md"]) {
      const widths = new Set(buttons.filter((button) => button.dataset.size === size).map((button) => button.offsetWidth));
      expect(widths.size).toBe(1);
    }
  },
};
