"use client";

import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
  type Ref,
} from "react";
import { createPortal } from "react-dom";
import { cn } from "../../lib/cn";
import { IconButton, type IconButtonSize, type IconButtonVariant } from "../IconButton/IconButton";

export type DropdownMenuPlacement = "below" | "above";
export type DropdownMenuAlignment = "start" | "end";

export interface DropdownMenuItemData {
  id?: string;
  label: ReactNode;
  onClick?: () => void;
  icon?: ReactNode;
  disabled?: boolean;
  description?: ReactNode;
  endContent?: ReactNode;
  variant?: "default" | "destructive";
}

export interface DropdownMenuDividerData {
  type: "divider";
}

export interface DropdownMenuSection {
  type: "section";
  id?: string;
  title?: string;
  items: DropdownMenuItemData[];
}

export type DropdownMenuOption =
  | DropdownMenuItemData
  | DropdownMenuDividerData
  | DropdownMenuSection;

export interface DropdownMenuTriggerProps {
  label: string;
  icon: ReactNode;
  variant: IconButtonVariant;
  size: IconButtonSize;
  disabled?: boolean;
  ref?: Ref<HTMLButtonElement>;
}

export interface DropdownMenuProps {
  items: DropdownMenuOption[];
  trigger: DropdownMenuTriggerProps;
  placement?: DropdownMenuPlacement;
  alignment?: DropdownMenuAlignment;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
  "data-testid"?: string;
}

interface MenuPosition {
  top: number;
  left: number;
  placement: DropdownMenuPlacement;
  alignment: DropdownMenuAlignment;
  ready: boolean;
}

const MENU_GAP_PX = 4;
const VIEWPORT_PADDING_PX = 8;

function isDivider(option: DropdownMenuOption): option is DropdownMenuDividerData {
  return "type" in option && option.type === "divider";
}

function isSection(option: DropdownMenuOption): option is DropdownMenuSection {
  return "type" in option && option.type === "section";
}

function itemKey(option: DropdownMenuItemData, index: number): string {
  return option.id ?? `item-${index}`;
}

function assignRef<T>(ref: Ref<T> | undefined, value: T | null) {
  if (typeof ref === "function") ref(value);
  else if (ref) ref.current = value;
}

function mergeRefs<T>(...refs: Array<Ref<T> | undefined>) {
  return (value: T | null) => {
    for (const ref of refs) assignRef(ref, value);
  };
}

function resolveMenuPosition(
  triggerRect: DOMRect,
  menuRect: DOMRect,
  preferredPlacement: DropdownMenuPlacement,
  preferredAlignment: DropdownMenuAlignment,
): Omit<MenuPosition, "ready"> {
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  const spaceBelow = viewportHeight - triggerRect.bottom - VIEWPORT_PADDING_PX;
  const spaceAbove = triggerRect.top - VIEWPORT_PADDING_PX;

  let placement = preferredPlacement;
  if (
    placement === "below" &&
    menuRect.height + MENU_GAP_PX > spaceBelow &&
    spaceAbove > spaceBelow
  ) {
    placement = "above";
  } else if (
    placement === "above" &&
    menuRect.height + MENU_GAP_PX > spaceAbove &&
    spaceBelow > spaceAbove
  ) {
    placement = "below";
  }

  const menuWidth = menuRect.width;
  const alignStartLeft = triggerRect.left;
  const alignEndLeft = triggerRect.right - menuWidth;
  const startOverflow = alignStartLeft + menuWidth + VIEWPORT_PADDING_PX - viewportWidth;
  const endOverflow = VIEWPORT_PADDING_PX - alignEndLeft;

  let alignment = preferredAlignment;
  if (alignment === "end" && endOverflow > 0 && startOverflow <= 0) {
    alignment = "start";
  } else if (alignment === "start" && startOverflow > 0 && endOverflow <= 0) {
    alignment = "end";
  }

  let top =
    placement === "below"
      ? triggerRect.bottom + MENU_GAP_PX
      : triggerRect.top - menuRect.height - MENU_GAP_PX;

  let left = alignment === "start" ? alignStartLeft : alignEndLeft;

  left = Math.max(
    VIEWPORT_PADDING_PX,
    Math.min(left, viewportWidth - menuWidth - VIEWPORT_PADDING_PX),
  );
  top = Math.max(
    VIEWPORT_PADDING_PX,
    Math.min(top, viewportHeight - menuRect.height - VIEWPORT_PADDING_PX),
  );

  return { top, left, placement, alignment };
}

