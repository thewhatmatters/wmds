/** Query keys for a URL-backed sheet: `?sheet=<kind>&id=<id>`. */
export const sheetParamKey = "sheet";
export const sheetParamIdKey = "id";

export interface SheetParamValue {
  kind: string | null;
  id: string | null;
}

const ABSOLUTE_URL = /^[a-z][a-z0-9+.-]*:/i;
const PARSE_BASE = "http://wmds.invalid";

function parse(url: string | URL): { parsed: URL; absolute: boolean } {
  const text = typeof url === "string" ? url : url.href;
  return { parsed: new URL(text, PARSE_BASE), absolute: ABSOLUTE_URL.test(text) };
}

/** The sheet a URL asks for — `kind` and `id` are `null` when it asks for none. */
export function readSheetParam(url: string | URL): SheetParamValue {
  const { parsed } = parse(url);
  const kind = parsed.searchParams.get(sheetParamKey);
  const id = parsed.searchParams.get(sheetParamIdKey);
  if (kind == null || kind === "" || id == null || id === "") {
    return { kind: null, id: null };
  }
  return { kind, id };
}

/**
 * The URL with `?sheet=<kind>&id=<id>` set, or both removed when `id` is `null`.
 * Other query parameters and the hash are kept; a relative URL stays relative.
 */
export function withSheetParam(url: string | URL, id: string | null, kind: string): string {
  const { parsed, absolute } = parse(url);
  if (id == null || id === "") {
    parsed.searchParams.delete(sheetParamKey);
    parsed.searchParams.delete(sheetParamIdKey);
  } else {
    parsed.searchParams.set(sheetParamKey, kind);
    parsed.searchParams.set(sheetParamIdKey, id);
  }
  return absolute ? parsed.href : `${parsed.pathname}${parsed.search}${parsed.hash}`;
}
