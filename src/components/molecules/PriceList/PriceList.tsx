import { createContext, useContext, useMemo, type ReactNode } from "react";
import { cn } from "../../../lib/cn";
import {
  priceListNameClasses,
  priceListNoteClasses,
  priceListPriceClasses,
  priceListRootClasses,
  priceListRowClasses,
  priceListRuleClasses,
  type PriceListLayout,
  type PriceListRule,
  type PriceListSize,
} from "./priceListStyles";

export {
  priceListLayouts,
  priceListRules,
  priceListSizes,
  type PriceListLayout,
  type PriceListRule,
  type PriceListSize,
} from "./priceListStyles";

/** Layout-only — width, margin, or grid placement. */
export type PriceListLayoutClassName = string;

export interface PriceListProps {
  /**
   * Where the note sits: `inline` (default — beside the name from `md`, under it on phones) or
   * `stacked` (under the name at every width).
   */
  layout?: PriceListLayout;
  /** The hairline under each row: `solid` (default), `dotted`, or `none`. */
  rule?: PriceListRule;
  /** `md` (default) — label-size names. `lg` — names and prices a step up, in the heading face. */
  size?: PriceListSize;
  /** **PriceList.Item** rows. */
  children: ReactNode;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  className?: PriceListLayoutClassName;
}

export interface PriceListItemProps {
  /** What is priced: a dish, a service, a ticket. */
  name: ReactNode;
  /** One short line about it: what's in it, what it covers. */
  note?: ReactNode;
  /** The price as written ("$18", "$4.50 a slice", "Market price"). End-aligned, in tabular figures. */
  price: ReactNode;
  className?: PriceListLayoutClassName;
}

interface PriceListContextValue {
  layout: PriceListLayout;
  rule: PriceListRule;
  size: PriceListSize;
}

const PriceListContext = createContext<PriceListContextValue>({ layout: "inline", rule: "solid", size: "md" });

/**
 * A priced list — a menu, a rate card. Each row is a name, an optional note and an end-aligned price,
 * with one rule under it. It wraps to fit a phone; it never scrolls sideways.
 */
function PriceListRoot({
  layout = "inline",
  rule = "solid",
  size = "md",
  children,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  className,
}: PriceListProps) {
  const contextValue = useMemo(() => ({ layout, rule, size }), [layout, rule, size]);

  return (
    <PriceListContext.Provider value={contextValue}>
      <ul
        // list-none drops the list role in Safari; the explicit role keeps "list, 12 items".
        role="list"
        className={cn(priceListRootClasses[layout], className)}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        data-layout={layout}
        data-rule={rule}
        data-size={size}
      >
        {children}
      </ul>
    </PriceListContext.Provider>
  );
}

function PriceListItem({ name, note, price, className }: PriceListItemProps) {
  const { layout, rule, size } = useContext(PriceListContext);

  return (
    <li className={cn(priceListRowClasses, priceListRuleClasses[rule], className)}>
      <p className={priceListNameClasses[size]} data-slot="name">
        {name}
      </p>
      {note != null && note !== false ? (
        <p className={priceListNoteClasses[layout]} data-slot="note">
          {note}
        </p>
      ) : null}
      <p className={priceListPriceClasses(layout, size)} data-slot="price">
        {price}
      </p>
    </li>
  );
}

export const PriceList = Object.assign(PriceListRoot, {
  Item: PriceListItem,
});
