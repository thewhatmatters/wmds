/** Join conditional class names — filters falsy parts. */
export function cn(...parts: Array<string | false | undefined | null>) {
  return parts.filter(Boolean).join(" ");
}
