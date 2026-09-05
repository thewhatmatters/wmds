import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { EllipsisVertical } from "lucide-react";
import { IconButton, type IconButtonSize } from "../../atoms/IconButton/IconButton";
import { Dropdown } from "../../molecules/Dropdown/Dropdown";
import {
  measureDropdownMenuStyle,
  type DropdownMenuMeasureRow,
} from "../../molecules/Dropdown/dropdownMenuPosition";
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
  const menuId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [menuStyle, setMenuStyle] = useState<CSSProperties | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  assertMoreMenuA11y({ "aria-label": ariaLabel, items });

  const close = useCallback(() => {
    setOpen(false);
    setMenuStyle(null);
  }, []);

  const openMenu = useCallback(() => {
    const trigger = triggerRef.current;
    if (trigger != null) {
      setMenuStyle(measureDropdownMenuStyle(trigger, toMeasureRows(items), "end"));
    }
    setOpen(true);
  }, [items]);

  const runAction = useCallback(
    (id: string) => {
      onAction?.(id);
      close();
    },
    [close, onAction],
  );

  const updateMenuPosition = useCallback(() => {
    const trigger = triggerRef.current;
    if (trigger == null) {
      return;
    }
    setMenuStyle(measureDropdownMenuStyle(trigger, toMeasureRows(items), "end"));
  }, [items]);

  useLayoutEffect(() => {
    if (!open) {
      return undefined;
    }

    updateMenuPosition();

    window.addEventListener("resize", updateMenuPosition);
    window.addEventListener("scroll", updateMenuPosition, true);

    return () => {
      window.removeEventListener("resize", updateMenuPosition);
      window.removeEventListener("scroll", updateMenuPosition, true);
    };
  }, [open, updateMenuPosition]);

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    function handlePointerDown(event: MouseEvent) {
      if (rootRef.current != null && !rootRef.current.contains(event.target as Node)) {
        close();
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
    };
  }, [close, open]);

  useEffect(() => {
    if (!open) {
      return;
    }
    setActiveIndex((current) => Math.min(current, Math.max(items.length - 1, 0)));
  }, [items.length, open]);

  function moveActive(delta: number) {
    setActiveIndex((current) => {
      if (items.length === 0) {
        return 0;
      }
      let next = current;
      for (let step = 0; step < items.length; step += 1) {
        next = (next + delta + items.length) % items.length;
        if (!items[next]?.disabled) {
          return next;
        }
      }
      return current;
    });
  }

  function handleTriggerKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (disabled) {
      return;
    }

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        if (!open) {
          openMenu();
        } else {
          moveActive(1);
        }
        break;
      case "ArrowUp":
        event.preventDefault();
        if (!open) {
          openMenu();
        } else {
          moveActive(-1);
        }
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        if (open) {
          const item = items[activeIndex];
          if (item != null && !item.disabled) {
            runAction(item.id);
          }
        } else {
          openMenu();
        }
        break;
      case "Escape":
        event.preventDefault();
        close();
        break;
      default:
        break;
    }
  }

  return (
    <div ref={rootRef} className={cn(moreMenuRootClasses, className)}>
      <div ref={triggerRef} className="inline-flex">
        <IconButton
          size={size}
          role="ghost"
          icon={<EllipsisVertical strokeWidth={2} />}
          aria-label={ariaLabel}
          aria-haspopup="menu"
          aria-expanded={open}
          aria-controls={open ? menuId : undefined}
          disabled={disabled}
          onClick={() => {
            if (disabled) {
              return;
            }
            if (open) {
              close();
            } else {
              openMenu();
            }
          }}
          onKeyDown={handleTriggerKeyDown}
        />
      </div>
      {open && menuStyle != null ? (
        <Dropdown.Menu id={menuId} role="menu" aria-label={ariaLabel} style={menuStyle}>
          {items.map((item, index) => (
            <li key={item.id} role="presentation">
              <Dropdown.Item
                role="menuitem"
                tabIndex={-1}
                active={index === activeIndex}
                disabled={item.disabled}
                start={item.start}
                end={item.end}
                onMouseEnter={() => {
                  if (!item.disabled) {
                    setActiveIndex(index);
                  }
                }}
                onClick={() => {
                  if (item.disabled) {
                    return;
                  }
                  runAction(item.id);
                }}
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
