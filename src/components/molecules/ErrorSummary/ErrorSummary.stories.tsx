import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState, type FormEvent } from "react";
import { storyMetaDocsDefaults, withStoryCopySource } from "../../../lib/storyCopySource";
import { Button } from "../../atoms/Button/Button";
import { Input } from "../../atoms/Input/Input";
import { ErrorSummary, type ErrorSummaryItem } from "./ErrorSummary";

const meta = {
  title: "Components/ErrorSummary",
  component: ErrorSummary,
  tags: ["autodocs"],
  ...storyMetaDocsDefaults(),
  parameters: {
    wmdsLayout: "padded",
    docs: {
      description: {
        component: `
## Usage

After a failed submit, put **ErrorSummary** at the top of the form (Errors and validation V5). It says "There's a problem", lists one link per error in the same words as the field's own message, and takes focus so a screen reader starts here. Each link moves focus to its field. The fields keep their inline messages.

| Prop | What it does |
|------|--------------|
| \`errors\` | \`{ field, message }[]\` — \`field\` is the input's \`id\`; empty renders nothing |
| \`title\` | Default "There's a problem" |
| \`as\` | Heading level, \`h2\` (default) or \`h3\` |
| \`focusOnShow\` | Take focus when the errors change (default \`true\`) |

## Best practices

- **Do** show it only after submit; validate single fields on blur, not while typing.
- **Do** word each line like the field's message: an instruction for an empty field ("Enter your email address"), a description for a broken rule ("Enter an email address like name@example.com").
- **Don't** clear what people typed, and don't write "invalid", "please" or "oops".
        `.trim(),
      },
    },
  },
} satisfies Meta<typeof ErrorSummary>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A two-field form that validates on submit and shows the summary plus inline messages. */
export function ContactFormExample() {
  const [errors, setErrors] = useState<ErrorSummaryItem[]>([]);
  const messageFor = (field: string) => errors.find((error) => error.field === field)?.message as string | undefined;

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const next: ErrorSummaryItem[] = [];
    if (String(data.get("name") ?? "").trim() === "") next.push({ field: "contact-name", message: "Enter your name" });
    const email = String(data.get("email") ?? "").trim();
    if (email === "") next.push({ field: "contact-email", message: "Enter your email address" });
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) next.push({ field: "contact-email", message: "Enter an email address like name@example.com" });
    setErrors(next);
  }

  return (
    <form noValidate onSubmit={submit} className="flex max-w-md flex-col gap-6">
      <ErrorSummary errors={errors} />
      <Input id="contact-name" name="name" label="Name" status={messageFor("contact-name") ? "error" : undefined} message={messageFor("contact-name")} />
      <Input id="contact-email" name="email" type="email" label="Email" status={messageFor("contact-email") ? "error" : undefined} message={messageFor("contact-email")} />
      <div>
        <Button type="submit">Send message</Button>
      </div>
    </form>
  );
}

export const ContactForm: Story = {
  name: "Pattern — form with an error summary",
  args: { errors: [] },
  render: () => <ContactFormExample />,
  parameters: withStoryCopySource(
    { docs: { description: { story: "Submit it empty: the summary takes focus, each link moves to its field, and the fields keep their messages and what was typed." } } },
    `
"use client";

import { useState, type FormEvent } from "react";
import { Button, ErrorSummary, Input, type ErrorSummaryItem } from "@thewhatmatters/wmds";

export function ContactFormExample() {
  const [errors, setErrors] = useState<ErrorSummaryItem[]>([]);
  const messageFor = (field: string) => errors.find((error) => error.field === field)?.message as string | undefined;

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const next: ErrorSummaryItem[] = [];
    if (String(data.get("name") ?? "").trim() === "") next.push({ field: "contact-name", message: "Enter your name" });
    const email = String(data.get("email") ?? "").trim();
    if (email === "") next.push({ field: "contact-email", message: "Enter your email address" });
    else if (!/^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$/.test(email)) next.push({ field: "contact-email", message: "Enter an email address like name@example.com" });
    setErrors(next);
  }

  return (
    <form noValidate onSubmit={submit} className="flex max-w-md flex-col gap-6">
      <ErrorSummary errors={errors} />
      <Input id="contact-name" name="name" label="Name" status={messageFor("contact-name") ? "error" : undefined} message={messageFor("contact-name")} />
      <Input id="contact-email" name="email" type="email" label="Email" status={messageFor("contact-email") ? "error" : undefined} message={messageFor("contact-email")} />
      <div>
        <Button type="submit">Send message</Button>
      </div>
    </form>
  );
}
`,
  ),
};

export const TwoErrors: Story = {
  name: "Reference — two errors",
  args: {
    focusOnShow: false,
    errors: [
      { field: "x-name", message: "Enter your name" },
      { field: "x-email", message: "Enter an email address like name@example.com" },
    ],
  },
};
