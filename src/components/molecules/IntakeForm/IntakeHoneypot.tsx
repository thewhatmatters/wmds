import { useId } from "react";

/** Props for **IntakeHoneypot**. */
export interface IntakeHoneypotProps {
  /** Field name the server checks. Default `fax`: plausible to a bot, never a real question here. */
  name?: string;
  value: string;
  onChange: (value: string) => void;
}

/**
 * Contact and booking forms T4: spam checks without a puzzle. A field people never see or reach, hidden
 * from screen readers too (`aria-hidden`, `tabindex="-1"`, no autofill), that bots fill in. Drop any
 * request where it has a value, on the server, alongside rate limits and a time-to-submit check. Never
 * a CAPTCHA.
 */
export function IntakeHoneypot({ name = "fax", value, onChange }: IntakeHoneypotProps) {
  const id = useId();
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] size-px overflow-hidden" data-intake-honeypot="">
      <label htmlFor={id}>Leave this empty</label>
      <input
        id={id}
        name={name}
        type="text"
        tabIndex={-1}
        autoComplete="off"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}

/** True when the honeypot was filled: treat the request as spam (check this on the server too). */
export function isIntakeHoneypotFilled(value: string | null | undefined): boolean {
  return (value ?? "").trim().length > 0;
}
