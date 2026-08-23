"use client";

import { MoreVertical } from "lucide-react";
import { MoreMenuPanel } from "./MoreMenuPanel";
import type { MoreMenuProps } from "./types";

export type {
  MoreMenuAlignment,
  MoreMenuDivider,
  MoreMenuItem,
  MoreMenuOption,
  MoreMenuPlacement,
  MoreMenuProps,
  MoreMenuSection,
} from "./types";

/**
 * Overflow menu with an icon-only trigger — [Astryx MoreMenu](https://astryx.atmeta.com/components/MoreMenu).
 * Default kebab trigger; positioning, portal, and keyboard live in the internal panel module.
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
    <MoreMenuPanel
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
