/**
 * Required and optional fields Q8: autocomplete tokens the browser or a password manager fills.
 * Autofill paints over a badge inside the field, so these fields say "(optional)" in the label instead.
 * bin/wmds-check.mjs keeps the same list (a unit test holds them together).
 */
export const autofillTokens = [
  "name",
  "honorific-prefix",
  "given-name",
  "additional-name",
  "family-name",
  "honorific-suffix",
  "nickname",
  "email",
  "username",
  "new-password",
  "current-password",
  "one-time-code",
  "organization",
  "organization-title",
  "street-address",
  "address-line1",
  "address-line2",
  "address-line3",
  "address-level1",
  "address-level2",
  "address-level3",
  "address-level4",
  "country",
  "country-name",
  "postal-code",
  "tel",
  "tel-country-code",
  "tel-national",
  "tel-area-code",
  "tel-local",
  "tel-extension",
] as const;

/** True when an `autocomplete` value names an autofill field ("shipping postal-code" counts). */
export function isAutofillField(autoComplete: string | undefined): boolean {
  if (autoComplete == null) return false;
  const tokens = autoComplete.toLowerCase().split(/\s+/);
  return tokens.some((token) => (autofillTokens as readonly string[]).includes(token));
}
