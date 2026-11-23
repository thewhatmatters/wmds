export const mapLinkProviders = ["google", "apple"] as const;

/** Which maps site the link opens. `google` (default) works in every browser and opens the app on phones that have it. */
export type MapLinkProvider = (typeof mapLinkProviders)[number];

export const mapLinkModes = ["directions", "search"] as const;

/** `directions` routes to the place from where the visitor is; `search` shows the place on the map. */
export type MapLinkMode = (typeof mapLinkModes)[number];

export const mapLinkRootClasses = "flex min-w-0 flex-col items-start gap-4";

/** `whitespace-pre-line` keeps an address typed on two lines on two lines. */
export const mapLinkAddressClasses =
  "m-0 min-w-0 whitespace-pre-line not-italic text-fg type-large [overflow-wrap:anywhere]";

export const mapLinkAreasClasses = "m-0 flex min-w-0 list-none flex-wrap gap-2 p-0";

export const mapLinkAreaClasses = "flex min-w-0";

export const mapLinkActionsClasses = "flex min-w-0 flex-wrap items-center gap-3";
