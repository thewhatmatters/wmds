"use client";

import {
  Children,
  createContext,
  isValidElement,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type PointerEvent,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
  type RefObject,
} from "react";
import { motionTransition } from "../../foundation/motion";
import { cn } from "../../lib/cn";
import {
  CountPill,
  horizontalScrollClasses,
  segmentedDisabledClasses,
  segmentedFocusRingClasses,
} from "../../lib/segmentedControl";
import {
  tabIconOnlyPaddingClasses,
  tabLeadingIconSizeClasses,
  tabSegmentSizeClasses,
  tabTrackSizeClasses,
  type TabSize,
} from "./tabStyles";

export type { TabSize };

export interface TabGroupProps<T extends string = string>
  extends HTMLAttributes<HTMLDivElement> {
  /** Currently selected tab value. */
  value: T;
  onValueChange: (value: T) => void;
  /** Accessible name for the tab list. */
  "aria-label": string;
  /** `equal` — fixed-width segments (layout switchers); default sizes to label content. */
  layout?: "auto" | "equal";
  /** Segment density — `xs` (default) through `md`. */
  size?: TabSize;
  children: ReactNode;
}

export interface TabProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Selection value — required inside `Tab.Group`. */
  value: string;
  /** Optional icon before the label. */
  icon?: ReactNode;
  /** Icon-only segment — requires `icon` and an accessible name (`aria-label` or `children`). */
  iconOnly?: boolean;
  /** Trailing count — compact pill matching `Chip` counts. */
  count?: number;
  /** Optional trailing content — StatusDot, custom nodes (prefer `count` for numbers). */
  endContent?: ReactNode;
  children?: ReactNode;
}

const TabGroupContext = createContext<{
  value: string;
  hoveredValue: string | null;
  onValueChange: (value: string) => void;
  commitSelection: (value: string) => void;
  setHoveredValue: (value: string | null) => void;
  layout: "auto" | "equal";
  size: TabSize;
} | null>(null);

/** Matches `--duration-slower` — active pill slide when committing a selection. */
const SELECTION_SLIDE_MS = 300;

function useTabGroup() {
  return useContext(TabGroupContext);
}

type IndicatorRect = {
  left: number;
  top: number;
  width: number;
  height: number;
};

function measureTab(tablist: HTMLElement, tab: HTMLElement): IndicatorRect {
  const listRect = tablist.getBoundingClientRect();
  const tabRect = tab.getBoundingClientRect();

  return {
    left: tabRect.left - listRect.left,
    top: tabRect.top - listRect.top,
    width: tabRect.width,
    height: tabRect.height,
  };
}

function measureTabByValue(tablist: HTMLElement, tabValue: string): IndicatorRect | null {
  const tab = tablist.querySelector<HTMLElement>(
    `[role="tab"][data-value="${tabValue}"]:not(:disabled)`,
  );
  if (tab == null) return null;

  return measureTab(tablist, tab);
}

function measureSelectedTab(tablist: HTMLElement): IndicatorRect | null {
  const selected = tablist.querySelector<HTMLElement>('[role="tab"][aria-selected="true"]');
  if (selected == null) return null;

  return measureTab(tablist, selected);
}

function useSlidingIndicator(
  hoveredValue: string | null,
  value: string,
  tablistRef: RefObject<HTMLDivElement | null>,
) {
  const [activeIndicator, setActiveIndicator] = useState<IndicatorRect | null>(null);
  const [previewIndicator, setPreviewIndicator] = useState<IndicatorRect | null>(null);
  const [animate, setAnimate] = useState(false);
  const previewTarget = hoveredValue ?? value;

  useLayoutEffect(() => {
    const tablist = tablistRef.current;
    if (tablist == null) return;

    const update = () => {
      setActiveIndicator(measureSelectedTab(tablist));
      setPreviewIndicator(measureTabByValue(tablist, previewTarget));
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
  }, [animate, previewTarget, tablistRef, value]);

  return { activeIndicator, previewIndicator, animate };
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
  iconOnly = false,
  count,
  endContent,
  className,
  children,
  disabled,
  onClick,
  type = "button",
  "aria-label": ariaLabel,
  ...props
}: TabProps) {
  const group = useTabGroup();
  if (group == null) {
    throw new Error("Tab must be rendered inside Tab.Group.");
  }

  if (iconOnly && icon == null) {
    throw new Error("Tab with iconOnly requires an icon.");
  }
  if (iconOnly && ariaLabel == null && children == null) {
    throw new Error("Tab with iconOnly requires aria-label or children for an accessible name.");
  }

  const isSelected = group.value === value;

  return (
    <button
      type={type}
      role="tab"
      aria-selected={isSelected}
      aria-label={iconOnly ? ariaLabel : undefined}
      tabIndex={isSelected ? 0 : -1}
      disabled={disabled}
      data-value={value}
      className={cn(
        "relative z-[2] inline-flex shrink-0 items-center rounded-full whitespace-nowrap",
        "border border-transparent font-medium",
        "transition-[color]",
        motionTransition("base"),
        segmentedFocusRingClasses,
        segmentedDisabledClasses,
        tabSegmentSizeClasses[group.size],
        group.layout === "equal" && "min-w-0 flex-1 justify-center",
        iconOnly && tabIconOnlyPaddingClasses[group.size],
        isSelected ? "text-fg" : "text-muted",
        className,
      )}
      {...props}
      onClick={(event) => {
        group.commitSelection(value);
        group.onValueChange(value);
        onClick?.(event);
      }}
    >
      {icon ? (
        <span className={tabLeadingIconSizeClasses[group.size]} aria-hidden>
          {icon}
        </span>
      ) : null}
      {iconOnly ? (
        children != null ? <span className="sr-only">{children}</span> : null
      ) : (
        <span>{children}</span>
      )}
      {count != null ? <CountPill active={isSelected} count={count} /> : null}
      {endContent ? <span className="inline-flex shrink-0 items-center">{endContent}</span> : null}
    </button>
  );
}

