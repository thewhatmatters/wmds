import {
  createContext,
  useCallback,
  useContext,
  useId,
  useMemo,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { ChevronDown } from "lucide-react";
import { ButtonIcon } from "../../atoms/Button/ButtonIcon";
import { cn } from "../../../lib/cn";
import {
  accordionChevronOpenClasses,
  accordionChevronRotateClasses,
  accordionChevronSlotClasses,
  accordionItemCapsuleClasses,
  accordionItemCapsuleClosedClasses,
  accordionItemCapsuleOpenClasses,
  accordionItemListClasses,
  accordionItemPlainClasses,
  accordionLabelPlainClasses,
  accordionLabelRowClasses,
  accordionLeadingSlotClasses,
  accordionPanelContentClasses,
  accordionPanelInnerClasses,
  accordionRootCapsuleClasses,
  accordionRootListClasses,
  accordionRootListInsetClasses,
  accordionRootPlainClasses,
  accordionTrailingClusterClasses,
  accordionTriggerBaseClasses,
  accordionTriggerInteractiveClasses,
  type AccordionVariant,
} from "./accordionStyles";

export type { AccordionVariant } from "./accordionStyles";
export { accordionVariants } from "./accordionStyles";

/** Layout-only — not for row colors or panel styling overrides. */
export type AccordionLayoutClassName = string;

interface AccordionContextValue {
  variant: AccordionVariant;
}

const AccordionContext = createContext<AccordionContextValue>({
  variant: "plain",
});

export interface AccordionProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  /** `list` — inset panel with dividers. `capsule` — separated rounded rows. `plain` — rows only. */
  variant?: AccordionVariant;
  /** List only — drop standalone shell (radius, fill, shadow) inside **Card.Body**. */
  inset?: boolean;
  className?: AccordionLayoutClassName;
}

export interface AccordionItemProps {
  /** Primary header label. */
  label: ReactNode;
  /** Leading column — icon, **Status** ring, **Badge**, or any node. */
  leading?: ReactNode;
  /** Trailing cluster — meta, **Badge**, actions; chevron sits outside. */
  trailing?: ReactNode;
  /** Panel body — omit for static (non-expandable) rows. */
  children?: ReactNode;
  /** Uncontrolled expand. */
  defaultOpen?: boolean;
  /** Controlled expand. */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: AccordionLayoutClassName;
}

function AccordionRoot({
  variant = "plain",
  inset = false,
  className,
  children,
  ...props
}: AccordionProps) {
  const contextValue = useMemo(() => ({ variant }), [variant]);

  const rootClasses = (() => {
    if (variant === "list") {
      return inset ? accordionRootListInsetClasses : accordionRootListClasses;
    }
    if (variant === "capsule") {
      return accordionRootCapsuleClasses;
    }
    return accordionRootPlainClasses;
  })();

  return (
    <AccordionContext.Provider value={contextValue}>
      <div className={cn(rootClasses, className)} data-variant={variant} data-inset={inset ? "true" : undefined} {...props}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
}

function accordionItemShellClasses(variant: AccordionVariant, open: boolean): string {
  if (variant === "list") {
    return accordionItemListClasses;
  }
  if (variant === "capsule") {
    return cn(
      accordionItemCapsuleClasses,
      open ? accordionItemCapsuleOpenClasses : accordionItemCapsuleClosedClasses,
    );
  }
  return accordionItemPlainClasses;
}

function AccordionItem({
  label,
  leading,
  trailing,
  children,
  defaultOpen = false,
  open: openProp,
  onOpenChange,
  className,
}: AccordionItemProps) {
  const { variant } = useContext(AccordionContext);
  const panelId = useId();
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isControlled = openProp !== undefined;
  const open = isControlled ? openProp : internalOpen;
  const expandable = children != null;

  const setOpen = useCallback(
    (next: boolean) => {
      if (!isControlled) {
        setInternalOpen(next);
      }
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange],
  );

  const labelClasses = variant === "plain" ? accordionLabelPlainClasses : accordionLabelRowClasses;

  const trigger = (
    <>
      {leading != null ? <span className={accordionLeadingSlotClasses}>{leading}</span> : null}
      <span className={labelClasses}>{label}</span>
      {trailing != null ? (
        <span className={accordionTrailingClusterClasses}>{trailing}</span>
      ) : null}
      {expandable ? (
        <span className={accordionChevronSlotClasses} aria-hidden>
          <span className={cn(accordionChevronRotateClasses, open && accordionChevronOpenClasses)}>
            <ButtonIcon size="xs">
              <ChevronDown strokeWidth={2.2} />
            </ButtonIcon>
          </span>
        </span>
      ) : null}
    </>
  );

  return (
    <div className={cn(accordionItemShellClasses(variant, open), className)}>
      {expandable ? (
        <button
          type="button"
          className={cn(accordionTriggerBaseClasses, accordionTriggerInteractiveClasses)}
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen(!open)}
        >
          {trigger}
        </button>
      ) : (
        <div className={accordionTriggerBaseClasses}>{trigger}</div>
      )}

      {expandable ? (
        <div className="motion-collapse" data-visible={open ? "true" : "false"}>
          <div id={panelId} className={accordionPanelInnerClasses}>
            <div className={accordionPanelContentClasses}>{children}</div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export const Accordion = Object.assign(AccordionRoot, {
  Item: AccordionItem,
});
