import { useEffect, useState } from "react";
import { Badge } from "../../atoms/Badge/Badge";
import { Input } from "../../atoms/Input/Input";
import { TextArea } from "../../atoms/TextArea/TextArea";
import { cn } from "../../../lib/cn";
import { Field } from "../Field/Field";
import { intakeDetailsMax, intakeFormClasses } from "./intakeFormStyles";

export { intakeDetailsMax } from "./intakeFormStyles";

/** Layout-only — width or margin. */
export type IntakeFormLayoutClassName = string;

export interface IntakeAboutValues {
  name: string;
  email: string;
  company: string;
  /** Optional project or site URL. */
  url: string;
  details: string;
}

export const intakeAboutEmpty: IntakeAboutValues = {
  name: "",
  email: "",
  company: "",
  url: "",
  details: "",
};

export interface IntakeFormProps {
  values: IntakeAboutValues;
  onChange: (values: IntakeAboutValues) => void;
  /** Character ceiling for project details. Default 400. */
  detailsMax?: number;
  /**
   * Shows the optional Company field. Default `false` (Required and optional Q9: ask less). Left out, the form closes up and
   * `values.company` keeps its value (empty), so `isIntakeAboutValid` and the app's submit code are
   * unchanged.
   */
  company?: boolean;
  /**
   * Shows the optional website field ("Your website", with an Optional badge). Default `true`. Left out, the form closes up and `values.url`
   * keeps its value (empty, which is valid).
   */
  link?: boolean;
  className?: IntakeFormLayoutClassName;
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type IntakeTouchedField = "name" | "email" | "url" | "details";

/** Empty link is fine. A filled value must be an http(s) URL. */
export function isIntakeUrlValid(value: string | null | undefined): boolean {
  const trimmed = (value ?? "").trim();
  if (trimmed.length === 0) {
    return true;
  }
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

/** Name, a real email, and details within the counter. Company and link stay optional. */
export function isIntakeAboutValid(
  values: IntakeAboutValues,
  detailsMax: number = intakeDetailsMax,
): boolean {
  return (
    values.name.trim().length > 0 &&
    emailPattern.test(values.email.trim()) &&
    isIntakeUrlValid(values.url) &&
    values.details.trim().length > 0 &&
    values.details.length <= detailsMax
  );
}

const characters = (count: number) => `${count} character${count === 1 ? "" : "s"}`;

/** Form layout L9: what the counter says. People may type past the limit; the counter tells them by how much. */
export function intakeCounterText(length: number, max: number): string {
  return length > max ? `You have ${characters(length - max)} too many` : `${characters(max - length)} left`;
}

/** The counter's words once typing pauses, so a screen reader hears it now and then, not on every keystroke. */
function useSettledText(text: string, delayMs = 1000): string {
  const [settled, setSettled] = useState(text);
  useEffect(() => {
    const timer = setTimeout(() => setSettled(text), delayMs);
    return () => clearTimeout(timer);
  }, [text, delayMs]);
  return settled;
}

function intakeFieldError(
  field: IntakeTouchedField,
  values: IntakeAboutValues,
  detailsMax: number,
): string | undefined {
  if (field === "name") {
    return values.name.trim().length === 0 ? "Enter your name." : undefined;
  }
  if (field === "email") {
    // Errors and validation V1: an empty field gets an instruction, a broken rule a description.
    if (values.email.trim().length === 0) {
      return "Enter your email address.";
    }
    return emailPattern.test(values.email.trim())
      ? undefined
      : "Enter an email address like name@example.com.";
  }
  if (field === "url") {
    return isIntakeUrlValid(values.url) ? undefined : "Enter a website address like example.com.";
  }
  if (values.details.trim().length === 0) {
    return "Tell us a bit about the project.";
  }
  if (values.details.length > detailsMax) {
    // One message, not two: the band repeats the counter's own words (Form layout L9).
    return intakeCounterText(values.details.length, detailsMax);
  }
  return undefined;
}

/**
 * About-you step — **Field** rows for name, email, company, link, and project details.
 * Required fields show **Input** / **TextArea** `status` + `message` on blur when invalid.
 * Name, email and details are required (`aria-required`); the website is optional and says so with a
 * badge. Company is off by default (`company` shows it, labelled "Company (optional)"); `link={false}`
 * leaves the website out (the short form: name, email, details). Hints sit above their fields; the details
 * counter sits below the box, next to what it counts.
 */
export function IntakeForm({
  values,
  onChange,
  detailsMax = intakeDetailsMax,
  company = false,
  link = true,
  className,
}: IntakeFormProps) {
  const [touched, setTouched] = useState<Partial<Record<IntakeTouchedField, boolean>>>({});

  function markTouched(field: IntakeTouchedField) {
    setTouched((current) => (current[field] ? current : { ...current, [field]: true }));
  }

  function errorFor(field: IntakeTouchedField): string | undefined {
    if (!touched[field]) {
      return undefined;
    }
    return intakeFieldError(field, values, detailsMax);
  }

  const nameError = errorFor("name");
  const emailError = errorFor("email");
  const urlError = errorFor("url");
  const detailsError = errorFor("details");
  const counterText = intakeCounterText(values.details.length, detailsMax);
  const announcedCounter = useSettledText(counterText);

  return (
    <div className={cn(intakeFormClasses, className)}>
      <Field label="Name">
        <Input
          aria-label="Name"
          aria-required
          autoComplete="name"
          value={values.name}
          status={nameError != null ? "error" : undefined}
          message={nameError}
          onBlur={() => markTouched("name")}
          onChange={(event) => onChange({ ...values, name: event.target.value })}
        />
      </Field>
      <Field label="Email">
        <Input
          aria-label="Email"
          aria-required
          type="email"
          autoComplete="email"
          value={values.email}
          status={emailError != null ? "error" : undefined}
          message={emailError}
          onBlur={() => markTouched("email")}
          onChange={(event) => onChange({ ...values, email: event.target.value })}
        />
      </Field>
      {company ? (
        // An autofill field: the word goes in the label, not a badge (Q8).
        <Field label="Company (optional)" description="So we can read up on you first.">
          <Input
            aria-label="Company (optional)"
            autoComplete="organization"
            value={values.company}
            onChange={(event) => onChange({ ...values, company: event.target.value })}
          />
        </Field>
      ) : null}
      {link ? (
        <Field label="Your website" description="So we can see what you have now.">
          <Input
            aria-label="Your website"
            endBadge={<Badge size="sm">Optional</Badge>}
            type="url"
            inputMode="url"
            autoComplete="url"
            value={values.url}
            status={urlError != null ? "error" : undefined}
            message={urlError}
            onBlur={() => markTouched("url")}
            onChange={(event) => onChange({ ...values, url: event.target.value })}
          />
        </Field>
      ) : null}
      {/* Labels and placeholders: the question is the label (a label can be a question, as on GOV.UK question pages). */}
      <Field
        label="What should feel different when this work is done?"
        // The counter line steps aside while the error band says the same words.
        counter={detailsError == null ? counterText : undefined}
      >
        {/* L9: no maxLength, so nothing pasted is cut; the counter and the error say how much to trim. */}
        <TextArea
          aria-label="What should feel different when this work is done?"
          aria-required
          rows={5}
          value={values.details}
          status={detailsError != null ? "error" : undefined}
          message={detailsError}
          onBlur={() => markTouched("details")}
          onChange={(event) => onChange({ ...values, details: event.target.value })}
        />
      </Field>
      <p className="sr-only" aria-live="polite" data-intake-counter-live="">
        {announcedCounter}
      </p>
    </div>
  );
}
