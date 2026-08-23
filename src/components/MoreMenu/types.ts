import type { ReactNode, Ref } from "react";
import type { IconButtonSize, IconButtonVariant } from "../IconButton/IconButton";

export type MoreMenuPlacement = "below" | "above";
export type MoreMenuAlignment = "start" | "end";

export interface MoreMenuItem {
  id?: string;
  label: ReactNode;
  onClick?: () => void;
  icon?: ReactNode;
  disabled?: boolean;
  description?: ReactNode;
  endContent?: ReactNode;
  variant?: "default" | "destructive";
}

export interface MoreMenuDivider {
  type: "divider";
}

export interface MoreMenuSection {
  type: "section";
  id?: string;
  title?: string;
  items: MoreMenuItem[];
}

export type MoreMenuOption = MoreMenuItem | MoreMenuDivider | MoreMenuSection;

/** Internal — trigger slot passed into the menu panel by {@link MoreMenu}. */
export interface MoreMenuTriggerConfig {
  label: string;
  icon: ReactNode;
  variant: IconButtonVariant;
  size: IconButtonSize;
  disabled?: boolean;
  ref?: Ref<HTMLButtonElement>;
}

/** Internal — props for the portaled menu panel (not part of the public package API). */
export interface MoreMenuPanelProps {
  items: MoreMenuOption[];
  trigger: MoreMenuTriggerConfig;
  placement?: MoreMenuPlacement;
  alignment?: MoreMenuAlignment;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
  "data-testid"?: string;
}

export interface MoreMenuProps {
  /** Menu entries — actions, dividers, and sections (Astryx `items` shape). */
  items: MoreMenuOption[];
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
  placement?: MoreMenuPlacement;
  /** Menu alignment along the placement axis. @default "end" */
  alignment?: MoreMenuAlignment;
  /** Controlled open state. */
  open?: boolean;
  /** Fired when menu visibility changes. */
  onOpenChange?: (open: boolean) => void;
  className?: string;
  ref?: Ref<HTMLButtonElement>;
  "data-testid"?: string;
}
