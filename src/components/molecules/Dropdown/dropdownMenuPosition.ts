import type { CSSProperties, ReactNode } from "react";
import {
  dropdownItemEndClasses,
  dropdownItemMeasureButtonClasses,
  dropdownItemMeasureLabelClasses,
  dropdownItemSelectedCheckClasses,
  dropdownItemStartClasses,
  dropdownMenuOffsetPx,
} from "./dropdownStyles";

/** Max fraction of menu width that may extend outside the boundary shell. */
export const dropdownMenuMaxOutsideFraction = 0.5;

export type DropdownMenuMeasureRow = {
  label: string;
  start?: ReactNode;
  end?: ReactNode;
  /** Reserve end slot for listbox check — **Select** options without custom `end`. */
  selectionCheck?: boolean;
};

export type DropdownMenuAlign = "start" | "end";

/** `content` — menu width from widest row (**MoreMenu**). `at-least-trigger` — never narrower than anchor (**Select**). */
export type DropdownMenuWidthMode = "content" | "at-least-trigger";

export type DropdownMenuMeasureOptions = {
  align?: DropdownMenuAlign;
  widthMode?: DropdownMenuWidthMode;
};

let measureHost: HTMLDivElement | null = null;

function getMeasureHost(): HTMLDivElement {
  if (measureHost == null) {
    measureHost = document.createElement("div");
    measureHost.style.cssText =
      "position:fixed;left:-10000px;top:0;visibility:hidden;pointer-events:none";
    document.body.appendChild(measureHost);
  }
  return measureHost;
}

/**
 * Nearest layout shell — **Card** `data-layout="shell"`, else the viewport.
 */
export function findDropdownMenuBoundary(trigger: HTMLElement): DOMRect {
  let node: HTMLElement | null = trigger.parentElement;
  while (node != null && node !== document.documentElement) {
    if (node.dataset.layout === "shell") {
      return node.getBoundingClientRect();
    }
    node = node.parentElement;
  }
  return document.documentElement.getBoundingClientRect();
}

function clampMenuLeft(left: number, menuWidth: number, boundary: DOMRect): number {
  const maxOutside = menuWidth * dropdownMenuMaxOutsideFraction;
  const minLeft = boundary.left - maxOutside;
  const maxLeft = boundary.right + maxOutside - menuWidth;
  if (minLeft > maxLeft) {
    return minLeft;
  }
  return Math.min(Math.max(left, minLeft), maxLeft);
}

function appendMeasureStartSlot(button: HTMLButtonElement) {
  const start = document.createElement("span");
  start.className = dropdownItemStartClasses;
  const icon = document.createElement("span");
  icon.className = "size-4 shrink-0";
  icon.setAttribute("aria-hidden", "true");
  start.appendChild(icon);
  button.appendChild(start);
}

function measureDropdownMenuRowWidth(row: DropdownMenuMeasureRow): number {
  const host = getMeasureHost();
  const button = document.createElement("button");
  button.type = "button";
  button.className = dropdownItemMeasureButtonClasses;

  if (row.start != null) {
    appendMeasureStartSlot(button);
  }

  const label = document.createElement("span");
  label.className = dropdownItemMeasureLabelClasses;
  label.textContent = row.label;
  button.appendChild(label);

  if (row.end != null) {
    const end = document.createElement("span");
    end.className = dropdownItemEndClasses;
    end.textContent = typeof row.end === "string" ? row.end : "⌘K";
    button.appendChild(end);
  } else if (row.selectionCheck) {
    const check = document.createElement("span");
    check.className = dropdownItemSelectedCheckClasses;
    check.setAttribute("aria-hidden", "true");
    check.textContent = "✓";
    button.appendChild(check);
  }

  host.replaceChildren(button);
  return Math.ceil(button.getBoundingClientRect().width);
}

/** Widest row — labels, optional start, check or end meta. Includes menu shell inset (p-0.5 × 2). */
export function measureDropdownMenuContentWidth(rows: DropdownMenuMeasureRow[]): number {
  if (rows.length === 0) {
    return 0;
  }

  let widestRow = 0;
  for (const row of rows) {
    widestRow = Math.max(widestRow, measureDropdownMenuRowWidth(row));
  }

  // Menu shell horizontal inset — p-0.5 (2px) each side.
  return widestRow + 4;
}

export function measureDropdownMenuStyle(
  trigger: HTMLElement,
  rows: DropdownMenuMeasureRow[],
  alignOrOptions: DropdownMenuAlign | DropdownMenuMeasureOptions = "start",
): CSSProperties {
  const options =
    typeof alignOrOptions === "string" ? { align: alignOrOptions } : alignOrOptions;
  const align = options.align ?? "start";
  const widthMode = options.widthMode ?? "at-least-trigger";

  const rect = trigger.getBoundingClientRect();
  const boundary = findDropdownMenuBoundary(trigger);
  const triggerWidth = rect.width;
  const contentWidth = measureDropdownMenuContentWidth(rows);
  const menuWidth =
    widthMode === "content" ? contentWidth : Math.max(contentWidth, triggerWidth);

  let left = rect.left;
  if (align === "end") {
    left = rect.right - menuWidth;
  } else if (menuWidth > triggerWidth) {
    const triggerCenter = rect.left + triggerWidth / 2;
    const boundaryCenter = boundary.left + boundary.width / 2;
    if (triggerCenter > boundaryCenter) {
      left = rect.right - menuWidth;
    }
  }

  left = clampMenuLeft(left, menuWidth, boundary);

  return {
    position: "fixed",
    top: rect.bottom + dropdownMenuOffsetPx,
    left,
    width: menuWidth,
    minWidth: widthMode === "content" ? contentWidth : triggerWidth,
  };
}
