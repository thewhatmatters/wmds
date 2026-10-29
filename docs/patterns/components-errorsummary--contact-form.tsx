// @thewhatmatters/wmds@0.4.35 · Pattern — form with an error summary
// Storybook: Components/ErrorSummary → Pattern — form with an error summary (?path=/story/components-errorsummary--contact-form)
// Show code — copy verbatim and keep this header; upgrades find pasted patterns by it.

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
