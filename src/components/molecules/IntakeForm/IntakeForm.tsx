import { useState } from "react";
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

function intakeFieldError(
  field: IntakeTouchedField,
  values: IntakeAboutValues,
  detailsMax: number,
): string | undefined {
  if (field === "name") {
    return values.name.trim().length === 0 ? "Enter your name." : undefined;
  }
  if (field === "email") {
    if (values.email.trim().length === 0) {
      return "Please enter a valid email address.";
    }
    return emailPattern.test(values.email.trim())
      ? undefined
      : "Please enter a valid email address.";
  }
  if (field === "url") {
    return isIntakeUrlValid(values.url) ? undefined : "Please enter a valid URL.";
  }
  if (values.details.trim().length === 0) {
    return "Tell us a bit about the project.";
  }
  if (values.details.length > detailsMax) {
    return `Keep project details to ${detailsMax} characters.`;
  }
  return undefined;
}

/**
 * About-you step — **Field** rows for name, email, company, link, and project details.
 * Required fields show **Input** / **TextArea** `status` + `message` on blur when invalid.
 * Company and link stay optional. The details description is the character counter.
 */
export function IntakeForm({
  values,
  onChange,
  detailsMax = intakeDetailsMax,
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

  return (
    <div className={cn(intakeFormClasses, className)}>
      <Field label="Name">
        <Input
          aria-label="Name"
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
          type="email"
          autoComplete="email"
          value={values.email}
          status={emailError != null ? "error" : undefined}
          message={emailError}
          onBlur={() => markTouched("email")}
          onChange={(event) => onChange({ ...values, email: event.target.value })}
        />
      </Field>
      <Field label="Company" description="Optional">
        <Input
          aria-label="Company"
          autoComplete="organization"
          value={values.company}
          onChange={(event) => onChange({ ...values, company: event.target.value })}
        />
      </Field>
      <Field label="Link" description="Optional">
        <Input
          aria-label="Link"
          type="url"
          inputMode="url"
          autoComplete="url"
          placeholder="https://"
          value={values.url}
          status={urlError != null ? "error" : undefined}
          message={urlError}
          onBlur={() => markTouched("url")}
          onChange={(event) => onChange({ ...values, url: event.target.value })}
        />
      </Field>
      <Field
        label="Project details"
        description={detailsError == null ? `${values.details.length} / ${detailsMax}` : undefined}
      >
        <TextArea
          aria-label="Project details"
          rows={5}
          maxLength={detailsMax}
          value={values.details}
          placeholder="What should feel different when this work is done?"
          status={detailsError != null ? "error" : undefined}
          message={detailsError}
          onBlur={() => markTouched("details")}
          onChange={(event) => onChange({ ...values, details: event.target.value })}
        />
      </Field>
    </div>
  );
}
