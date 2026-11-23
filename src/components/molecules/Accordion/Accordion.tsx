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
  accordionChevronSlotPlainClasses,
  accordionHeadingClasses,
  accordionItemCapsuleClasses,
  accordionItemCapsuleClosedClasses,
  accordionItemCapsuleOpenClasses,
  accordionItemFlushClasses,
  accordionItemListClasses,
  accordionItemPlainClasses,
  accordionLabelPlainClasses,
  accordionLabelPlainReadingClasses,
  accordionLabelRowClasses,
  accordionLeadingSlotClasses,
  accordionLeadingSlotPlainClasses,
  accordionPanelContentCapsuleClasses,
  accordionPanelContentFlushClasses,
  accordionPanelContentListClasses,
  accordionPanelInnerClasses,
  accordionPanelSizeClasses,
  type AccordionSize,
  accordionRootCapsuleClasses,
  accordionRootListClasses,
  accordionRootListInsetClasses,
  accordionRootPlainClasses,
  accordionTrailingClusterClasses,
  accordionTrailingClusterPlainClasses,
  accordionTriggerCapsuleClasses,
  accordionTriggerFlushClasses,
  accordionTriggerInteractiveClasses,
  accordionTriggerListClasses,
  accordionTriggerPlainClasses,
  type AccordionVariant,
} from "./accordionStyles";

export type { AccordionSize, AccordionVariant } from "./accordionStyles";
export { accordionSizes, accordionVariants } from "./accordionStyles";

/** Layout-only — not for row colors or panel styling overrides. */
export type AccordionLayoutClassName = string;

/** Heading level for each expandable row's header. */
export type AccordionHeadingLevel = 2 | 3 | 4 | 5 | 6;

interface AccordionContextValue {
  variant: AccordionVariant;
  flush: boolean;
  size: AccordionSize;
  headingLevel?: AccordionHeadingLevel;
}

const AccordionContext = createContext<AccordionContextValue>({
  variant: "plain",
  flush: false,
  size: "ui",
});

export interface AccordionProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  /** `list` — inset panel with dividers. `capsule` — separated rounded rows. `plain` — rows only. */
  variant?: AccordionVariant;
  /** List only — drop standalone shell (radius, fill, shadow) inside **Card.Body**. */
  inset?: boolean;
  /**
   * Plain only — no horizontal inset, so labels and panels line up with the text around the
   * accordion (a filter side panel). The hover band reaches 8px past each edge.
   */
  flush?: boolean;
  /**
   * Panel text: `ui` (default, 14px muted, app UI) or `reading` (17px regular in ink) for answers people read,
   * such as an FAQ or a services list (Body rules B7, B9).
   */
  size?: AccordionSize;
  /**
   * Wraps each expandable row's button in a heading of this level (`3` gives `<h3><button>…</button></h3>`), so
   * screen-reader users can jump between rows by heading. Set it when the rows are a page's content, such as an FAQ:
   * one level below the section's own heading. Leave it out for app UI (filters, task rows). Looks the same.
   */
  headingLevel?: AccordionHeadingLevel;
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
  flush: flushProp = false,
  size = "ui",
  headingLevel,
  className,
  children,
  ...props
}: AccordionProps) {
  const flush = flushProp && variant === "plain";
  const contextValue = useMemo(
    () => ({ variant, flush, size, headingLevel }),
    [variant, flush, size, headingLevel],
  );

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
      <div
        className={cn(rootClasses, className)}
        data-variant={variant}
        data-inset={inset ? "true" : undefined}
        data-flush={flush ? "true" : undefined}
        data-size={size === "reading" ? "reading" : undefined}
        {...props}
      >
        {children}
      </div>
    </AccordionContext.Provider>
  );
}

function accordionItemShellClasses(variant: AccordionVariant, open: boolean, flush: boolean): string {
  if (flush) {
    return accordionItemFlushClasses;
  }
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
  const { variant, flush, size, headingLevel } = useContext(AccordionContext);
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

  const plain = variant === "plain";
  const labelClasses = plain
    ? size === "reading"
      ? accordionLabelPlainReadingClasses
      : accordionLabelPlainClasses
    : accordionLabelRowClasses;

  const triggerClasses = flush
    ? accordionTriggerFlushClasses
    : variant === "capsule"
      ? accordionTriggerCapsuleClasses
      : plain
        ? accordionTriggerPlainClasses
        : accordionTriggerListClasses;

  const panelContentClasses = flush
    ? accordionPanelContentFlushClasses
    : variant === "capsule"
      ? accordionPanelContentCapsuleClasses
      : accordionPanelContentListClasses;

  const trigger = (
    <>
      {leading != null ? (
        <span className={plain ? accordionLeadingSlotPlainClasses : accordionLeadingSlotClasses}>{leading}</span>
      ) : null}
      <span className={labelClasses}>{label}</span>
      {trailing != null ? (
        <span className={plain ? accordionTrailingClusterPlainClasses : accordionTrailingClusterClasses}>
          {trailing}
        </span>
      ) : null}
      {expandable ? (
        <span className={plain ? accordionChevronSlotPlainClasses : accordionChevronSlotClasses} aria-hidden>
          <span className={cn(accordionChevronRotateClasses, open && accordionChevronOpenClasses)}>
            <ButtonIcon size="xs">
              <ChevronDown strokeWidth={2.2} />
            </ButtonIcon>
          </span>
        </span>
      ) : null}
    </>
  );

  const Heading = headingLevel ? (`h${headingLevel}` as const) : null;
  const button = (
    <button
      type="button"
      className={cn(triggerClasses, accordionTriggerInteractiveClasses)}
      aria-expanded={open}
      aria-controls={panelId}
      onClick={() => setOpen(!open)}
    >
      {trigger}
    </button>
  );

  return (
    <div className={cn(accordionItemShellClasses(variant, open, flush), className)}>
      {expandable ? (
        Heading ? (
          <Heading className={accordionHeadingClasses}>{button}</Heading>
        ) : (
          button
        )
      ) : (
        <div className={triggerClasses}>{trigger}</div>
      )}

      {expandable ? (
        <div className="motion-collapse" data-visible={open ? "true" : "false"}>
          <div id={panelId} className={accordionPanelInnerClasses}>
            <div className={accordionPanelSizeClasses(panelContentClasses, size)}>{children}</div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export const Accordion = Object.assign(AccordionRoot, {
  Item: AccordionItem,
});
