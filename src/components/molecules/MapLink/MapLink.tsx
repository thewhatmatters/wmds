import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../../../lib/cn";
import { Badge } from "../../atoms/Badge/Badge";
import { Button } from "../../atoms/Button/Button";
import type { ButtonRole, ButtonSize } from "../../atoms/Button/buttonStyles";
import {
  mapLinkActionsClasses,
  mapLinkAddressClasses,
  mapLinkAreaClasses,
  mapLinkAreasClasses,
  mapLinkRootClasses,
  type MapLinkMode,
  type MapLinkProvider,
} from "./mapLinkStyles";

export { mapLinkModes, mapLinkProviders, type MapLinkMode, type MapLinkProvider } from "./mapLinkStyles";

/** Layout only: width, margins, grid placement. */
export type MapLinkLayoutClassName = string;

/** One line, single spaces: what the maps site is asked for. */
export function mapLinkQuery(place: string): string {
  return place.replace(/\s+/g, " ").trim();
}

/**
 * The address of a place on a maps site. `directions` (default) routes there from where the visitor
 * is; `search` shows it on the map. An empty place gives `undefined`, so no dead link is drawn.
 */
export function mapLinkHref(
  place: string,
  { provider = "google", mode = "directions" }: { provider?: MapLinkProvider; mode?: MapLinkMode } = {},
): string | undefined {
  const query = mapLinkQuery(place);
  if (query === "") return undefined;
  const encoded = encodeURIComponent(query);
  if (provider === "apple") {
    return mode === "directions" ? `https://maps.apple.com/?daddr=${encoded}` : `https://maps.apple.com/?q=${encoded}`;
  }
  return mode === "directions"
    ? `https://www.google.com/maps/dir/?api=1&destination=${encoded}`
    : `https://www.google.com/maps/search/?api=1&query=${encoded}`;
}

export type MapLinkProps = Omit<HTMLAttributes<HTMLDivElement>, "children" | "className" | "role"> & {
  /** The street address, shown as written (a line break stays a line break) and used as the destination. */
  address?: string;
  /**
   * What the map is asked for when that differs from `address`: the business's name with its address
   * drops the pin on the business, and a business with no storefront gives its home town.
   */
  place?: string;
  /** The towns or neighbourhoods served, shown as a list. Use with `place`, or beside an `address`. */
  areas?: readonly string[];
  /** Names the `areas` list for screen readers. */
  areasLabel?: string;
  /** The link's words. "Get directions" by default, "See it on the map" for `mode="search"`. */
  label?: ReactNode;
  mode?: MapLinkMode;
  provider?: MapLinkProvider;
  /** Opens the map in a new tab and says so. Off by default: on a phone the link opens the maps app. */
  newTab?: boolean;
  /** The link's **Button** role and size. */
  role?: ButtonRole;
  size?: ButtonSize;
  /** More buttons beside the link: "Call", "Book a visit". */
  actions?: ReactNode;
  className?: MapLinkLayoutClassName;
};

/**
 * Where a business is and a way there: the address as text, a link that opens the maps site with
 * directions, and for a business that travels, the towns it serves. No embedded map.
 */
export function MapLink({
  address,
  place,
  areas,
  areasLabel = "Areas we serve",
  label,
  mode = "directions",
  provider = "google",
  newTab = false,
  role = "primary",
  size = "md",
  actions,
  className,
  ...rest
}: MapLinkProps) {
  const href = mapLinkHref(place ?? address ?? "", { provider, mode });
  const hasAddress = address != null && address.trim() !== "";
  const hasAreas = areas != null && areas.length > 0;

  return (
    <div {...rest} data-slot="map-link" data-provider={provider} className={cn(mapLinkRootClasses, className)}>
      {hasAddress ? (
        <address data-slot="address" className={mapLinkAddressClasses}>
          {address.trim()}
        </address>
      ) : null}
      {hasAreas ? (
        <ul role="list" aria-label={areasLabel} data-slot="areas" className={mapLinkAreasClasses}>
          {areas.map((area) => (
            <li key={area} className={mapLinkAreaClasses}>
              <Badge emphasis="outline" mono size="md">
                {area}
              </Badge>
            </li>
          ))}
        </ul>
      ) : null}
      {href != null || actions != null ? (
        <div data-slot="actions" className={mapLinkActionsClasses}>
          {href != null ? (
            <Button role={role} size={size} external newTab={newTab} render={<a href={href} data-slot="link" />}>
              {label ?? (mode === "search" ? "See it on the map" : "Get directions")}
            </Button>
          ) : null}
          {actions}
        </div>
      ) : null}
    </div>
  );
}
