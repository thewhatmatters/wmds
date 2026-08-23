"use client";

import type { ReactNode, Ref } from "react";
import { MoreVertical } from "lucide-react";
import type { IconButtonSize, IconButtonVariant } from "../IconButton/IconButton";
import {
  DropdownMenu,
  type DropdownMenuAlignment,
  type DropdownMenuOption,
  type DropdownMenuPlacement,
} from "./DropdownMenu";

export type {
  DropdownMenuAlignment as MoreMenuAlignment,
  DropdownMenuDividerData as MoreMenuDivider,
  DropdownMenuItemData as MoreMenuItem,
  DropdownMenuOption as MoreMenuOption,
  DropdownMenuPlacement as MoreMenuPlacement,
  DropdownMenuSection as MoreMenuSection,
} from "./DropdownMenu";

export interface MoreMenuProps {
  /** Menu entries — actions, dividers, and sections (Astryx `items` shape). */
  items: DropdownMenuOption[];
  /**
   * Accessible label for the icon trigger — always used as `aria-label`.
   * @default "More options"
   */
  label?: string;
  /** Trigger visual variant. @default "ghost" */
  variant?: IconButtonVariant;
  /** Trigger size. @default "md" */
  size?: IconButtonSize;
  /** Override the default kebab icon. */
  icon?: ReactNode;
  /** Disable the trigger. */
  disabled?: boolean;
  /** Menu position relative to the trigger. @default "below" */
  placement?: DropdownMenuPlacement;
  /** Menu alignment along the placement axis. @default "end" */
  alignment?: DropdownMenuAlignment;
  /** Controlled open state. */
  open?: boolean;
  /** Fired when menu visibility changes. */
  onOpenChange?: (open: boolean) => void;
  className?: string;
  ref?: Ref<HTMLButtonElement>;
  "data-testid"?: string;
}

/**
 * Overflow menu with an icon-only trigger — thin wrapper around {@link DropdownMenu}
 * following [Astryx MoreMenu](https://astryx.atmeta.com/components/MoreMenu).
 */
export function MoreMenu({
  items,
  label = "More options",
  variant = "ghost",
  size = "md",
  icon = <MoreVertical strokeWidth={2} />,
  disabled = false,
  placement = "below",
  alignment = "end",
  open,
  onOpenChange,
  className,
  ref,
  "data-testid": testId,
}: MoreMenuProps) {
  return (
    <DropdownMenu
      className={className}
      data-testid={testId}
      items={items}
      placement={placement}
      alignment={alignment}
      open={open}
      onOpenChange={onOpenChange}
      trigger={{
        label,
        icon,
        variant,
        size,
        disabled,
        ref,
      }}
    />
  );
}