function readThemeFromTrigger(trigger: HTMLButtonElement | null): string | undefined {
  return trigger?.closest("[data-wmds-theme]")?.getAttribute("data-wmds-theme") ?? undefined;
}

const menuItemClasses =
  "flex w-full items-center gap-2 rounded-md px-[length:var(--spacing-2)] py-[length:var(--spacing-1-5)] " +
  "text-left text-sm leading-[var(--line-height-sm)] text-fg outline-none " +
  "transition-colors duration-[length:var(--duration-instant)] ease-[var(--ease-standard)] " +
  "hover:bg-secondary-hover focus-visible:bg-secondary-hover " +
  "disabled:pointer-events-none disabled:opacity-50";

function MenuItemButton({
  item,
  onSelect,
  itemRef,
}: {
  item: DropdownMenuItemData;
  onSelect: (item: DropdownMenuItemData) => void;
  itemRef?: (node: HTMLButtonElement | null) => void;
}) {
  const destructive = item.variant === "destructive";

  return (
    <button
      ref={itemRef}
      type="button"
      role="menuitem"
      tabIndex={-1}
      disabled={item.disabled}
      className={cn(
        menuItemClasses,
        destructive && "text-destructive hover:bg-destructive/10 focus-visible:bg-destructive/10",
      )}
      onClick={() => onSelect(item)}
    >
      {item.icon ? (
        <span
          className="inline-flex size-4 shrink-0 text-inherit [&>svg]:size-full [&>svg]:shrink-0 [&>svg]:stroke-current"
          aria-hidden
        >
          {item.icon}
        </span>
      ) : null}
      <span className="min-w-0 flex-1">
        <span className="block truncate">{item.label}</span>
        {item.description ? (
          <span
            className={cn(
              "block truncate text-xs",
              destructive ? "text-destructive/80" : "text-muted",
            )}
          >
            {item.description}
          </span>
        ) : null}
      </span>
      {item.endContent ? (
        <span className="shrink-0 text-xs text-muted">{item.endContent}</span>
      ) : null}
    </button>
  );
}

function flattenFocusableItems(options: DropdownMenuOption[]): DropdownMenuItemData[] {
  const items: DropdownMenuItemData[] = [];
  for (const option of options) {
    if (isDivider(option)) continue;
    if (isSection(option)) {
      items.push(...option.items);
      continue;
    }
    items.push(option);
  }
  return items;
}

