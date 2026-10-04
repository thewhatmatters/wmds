import { createContext, useContext, useMemo, type ReactNode } from "react";
import { cn } from "../../../lib/cn";
import {
  descriptionListNameClasses,
  descriptionListRootClasses,
  descriptionListRowLayoutClasses,
  descriptionListRuleClasses,
  descriptionListValueClasses,
  descriptionListValueFlowClasses,
  type DescriptionListLayout,
  type DescriptionListRule,
  type DescriptionListVariant,
} from "./descriptionListStyles";

export {
  descriptionListLayouts,
  descriptionListRules,
  descriptionListVariants,
  type DescriptionListLayout,
  type DescriptionListRule,
  type DescriptionListVariant,
} from "./descriptionListStyles";

/** Layout-only — width, margin, or grid placement. */
export type DescriptionListLayoutClassName = string;

export interface DescriptionListProps {
  /** Rows' default layout: `inline` (value beside the name, default) or `stacked` (value under it). */
  layout?: DescriptionListLayout;
  /** The hairline between rows: `solid` (default), `dotted`, or `none`. */
  rule?: DescriptionListRule;
  /** `sans` (default) — caption name, body value. `mono` — eyebrow name, mono caps value (metadata). */
  variant?: DescriptionListVariant;
  /** **DescriptionList.Item** rows. */
  children: ReactNode;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  className?: DescriptionListLayoutClassName;
}

export interface DescriptionListItemProps {
  /** The name — rendered as `dt`. */
  name: ReactNode;
  /** The value — text, one or more **Badge**, or a row of **Button** — rendered as `dd`. */
  children: ReactNode;
  /** Overrides the list's `layout` for this row — for example `stacked` for a row of actions. */
  layout?: DescriptionListLayout;
  className?: DescriptionListLayoutClassName;
}

interface DescriptionListContextValue {
  layout: DescriptionListLayout;
  rule: DescriptionListRule;
  variant: DescriptionListVariant;
}

const DescriptionListContext = createContext<DescriptionListContextValue>({
  layout: "inline",
  rule: "solid",
  variant: "sans",
});

/**
 * A list of facts — each row a name and a value, with a rule between rows. Renders `dl`, `dt`, and
 * `dd`. Values take text, **Badge** tags, or **Button** actions.
 */
function DescriptionListRoot({
  layout = "inline",
  rule = "solid",
  variant = "sans",
  children,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  className,
}: DescriptionListProps) {
  const contextValue = useMemo(() => ({ layout, rule, variant }), [layout, rule, variant]);

  return (
    <DescriptionListContext.Provider value={contextValue}>
      <dl
        className={cn(descriptionListRootClasses, className)}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        data-rule={rule}
        data-variant={variant}
      >
        {children}
      </dl>
    </DescriptionListContext.Provider>
  );
}

function DescriptionListItem({ name, children, layout: layoutProp, className }: DescriptionListItemProps) {
  const context = useContext(DescriptionListContext);
  const layout = layoutProp ?? context.layout;

  return (
    <div
      className={cn(descriptionListRowLayoutClasses[layout], descriptionListRuleClasses[context.rule], className)}
      data-layout={layout}
    >
      <dt className={descriptionListNameClasses[context.variant]}>{name}</dt>
      <dd className={cn(descriptionListValueClasses[context.variant], descriptionListValueFlowClasses[layout])}>
        {children}
      </dd>
    </div>
  );
}

export const DescriptionList = Object.assign(DescriptionListRoot, {
  Item: DescriptionListItem,
});
