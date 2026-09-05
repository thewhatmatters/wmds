import type { CSSProperties, ReactNode } from "react";
import {
  dropdownItemButtonClasses,
  dropdownItemEndClasses,
  dropdownItemLabelFullClasses,
  dropdownItemSelectedCheckClasses,
  dropdownItemStartClasses,
  dropdownMenuClasses,
  dropdownMenuListClasses,
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

/** Widest row — labels, optional start, check or end meta. */
export function measureDropdownMenuContentWidth(rows: DropdownMenuMeasureRow[]): number {
  if (rows.length === 0) {
    return 0;
  }

  const host = getMeasureHost();
  host.replaceChildren();

  const menu = document.createElement("ul");
  menu.className = `${dropdownMenuClasses} ${dropdownMenuListClasses}`;

  for (const row of rows) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = dropdownItemButtonClasses;

    if (row.start != null) {
      const start = document.createElement("span");
      start.className = dropdownItemStartClasses;
      start.textContent = "•";
      button.appendChild(start);
    }

    const label = document.createElement("span");
    label.className = dropdownItemLabelFullClasses;
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

    const item = document.createElement("li");
    item.appendChild(button);
    menu.appendChild(item);
  }

  host.appendChild(menu);
  return menu.scrollWidth;
}

export function measureDropdownMenuStyle(
  trigger: HTMLElement,
  rows: DropdownMenuMeasureRow[],
  align: DropdownMenuAlign = "start",
): CSSProperties {
  const rect = trigger.getBoundingClientRect();
  const boundary = findDropdownMenuBoundary(trigger);
  const triggerWidth = rect.width;
  const contentWidth = measureDropdownMenuContentWidth(rows);
  const menuWidth = Math.max(triggerWidth, contentWidth);

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
    minWidth: triggerWidth,
  };
}
