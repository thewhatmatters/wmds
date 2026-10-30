import type { SelectOption } from "./Select";

/** The 50 US states plus DC, as two-letter postal abbreviations (Form layout L7). */
const usStateCodes = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "DC", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS",
  "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC",
  "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY",
] as const;

/**
 * Options for a State **Select**: `<Select label="State" options={usStateOptions} width="2ch"
 * name="state" autoComplete="address-level1" />`. Value and label are both the abbreviation, which is
 * what browsers autofill into `address-level1`.
 */
export const usStateOptions: SelectOption[] = usStateCodes.map((code) => ({ value: code, label: code }));