function TabGroup<T extends string = string>({
  value,
  onValueChange,
  layout = "auto",
  size = "xs",
  className,
  children,
  "aria-label": ariaLabel,
  onKeyDown,
  style,
  ...props
}: TabGroupProps<T>) {
  const tablistRef = useRef<HTMLDivElement>(null);
  const [hoveredValue, setHoveredValue] = useState<string | null>(null);
  const [selectionTransition, setSelectionTransition] = useState<string | null>(null);
  const [previewFadingOut, setPreviewFadingOut] = useState(false);
  const { activeIndicator, previewIndicator, animate } = useSlidingIndicator(
    hoveredValue,
    value,
    tablistRef,
  );

  const slideTransition = animate
    ? `transition-[left,width,height,top,opacity,background-color,border-color] ${motionTransition("slower", "out-expo")}`
    : "";

  const isSelecting = selectionTransition != null;
  const previewLayerVisible =
    hoveredValue != null &&
    (hoveredValue !== value || previewFadingOut || isSelecting);
  const previewOpacityClass = previewFadingOut
    ? "opacity-0"
    : hoveredValue != null && hoveredValue !== value
      ? "opacity-100"
      : "opacity-0";

  const commitSelection = (next: string) => {
    setSelectionTransition(next);
    setPreviewFadingOut(false);
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => setPreviewFadingOut(true));
    });
  };

  useEffect(() => {
    if (!previewFadingOut) return;

    const timer = window.setTimeout(() => {
      setPreviewFadingOut(false);
      setSelectionTransition(null);
    }, SELECTION_SLIDE_MS);

    return () => window.clearTimeout(timer);
  }, [previewFadingOut]);

  const handleTablistPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const tab = (event.target as HTMLElement).closest<HTMLElement>('[role="tab"]:not(:disabled)');
    const tabValue = tab?.dataset.value;
    if (tabValue != null) {
      setHoveredValue(tabValue);
    }
  };
  const segmentCount = Children.toArray(children).filter(isValidElement).length;

  return (
    <TabGroupContext.Provider
      value={{
        value,
        hoveredValue,
        onValueChange: onValueChange as (value: string) => void,
        commitSelection,
        setHoveredValue,
        layout,
        size,
      }}
    >
      <div
        className={cn("inline-flex max-w-full p-[2px]", horizontalScrollClasses, className)}
        onMouseLeave={() => setHoveredValue(null)}
      >
        <div
          ref={tablistRef}
          role="tablist"
          aria-label={ariaLabel}
          className={cn(
            "relative items-center rounded-full bg-secondary",
            tabTrackSizeClasses[size],
            layout === "equal" ? "grid w-full" : "inline-flex w-max flex-nowrap",
          )}
          style={{
            ...style,
            ...(layout === "equal"
              ? { gridTemplateColumns: `repeat(${segmentCount}, minmax(0, 1fr))` }
              : undefined),
          }}
          onKeyDown={(event) => {
            handleTabListKeyDown(event);
            onKeyDown?.(event);
          }}
          onPointerMove={handleTablistPointerMove}
          {...props}
        >
          {activeIndicator != null ? (
            <span
              aria-hidden
              className={cn(
                "pointer-events-none absolute z-[1] rounded-full border border-border bg-surface",
                isSelecting && "z-[2]",
                slideTransition,
              )}
              style={{
                left: activeIndicator.left,
                top: activeIndicator.top,
                width: activeIndicator.width,
                height: activeIndicator.height,
              }}
            />
          ) : null}
          {previewLayerVisible && previewIndicator != null ? (
            <span
              aria-hidden
              className={cn(
                "pointer-events-none absolute z-0 rounded-full border border-transparent bg-secondary-hover",
                slideTransition,
                previewOpacityClass,
              )}
              style={{
                left: previewIndicator.left,
                top: previewIndicator.top,
                width: previewIndicator.width,
                height: previewIndicator.height,
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
