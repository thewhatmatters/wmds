"use client";

import {
  createContext,
  useContext,
  useLayoutEffect,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
  type RefObject,
} from "react";
import { cn } from "../../lib/cn";
import {
  CountPill,
  horizontalScrollClasses,
  segmentedDisabledClasses,
  segmentedFocusRingClasses,
  segmentedLeadingIconClasses,
} from "../../lib/segmentedControl";

export interface TabGroupProps<T extends string = string>
  extends HTMLAttributes<HTMLDivElement> {
  /** Currently selected tab value. */
  value: T;
  onValueChange: (value: T) => void;
  /** Accessible name for the tab list. */
  "aria-label": string;
  children: ReactNode;
}

export interface TabProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Selection value — required inside `Tab.Group`. */
  value: string;
  /** Optional icon before the label. */
  icon?: ReactNode;
  /** Trailing count — compact pill matching `Chip` counts. */
  count?: number;
  /** Optional trailing content — StatusDot, custom nodes (prefer `count` for numbers). */
  endContent?: ReactNode;
  children: ReactNode;
}

const TabGroupContext = createContext<{
  value: string;
  onValueChange: (value: string) => void;
} | null>(null);

function useTabGroup() {
  return useContext(TabGroupContext);
}

type IndicatorRect = {
  left: number;
  top: number;
  width: number;
  height: number;
};

function measureSelectedTab(tablist: HTMLElement): IndicatorRect | null {
  const selected = tablist.querySelector<HTMLElement>('[role="tab"][aria-selected="true"]');
  if (selected == null) return null;

  const listRect = tablist.getBoundingClientRect();
  const tabRect = selected.getBoundingClientRect();

  return {
    left: tabRect.left - listRect.left,
    top: tabRect.top - listRect.top,
    width: tabRect.width,
    height: tabRect.height,
  };
}

function useSlidingIndicator(
  value: string,
  tablistRef: RefObject<HTMLDivElement | null>,
) {
  const [indicator, setIndicator] = useState<IndicatorRect | null>(null);
  const [animate, setAnimate] = useState(false);

  useLayoutEffect(() => {
    const tablist = tablistRef.current;
    if (tablist == null) return;

    const update = () => {
      setIndicator(measureSelectedTab(tablist));
    };

    update();

    const resizeObserver = new ResizeObserver(update);
    resizeObserver.observe(tablist);
    for (const tab of tablist.querySelectorAll('[role="tab"]')) {
      resizeObserver.observe(tab);
    }

    if (!animate) {
      requestAnimationFrame(() => setAnimate(true));
    }

    return () => resizeObserver.disconnect();
  }, [animate, tablistRef, value]);

  return { indicator, animate };
}

function focusTabAt(root: HTMLElement, index: number) {
  const tabs = Array.from(
    root.querySelectorAll<HTMLButtonElement>('[role="tab"]:not(:disabled)'),
  );
  if (tabs.length === 0) return;
  const wrapped = ((index % tabs.length) + tabs.length) % tabs.length;
  tabs[wrapped]?.focus();
}

function handleTabListKeyDown(event: KeyboardEvent<HTMLDivElement>) {
  const tabs = Array.from(
    event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="tab"]:not(:disabled)'),
  );
  const currentIndex = tabs.indexOf(document.activeElement as HTMLButtonElement);
  if (currentIndex < 0) return;

  if (event.key === "ArrowRight") {
    event.preventDefault();
    focusTabAt(event.currentTarget, currentIndex + 1);
    return;
  }
  if (event.key === "ArrowLeft") {
    event.preventDefault();
    focusTabAt(event.currentTarget, currentIndex - 1);
    return;
  }
  if (event.key === "Home") {
    event.preventDefault();
    tabs[0]?.focus();
    return;
  }
  if (event.key === "End") {
    event.preventDefault();
    tabs[tabs.length - 1]?.focus();
  }
}

function TabRoot({
  value,
  icon,
  count,
  endContent,
  className,
  children,
  disabled,
  onClick,
  type = "button",
  ...props
}: TabProps) {
  const group = useTabGroup();
  if (group == null) {
    throw new Error("Tab must be rendered inside Tab.Group.");
  }

  const isSelected = group.value === value;

  return (
    <button
      type={type}
      role="tab"
      aria-selected={isSelected}
      tabIndex={isSelected ? 0 : -1}
      disabled={disabled}
      className={cn(
        "relative z-[1] inline-flex shrink-0 items-center gap-[length:var(--spacing-1-5)] rounded-full whitespace-nowrap",
        "border border-transparent px-[length:var(--spacing-2)] py-[2px] text-[11.5px] font-medium leading-[1.5]",
        "transition-[color,background-color] duration-[length:var(--duration-base)] ease-[var(--ease-standard)]",
        segmentedFocusRingClasses,
        segmentedDisabledClasses,
        isSelected ? "text-fg" : "text-muted hover:bg-ghost-hover hover:text-fg",
        className,
      )}
      onClick={(event) => {
        group.onValueChange(value);
        onClick?.(event);
      }}
      {...props}
    >
      {icon ? (
        <span className={segmentedLeadingIconClasses} aria-hidden>
          {icon}
        </span>
      ) : null}
      <span>{children}</span>
      {count != null ? <CountPill active={isSelected} count={count} /> : null}
      {endContent ? <span className="inline-flex shrink-0 items-center">{endContent}</span> : null}
    </button>
  );
}

function TabGroup<T extends string = string>({
  value,
  onValueChange,
  className,
  children,
  "aria-label": ariaLabel,
  onKeyDown,
  ...props
}: TabGroupProps<T>) {
  const tablistRef = useRef<HTMLDivElement>(null);
  const { indicator, animate } = useSlidingIndicator(value, tablistRef);

  return (
    <TabGroupContext.Provider
      value={{ value, onValueChange: onValueChange as (value: string) => void }}
    >
      <div
        className={cn("inline-flex max-w-full p-[2px]", horizontalScrollClasses, className)}
      >
        <div
          ref={tablistRef}
          role="tablist"
          aria-label={ariaLabel}
          className={cn(
            "relative inline-flex w-max flex-nowrap items-center gap-[2px] rounded-full",
            "bg-secondary p-[2px]",
          )}
          onKeyDown={(event) => {
            handleTabListKeyDown(event);
            onKeyDown?.(event);
          }}
          {...props}
        >
          {indicator != null ? (
            <span
              aria-hidden
              className={cn(
                "pointer-events-none absolute z-0 rounded-full border border-border bg-surface",
                animate &&
                  "transition-[left,width,height,top] duration-[length:var(--duration-slower)] ease-[var(--ease-out-expo)]",
              )}
              style={{
                left: indicator.left,
                top: indicator.top,
                width: indicator.width,
                height: indicator.height,
              }}
            />
          ) : null}
          {children}
        </div>
      </div>
    </TabGroupContext.Provider>
  );
}

/**
 * Segmented tab control — Paper **Tab group** / Astryx **TabList** pattern.
 * `Tab.Group` is the pill track with a sliding active indicator; each **`Tab`** is a selectable segment (not `Chip`, which is filter-toolbar style).
 */
export const Tab = Object.assign(TabRoot, {
  Group: TabGroup,
});