export function DropdownMenu({
  items,
  trigger,
  placement = "below",
  alignment = "end",
  open: openProp,
  onOpenChange,
  className,
  "data-testid": testId,
}: DropdownMenuProps) {
  const menuId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState<MenuPosition | null>(null);
  const [themeMode, setThemeMode] = useState<string | undefined>();
  const open = openProp ?? uncontrolledOpen;

  const setOpen = useCallback(
    (next: boolean) => {
      if (openProp === undefined) setUncontrolledOpen(next);
      onOpenChange?.(next);
      if (!next) setMenuPosition(null);
    },
    [onOpenChange, openProp],
  );

  const focusableItems = flattenFocusableItems(items);

  const focusItem = useCallback(
    (index: number) => {
      const enabledIndexes = focusableItems
        .map((item, itemIndex) => (!item.disabled ? itemIndex : -1))
        .filter((itemIndex) => itemIndex >= 0);
      if (enabledIndexes.length === 0) return;
      const wrapped =
        ((index % enabledIndexes.length) + enabledIndexes.length) % enabledIndexes.length;
      itemRefs.current[enabledIndexes[wrapped]]?.focus();
    },
    [focusableItems],
  );

  const closeMenu = useCallback(
    (focusTrigger = true) => {
      setOpen(false);
      if (focusTrigger) triggerRef.current?.focus();
    },
    [setOpen],
  );

  const handleSelect = useCallback(
    (item: DropdownMenuItemData) => {
      if (item.disabled) return;
      item.onClick?.();
      closeMenu(false);
      triggerRef.current?.focus();
    },
    [closeMenu],
  );

  const updateMenuPosition = useCallback(() => {
    const triggerEl = triggerRef.current;
    const menuEl = menuRef.current;
    if (!triggerEl || !menuEl) return;

    setThemeMode(readThemeFromTrigger(triggerEl));
    const resolved = resolveMenuPosition(
      triggerEl.getBoundingClientRect(),
      menuEl.getBoundingClientRect(),
      placement,
      alignment,
    );
    setMenuPosition({ ...resolved, ready: true });
  }, [alignment, placement]);

  useLayoutEffect(() => {
    if (!open) return;
    updateMenuPosition();
  }, [open, items, updateMenuPosition]);

  useEffect(() => {
    if (!open) return;

    const firstEnabled = focusableItems.findIndex((item) => !item.disabled);
    if (firstEnabled >= 0) {
      requestAnimationFrame(() => itemRefs.current[firstEnabled]?.focus());
    }

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (rootRef.current?.contains(target)) return;
      if (menuRef.current?.contains(target)) return;
      closeMenu();
    };

    const handleReposition = () => updateMenuPosition();

    document.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("resize", handleReposition);
    window.addEventListener("scroll", handleReposition, true);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("resize", handleReposition);
      window.removeEventListener("scroll", handleReposition, true);
    };
  }, [closeMenu, focusableItems, open, updateMenuPosition]);

  const menuStyle: CSSProperties = menuPosition
    ? { top: menuPosition.top, left: menuPosition.left }
    : { top: 0, left: 0, visibility: "hidden" };

  let itemIndex = -1;

  const menuPanel = open ? (
    <div
      ref={menuRef}
      id={menuId}
      role="menu"
      aria-label={trigger.label}
      data-wmds-theme={themeMode}
      style={menuStyle}
      className={cn(
        "fixed z-[100] min-w-[10rem] overflow-hidden rounded-lg border border-border bg-surface p-[length:var(--spacing-1)] font-sans shadow-md",
        menuPosition?.ready ? "visible" : "invisible",
      )}
      onKeyDown={(event) => {
        const currentIndex = itemRefs.current.findIndex((node) => node === document.activeElement);
        if (event.key === "Escape") {
          event.preventDefault();
          closeMenu();
          return;
        }
        if (event.key === "ArrowDown") {
          event.preventDefault();
          focusItem(currentIndex + 1);
          return;
        }
        if (event.key === "ArrowUp") {
          event.preventDefault();
          focusItem(currentIndex - 1);
          return;
        }
        if (event.key === "Home") {
          event.preventDefault();
          focusItem(0);
          return;
        }
        if (event.key === "End") {
          event.preventDefault();
          focusItem(focusableItems.length - 1);
        }
      }}
    >
      {items.map((option, index) => {
        if (isDivider(option)) {
          return (
            <div
              key={`divider-${index}`}
              role="separator"
              className="my-[length:var(--spacing-1)] h-px bg-border"
            />
          );
        }

        if (isSection(option)) {
          return (
            <div key={option.id ?? `section-${index}`} role="group" aria-label={option.title}>
              {option.title ? (
                <p className="px-[length:var(--spacing-2)] pb-[length:var(--spacing-1)] pt-[length:var(--spacing-1)] text-xs font-medium uppercase tracking-wider text-muted">
                  {option.title}
                </p>
              ) : null}
              <div className="flex flex-col gap-[length:var(--spacing-0-5)]">
                {option.items.map((item) => {
                  itemIndex += 1;
                  const refIndex = itemIndex;
                  return (
                    <MenuItemButton
                      key={itemKey(item, refIndex)}
                      item={item}
                      onSelect={handleSelect}
                      itemRef={(node) => {
                        itemRefs.current[refIndex] = node;
                      }}
                    />
                  );
                })}
              </div>
            </div>
          );
        }

        itemIndex += 1;
        const refIndex = itemIndex;
        return (
          <MenuItemButton
            key={itemKey(option, refIndex)}
            item={option}
            onSelect={handleSelect}
            itemRef={(node) => {
              itemRefs.current[refIndex] = node;
            }}
          />
        );
      })}
    </div>
  ) : null;

  return (
    <>
      <div ref={rootRef} className={cn("inline-flex", className)} data-testid={testId}>
        <IconButton
          ref={mergeRefs(triggerRef, trigger.ref)}
          label={trigger.label}
          icon={trigger.icon}
          variant={trigger.variant}
          size={trigger.size}
          disabled={trigger.disabled}
          aria-haspopup="menu"
          aria-expanded={open}
          aria-controls={open ? menuId : undefined}
          onClick={() => setOpen(!open)}
        />
      </div>
      {menuPanel && typeof document !== "undefined" ? createPortal(menuPanel, document.body) : null}
    </>
  );
}
