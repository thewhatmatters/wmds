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
  details: string;
}

export const intakeAboutEmpty: IntakeAboutValues = {
  name: "",
  email: "",
  company: "",
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

/** Name, a real email, and details within the counter. Company stays optional. */
export function isIntakeAboutValid(
  values: IntakeAboutValues,
  detailsMax: number = intakeDetailsMax,
): boolean {
  return (
    values.name.trim().length > 0 &&
    emailPattern.test(values.email.trim()) &&
    values.details.trim().length > 0 &&
    values.details.length <= detailsMax
  );
}

/**
 * About-you step — **Field** rows for name, email, company, and project details.
 * The details description is the character counter. **TextArea** is unchanged.
 */
export function IntakeForm({
  values,
  onChange,
  detailsMax = intakeDetailsMax,
  className,
}: IntakeFormProps) {
  return (
    <div className={cn(intakeFormClasses, className)}>
      <Field label="Name">
        <Input
          aria-label="Name"
          autoComplete="name"
          value={values.name}
          onChange={(event) => onChange({ ...values, name: event.target.value })}
        />
      </Field>
      <Field label="Email">
        <Input
          aria-label="Email"
          type="email"
          autoComplete="email"
          value={values.email}
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
      <Field label="Project details" description={`${values.details.length} / ${detailsMax}`}>
        <TextArea
          aria-label="Project details"
          rows={5}
          maxLength={detailsMax}
          value={values.details}
          placeholder="What should feel different when this work is done?"
          onChange={(event) => onChange({ ...values, details: event.target.value })}
        />
      </Field>
    </div>
  );
}
