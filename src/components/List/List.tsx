"use client";

import {
  createContext,
  useContext,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import "../../foundation/collapse.css";
import { motionTransition } from "../../foundation/motion";
import { cn } from "../../lib/cn";
import {
  listItemButtonClasses,
  listItemChevronClasses,
  listItemDetailLabelClasses,
  listItemDetailMetaClasses,
  listItemDetailRailClasses,
  listItemDetailRailLaneClasses,
  listItemLabelClasses,
  listItemMediaClasses,
  listItemMetaClasses,
  listItemPanelChevronSpacerClasses,
  listItemPanelInnerClasses,
  listItemRowClasses,
  listItemTrailingClasses,
  listItemVariantClasses,
  listRootVariantClasses,
  type ListVariant,
} from "./listStyles";

export type { ListVariant };

export interface ListProps extends HTMLAttributes<HTMLDivElement> {
  /** `contained` — dividers in a shared shell (pair with `Card padding="none"`). `separated` — raised row chips. */
  variant?: ListVariant;
  children: ReactNode;
}

export interface ListItemProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export interface ListItemButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export interface ListItemMediaProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
}

export interface ListItemLabelProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
}

export interface ListItemMetaProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
}

export interface ListItemTrailingProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
}

export interface ListItemChevronProps extends HTMLAttributes<HTMLSpanElement> {
  /** Chevron rotates 180° when the row panel is open. */
  open?: boolean;
}

export interface ListItemPanelProps extends HTMLAttributes<HTMLDivElement> {
  open?: boolean;
  children: ReactNode;
}

export interface ListItemDetailProps extends HTMLAttributes<HTMLDivElement> {
  label: ReactNode;
  meta?: ReactNode;
}

export interface ListItemRowProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

const ListVariantContext = createContext<ListVariant>("contained");

function useListVariant() {
  return useContext(ListVariantContext);
}

function ListRoot({ variant = "contained", className, children, ...props }: ListProps) {
  return (
    <ListVariantContext.Provider value={variant}>
      <div
        role="list"
        className={cn(listRootVariantClasses[variant], className)}
        data-variant={variant}
        {...props}
      >
        {children}
      </div>
    </ListVariantContext.Provider>
  );
}

function ListItem({ className, children, ...props }: ListItemProps) {
  const variant = useListVariant();
  return (
    <div
      role="listitem"
      className={cn(
        "overflow-hidden transition-[border-radius,background-color]",
        motionTransition("base"),
        listItemVariantClasses[variant],
        variant === "separated" && "hover:bg-secondary-hover",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

/** Static row shell — use when the row is not a button (ledger lines, read-only rows). */
function ListItemRow({ className, children, ...props }: ListItemRowProps) {
  return (
    <div className={cn(listItemRowClasses, className)} {...props}>
      {children}
    </div>
  );
}

function ListItemButton({ className, children, type = "button", ...props }: ListItemButtonProps) {
  return (
    <button type={type} className={cn(listItemButtonClasses, className)} {...props}>
      {children}
    </button>
  );
}

function ListItemMedia({ className, children, ...props }: ListItemMediaProps) {
  return (
    <span className={cn(listItemMediaClasses, className)} {...props}>
      {children}
    </span>
  );
}

function ListItemLabel({ className, children, ...props }: ListItemLabelProps) {
  return (
    <span className={cn(listItemLabelClasses, className)} {...props}>
      {children}
    </span>
  );
}

function ListItemMeta({ className, children, ...props }: ListItemMetaProps) {
  return (
    <span className={cn(listItemMetaClasses, className)} {...props}>
      {children}
    </span>
  );
}

function ListItemTrailing({ className, children, ...props }: ListItemTrailingProps) {
  return (
    <span className={cn(listItemTrailingClasses, className)} {...props}>
      {children}
    </span>
  );
}

function ListItemChevron({ open = false, className, ...props }: ListItemChevronProps) {
  return (
    <span
      aria-hidden
      className={cn(
        listItemChevronClasses,
        motionTransition("slower", "out-expo"),
        open && "rotate-180",
        className,
      )}
      {...props}
    >
      <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M6 9l6 6 6-6" />
      </svg>
    </span>
  );
}

function ListItemPanel({ open = false, className, children, ...props }: ListItemPanelProps) {
  return (
    <div
      className={cn("motion-collapse", className)}
      data-visible={open ? "true" : "false"}
      {...props}
    >
      <div className="min-h-0 overflow-hidden">
        <div className={listItemPanelInnerClasses}>
          {children}
          <span aria-hidden className={listItemPanelChevronSpacerClasses} />
        </div>
      </div>
    </div>
  );
}

function ListItemDetailRail({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span aria-hidden className={listItemDetailRailLaneClasses}>
      <span className={cn(listItemDetailRailClasses, className)} {...props} />
    </span>
  );
}

function ListItemDetailGroup({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex min-w-0 flex-1 flex-col gap-[length:var(--spacing-1-5)]", className)}
      {...props}
    >
      {children}
    </div>
  );
}

function ListItemDetail({ label, meta, className, ...props }: ListItemDetailProps) {
  return (
    <div className={cn("flex items-center justify-between gap-[length:var(--spacing-3)]", className)} {...props}>
      <span className={listItemDetailLabelClasses}>{label}</span>
      {meta != null ? <span className={listItemDetailMetaClasses}>{meta}</span> : null}
    </div>
  );
}

export const List = Object.assign(ListRoot, {
  Item: ListItem,
  ItemRow: ListItemRow,
  ItemButton: ListItemButton,
  ItemMedia: ListItemMedia,
  ItemLabel: ListItemLabel,
  ItemMeta: ListItemMeta,
  ItemTrailing: ListItemTrailing,
  ItemChevron: ListItemChevron,
  ItemPanel: ListItemPanel,
  ItemDetailRail: ListItemDetailRail,
  ItemDetailGroup: ListItemDetailGroup,
  ItemDetail: ListItemDetail,
});
