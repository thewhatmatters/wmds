import { useRef, type ReactNode } from "react";
import { EllipsisVertical } from "lucide-react";
import { IconButton, type IconButtonSize } from "../../atoms/IconButton/IconButton";
import { Dropdown } from "../../molecules/Dropdown/Dropdown";
import {
  measureDropdownMenuStyle,
  type DropdownMenuMeasureRow,
} from "../../molecules/Dropdown/dropdownMenuPosition";
import { useDropdownMenu } from "../../molecules/Dropdown/useDropdownMenu";
import { cn } from "../../../lib/cn";
import { moreMenuRootClasses } from "./moreMenuStyles";

export type MoreMenuItem = {
  /** Stable action id — passed to `onAction`. */
  id: string;
  label: string;
  start?: ReactNode;
  end?: ReactNode;
  disabled?: boolean;
};

/** Layout-only — margin in Card header clusters. */
export type MoreMenuLayoutClassName = string;

export interface MoreMenuProps {
  /** Accessible name for the kebab trigger — e.g. "More market actions". */
  "aria-label": string;
  items: MoreMenuItem[];
  onAction?: (id: string) => void;
  /** Toolbar size — default **`sm`** (cluster md); use **`xs`** beside **SegmentedControl** / **Chip** `sm`. */
  size?: IconButtonSize;
  disabled?: boolean;
  className?: MoreMenuLayoutClassName;
}

function assertMoreMenuA11y(props: Pick<MoreMenuProps, "aria-label" | "items">) {
  if (props.items.length === 0) {
    console.warn("[WMDS MoreMenu] `items` must not be empty.");
  }
}

function toMeasureRows(items: MoreMenuItem[]): DropdownMenuMeasureRow[] {
  return items.map((item) => ({
    label: item.label,
    start: item.start,
    end: item.end,
  }));
}

/**
 * Kebab **IconButton** + floating action menu — composes **Dropdown.Menu** / **Dropdown.Item**.
 * Card header `end` slot pattern; menu right-aligns to the trigger (`align="end"`).
 */
export function MoreMenu({
  "aria-label": ariaLabel,
  items,
  onAction,
  size = "sm",
  disabled = false,
  className,
}: MoreMenuProps) {
  const triggerRef = useRef<HTMLButtonElement>(null);

  assertMoreMenuA11y({ "aria-label": ariaLabel, items });

  const menu = useDropdownMenu({
    rows: items,
    triggerRef,
    focus: "items",
    measure: () =>
      triggerRef.current == null
        ? null
        : measureDropdownMenuStyle(triggerRef.current, toMeasureRows(items), {
            align: "end",
            widthMode: "content",
          }),
  });

  function runAction(item: MoreMenuItem) {
    if (item.disabled) return;
    menu.close({ returnFocus: true });
    onAction?.(item.id);
  }

  return (
    <div {...menu.rootProps} className={cn(moreMenuRootClasses, className)}>
      <IconButton
        ref={triggerRef}
        size={size}
        role="ghost"
        icon={<EllipsisVertical strokeWidth={2} />}
        aria-label={ariaLabel}
        aria-haspopup="menu"
        aria-expanded={menu.triggerProps["aria-expanded"]}
        aria-controls={menu.triggerProps["aria-controls"]}
        disabled={disabled}
        onClick={() => {
          if (!disabled) menu.toggle();
        }}
      />
      {menu.open && menu.menuStyle != null ? (
        <Dropdown.Menu {...menu.menuProps} role="menu" aria-label={ariaLabel}>
          {items.map((item, index) => (
            <li key={item.id} role="presentation">
              <Dropdown.Item
                {...menu.rowProps(index)}
                role="menuitem"
                truncate={false}
                disabled={item.disabled}
                start={item.start}
                end={item.end}
                onClick={() => runAction(item)}
              >
                {item.label}
              </Dropdown.Item>
            </li>
          ))}
        </Dropdown.Menu>
      ) : null}
    </div>
  );
}
